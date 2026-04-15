<?php

namespace App\Http\Controllers;

use App\Models\BankSoal;
use App\Models\NilaiAkhir;
use App\Models\PesertaUjian;
use App\Models\Ujian;
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

        // Ujian akan datang (3 terdekat) 
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
