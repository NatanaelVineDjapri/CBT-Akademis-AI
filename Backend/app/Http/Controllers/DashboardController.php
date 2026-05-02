<?php

namespace App\Http\Controllers;

use App\Models\BankSoal;
use App\Models\MataKuliah;
use App\Models\NilaiAkhir;
use App\Models\Pengumuman;
use App\Models\PesertaUjian;
use App\Models\Ujian;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class DashboardController extends Controller
{
    public function dosen(Request $request)
    {
        PesertaUjian::autoExpire();

        $userId = $request->user()->id;
        $now = now();

        $allUjian = Ujian::with('mataKuliah')
            ->where('created_by', $userId)
            ->orderByDesc('start_date')
            ->get();

        $berlangsung = $allUjian->filter(fn($u) => $u->start_date <= $now && $u->end_date >= $now);
        $selesai     = $allUjian->filter(fn($u) => $u->end_date < $now);

        $formatUjian = fn($u) => [
            'id'          => $u->id,
            'nama'        => $u->nama_ujian,
            'mata_kuliah' => $u->mataKuliah?->nama ?? '-',
            'start_date'  => $u->start_date?->format('d M Y'),
            'end_date'    => $u->end_date?->format('d M Y'),
            'jam'         => ($u->start_date?->format('H:i') ?? '') . ' – ' . ($u->end_date?->format('H:i') ?? ''),
        ];

        $bankSoal = BankSoal::withCount('soal')
            ->where('created_by', $userId)
            ->orderByDesc('created_at')
            ->limit(3)
            ->get()
            ->map(fn($b) => [
                'id'         => $b->id,
                'nama'       => $b->nama,
                'jumlah_soal' => $b->soal_count,
                'permission' => $b->permission,
            ]);

        return response()->json([
            'message' => 'Data dashboard dosen berhasil diambil!',
            'stats'   => [
                'total_bank_soal'   => BankSoal::where('created_by', $userId)->count(),
                'total_ujian'       => $allUjian->count(),
                'ujian_berlangsung' => $berlangsung->count(),
                'ujian_selesai'     => $selesai->count(),
            ],
            'bank_soal'          => $bankSoal,
            'ujian_terbaru'      => $allUjian->take(3)->map($formatUjian)->values(),
            'ujian_berlangsung'  => $berlangsung->take(3)->map($formatUjian)->values(),
            'ujian_selesai'      => $selesai->take(3)->map($formatUjian)->values(),
        ]);
    }

    public function dosenPerforma(Request $request)
    {
        $userId = $request->user()->id;

        // Query 1: semua ujian dosen — top 10 per matkul diambil di PHP
        $allUjian = Ujian::with(['mataKuliah', 'ujianSetting'])
            ->where('created_by', $userId)
            ->orderBy('mata_kuliah_id')
            ->orderByDesc('start_date')
            ->get();

        if ($allUjian->isEmpty()) {
            return response()->json(['message' => 'Data performa berhasil diambil!', 'data' => []]);
        }

        $ujianByMatkul = $allUjian->groupBy('mata_kuliah_id')
            ->map(fn($ujians) => $ujians->take(10));

        $allUjianIds = $ujianByMatkul->flatten()->pluck('id')->toArray();
        $matkulIds   = $ujianByMatkul->keys()->toArray();

        // Query 2: avg nilai per ujian (bulk)
        $avgByUjian = NilaiAkhir::join('peserta_ujian', 'nilai_akhir.peserta_ujian_id', '=', 'peserta_ujian.id')
            ->whereIn('peserta_ujian.ujian_id', $allUjianIds)
            ->groupBy('peserta_ujian.ujian_id')
            ->selectRaw('peserta_ujian.ujian_id, AVG(nilai_akhir.nilai_total) AS avg_nilai')
            ->pluck('avg_nilai', 'ujian_id');

        // Query 3: stats per matkul (bulk)
        $statsByMatkul = NilaiAkhir::join('peserta_ujian', 'nilai_akhir.peserta_ujian_id', '=', 'peserta_ujian.id')
            ->join('ujian', 'peserta_ujian.ujian_id', '=', 'ujian.id')
            ->where('ujian.created_by', $userId)
            ->whereIn('ujian.mata_kuliah_id', $matkulIds)
            ->groupBy('ujian.mata_kuliah_id')
            ->selectRaw('
                ujian.mata_kuliah_id,
                AVG(nilai_akhir.nilai_total)                               AS rata_rata,
                COUNT(*)                                                    AS total_peserta,
                SUM(CASE WHEN nilai_akhir.lulus = true THEN 1 ELSE 0 END)  AS total_lulus,
                COUNT(DISTINCT peserta_ujian.user_id)                      AS jumlah_mahasiswa
            ')
            ->get()
            ->keyBy('mata_kuliah_id');

        $result = $ujianByMatkul->map(function ($ujians, $matkulId) use ($avgByUjian, $statsByMatkul) {
            $stats        = $statsByMatkul[$matkulId] ?? null;
            $totalPeserta = (int) ($stats->total_peserta ?? 0);

            $ujianData = $ujians->sortBy('start_date')->map(function ($ujian) use ($avgByUjian) {
                $avg          = (float) ($avgByUjian[$ujian->id] ?? 0);
                $passingGrade = $ujian->ujianSetting?->passing_grade ?? 60;
                return [
                    'ujian'   => $ujian->nama_ujian,
                    'nilai'   => round($avg, 1),
                    'lowPass' => $avg < $passingGrade,
                ];
            })->values();

            return [
                'matkul_id'            => $matkulId,
                'matkul_nama'          => $ujians->first()->mataKuliah?->nama ?? '-',
                'rata_rata_nilai'      => round((float) ($stats->rata_rata ?? 0), 2),
                'persentase_kelulusan' => $totalPeserta > 0
                    ? round(((int) ($stats->total_lulus ?? 0) / $totalPeserta) * 100)
                    : 0,
                'jumlah_mahasiswa'     => (int) ($stats->jumlah_mahasiswa ?? 0),
                'ujian'                => $ujianData,
            ];
        })->sortBy('matkul_nama')->values();

        return response()->json([
            'message' => 'Data performa berhasil diambil!',
            'data'    => $result,
        ]);
    }

    public function adminUniversitas(Request $request)
    {
        PesertaUjian::autoExpire();

        $user          = $request->user();
        $universitasId = $user->universitas_id;
        $now           = now();

        $dosenIds = User::where('universitas_id', $universitasId)
            ->where('role', 'dosen')
            ->pluck('id');

        $totalMataKuliah = MataKuliah::whereHas('prodi.fakultas', fn($q) => $q->where('universitas_id', $universitasId))->count();

        $allUjianQuery = Ujian::whereIn('created_by', $dosenIds);

        $formatUjian = fn($u) => [
            'id'          => $u->id,
            'nama'        => $u->nama_ujian,
            'mata_kuliah' => $u->mataKuliah?->nama ?? '-',
            'start_date'  => $u->start_date?->format('d M Y'),
            'end_date'    => $u->end_date?->format('d M Y'),
            'jam'         => ($u->start_date?->format('H:i') ?? '') . ' – ' . ($u->end_date?->format('H:i') ?? ''),
        ];

        $ujianBerlangsung = Ujian::with('mataKuliah')
            ->where('created_by', $user->id)
            ->where('jenis_ujian', 'pmb')
            ->where('start_date', '<=', $now)
            ->where('end_date', '>=', $now)
            ->orderByDesc('start_date')
            ->limit(3)
            ->get()
            ->map(fn($u) => [...$formatUjian($u), 'jumlah_peserta' => $u->pesertaUjian()->count()]);

        $bankSoal = BankSoal::withCount('soal')
            ->where('created_by', $user->id)
            ->orderByDesc('created_at')
            ->limit(3)
            ->get()
            ->map(fn($b) => [
                'id'          => $b->id,
                'nama'        => $b->nama,
                'jumlah_soal' => $b->soal_count,
                'permission'  => $b->permission,
            ]);

        $ujianTerbaru = Ujian::with('mataKuliah')
            ->where('created_by', $user->id)
            ->where('jenis_ujian', 'pmb')
            ->orderByDesc('start_date')
            ->limit(3)
            ->get()
            ->map($formatUjian);

        $pengumuman = Pengumuman::where('created_by', $user->id)
            ->where(fn($q) => $q->whereNull('expired_at')->orWhere('expired_at', '>', $now))
            ->orderByDesc('created_at')
            ->limit(5)
            ->get()
            ->map(fn($p) => [
                'id'         => $p->id,
                'judul'      => $p->judul,
                'isi'        => $p->isi,
                'expired_at' => $p->expired_at?->format('d M Y'),
            ]);

        return response()->json([
            'message' => 'Data dashboard admin universitas berhasil diambil!',
            'stats'   => [
                'total_dosen'      => $dosenIds->count(),
                'total_mahasiswa'  => User::where('universitas_id', $universitasId)->where('role', 'mahasiswa')->count(),
                'total_matakuliah' => $totalMataKuliah,
                'total_ujian'      => $allUjianQuery->count(),
            ],
            'ujian_berlangsung' => $ujianBerlangsung,
            'bank_soal'         => $bankSoal,
            'ujian_terbaru'     => $ujianTerbaru,
            'pengumuman'        => $pengumuman,
        ]);
    }

    public function adminUniversitasPerforma(Request $request)
    {
        $userId = $request->user()->id;

        $ujianList = Ujian::where('created_by', $userId)
            ->where('jenis_ujian', 'pmb')
            ->where('end_date', '<', now())
            ->orderBy('start_date')
            ->get();

        if ($ujianList->isEmpty()) {
            return response()->json(['message' => 'Data performa PMB berhasil diambil!', 'stats' => null, 'ujian' => []]);
        }

        $ujianIds = $ujianList->pluck('id')->toArray();

        $avgByUjian = NilaiAkhir::join('peserta_ujian', 'nilai_akhir.peserta_ujian_id', '=', 'peserta_ujian.id')
            ->whereIn('peserta_ujian.ujian_id', $ujianIds)
            ->groupBy('peserta_ujian.ujian_id')
            ->selectRaw('peserta_ujian.ujian_id, AVG(nilai_akhir.nilai_total) AS avg_nilai, COUNT(*) AS total_peserta, SUM(CASE WHEN nilai_akhir.lulus = true THEN 1 ELSE 0 END) AS total_lulus')
            ->get()
            ->keyBy('ujian_id');

        $ujianData = $ujianList->map(function ($ujian) use ($avgByUjian) {
            $row          = $avgByUjian[$ujian->id] ?? null;
            $avg          = (float) ($row->avg_nilai ?? 0);
            $passingGrade = 60;
            return [
                'ujian'   => $ujian->nama_ujian,
                'nilai'   => round($avg, 1),
                'lowPass' => $avg > 0 && $avg < $passingGrade,
            ];
        })->values();

        $totalPeserta = $avgByUjian->sum('total_peserta');
        $totalLulus   = $avgByUjian->sum('total_lulus');
        $rataRata     = $avgByUjian->avg('avg_nilai');

        return response()->json([
            'message' => 'Data performa PMB berhasil diambil!',
            'stats'   => [
                'rata_rata'             => round((float) ($rataRata ?? 0), 1),
                'persentase_kelulusan'  => $totalPeserta > 0 ? round(($totalLulus / $totalPeserta) * 100) : 0,
                'total_peserta'         => (int) $totalPeserta,
            ],
            'ujian' => $ujianData,
        ]);
    }

    public function adminUniversitasPerformaProdi(Request $request)
    {
        $univId = $request->user()->universitas_id;

        $data = DB::table('nilai_akhir')
            ->join('peserta_ujian', 'nilai_akhir.peserta_ujian_id', '=', 'peserta_ujian.id')
            ->join('users',         'peserta_ujian.user_id',        '=', 'users.id')
            ->join('prodi',         'users.prodi_id',               '=', 'prodi.id')
            ->join('fakultas',      'prodi.fakultas_id',            '=', 'fakultas.id')
            ->where('fakultas.universitas_id', $univId)
            ->where('users.role', 'mahasiswa')
            ->groupBy('prodi.id', 'prodi.nama')
            ->select(
                'prodi.nama',
                DB::raw('ROUND(AVG(nilai_akhir.nilai_total), 1) AS rata_rata'),
                DB::raw('COUNT(DISTINCT users.id) AS jumlah_mahasiswa')
            )
            ->orderByDesc('rata_rata')
            ->limit(10)
            ->get();

        return response()->json($data);
    }

    public function adminUniversitasAktivitasUjian(Request $request)
    {
        $univId = $request->user()->universitas_id;

        $data = DB::table('ujian')
            ->join('users', 'ujian.created_by', '=', 'users.id')
            ->where('users.universitas_id', $univId)
            ->where('ujian.start_date', '>=', now()->subMonths(11)->startOfMonth())
            ->groupBy(DB::raw('DATE_FORMAT(ujian.start_date, "%Y-%m")'))
            ->select(
                DB::raw('DATE_FORMAT(ujian.start_date, "%Y-%m") AS bulan'),
                DB::raw('COUNT(*) AS total')
            )
            ->orderBy('bulan')
            ->get()
            ->map(function ($row) {
                [$y, $m] = explode('-', $row->bulan);
                $bulanNama = ['Jan','Feb','Mar','Apr','Mei','Jun','Jul','Agu','Sep','Okt','Nov','Des'];
                return [
                    'bulan' => $bulanNama[(int)$m - 1] . ' ' . $y,
                    'total' => (int) $row->total,
                ];
            });

        return response()->json($data);
    }

    public function adminUniversitasDistribusi(Request $request)
    {
        $univId = $request->user()->universitas_id;

        $distribusi = DB::table('users')
            ->join('prodi',    'users.prodi_id',     '=', 'prodi.id')
            ->join('fakultas', 'prodi.fakultas_id',  '=', 'fakultas.id')
            ->where('fakultas.universitas_id', $univId)
            ->where('users.role', 'mahasiswa')
            ->groupBy('fakultas.id', 'fakultas.nama', 'fakultas.kode')
            ->select('fakultas.nama', 'fakultas.kode', DB::raw('COUNT(users.id) as total'))
            ->orderByDesc('total')
            ->get();

        return response()->json($distribusi);
    }

    public function mahasiswa(Request $request)
    {
        PesertaUjian::autoExpire();

        $userId = $request->user()->id;

        // Stats
        $ujianSelesai   = PesertaUjian::where('user_id', $userId)->where('status', 'selesai')->count();
        $ujianAkanDatang = PesertaUjian::where('user_id', $userId)->where('status', 'belum_mulai')->count();
        $rataRata       = NilaiAkhir::whereHas('pesertaUjian', fn($q) => $q->where('user_id', $userId))->avg('nilai_total');
        $tertinggi      = NilaiAkhir::whereHas('pesertaUjian', fn($q) => $q->where('user_id', $userId))->max('nilai_total');

        // Ujian segera berlangsung
        $segera = PesertaUjian::with(['ujian.mataKuliah'])
            ->where('user_id', $userId)
            ->where('status', 'sedang_berlangsung')
            ->join('ujian', 'peserta_ujian.ujian_id', '=', 'ujian.id')
            ->orderBy('ujian.start_date')
            ->select('peserta_ujian.*')
            ->first();

        $ujianSegera = $segera ? [
            'peserta_ujian_id' => $segera->id,
            'ujian_id'         => $segera->ujian->id,
            'nama'             => $segera->ujian->nama_ujian,
            'mata_kuliah'      => $segera->ujian->mataKuliah?->nama ?? '-',
            'start_date'       => $segera->ujian->start_date,
            'end_date'         => $segera->ujian->end_date,
        ] : null;
        // 
        $akanDatangList = PesertaUjian::with(['ujian.mataKuliah'])
            ->where('peserta_ujian.user_id', $userId)
            ->where('peserta_ujian.status', 'belum_mulai')
            ->join('ujian', 'peserta_ujian.ujian_id', '=', 'ujian.id')
            ->orderBy('ujian.start_date')
            ->limit(3)
            ->select('peserta_ujian.*')
            ->get()
            ->map(fn($p) => [
                'peserta_ujian_id' => $p->id,
                'ujian_id'         => $p->ujian->id,
                'nama'             => $p->ujian->nama_ujian,
                'mata_kuliah'      => $p->ujian->mataKuliah?->nama ?? '-',
                'start_date'       => $p->ujian->start_date,
                'end_date'         => $p->ujian->end_date,
            ]);

        // Nilai terbaru (5 terakhir) 
        $nilaiTerbaru = NilaiAkhir::with(['pesertaUjian.ujian.mataKuliah'])
            ->whereHas('pesertaUjian', fn($q) => $q->where('user_id', $userId))
            ->orderBy('graded_at', 'desc')
            ->limit(5)
            ->get()
            ->map(fn($n) => [
                'nama'       => $n->pesertaUjian->ujian->nama_ujian ?? '-',
                'mata_kuliah' => $n->pesertaUjian->ujian->mataKuliah?->nama ?? '-',
                'tanggal'    => $n->graded_at?->format('d M Y'),
                'nilai'      => $n->nilai_total,
                'grade'      => $n->grade,
                'lulus'      => $n->lulus,
            ]);

        // Ujian per bulan (6 bulan terakhir)
        $ujianRaw = PesertaUjian::with('ujian')
            ->where('user_id', $userId)
            ->whereHas('ujian', fn($q) => $q->where('start_date', '>=', now()->subMonths(6)->startOfMonth()))
            ->get();

        $ujianPerBulan = $ujianRaw
            ->groupBy(fn($p) => $p->ujian->start_date->format('Y-m'))
            ->map(fn($items, $key) => [
                'bulan'       => $items->first()->ujian->start_date->format('M'),
                'bulan_sort'  => $key,
                'selesai'     => $items->where('status', 'selesai')->count(),
                'akan_datang' => $items->where('status', 'belum_mulai')->count(),
            ])
            ->sortBy('bulan_sort')
            ->values();

        // Perkembangan nilai per bulan (6 bulan terakhir)
        $nilaiRaw = NilaiAkhir::with(['pesertaUjian.ujian'])
            ->whereHas('pesertaUjian', fn($q) => $q->where('user_id', $userId))
            ->where('graded_at', '>=', now()->subMonths(6)->startOfMonth())
            ->orderBy('graded_at')
            ->get();

        $perkembangan = $nilaiRaw
            ->groupBy(fn($n) => $n->graded_at->format('Y-m'))
            ->map(function ($items, $key) {
                $sorted = $items->sortByDesc('nilai_total');
                return [
                    'bulan'         => $items->first()->graded_at->format('M'),
                    'bulan_sort'    => $key,
                    'rata'          => round($items->avg('nilai_total'), 1),
                    'tertinggi'     => $items->max('nilai_total'),
                    'matkul_tinggi' => $sorted->first()?->pesertaUjian?->ujian?->nama_ujian ?? '-',
                    'matkul_rendah' => $sorted->last()?->pesertaUjian?->ujian?->nama_ujian ?? '-',
                ];
            })
            ->sortBy('bulan_sort')
            ->values();

        return response()->json([
            "message" => 'Data dashboard berhasil diambil!',
            'stats' => [
                'ujian_selesai'    => $ujianSelesai,
                'ujian_akan_datang' => $ujianAkanDatang,
                'rata_rata_nilai'  => round($rataRata ?? 0, 1),
                'nilai_tertinggi'  => $tertinggi ?? 0,
            ],
            'ujian_segera'      => $ujianSegera,
            'ujian_akan_datang' => $akanDatangList,
            'nilai_terbaru'     => $nilaiTerbaru,
            'ujian_per_bulan'   => $ujianPerBulan,
            'perkembangan_nilai' => $perkembangan,
        ]);
    }
}
