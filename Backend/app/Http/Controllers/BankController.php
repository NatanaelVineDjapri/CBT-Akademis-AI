<?php

namespace App\Http\Controllers;

use App\Models\BankSoal;
use App\Models\BankSoalShared;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class BankSoalController extends Controller
{
    public function index(Request $request)
    {
        $authUser = $request->user();

        $bankSoal = BankSoal::with('mataKuliah', 'creator')
            ->where(function ($q) use ($authUser) {
                $q
                    // Punya sendiri
                    ->where('created_by', $authUser->id)
                    // Public → semua universitas bisa lihat
                    ->orWhere('permission', 'public')
                    // Shared → hanya yang diinvite by email atau via link
                    ->orWhereHas('sharedUsers', fn($q) => $q->where('user_id', $authUser->id));

                if (in_array($authUser->role, ['mahasiswa', 'peserta_mahasiswa_baru'])) { //ini tar hrs diubah pmb boleh atau ga akses public bank soal
                    $q->where('permission', 'public');
                }
            })
            ->when($request->mata_kuliah_id, fn($q) => $q->where('mata_kuliah_id', $request->mata_kuliah_id))
            ->when($request->search, fn($q) => $q->where('nama', 'like', '%' . $request->search . '%'))
            ->paginate($request->per_page ?? 10);

        return response()->json([
            'message' => 'Data bank soal berhasil diambil!',
            'data' => $bankSoal->items(),
            'meta' => [
                'total' => $bankSoal->total(),
                'per_page' => $bankSoal->perPage(),
                'current_page' => $bankSoal->currentPage(),
                'last_page' => $bankSoal->lastPage(),
            ],
        ], 200);
    }

    public function update(Request $request, $id)
    {
        $authUser = $request->user();
        $bankSoal = BankSoal::findOrFail($id);

        if ($bankSoal->created_by !== $authUser->id) {
            return response()->json(['message' => 'Tidak punya akses!'], 403);
        }

        $request->validate([
            'nama' => 'sometimes|string|max:255',
            'deskripsi' => 'nullable|string',
            'permission' => 'sometimes|in:public,shared,private',
        ], [
            'permission.in' => 'Permission tidak valid!',
        ]);

        // Kalau permission diubah jadi private →
        // hapus semua akses shared yang sudah ada
        if ($request->permission === 'private') {
            BankSoalShared::where('bank_soal_id', $id)->delete();
        }

        $bankSoal->update([
            'nama' => $request->nama ?? $bankSoal->nama,
            'deskripsi' => $request->deskripsi ?? $bankSoal->deskripsi,
            'permission' => $request->permission ?? $bankSoal->permission,
        ]);

        return response()->json([
            'message' => 'Bank soal berhasil diupdate!',
            'data' => $bankSoal,
        ], 200);
    }

    public function destroy(Request $request, $id)
    {
        $authUser = $request->user();
        $bankSoal = BankSoal::findOrFail($id);

        if ($bankSoal->created_by !== $authUser->id) {
            return response()->json(['message' => 'Tidak punya akses!'], 403);
        }

        // Hapus semua shared access dulu sebelum hapus bank soal
        BankSoalShared::where('bank_soal_id', $id)->delete();
        $bankSoal->delete();

        return response()->json([
            'message' => 'Bank soal berhasil dihapus!',
        ], 200);
    }

    // Share via email → cari user by email → tambah akses langsung
    public function shareByEmail(Request $request, $id)
    {
        $authUser = $request->user();
        $bankSoal = BankSoal::findOrFail($id);

        if ($bankSoal->created_by !== $authUser->id) {
            return response()->json(['message' => 'Tidak punya akses!'], 403);
        }

        if ($bankSoal->permission !== 'shared') {
            return response()->json(['message' => 'Bank soal harus berstatus shared!'], 400);
        }

        $request->validate([
            'email' => 'required|email|exists:users,email',
        ], [
            'email.required' => 'Email wajib diisi!',
            'email.email' => 'Format email tidak valid!',
            'email.exists' => 'Email tidak terdaftar!',
        ]);

        $targetUser = User::where('email', $request->email)->first();

        // Cek kalau sudah pernah di-share ke user ini
        $alreadyShared = BankSoalShared::where('bank_soal_id', $id)
            ->where('user_id', $targetUser->id)
            ->exists();

        if ($alreadyShared) {
            return response()->json(['message' => 'Bank soal sudah di-share ke user ini!'], 400);
        }

        BankSoalShared::create([
            'bank_soal_id' => $id,
            'user_id' => $targetUser->id,
            'token' => null,
            'expired_at' => null,
        ]);

        return response()->json([
            'message' => 'Bank soal berhasil di-share ke ' . $targetUser->nama . '!',
        ], 200);
    }

    // Generate link → buat token unik → kirim link ke frontend
    public function generateLink(Request $request, $id)
    {
        $authUser = $request->user();
        $bankSoal = BankSoal::findOrFail($id);

        if ($bankSoal->created_by !== $authUser->id) {
            return response()->json(['message' => 'Tidak punya akses!'], 403);
        }

        if ($bankSoal->permission !== 'shared') {
            return response()->json(['message' => 'Bank soal harus berstatus shared!'], 400);
        }

        $request->validate([
            'expired_at' => 'nullable|date|after:now',
        ], [
            'expired_at.after' => 'Tanggal expired harus setelah sekarang!',
        ]);

        // Generate token unik 32 karakter
        $token = Str::random(32);

        BankSoalShared::create([
            'bank_soal_id' => $id,
            'user_id' => null, // null karena belum tahu siapa yang akan akses
            'token' => $token,
            'expired_at' => $request->expired_at,
        ]);

        $link = env('FRONTEND_URL') . '/bank-soal/join?token=' . $token;

        return response()->json([
            'message' => 'Link berhasil digenerate!',
            'link' => $link,
        ], 200);
    }

    // User klik link → validasi token → tambah akses ke user yang login
    public function joinByLink(Request $request)
    {
        $authUser = $request->user();

        $request->validate([
            'token' => 'required|string',
        ], [
            'token.required' => 'Token wajib diisi!',
        ]);

        // Cari record berdasarkan token
        $shared = BankSoalShared::where('token', $request->token)
            ->whereNull('user_id') // hanya yang belum diklaim
            ->first();

        if (!$shared) {
            return response()->json(['message' => 'Link tidak valid!'], 400);
        }

        // Cek apakah link sudah expired
        if ($shared->expired_at && now()->gt($shared->expired_at)) {
            return response()->json(['message' => 'Link sudah expired!'], 400);
        }

        // Cek kalau sudah pernah join bank soal ini
        $alreadyJoined = BankSoalShared::where('bank_soal_id', $shared->bank_soal_id)
            ->where('user_id', $authUser->id)
            ->exists();

        if ($alreadyJoined) {
            return response()->json(['message' => 'Kamu sudah punya akses ke bank soal ini!'], 400);
        }

        // Update record → assign user_id ke user yang login
        $shared->update(['user_id' => $authUser->id]);

        return response()->json([
            'message' => 'Berhasil join bank soal!',
            'data' => $shared->bankSoal,
        ], 200);
    }

    // Hapus akses shared user tertentu
    public function removeShared(Request $request, $id)
    {
        $authUser = $request->user();
        $bankSoal = BankSoal::findOrFail($id);

        if ($bankSoal->created_by !== $authUser->id) {
            return response()->json(['message' => 'Tidak punya akses!'], 403);
        }

        $request->validate([
            'user_id' => 'required|exists:users,id',
        ], [
            'user_id.required' => 'User wajib dipilih!',
            'user_id.exists' => 'User tidak ditemukan!',
        ]);

        // Hapus akses shared user tertentu
        BankSoalShared::where('bank_soal_id', $id)
            ->where('user_id', $request->user_id)
            ->delete();

        return response()->json([
            'message' => 'Akses shared berhasil dihapus!',
        ], 200);
    }
}