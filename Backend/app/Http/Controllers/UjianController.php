<?php

namespace App\Http\Controllers;

use App\Models\NilaiAkhir;
use App\Models\PesertaUjian;
use Illuminate\Http\Request;

class UjianController extends Controller
{
    public function ujianMahasiswa(Request $request)
    {
        $authUser = $request->user();
        $search   = $request->query('search', '');
        $status   = $request->query('status', '');
        $sortDir  = in_array($request->query('sort_dir'), ['asc', 'desc']) ? $request->query('sort_dir') : 'desc';
        $perPage  = (int) $request->query('per_page', 8);

        $query = PesertaUjian::with([
            'ujian.mataKuliah',
            'ujian.ujianSetting',
            'ujian.ujianSoal',
            'nilaiAkhir',
        ])
            ->join('ujian', 'peserta_ujian.ujian_id', '=', 'ujian.id')
            ->where('peserta_ujian.user_id', $authUser->id)
            ->select('peserta_ujian.*')
            ->when($status, fn($q) => $q->where('peserta_ujian.status', $status))
            ->when($search, fn($q) =>
                $q->whereRaw('LOWER(ujian.nama_ujian) LIKE ?', ['%' . strtolower($search) . '%'])
            )
            ->orderBy('ujian.nama_ujian', $sortDir);

        $paginated = $query->paginate($perPage);

        $data = collect($paginated->items())->map(fn($p) => [
            'peserta_ujian_id' => $p->id,
            'ujian_id'         => $p->ujian->id,
            'nama_ujian'       => $p->ujian->nama_ujian,
            'mata_kuliah'      => $p->ujian->mataKuliah?->nama ?? '-',
            'start_date'       => $p->ujian->start_date,
            'end_date'         => $p->ujian->end_date,
            'durasi_menit'     => $p->ujian->durasi_menit,
            'passing_grade'    => $p->ujian->ujianSetting?->passing_grade,
            'status'           => $p->status,
            'attempt_ke'       => $p->attempt_ke,
            'max_attempt'      => $p->ujian->ujianSetting?->max_attempt,
            'jumlah_soal'      => $p->ujian->ujianSoal->count(),
            'nilai'            => $p->nilaiAkhir?->nilai_total,
            'grade'            => $p->nilaiAkhir?->grade,
            'lulus'            => $p->nilaiAkhir?->lulus,
        ]);

        return response()->json([
            'message' => 'Daftar ujian berhasil diambil!',
            'data'    => $data,
            'meta'    => [
                'current_page' => $paginated->currentPage(),
                'last_page'    => $paginated->lastPage(),
                'per_page'     => $paginated->perPage(),
                'total'        => $paginated->total(),
            ],
        ]);
    }

    public function jadwalMahasiswa(Request $request)
    {
        $authUser = $request->user();

        $ujianList = PesertaUjian::with(['ujian.mataKuliah'])
            ->where('user_id', $authUser->id)
            ->get()
            ->map(fn($peserta) => [
                'id'          => $peserta->ujian->id,
                'title'       => $peserta->ujian->nama_ujian,
                'mata_kuliah' => $peserta->ujian->mataKuliah?->nama,
                'start'       => $peserta->ujian->start_date,
                'end'         => $peserta->ujian->end_date,
                'status'      => $peserta->status,
            ]);

        return response()->json([
            'message' => 'Jadwal ujian berhasil diambil!',
            'data'    => $ujianList,
        ], 200);
    }

    public function nilaiMahasiswa(Request $request)
    {
        $authUser = $request->user();
        $search   = $request->query('search', '');
        $perPage  = (int) $request->query('per_page', 10);

        $colMap = [
            'nama_ujian' => 'ujian.nama_ujian',
            'tanggal'    => 'nilai_akhir.graded_at',
            'nilai'      => 'nilai_akhir.nilai_total',
            'grade'      => 'nilai_akhir.grade',
        ];

        $sortBy  = $colMap[$request->query('sort_by', 'tanggal')] ?? 'nilai_akhir.graded_at';
        $sortDir = in_array($request->query('sort_dir'), ['asc', 'desc']) ? $request->query('sort_dir') : 'desc';

        $query = NilaiAkhir::with(['pesertaUjian.ujian'])
            ->join('peserta_ujian', 'nilai_akhir.peserta_ujian_id', '=', 'peserta_ujian.id')
            ->join('ujian', 'peserta_ujian.ujian_id', '=', 'ujian.id')
            ->where('peserta_ujian.user_id', $authUser->id)
            ->select('nilai_akhir.*')
            ->when($search, function ($q) use ($search) {
                $q->whereRaw('LOWER(ujian.nama_ujian) LIKE ?', ['%' . strtolower($search) . '%']);
            })
            ->orderBy($sortBy, $sortDir);

        $paginated = $query->paginate($perPage);

        $data = collect($paginated->items())->map(fn($nilai) => [
            'id'         => $nilai->id,
            'nama_ujian' => $nilai->pesertaUjian->ujian->nama_ujian ?? '-',
            'tanggal'    => $nilai->graded_at?->format('d/m/y'),
            'pukul'      => $nilai->graded_at?->format('H.i'),
            'nilai'      => $nilai->nilai_total,
            'grade'      => $nilai->grade ?? '-',
            'lulus'      => $nilai->lulus,
        ]);

        return response()->json([
            'message' => 'Riwayat nilai berhasil diambil!',
            'data'    => $data,
            'meta'    => [
                'current_page' => $paginated->currentPage(),
                'last_page'    => $paginated->lastPage(),
                'per_page'     => $paginated->perPage(),
                'total'        => $paginated->total(),
            ],
        ]);
    }
}
