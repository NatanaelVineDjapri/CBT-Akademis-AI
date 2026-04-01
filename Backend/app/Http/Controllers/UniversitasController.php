<?php

namespace App\Http\Controllers;

use App\Models\Universitas;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class UniversitasController extends Controller
{
    public function index(Request $request)
    {
        $universitas = Universitas::withCount([
            'fakultas',
            'users as total_mahasiswa' => fn($q) => $q->where('role', 'mahasiswa'),
            'users as total_dosen' => fn($q) => $q->where('role', 'dosen'),
        ])
            ->when($request->search, fn($q) => $q->where('nama', 'like', '%' . $request->search . '%')
                ->orWhere('kode', 'like', '%' . $request->search . '%'))
            ->paginate($request->per_page ?? 10);

        return response()->json([
            'message' => 'Data universitas berhasil diambil!',
            'data' => $universitas->items(),
            'meta' => [
                'total' => $universitas->total(),
                'per_page' => $universitas->perPage(),
                'current_page' => $universitas->currentPage(),
                'last_page' => $universitas->lastPage(),
            ],
        ], 200);
    }

    public function store(Request $request)
    {
        $request->validate([
            'nama' => 'required|string|max:255',
            'kode' => 'required|string|unique:universitas,kode',
            'alamat' => 'nullable|string',
            'logo' => 'nullable|image|mimes:jpg,jpeg,png|max:2048',
        ], [
            'nama.required' => 'Nama universitas wajib diisi!',
            'kode.required' => 'Kode universitas wajib diisi!',
            'kode.unique' => 'Kode universitas sudah digunakan!',
            'logo.image' => 'Logo harus berupa gambar!',
            'logo.max' => 'Ukuran logo maksimal 2MB!',
        ]);

        $logoPath = null;
        if ($request->hasFile('logo')) {
            $logoPath = $request->file('logo')->store('universitas', 'public');
        }

        $universitas = Universitas::create([
            'nama' => $request->nama,
            'kode' => $request->kode,
            'alamat' => $request->alamat,
            'logo' => $logoPath,
        ]);

        return response()->json([
            'message' => 'Universitas berhasil didaftarkan!',
            'data' => $universitas,
        ], 201);
    }

    public function update(Request $request, $id)
    {
        $universitas = Universitas::findOrFail($id);

        $request->validate([
            'nama' => 'sometimes|string|max:255',
            'kode' => 'sometimes|string|unique:universitas,kode,' . $id,
            'alamat' => 'nullable|string',
            'logo' => 'nullable|image|mimes:jpg,jpeg,png|max:2048',
        ], [
            'kode.unique' => 'Kode universitas sudah digunakan!',
            'logo.image' => 'Logo harus berupa gambar!',
            'logo.max' => 'Ukuran logo maksimal 2MB!',
        ]);

        if ($request->hasFile('logo')) {
            if ($universitas->logo) {
                Storage::disk('public')->delete($universitas->logo);
            }
            $universitas->logo = $request->file('logo')->store('universitas', 'public');
        }

        $universitas->update([
            'nama' => $request->nama ?? $universitas->nama,
            'kode' => $request->kode ?? $universitas->kode,
            'alamat' => $request->alamat ?? $universitas->alamat,
            'logo' => $universitas->logo,
        ]);

        return response()->json([
            'message' => 'Universitas berhasil diupdate!',
            'data' => $universitas,
        ], 200);
    }

    public function destroy($id)
    {
        $universitas = Universitas::findOrFail($id);

        if ($universitas->logo) {
            Storage::disk('public')->delete($universitas->logo);
        }

        $universitas->delete();

        return response()->json([
            'message' => 'Universitas berhasil dihapus!',
        ], 200);
    }
}