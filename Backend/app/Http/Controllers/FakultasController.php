<?php

namespace App\Http\Controllers;

use App\Models\Fakultas;
use Illuminate\Http\Request;

class FakultasController extends Controller
{
    public function index(Request $request)
    {
        $fakultas = Fakultas::withCount([
            'prodi',
            'users as total_mahasiswa' => fn($q) => $q->where('role', 'mahasiswa'),
            'users as total_dosen' => fn($q) => $q->where('role', 'dosen'),
        ])
            ->when($request->universitas_id, fn($q) => $q->where('universitas_id', $request->universitas_id))
            ->when($request->search, fn($q) => $q->where('nama', 'like', '%' . $request->search . '%')
                ->orWhere('kode', 'like', '%' . $request->search . '%'))
            ->paginate($request->per_page ?? 10);

        return response()->json([
            'message' => 'Data fakultas berhasil diambil!',
            'data' => $fakultas->items(),
            'meta' => [
                'total' => $fakultas->total(),
                'per_page' => $fakultas->perPage(),
                'current_page' => $fakultas->currentPage(),
                'last_page' => $fakultas->lastPage(),
            ],
        ], 200);
    }

    public function store(Request $request)
    {
        $request->validate([
            'universitas_id' => 'required|exists:universitas,id',
            'nama' => 'required|string|max:255',
            'kode' => 'required|string|unique:fakultas,kode',
        ], [
            'universitas_id.required' => 'Universitas wajib dipilih!',
            'universitas_id.exists' => 'Universitas tidak ditemukan!',
            'nama.required' => 'Nama fakultas wajib diisi!',
            'kode.required' => 'Kode fakultas wajib diisi!',
            'kode.unique' => 'Kode fakultas sudah digunakan!',
        ]);

        $fakultas = Fakultas::create([
            'universitas_id' => $request->universitas_id,
            'nama' => $request->nama,
            'kode' => $request->kode,
        ]);

        return response()->json([
            'message' => 'Fakultas berhasil didaftarkan!',
            'data' => $fakultas,
        ], 201);
    }

    public function update(Request $request, $id)
    {
        $fakultas = Fakultas::findOrFail($id);

        $request->validate([
            'universitas_id' => 'sometimes|exists:universitas,id',
            'nama' => 'sometimes|string|max:255',
            'kode' => 'sometimes|string|unique:fakultas,kode,' . $id,
        ], [
            'universitas_id.exists' => 'Universitas tidak ditemukan!',
            'kode.unique' => 'Kode fakultas sudah digunakan!',
        ]);

        $fakultas->update([
            'universitas_id' => $request->universitas_id ?? $fakultas->universitas_id,
            'nama' => $request->nama ?? $fakultas->nama,
            'kode' => $request->kode ?? $fakultas->kode,
        ]);

        return response()->json([
            'message' => 'Fakultas berhasil diupdate!',
            'data' => $fakultas,
        ], 200);
    }

    public function destroy($id)
    {
        $fakultas = Fakultas::findOrFail($id);
        $fakultas->delete();

        return response()->json([
            'message' => 'Fakultas berhasil dihapus!',
        ], 200);
    }
}