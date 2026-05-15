<?php

namespace App\Http\Controllers;

use App\Models\MataKuliah;
use App\Models\User;
use App\Models\UserMataKuliah;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class KrsController extends Controller
{
    // GET /krs/mahasiswa — list mahasiswa with enrollment counts
    public function index(Request $request)
    {
        $auth = $request->user();

        $users = User::with('prodi')
            ->withCount('mataKuliah')
            ->where('role', 'mahasiswa')
            ->whereHas('prodi.fakultas.universitas', fn($q) => $q->where('id', $auth->universitas_id))
            ->when($request->prodi_id, fn($q) => $q->where('prodi_id', $request->prodi_id))
            ->when($request->search, function ($q) use ($request) {
                $term = '%' . strtolower($request->search) . '%';
                $q->where(fn($q2) => $q2
                    ->whereRaw('LOWER(nama) LIKE ?', [$term])
                    ->orWhereRaw('LOWER(nim) LIKE ?', [$term])
                );
            })
            ->orderBy('nama')
            ->paginate($request->per_page ?? 20);

        return response()->json([
            'message' => 'OK',
            'data'    => collect($users->items())->map(fn($u) => [
                'id'              => $u->id,
                'nama'            => $u->nama,
                'nim'             => $u->nim,
                'tahun_masuk'     => $u->tahun_masuk,
                'prodi_id'        => $u->prodi_id,
                'prodi'           => $u->prodi?->nama,
                'matkul_count'    => $u->mata_kuliah_count,
            ]),
            'meta'    => [
                'total'        => $users->total(),
                'per_page'     => $users->perPage(),
                'current_page' => $users->currentPage(),
                'last_page'    => $users->lastPage(),
            ],
        ]);
    }

    // GET /krs/mahasiswa/{userId} — enrolled mata kuliah of a student
    public function showMahasiswa(Request $request, $userId)
    {
        $auth = $request->user();

        $student = User::with('prodi.fakultas')
            ->where('role', 'mahasiswa')
            ->whereHas('prodi.fakultas.universitas', fn($q) => $q->where('id', $auth->universitas_id))
            ->findOrFail($userId);

        $enrolled = UserMataKuliah::with('mataKuliah')
            ->where('user_id', $userId)
            ->get()
            ->map(fn($umk) => [
                'user_mata_kuliah_id' => $umk->id,
                'mata_kuliah_id'      => $umk->mata_kuliah_id,
                'nama'                => $umk->mataKuliah?->nama,
                'kode'                => $umk->mataKuliah?->kode,
                'semester'            => $umk->mataKuliah?->semester,
                'sks'                 => $umk->mataKuliah?->sks,
                'tahun_ajaran'        => $umk->tahun_ajaran,
                'is_aktif'            => $umk->is_aktif,
            ]);

        return response()->json([
            'message' => 'OK',
            'data'    => [
                'id'          => $student->id,
                'nama'        => $student->nama,
                'nim'         => $student->nim,
                'tahun_masuk' => $student->tahun_masuk,
                'prodi_id'    => $student->prodi_id,
                'prodi'       => $student->prodi?->nama,
                'krs'         => $enrolled->values(),
            ],
        ]);
    }

    // POST /krs/mahasiswa/{userId}/add — add mata kuliah to student
    public function addMatkul(Request $request, $userId)
    {
        $auth = $request->user();

        $student = User::where('role', 'mahasiswa')
            ->whereHas('prodi.fakultas.universitas', fn($q) => $q->where('id', $auth->universitas_id))
            ->findOrFail($userId);

        $request->validate([
            'mata_kuliah_ids' => 'required|array|min:1',
            'mata_kuliah_ids.*' => 'integer|exists:mata_kuliah,id',
            'tahun_ajaran'    => 'required|string',
        ]);

        $tahunAjaran = $request->tahun_ajaran;
        $added = 0;

        foreach ($request->mata_kuliah_ids as $mkId) {
            $exists = UserMataKuliah::where('user_id', $userId)
                ->where('mata_kuliah_id', $mkId)
                ->exists();

            if (!$exists) {
                UserMataKuliah::create([
                    'user_id'        => $userId,
                    'mata_kuliah_id' => $mkId,
                    'tahun_ajaran'   => $tahunAjaran,
                    'is_aktif'       => true,
                ]);
                $added++;
            }
        }

        return response()->json(['message' => $added . ' mata kuliah ditambahkan.', 'added' => $added]);
    }

    // DELETE /krs/mahasiswa/{userId}/matkul/{matkulId}
    public function removeMatkul(Request $request, $userId, $matkulId)
    {
        $auth = $request->user();

        User::where('role', 'mahasiswa')
            ->whereHas('prodi.fakultas.universitas', fn($q) => $q->where('id', $auth->universitas_id))
            ->findOrFail($userId);

        UserMataKuliah::where('user_id', $userId)
            ->where('mata_kuliah_id', $matkulId)
            ->delete();

        return response()->json(['message' => 'Mata kuliah dihapus dari KRS mahasiswa.']);
    }

    // POST /krs/apply-package — bulk enroll students of a prodi into a semester's courses
    public function applyPackage(Request $request)
    {
        $auth = $request->user();

        $request->validate([
            'prodi_id'     => 'required|integer|exists:prodi,id',
            'semester'     => 'required|integer|min:1|max:8',
            'tahun_ajaran' => 'required|string',
        ]);

        // Verify prodi belongs to this universitas
        $prodi = \App\Models\Prodi::whereHas('fakultas.universitas', fn($q) => $q->where('id', $auth->universitas_id))
            ->findOrFail($request->prodi_id);

        // Mata kuliah in this semester for this prodi
        $matkuls = MataKuliah::where('prodi_id', $prodi->id)
            ->where('semester', $request->semester)
            ->pluck('id');

        if ($matkuls->isEmpty()) {
            return response()->json(['message' => 'Tidak ada mata kuliah untuk semester ini.'], 422);
        }

        // All mahasiswa in this prodi
        $students = User::where('role', 'mahasiswa')
            ->where('prodi_id', $prodi->id)
            ->pluck('id');

        if ($students->isEmpty()) {
            return response()->json(['message' => 'Tidak ada mahasiswa di prodi ini.'], 422);
        }

        $inserted = 0;
        foreach ($students as $userId) {
            foreach ($matkuls as $mkId) {
                $exists = UserMataKuliah::where('user_id', $userId)
                    ->where('mata_kuliah_id', $mkId)
                    ->exists();

                if (!$exists) {
                    UserMataKuliah::create([
                        'user_id'        => $userId,
                        'mata_kuliah_id' => $mkId,
                        'tahun_ajaran'   => $request->tahun_ajaran,
                        'is_aktif'       => true,
                    ]);
                    $inserted++;
                }
            }
        }

        return response()->json([
            'message'   => "Paket semester {$request->semester} diterapkan ke {$students->count()} mahasiswa ({$inserted} enrollment baru).",
            'students'  => $students->count(),
            'matkuls'   => $matkuls->count(),
            'inserted'  => $inserted,
        ]);
    }

    // GET /krs/prodi/{prodiId}/semester/{semester} — list courses for a semester (for selection UI)
    public function semesterCourses(Request $request, $prodiId, $semester)
    {
        $auth = $request->user();

        \App\Models\Prodi::whereHas('fakultas.universitas', fn($q) => $q->where('id', $auth->universitas_id))
            ->findOrFail($prodiId);

        $courses = MataKuliah::where('prodi_id', $prodiId)
            ->where('semester', $semester)
            ->orderBy('kode')
            ->get(['id', 'nama', 'kode', 'semester', 'sks']);

        return response()->json(['message' => 'OK', 'data' => $courses]);
    }
}
