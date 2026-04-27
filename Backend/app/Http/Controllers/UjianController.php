<?php

namespace App\Http\Controllers;

use App\Models\NilaiAkhir;
use App\Models\PesertaUjian;
use App\Models\Ujian;
use App\Events\JawabanMasuk;
use App\Models\JawabanPeserta;
use App\Models\UjianSoal;
use Illuminate\Http\Request;

class UjianController extends Controller
{
    public function ujianMahasiswa(Request $request)
    {
        PesertaUjian::autoExpire();

        $authUser = $request->user();
        $search = $request->query('search', '');
        $status = $request->query('status', '');
        $sortDir = in_array($request->query('sort_dir'), ['asc', 'desc']) ? $request->query('sort_dir') : 'desc';
        $perPage = (int) $request->query('per_page', 8);

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
            ->when(
                $search,
                fn($q) =>
                $q->whereRaw('LOWER(ujian.nama_ujian) LIKE ?', ['%' . strtolower($search) . '%'])
            )
            ->orderBy('ujian.nama_ujian', $sortDir);

        $paginated = $query->paginate($perPage);

        $data = collect($paginated->items())->map(fn($p) => [
            'peserta_ujian_id' => $p->id,
            'ujian_id' => $p->ujian->id,
            'nama_ujian' => $p->ujian->nama_ujian,
            'mata_kuliah' => $p->ujian->mataKuliah?->nama ?? '-',
            'start_date' => $p->ujian->start_date,
            'end_date' => $p->ujian->end_date,
            'durasi_menit' => $p->ujian->durasi_menit,
            'passing_grade' => $p->ujian->ujianSetting?->passing_grade,
            'status' => $p->status,
            'attempt_ke' => $p->attempt_ke,
            'max_attempt' => $p->ujian->ujianSetting?->max_attempt,
            'jumlah_soal' => $p->ujian->ujianSoal->count(),
            'nilai_akhir_id' => $p->nilaiAkhir?->id,
            'nilai' => $p->nilaiAkhir?->nilai_total,
            'grade' => $p->nilaiAkhir?->grade,
            'lulus' => $p->nilaiAkhir?->lulus,
        ]);

        return response()->json([
            'message' => 'Daftar ujian berhasil diambil!',
            'data' => $data,
            'meta' => [
                'current_page' => $paginated->currentPage(),
                'last_page' => $paginated->lastPage(),
                'per_page' => $paginated->perPage(),
                'total' => $paginated->total(),
            ],
        ]);
    }
    public function submitJawaban(Request $request)
    {
        $request->validate([
            'peserta_ujian_id' => 'required|exists:peserta_ujian,id',
            'ujian_soal_id' => 'required|exists:ujian_soal,id',
            'jawaban' => 'required|string',
        ]);

        // Ambil data peserta + user + ujian
        $peserta = PesertaUjian::with('user', 'ujian')->findOrFail($request->peserta_ujian_id);

        // Pastikan yang submit adalah peserta yang login
        if ($peserta->user_id !== $request->user()->id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        // Simpan / update jawaban
        JawabanPeserta::updateOrCreate(
            [
                'peserta_ujian_id' => $request->peserta_ujian_id,
                'ujian_soal_id' => $request->ujian_soal_id,
            ],
            [
                'jawaban' => $request->jawaban,
            ]
        );

        // Hitung progress
        $totalSoal = UjianSoal::where('ujian_id', $peserta->ujian_id)->count();
        $totalJawaban = JawabanPeserta::where('peserta_ujian_id', $peserta->id)->count();

        // Broadcast ke Pusher
        broadcast(new JawabanMasuk([
            'peserta_ujian_id' => $peserta->id,
            'user_id' => $peserta->user_id,
            'nama' => $peserta->user->nama,
            'ujian_id' => $peserta->ujian_id,
            'nama_ujian' => $peserta->ujian->nama_ujian,
            'ujian_soal_id' => $request->ujian_soal_id,
            'jawaban' => $request->jawaban,
            'total_jawaban' => $totalJawaban,
            'total_soal' => $totalSoal,
            'progress' => $totalSoal > 0 ? round(($totalJawaban / $totalSoal) * 100) : 0,
            'waktu' => now()->format('H:i:s'),
        ]));

        return response()->json([
            'status' => 'ok',
            'message' => 'Jawaban tersimpan',
            'data' => [
                'total_jawaban' => $totalJawaban,
                'total_soal' => $totalSoal,
            ]
        ]);
    }
    public function jadwalMahasiswa(Request $request)
    {
        $authUser = $request->user();

        $ujianList = PesertaUjian::with(['ujian.mataKuliah'])
            ->where('user_id', $authUser->id)
            ->get()
            ->map(fn($peserta) => [
                'id' => $peserta->ujian->id,
                'title' => $peserta->ujian->nama_ujian,
                'mata_kuliah' => $peserta->ujian->mataKuliah?->nama,
                'start' => $peserta->ujian->start_date,
                'end' => $peserta->ujian->end_date,
                'status' => $peserta->status,
            ]);

        return response()->json([
            'message' => 'Jadwal ujian berhasil diambil!',
            'data' => $ujianList,
        ], 200);
    }

    public function jadwalDosen(Request $request)
    {
        $authUser = $request->user();

        $now = now();

        $ujianList = Ujian::with('mataKuliah')
            ->where('created_by', $authUser->id)
            ->get()
            ->map(fn($ujian) => [
                'id' => $ujian->id,
                'title' => $ujian->nama_ujian,
                'mata_kuliah' => $ujian->mataKuliah?->nama,
                'start' => $ujian->start_date,
                'end' => $ujian->end_date,
                'status' => match(true) {
                    $ujian->end_date && $now->gt($ujian->end_date)   => 'selesai',
                    $ujian->start_date && $now->gte($ujian->start_date) => 'berlangsung',
                    default => 'belum_mulai',
                },
            ]);

        return response()->json([
            'message' => 'Jadwal ujian dosen berhasil diambil!',
            'data' => $ujianList,
        ]);
    }

    public function nilaiDetail(Request $request, $id)
    {
        $authUser = $request->user();

        $nilai = NilaiAkhir::with([
            'pesertaUjian.ujian.mataKuliah',
            'pesertaUjian.ujian.gradeSetting',
            'pesertaUjian.jawabanPeserta.ujianSoal.soal.jenisSoal.opsiJawaban',
        ])->findOrFail($id);

        if ($nilai->pesertaUjian->user_id !== $authUser->id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $peserta = $nilai->pesertaUjian;
        $ujian = $peserta->ujian;

        $gradeSetting = $ujian->gradeSetting
            ->sortBy('nilai_min')
            ->map(fn($g) => [
                'grade' => $g->grade,
                'nilai_min' => $g->nilai_min,
                'nilai_max' => $g->nilai_max,
            ])->values();

        $info = [
            'nama_ujian' => $ujian->nama_ujian,
            'mata_kuliah' => $ujian->mataKuliah?->nama ?? '-',
            'tanggal' => $nilai->graded_at?->format('d/m/Y'),
            'waktu' => $nilai->graded_at?->format('H:i'),
            'nilai' => $nilai->nilai_total,
            'grade' => $nilai->grade,
            'lulus' => $nilai->lulus,
            'grade_setting' => $gradeSetting,
        ];

        $pilihan_ganda = [];
        $checklist = [];
        $essay = [];

        foreach ($peserta->jawabanPeserta->sortBy('ujianSoal.urutan') as $jwb) {
            $soal = $jwb->ujianSoal?->soal;
            $jenisSoal = $soal?->jenisSoal->first();
            $tipe = $jenisSoal?->jenis_soal ?? 'essay';
            $urutan = $jwb->ujianSoal?->urutan ?? 0;

            $kunci = $jenisSoal?->opsiJawaban
                ->where('is_correct', true)
                ->pluck('opsi')
                ->sort()
                ->implode(',') ?? '-';

            $row = [
                'no' => $urutan,
                'soal' => $soal?->deskripsi ?? '-',
                'jawaban' => $jwb->jawaban ?? '-',
                'poin' => $jwb->final_nilai ?? $jwb->nilai ?? 0,
            ];

            if ($tipe === 'pilihan_ganda') {
                $pilihan_ganda[] = array_merge($row, ['kunci' => $kunci]);
            } elseif ($tipe === 'checklist') {
                $checklist[] = array_merge($row, ['kunci' => $kunci]);
            } else {
                $essay[] = array_merge($row, [
                    'ai_feedback' => $jwb->ai_feedback,
                ]);
            }
        }

        return response()->json([
            'message' => 'Detail nilai berhasil diambil!',
            'info' => $info,
            'jawaban' => [
                'pilihan_ganda' => $pilihan_ganda,
                'checklist' => $checklist,
                'essay' => $essay,
            ],
        ]);
    }

    public function hasilUjianDosen(Request $request)
    {
        $authUser = $request->user();
        $search   = $request->query('search', '');
        $perPage  = (int) $request->query('per_page', 10);
        $now      = now();

        $sortBy  = $request->query('sort_by', 'tanggal');
        $sortDir = in_array($request->query('sort_dir'), ['asc', 'desc']) ? $request->query('sort_dir') : 'desc';

        $query = Ujian::with(['mataKuliah', 'pesertaUjian.nilaiAkhir'])
            ->withCount('pesertaUjian')
            ->where('created_by', $authUser->id)
            ->when($search, fn($q) => $q->whereRaw('LOWER(nama_ujian) LIKE ?', ['%' . strtolower($search) . '%']));

        if ($sortBy === 'avg_nilai') {
            $sub = '(SELECT AVG(na.nilai_total) FROM nilai_akhir na
                     INNER JOIN peserta_ujian pu ON na.peserta_ujian_id = pu.id
                     WHERE pu.ujian_id = ujian.id)';
            $query->orderByRaw("($sub IS NULL), $sub $sortDir");
        } elseif ($sortBy === 'status') {
            $query->orderByRaw(
                "CASE
                    WHEN end_date IS NOT NULL AND end_date < NOW() THEN 3
                    WHEN start_date IS NOT NULL AND start_date <= NOW() THEN 1
                    ELSE 2
                END $sortDir"
            );
        } else {
            $colMap = ['nama_ujian' => 'nama_ujian', 'tanggal' => 'start_date'];
            $query->orderBy($colMap[$sortBy] ?? 'start_date', $sortDir);
        }

        $paginated = $query->paginate($perPage);

        $data = collect($paginated->items())->map(fn($ujian) => [
            'id'            => $ujian->id,
            'nama_ujian'    => $ujian->nama_ujian,
            'mata_kuliah'   => $ujian->mataKuliah?->nama ?? '-',
            'jenis_ujian'   => $ujian->jenis_ujian ?? '-',
            'tanggal'       => $ujian->start_date?->format('d/m/y'),
            'pukul'         => $ujian->start_date?->format('H.i'),
            'peserta_count' => $ujian->peserta_ujian_count,
            'avg_nilai'     => $ujian->pesertaUjian->pluck('nilaiAkhir')->filter()->count()
                               ? round($ujian->pesertaUjian->pluck('nilaiAkhir')->filter()->avg('nilai_total'), 1)
                               : null,
            'total_lulus'   => $ujian->pesertaUjian->pluck('nilaiAkhir')->filter()->where('lulus', true)->count(),
            'status'        => match(true) {
                $ujian->end_date && $now->gt($ujian->end_date)      => 'Selesai',
                $ujian->start_date && $now->gte($ujian->start_date) => 'berlangsung',
                default => 'Belum_mulai',
            },
        ]);

        return response()->json([
            'message' => 'Hasil ujian dosen berhasil diambil!',
            'data' => $data,
            'meta' => [
                'current_page' => $paginated->currentPage(),
                'last_page' => $paginated->lastPage(),
                'per_page' => $paginated->perPage(),
                'total' => $paginated->total(),
            ],
        ]);
    }

    public function detailUjianDosen(Request $request, $id)
    {
        $authUser = $request->user();

        $ujian = Ujian::with([
            'mataKuliah',
            'pesertaUjian' => fn($q) => $q
                ->with(['user', 'nilaiAkhir'])
                ->withExists([
                    'jawabanPeserta as needs_review' => fn($q) => $q->where('is_manual_graded', false),
                ]),
            'ujianSoal.soal.jenisSoal.opsiJawaban',
            'ujianSoal.jawabanPeserta',
        ])->where('created_by', $authUser->id)->findOrFail($id);

        $info = [
            'nama_ujian'     => $ujian->nama_ujian,
            'mata_kuliah'    => $ujian->mataKuliah?->nama ?? '-',
            'jenis_ujian'    => $ujian->jenis_ujian ?? '-',
            'tanggal'        => $ujian->start_date?->format('d/m/y'),
            'pukul'          => $ujian->start_date?->format('H.i'),
            'total_peserta'  => $ujian->pesertaUjian->count(),
            'total_soal'     => $ujian->ujianSoal->count(),
        ];

        $peserta = $ujian->pesertaUjian->map(fn($p) => [
            'id'     => $p->id,
            'nama'   => $p->user->nama,
            'nim'    => $p->user->nim,
            'status' => $p->nilaiAkhir
                ? ($p->needs_review ? 'Perlu Pengecekan' : 'Selesai')
                : match(true) {
                    $p->status === 'sedang_berlangsung' => 'Berlangsung',
                    $p->mulai_at === null                => 'Belum Mulai',
                    default                              => 'Belum Selesai',
                },
            'nilai'  => $p->nilaiAkhir?->nilai_total,
            'grade'  => $p->nilaiAkhir?->grade,
            'lulus'  => $p->nilaiAkhir?->lulus,
        ])->values();

        $distribusi = $ujian->ujianSoal
            ->sortBy('urutan')
            ->filter(fn($us) => in_array($us->soal?->jenisSoal->first()?->jenis_soal, ['pilihan_ganda', 'checklist']))
            ->map(function ($us) {
                $jenisSoal = $us->soal?->jenisSoal->first();
                $isPG      = $jenisSoal?->jenis_soal === 'pilihan_ganda';
                $opsiList  = $jenisSoal?->opsiJawaban->pluck('opsi')->toArray() ?? [];
                $kunci     = $jenisSoal?->opsiJawaban->where('is_correct', true)->pluck('opsi')->sort()->implode(',') ?? '-';
                $jawabanList = $us->jawabanPeserta->pluck('jawaban')->filter()->values();

                $opsiCount = [];
                foreach ($opsiList as $opsi) {
                    $opsiCount[$opsi] = $jawabanList->filter(fn($jwb) =>
                        $isPG ? $jwb === $opsi : in_array($opsi, explode(',', $jwb))
                    )->count();
                }

                $benar = $isPG
                    ? $jawabanList->filter(fn($jwb) => $jwb === $kunci)->count()
                    : 0;

                $total = $jawabanList->count();

                return [
                    'no'                => $us->urutan,
                    'soal'              => $us->soal?->deskripsi ?? '-',
                    'jenis'             => $jenisSoal?->jenis_soal,
                    'kunci'             => $kunci,
                    'opsi'              => $opsiCount,
                    'total_jawaban'     => $total,
                    'tingkat_ketepatan' => $total > 0 ? round(($benar / $total) * 100) : 0,
                ];
            })->values();

        return response()->json([
            'message'   => 'Detail ujian berhasil diambil!',
            'info'      => $info,
            'peserta'   => $peserta,
            'distribusi' => $distribusi,
        ]);
    }

    public function detailPesertaUjianDosen(Request $request, $ujianId, $pesertaId)
    {
        $authUser = $request->user();

        $ujian = Ujian::with(['mataKuliah', 'gradeSetting'])
            ->where('id', $ujianId)
            ->where('created_by', $authUser->id)
            ->firstOrFail();

        $peserta = PesertaUjian::with([
            'user',
            'nilaiAkhir',
            'jawabanPeserta.ujianSoal.soal.jenisSoal.opsiJawaban',
        ])->where('id', $pesertaId)->where('ujian_id', $ujianId)->firstOrFail();

        $nilai = $peserta->nilaiAkhir;

        $gradeSetting = $ujian->gradeSetting->sortBy('nilai_min')->map(fn($g) => [
            'grade'     => $g->grade,
            'nilai_min' => $g->nilai_min,
            'nilai_max' => $g->nilai_max,
        ])->values();

        $info = [
            'nama_peserta' => $peserta->user->nama,
            'nim'          => $peserta->user->nim ?? '-',
            'nama_ujian'   => $ujian->nama_ujian,
            'mata_kuliah'  => $ujian->mataKuliah?->nama ?? '-',
            'tanggal'      => $nilai?->graded_at?->format('d/m/Y'),
            'nilai'        => $nilai?->nilai_total,
            'grade'        => $nilai?->grade,
            'lulus'        => $nilai?->lulus,
            'grade_setting' => $gradeSetting,
        ];

        $pilihan_ganda = [];
        $checklist = [];
        $essay = [];

        foreach ($peserta->jawabanPeserta->sortBy('ujianSoal.urutan') as $jwb) {
            $soal      = $jwb->ujianSoal?->soal;
            $jenisSoal = $soal?->jenisSoal->first();
            $tipe      = $jenisSoal?->jenis_soal ?? 'essay';
            $urutan    = $jwb->ujianSoal?->urutan ?? 0;

            $kunci = $jenisSoal?->opsiJawaban
                ->where('is_correct', true)
                ->pluck('opsi')->sort()->implode(',') ?? '-';

            $row = [
                'no'      => $urutan,
                'soal'    => $soal?->deskripsi ?? '-',
                'jawaban' => $jwb->jawaban ?? '-',
                'poin'    => $jwb->final_nilai ?? $jwb->nilai ?? 0,
            ];

            if ($tipe === 'pilihan_ganda') {
                $pilihan_ganda[] = array_merge($row, ['kunci' => $kunci]);
            } elseif ($tipe === 'checklist') {
                $checklist[] = array_merge($row, ['kunci' => $kunci]);
            } else {
                $essay[] = array_merge($row, ['ai_feedback' => $jwb->ai_feedback]);
            }
        }

        return response()->json([
            'info'    => $info,
            'jawaban' => compact('pilihan_ganda', 'checklist', 'essay'),
        ]);
    }

    public function nilaiMahasiswa(Request $request)
    {
        $authUser = $request->user();
        $search = $request->query('search', '');
        $perPage = (int) $request->query('per_page', 10);

        $colMap = [
            'nama_ujian' => 'ujian.nama_ujian',
            'tanggal' => 'nilai_akhir.graded_at',
            'nilai' => 'nilai_akhir.nilai_total',
            'grade' => 'nilai_akhir.grade',
        ];

        $sortBy = $colMap[$request->query('sort_by', 'tanggal')] ?? 'nilai_akhir.graded_at';
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
            'id' => $nilai->id,
            'nama_ujian' => $nilai->pesertaUjian->ujian->nama_ujian ?? '-',
            'tanggal' => $nilai->graded_at?->format('d/m/y'),
            'pukul' => $nilai->graded_at?->format('H.i'),
            'nilai' => $nilai->nilai_total,
            'grade' => $nilai->grade ?? '-',
            'lulus' => $nilai->lulus,
        ]);

        return response()->json([
            'message' => 'Riwayat nilai berhasil diambil!',
            'data' => $data,
            'meta' => [
                'current_page' => $paginated->currentPage(),
                'last_page' => $paginated->lastPage(),
                'per_page' => $paginated->perPage(),
                'total' => $paginated->total(),
            ],
        ]);
    }
}
