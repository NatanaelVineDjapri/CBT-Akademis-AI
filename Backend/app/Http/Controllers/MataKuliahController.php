<?php

namespace App\Http\Controllers;

use App\Models\MataKuliah;
use App\Models\BankSoal;
use Illuminate\Http\Request;

class MataKuliahController extends Controller
{
    public function index(Request $request)
    {
        $authUser = $request->user();

        $mataKuliah = MataKuliah::with('prodi.fakultas', 'dosenMatkul.user')
            ->whereHas('prodi.fakultas.universitas', fn($q) => $q->where('id', $authUser->universitas_id))
            ->when($request->prodi_id, fn($q) => $q->where('prodi_id', $request->prodi_id))
            ->when($request->search, fn($q) => $q->where('nama', 'like', '%' . $request->search . '%')
                ->orWhere('kode', 'like', '%' . $request->search . '%'))
            ->paginate($request->per_page ?? 10);

        return response()->json([
            'message' => 'Data mata kuliah berhasil diambil!',
            'data' => $mataKuliah->items(),
            'meta' => [
                'total' => $mataKuliah->total(),
                'per_page' => $mataKuliah->perPage(),
                'current_page' => $mataKuliah->currentPage(),
                'last_page' => $mataKuliah->lastPage(),
            ],
        ], 200);
    }

    public function myMataKuliah(Request $request)
    {
        $authUser = $request->user();

        $mataKuliah = MataKuliah::with('prodi.fakultas', 'dosenMatkul.user')
            ->whereHas('userMataKuliah', fn($q) => $q->where('user_id', $authUser->id))
            ->when($request->search, function ($q) use ($request) {
                $term = '%' . strtolower($request->search) . '%';
                $q->where(fn($q2) => $q2
                    ->whereRaw('LOWER(nama) LIKE ?', [$term])
                    ->orWhereRaw('LOWER(kode) LIKE ?', [$term])
                );
            })
            ->orderBy('nama', in_array($request->sort, ['asc', 'desc']) ? $request->sort : 'asc')
            ->paginate($request->per_page ?? 30);

        return response()->json([
            'message' => 'Data mata kuliah berhasil diambil!',
            'data' => $mataKuliah->items(),
            'meta' => [
                'total' => $mataKuliah->total(),
                'per_page' => $mataKuliah->perPage(),
                'current_page' => $mataKuliah->currentPage(),
                'last_page' => $mataKuliah->lastPage(),
            ],
        ], 200);
    }

    public function dosenMataKuliah(Request $request)
    {
        $authUser = $request->user();

        $mataKuliah = MataKuliah::whereHas('dosenMatkul', fn($q) => $q->where('user_id', $authUser->id))
            ->orderBy('nama')
            ->get(['id', 'nama', 'kode']);

        return response()->json([
            'message' => 'Data mata kuliah dosen berhasil diambil!',
            'data' => $mataKuliah,
        ]);
    }

    public function myMataKuliahDetail(Request $request, $id)
    {
        $authUser = $request->user();

        $mataKuliah = MataKuliah::with([
            'dosenMatkul.user',
            'bab' => fn($q) => $q->withCount('soal')->orderBy('urutan'),
        ])
        ->whereHas('userMataKuliah', fn($q) => $q->where('user_id', $authUser->id))
        ->findOrFail($id);

        return response()->json([
            'message' => 'Detail mata kuliah berhasil diambil!',
            'data' => [
                'id'        => $mataKuliah->id,
                'nama'      => $mataKuliah->nama,
                'kode'      => $mataKuliah->kode,
                'dosen'     => $mataKuliah->dosenMatkul->first()?->user?->nama ?? '-',
                'total_bab' => $mataKuliah->bab->count(),
                'bab'       => $mataKuliah->bab->map(fn($b) => [
                    'id'          => $b->id,
                    'nama_bab'    => $b->nama_bab,
                    'urutan'      => $b->urutan,
                    'jumlah_soal' => $b->soal_count,
                ])->values(),
            ],
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'nama' => 'required|string|max:255',
            'kode' => 'required|string|unique:mata_kuliah,kode',
            'prodi_id' => 'required|exists:prodi,id',
        ], [
            'nama.required' => 'Nama mata kuliah wajib diisi!',
            'kode.required' => 'Kode mata kuliah wajib diisi!',
            'kode.unique' => 'Kode mata kuliah sudah digunakan!',
            'prodi_id.required' => 'Prodi wajib dipilih!',
            'prodi_id.exists' => 'Prodi tidak ditemukan!',
        ]);

        $mataKuliah = MataKuliah::create([
            'nama' => $request->nama,
            'kode' => $request->kode,
            'prodi_id' => $request->prodi_id,
        ]);

        BankSoal::create([
            'created_by' => $request->user()->id,
            'mata_kuliah_id' => $mataKuliah->id,
            'nama' => $mataKuliah->nama,
            'deskripsi' => null,
            'permission' => 'private',
        ]);

        return response()->json([
            'message' => 'Mata kuliah berhasil ditambahkan!',
            'data' => $mataKuliah,
        ], 201);
    }

    public function update(Request $request, $id)
    {
        $mataKuliah = MataKuliah::findOrFail($id);

        $request->validate([
            'nama' => 'sometimes|string|max:255',
            'kode' => 'sometimes|string|unique:mata_kuliah,kode,' . $id,
            'prodi_id' => 'sometimes|exists:prodi,id',
        ], [
            'kode.unique' => 'Kode mata kuliah sudah digunakan!',
            'prodi_id.exists' => 'Prodi tidak ditemukan!',
        ]);

        $mataKuliah->update([
            'nama' => $request->nama ?? $mataKuliah->nama,
            'kode' => $request->kode ?? $mataKuliah->kode,
            'prodi_id' => $request->prodi_id ?? $mataKuliah->prodi_id,
        ]);

        return response()->json([
            'message' => 'Mata kuliah berhasil diupdate!',
            'data' => $mataKuliah,
        ], 200);
    }

    public function destroy($id)
    {
        $mataKuliah = MataKuliah::findOrFail($id);
        $mataKuliah->delete();

        return response()->json([
            'message' => 'Mata kuliah berhasil dihapus!',
        ], 200);
    }
}