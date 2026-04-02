<?php

namespace App\Http\Controllers;

use App\Models\Pengumuman;
use App\Models\Ujian;
use Illuminate\Http\Request;

class PengumumanController extends Controller
{
    public function index(Request $request)
    {
        $authUser = $request->user();

        $pengumuman = Pengumuman::with('creator')
            ->where(function ($q) use ($authUser) {
                $q->whereHas('creator', fn($q) => $q->where('universitas_id', $authUser->universitas_id));
            })
            ->when($request->ujian_id, fn($q) => $q->where('ujian_id', $request->ujian_id))
            ->when(
                in_array($authUser->role, ['dosen', 'mahasiswa', 'peserta_mahasiswa_baru']),
                fn($q) => $q->where(function ($q) {
                    $q->whereNull('expired_at')
                        ->orWhere('expired_at', '>=', now());
                })
            )
            ->orderBy('created_at', 'desc')
            ->paginate($request->per_page ?? 10);

        return response()->json([
            'message' => 'Data pengumuman berhasil diambil!',
            'data' => $pengumuman->items(),
            'meta' => [
                'total' => $pengumuman->total(),
                'per_page' => $pengumuman->perPage(),
                'current_page' => $pengumuman->currentPage(),
                'last_page' => $pengumuman->lastPage(),
            ],
        ], 200);
    }

    public function store(Request $request)
    {
        $authUser = $request->user();

        $request->validate([
            'judul' => 'required|string|max:255',
            'isi' => 'required|string',
            'ujian_id' => 'nullable|exists:ujian,id',
            'expired_at' => 'nullable|date|after:now',
        ], [
            'judul.required' => 'Judul pengumuman wajib diisi!',
            'isi.required' => 'Isi pengumuman wajib diisi!',
            'ujian_id.exists' => 'Ujian tidak ditemukan!',
            'expired_at.after' => 'Tanggal expired harus setelah sekarang!',
        ]);

        // Validasi ujian milik user yang login
        if ($request->ujian_id) {
            $ujian = Ujian::find($request->ujian_id);

            if ($authUser->role === 'admin_universitas' && $ujian->universitas_id !== $authUser->universitas_id) {
                return response()->json(['message' => 'Ujian tidak ditemukan!'], 403);
            }

            if ($authUser->role === 'dosen' && $ujian->created_by !== $authUser->id) {
                return response()->json(['message' => 'Ujian tidak ditemukan!'], 403);
            }
        }

        $pengumuman = Pengumuman::create([
            'created_by' => $authUser->id,
            'ujian_id' => $request->ujian_id,
            'judul' => $request->judul,
            'isi' => $request->isi,
            'expired_at' => $request->expired_at,
        ]);

        return response()->json([
            'message' => 'Pengumuman berhasil dibuat!',
            'data' => $pengumuman,
        ], 201);
    }

    public function update(Request $request, $id)
    {
        $authUser = $request->user();
        $pengumuman = Pengumuman::findOrFail($id);

        if ($pengumuman->created_by !== $authUser->id) {
            return response()->json(['message' => 'Tidak punya akses!'], 403);
        }

        $request->validate([
            'judul' => 'sometimes|string|max:255',
            'isi' => 'sometimes|string',
            'ujian_id' => 'nullable|exists:ujian,id',
            'expired_at' => 'nullable|date|after:now',
        ], [
            'ujian_id.exists' => 'Ujian tidak ditemukan!',
            'expired_at.after' => 'Tanggal expired harus setelah sekarang!',
        ]);

        $pengumuman->update([
            'judul' => $request->judul ?? $pengumuman->judul,
            'isi' => $request->isi ?? $pengumuman->isi,
            'ujian_id' => $request->ujian_id ?? $pengumuman->ujian_id,
            'expired_at' => $request->expired_at ?? $pengumuman->expired_at,
        ]);

        return response()->json([
            'message' => 'Pengumuman berhasil diupdate!',
            'data' => $pengumuman,
        ], 200);
    }

    public function destroy(Request $request, $id)
    {
        $authUser = $request->user();
        $pengumuman = Pengumuman::findOrFail($id);

        if ($pengumuman->created_by !== $authUser->id) {
            return response()->json(['message' => 'Tidak punya akses!'], 403);
        }

        $pengumuman->delete();

        return response()->json([
            'message' => 'Pengumuman berhasil dihapus!',
        ], 200);
    }

    public function dropdown(Request $request)
    {
        $authUser = $request->user();

        $ujian = Ujian::select('id', 'nama_ujian', 'jenis_ujian')
            ->when(
                $authUser->role === 'admin_universitas',
                fn($q) => $q->where('universitas_id', $authUser->universitas_id)
                    ->where('jenis_ujian', 'pmb')
            )
            ->when(
                $authUser->role === 'dosen',
                fn($q) => $q->where('created_by', $authUser->id)
                    ->whereIn('jenis_ujian', ['perkuliahan', 'non_akademik'])
            )
            ->get();

        return response()->json([
            'message' => 'Data ujian untuk dropdown berhasil diambil!',
            'data' => $ujian,
        ], 200);
    }
}