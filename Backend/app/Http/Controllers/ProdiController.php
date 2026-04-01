<?php

namespace App\Http\Controllers;

use App\Models\Prodi;
use Illuminate\Http\Request;

class ProdiController extends Controller
{
    public function index(Request $request)
    {
        $prodi = Prodi::with('fakultas.universitas')
            ->withCount([
                'users as total_mahasiswa' => fn($q) => $q->where('role', 'mahasiswa'),
                'users as total_dosen' => fn($q) => $q->where('role', 'dosen'),
            ])
            ->when($request->fakultas_id, fn($q) => $q->where('fakultas_id', $request->fakultas_id))
            ->when($request->search, fn($q) => $q->where('nama', 'like', '%' . $request->search . '%')
                ->orWhere('kode', 'like', '%' . $request->search . '%'))
            ->paginate($request->per_page ?? 10);

        return response()->json([
            'message' => 'Data prodi berhasil diambil!',
            'data' => $prodi->items(),
            'meta' => [
                'total' => $prodi->total(),
                'per_page' => $prodi->perPage(),
                'current_page' => $prodi->currentPage(),
                'last_page' => $prodi->lastPage(),
            ],
        ], 200);
    }

    public function store(Request $request)
    {
        $request->validate([
            'fakultas_id' => 'required|exists:fakultas,id',
            'nama' => 'required|string|max:255',
            'kode' => 'required|string|unique:prodi,kode',
        ], [
            'fakultas_id.required' => 'Fakultas wajib dipilih!',
            'fakultas_id.exists' => 'Fakultas tidak ditemukan!',
            'nama.required' => 'Nama prodi wajib diisi!',
            'kode.required' => 'Kode prodi wajib diisi!',
            'kode.unique' => 'Kode prodi sudah digunakan!',
        ]);

        $prodi = Prodi::create([
            'fakultas_id' => $request->fakultas_id,
            'nama' => $request->nama,
            'kode' => $request->kode,
        ]);

        return response()->json([
            'message' => 'Prodi berhasil didaftarkan!',
            'data' => $prodi,
        ], 201);
    }

    public function update(Request $request, $id)
    {
        $prodi = Prodi::findOrFail($id);

        $request->validate([
            'fakultas_id' => 'sometimes|exists:fakultas,id',
            'nama' => 'sometimes|string|max:255',
            'kode' => 'sometimes|string|unique:prodi,kode,' . $id,
        ], [
            'fakultas_id.exists' => 'Fakultas tidak ditemukan!',
            'kode.unique' => 'Kode prodi sudah digunakan!',
        ]);

        $prodi->update([
            'fakultas_id' => $request->fakultas_id ?? $prodi->fakultas_id,
            'nama' => $request->nama ?? $prodi->nama,
            'kode' => $request->kode ?? $prodi->kode,
        ]);

        return response()->json([
            'message' => 'Prodi berhasil diupdate!',
            'data' => $prodi,
        ], 200);
    }

    public function destroy($id)
    {
        $prodi = Prodi::findOrFail($id);
        $prodi->delete();

        return response()->json([
            'message' => 'Prodi berhasil dihapus!',
        ], 200);
    }
}