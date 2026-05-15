<?php

namespace App\Http\Controllers;

use App\Models\PmbPenerimaan;
use App\Models\PesertaUjian;
use App\Models\Universitas;
use App\Models\User;
use Illuminate\Http\Request;

class PmbPenerimaanController extends Controller
{
    public function statistik(Request $request)
    {
        $user = $request->user();

        $data = PmbPenerimaan::where('universitas_id', $user->universitas_id)
            ->orderBy('tahun')
            ->get(['tahun', 'total_pendaftar', 'total_diterima']);

        return response()->json($data);
    }

    public function index(Request $request)
    {
        $user  = $request->user();
        $query = User::where('role', 'peserta_mahasiswa_baru')
            ->where('universitas_id', $user->universitas_id)
            ->with('prodi:id,nama')
            ->orderBy('nama');

        $search = $request->input('search');
        $tahun  = $request->input('tahun');

        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('nama',  'like', "%{$search}%")
                  ->orWhere('email', 'like', "%{$search}%")
                  ->orWhere('nim',   'like', "%{$search}%");
            });
        }

        if ($tahun) {
            $query->whereYear('created_at', $tahun);
        }

        $perPage = min((int) ($request->input('per_page', 50)), 500);
        $result  = $query->paginate($perPage);

        $userIds = collect($result->items())->pluck('id');
        $scores  = PesertaUjian::whereIn('user_id', $userIds)
            ->whereHas('ujian', fn ($q) => $q->where('jenis_ujian', 'pmb'))
            ->with('nilaiAkhir:peserta_ujian_id,nilai_total')
            ->get(['id', 'user_id'])
            ->groupBy('user_id')
            ->map(fn ($group) => $group->max(fn ($p) => $p->nilaiAkhir?->nilai_total));

        $items = collect($result->items())->map(function ($user) use ($scores) {
            $user->nilai_pmb = $scores[$user->id] ?? null;
            return $user;
        });

        return response()->json([
            'data' => $items,
            'meta' => [
                'total'        => $result->total(),
                'per_page'     => $result->perPage(),
                'current_page' => $result->currentPage(),
                'last_page'    => $result->lastPage(),
            ],
        ]);
    }

    public function proses(Request $request)
    {
        $request->validate([
            'tahun'                  => 'required|integer|min:2000|max:2100',
            'diterima'               => 'array',
            'diterima.*.user_id'     => 'required|integer|exists:users,id',
            'diterima.*.nim'         => 'nullable|string|max:50',
            'diterima.*.prodi_id'    => 'nullable|integer|exists:prodi,id',
            'ditolak'                => 'array',
            'ditolak.*'              => 'integer|exists:users,id',
        ]);

        $authUser       = $request->user();
        $diterima       = $request->input('diterima', []);
        $ditolak        = $request->input('ditolak', []);
        $tahun          = $request->input('tahun');
        $totalDiterima  = \count($diterima);
        $totalPendaftar = $totalDiterima + \count($ditolak);

        $univKode   = Universitas::where('id', $authUser->universitas_id)->value('kode');
        $emailDomain = 'student.' . strtolower($univKode) . '.ac.id';

        foreach ($diterima as $item) {
            $user = User::where('id', $item['user_id'])
                ->where('universitas_id', $authUser->universitas_id)
                ->where('role', 'peserta_mahasiswa_baru')
                ->first();

            if (!$user) continue;

            $nim       = $item['nim'] ?? null;
            $emailBaru = $nim
                ? strtolower(preg_replace('/\s+/', '.', $user->nama)) . '.' . $nim . '@' . $emailDomain
                : $user->email;

            $user->update([
                'role'        => 'mahasiswa',
                'nim'         => $nim,
                'email'       => $emailBaru,
                'prodi_id'    => $item['prodi_id'] ?? $user->prodi_id,
                'tahun_masuk' => $tahun,
            ]);
        }

        if (!empty($ditolak)) {
            User::whereIn('id', $ditolak)
                ->where('universitas_id', $authUser->universitas_id)
                ->where('role', 'peserta_mahasiswa_baru')
                ->delete();
        }

        $record = PmbPenerimaan::firstOrCreate(
            ['universitas_id' => $authUser->universitas_id, 'tahun' => $tahun],
            ['total_pendaftar' => 0, 'total_diterima' => 0]
        );
        $record->increment('total_pendaftar', $totalPendaftar);
        $record->increment('total_diterima',  $totalDiterima);

        return response()->json([
            'message'        => 'Proses penerimaan berhasil.',
            'total_diterima' => $totalDiterima,
            'total_ditolak'  => \count($ditolak),
        ]);
    }
}
