<?php

namespace App\Http\Controllers;

use App\Models\Bab;
use App\Models\BankSoal;
use App\Models\BankSoalShared;
use App\Models\Soal;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class BankSoalController extends Controller
{
    public function index(Request $request)
    {
        $authUser = $request->user();

        $bankSoal = BankSoal::with('mataKuliah', 'bab', 'creator')->withCount('soal')
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
            ->when($request->search, fn($q) => $q->whereRaw('LOWER(nama) LIKE ?', ['%' . strtolower($request->search) . '%']))
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

    public function global(Request $request)
    {
        $bankSoal = BankSoal::with(['mataKuliah.bab', 'creator.universitas'])->withCount('soal')
            ->where('permission', 'public')
            ->when($request->search, function ($q) use ($request) {
                $s = '%' . strtolower($request->search) . '%';
                $q->where(function ($q) use ($s) {
                    $q->whereRaw('LOWER(bank_soal.nama) LIKE ?', [$s])
                      ->orWhereHas('creator', fn($q) => $q->whereRaw('LOWER(nama) LIKE ?', [$s]))
                      ->orWhereHas('creator.universitas', fn($q) => $q->whereRaw('LOWER(nama) LIKE ?', [$s])
                            ->orWhereRaw('LOWER(kode) LIKE ?', [$s]));
                });
            })
            ->when($request->mata_kuliah_id, fn($q) => $q->where('mata_kuliah_id', $request->mata_kuliah_id))
            ->orderBy('created_at', 'desc')
            ->orderBy('id', 'desc')
            ->paginate($request->per_page ?? 10);

        return response()->json([
            'message' => 'Data bank soal global berhasil diambil!',
            'data' => $bankSoal->items(),
            'meta' => [
                'total'        => $bankSoal->total(),
                'per_page'     => $bankSoal->perPage(),
                'current_page' => $bankSoal->currentPage(),
                'last_page'    => $bankSoal->lastPage(),
            ],
        ], 200);
    }

    public function showGlobal(Request $request, $id)
    {
        $bankSoal = BankSoal::with(['mataKuliah', 'creator.universitas'])
            ->where('permission', 'public')
            ->findOrFail($id);

        $babs = [];
        if ($bankSoal->mata_kuliah_id) {
            $babs = Bab::where('mata_kuliah_id', $bankSoal->mata_kuliah_id)
                ->orderBy('urutan', 'asc')
                ->get()
                ->map(function ($bab) use ($id) {
                    return [
                        'id'         => $bab->id,
                        'nama_bab'   => $bab->nama_bab,
                        'urutan'     => $bab->urutan,
                        'soal_count' => Soal::where('bank_soal_id', $id)
                                            ->where('bab_id', $bab->id)
                                            ->count(),
                    ];
                });
        }

        return response()->json([
            'message' => 'Detail bank soal global berhasil diambil!',
            'data' => [
                'bank_soal' => $bankSoal,
                'babs'      => $babs,
            ],
        ], 200);
    }

    public function store(Request $request)
    {
        $request->validate([
            'nama'           => 'required|string|max:255',
            'deskripsi'      => 'nullable|string',
            'mata_kuliah_id' => 'nullable|exists:mata_kuliah,id',
            'bab_id'         => 'required_with:mata_kuliah_id|nullable|exists:bab,id',
            'permission'     => 'required|in:public,shared,private',
        ], [
            'nama.required'         => 'Nama bank soal wajib diisi!',
            'permission.in'         => 'Permission tidak valid!',
            'mata_kuliah_id.exists' => 'Mata kuliah tidak ditemukan!',
            'bab_id.exists'         => 'Bab tidak ditemukan!',
        ]);

        $bankSoal = BankSoal::create([
            'created_by'     => $request->user()->id,
            'mata_kuliah_id' => $request->mata_kuliah_id,
            'bab_id'         => $request->bab_id,
            'nama'           => $request->nama,
            'deskripsi'      => $request->deskripsi,
            'permission'     => $request->permission,
        ]);

        return response()->json([
            'message' => 'Bank soal berhasil dibuat!',
            'data'    => $bankSoal->load('mataKuliah', 'bab'),
        ], 201);
    }

    public function update(Request $request, $id)
    {
        $authUser = $request->user();
        $bankSoal = BankSoal::findOrFail($id);

        if ($bankSoal->created_by !== $authUser->id) {
            return response()->json(['message' => 'Tidak punya akses!'], 403);
        }

        $request->validate([
            'nama'           => 'sometimes|string|max:255',
            'deskripsi'      => 'nullable|string',
            'mata_kuliah_id' => 'nullable|exists:mata_kuliah,id',
            'bab_id'         => 'nullable|exists:bab,id',
            'permission'     => 'sometimes|in:public,shared,private',
        ], [
            'permission.in' => 'Permission tidak valid!',
        ]);

        if ($request->permission === 'private') {
            BankSoalShared::where('bank_soal_id', $id)->delete();
        }

        $bankSoal->update([
            'nama'           => $request->nama ?? $bankSoal->nama,
            'deskripsi'      => $request->deskripsi ?? $bankSoal->deskripsi,
            'mata_kuliah_id' => $request->has('mata_kuliah_id') ? $request->mata_kuliah_id : $bankSoal->mata_kuliah_id,
            'bab_id'         => $request->has('bab_id') ? $request->bab_id : $bankSoal->bab_id,
            'permission'     => $request->permission ?? $bankSoal->permission,
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