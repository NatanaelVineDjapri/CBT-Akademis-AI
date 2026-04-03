<?php

namespace App\Http\Controllers;

use App\Models\Bab;
use App\Models\BankSoal;
use Illuminate\Http\Request;

class BabController extends Controller
{
    public function index(Request $request)
    {
        $authUser = $request->user();

        $request->validate([
            'mata_kuliah_id' => 'required|exists:mata_kuliah,id',
        ]);

        // Cari bank soal untuk mata kuliah ini
        $bankSoal = BankSoal::where('mata_kuliah_id', $request->mata_kuliah_id)->firstOrFail();

        // Cek akses berdasarkan permission
        $punyaAkses = match ($bankSoal->permission) {
            'public' => true,
            'private' => $bankSoal->created_by === $authUser->id,
            'shared' => $bankSoal->created_by === $authUser->id ||
            $bankSoal->sharedUsers()->where('user_id', $authUser->id)->exists(),
        };

        if (!$punyaAkses) {
            return response()->json(['message' => 'Tidak punya akses!'], 403);
        }

        $bab = Bab::where('mata_kuliah_id', $request->mata_kuliah_id)
            ->orderBy('urutan', 'asc')
            ->get();

        return response()->json([
            'message' => 'Data bab berhasil diambil!',
            'data' => $bab,
        ], 200);
    }

    public function store(Request $request)
    {
        $request->validate([
            'mata_kuliah_id' => 'required|exists:mata_kuliah,id',
            'nama_bab' => 'required|string|max:255',
            'urutan' => 'required|integer|min:1',
        ], [
            'mata_kuliah_id.required' => 'Mata kuliah wajib dipilih!',
            'mata_kuliah_id.exists' => 'Mata kuliah tidak ditemukan!',
            'nama_bab.required' => 'Nama bab wajib diisi!',
            'urutan.required' => 'Urutan bab wajib diisi!',
            'urutan.integer' => 'Urutan harus berupa angka!',
        ]);

        $bab = Bab::create([
            'mata_kuliah_id' => $request->mata_kuliah_id,
            'nama_bab' => $request->nama_bab,
            'urutan' => $request->urutan,
        ]);

        return response()->json([
            'message' => 'Bab berhasil ditambahkan!',
            'data' => $bab,
        ], 201);
    }

    public function update(Request $request, $id)
    {
        $bab = Bab::findOrFail($id);

        $request->validate([
            'nama_bab' => 'sometimes|string|max:255',
            'urutan' => 'sometimes|integer|min:1',
        ], [
            'urutan.integer' => 'Urutan harus berupa angka!',
        ]);

        $bab->update([
            'nama_bab' => $request->nama_bab ?? $bab->nama_bab,
            'urutan' => $request->urutan ?? $bab->urutan,
        ]);

        return response()->json([
            'message' => 'Bab berhasil diupdate!',
            'data' => $bab,
        ], 200);
    }

    public function destroy($id)
    {
        $bab = Bab::findOrFail($id);
        $bab->delete();

        return response()->json([
            'message' => 'Bab berhasil dihapus!',
        ], 200);
    }
}