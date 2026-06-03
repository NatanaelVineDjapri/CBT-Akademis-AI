<?php

namespace App\Http\Controllers;

use App\Models\BankSoal;
use App\Models\JawabanPeserta;
use App\Models\JenisSoal;
use App\Models\NilaiAkhir;
use App\Models\OpsiJawaban;
use App\Models\PesertaUjian;
use App\Models\ProctoringLog;
use App\Models\Soal;
use App\Models\Ujian;
use App\Events\JawabanMasuk;
use App\Models\UjianSoal;
use App\Models\UjianSetting;
use App\Models\UserMataKuliah;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class UjianController extends Controller
{
    private function generateKodeAkses(): string
    {
        do {
            $kode = strtoupper(Str::random(6));
        } while (Ujian::where('kode_akses', $kode)->exists());
        return $kode;
    }

    public function getActiveSession(Request $request)
    {
        $active = PesertaUjian::where('user_id', $request->user()->id)
            ->where('status', 'sedang_berlangsung')
            ->whereHas('ujian', fn($q) => $q->where('end_date', '>=', now()))
            ->latest('mulai_at')
            ->first();

        if (!$active) {
            return response()->json(['active' => null]);
        }

        return response()->json([
            'active' => [
                'peserta_ujian_id' => $active->id,
                'nama_ujian'       => $active->ujian->nama_ujian,
            ],
        ]);
    }

    public function ujianMahasiswa(Request $request)
    {
        PesertaUjian::autoExpire();

        $authUser = $request->user();

        // Lazy auto-enroll: hanya untuk mahasiswa reguler (bukan PMB)
        if ($authUser->role === 'peserta_mahasiswa_baru') {
            goto skip_enroll;
        }

        // Lazy auto-enroll: daftarkan ke ujian yang belum terdaftar tapi punya KRS
        $matkulIds = UserMataKuliah::where('user_id', $authUser->id)
            ->where('is_aktif', true)
            ->pluck('mata_kuliah_id');

        if ($matkulIds->isNotEmpty()) {
            $sudahTerdaftar = PesertaUjian::where('user_id', $authUser->id)->pluck('ujian_id');
            $ujianBaru = Ujian::whereIn('mata_kuliah_id', $matkulIds)
                ->whereNotIn('id', $sudahTerdaftar)
                ->pluck('id');

            foreach ($ujianBaru as $ujianId) {
                PesertaUjian::firstOrCreate(
                    ['ujian_id' => $ujianId, 'user_id' => $authUser->id],
                    ['attempt_ke' => 1, 'status' => 'belum_mulai'],
                );
            }

            // Lazy-create attempt berikutnya jika attempt terakhir sudah selesai dan masih ada sisa
            $selesaiRecords = PesertaUjian::with('ujian.ujianSetting')
                ->where('user_id', $authUser->id)
                ->where('status', 'selesai')
                ->whereIn('ujian_id', $sudahTerdaftar)
                ->get()
                ->groupBy('ujian_id')
                ->map(fn($g) => $g->sortByDesc('attempt_ke')->first());

            foreach ($selesaiRecords as $latest) {
                $maxAttempt = $latest->ujian->ujianSetting?->max_attempt ?? 1;
                if ($latest->attempt_ke >= $maxAttempt) continue;

                $nextExists = PesertaUjian::where('ujian_id', $latest->ujian_id)
                    ->where('user_id', $authUser->id)
                    ->where('attempt_ke', $latest->attempt_ke + 1)
                    ->exists();

                if (!$nextExists) {
                    PesertaUjian::create([
                        'ujian_id'   => $latest->ujian_id,
                        'user_id'    => $authUser->id,
                        'attempt_ke' => $latest->attempt_ke + 1,
                        'status'     => 'belum_mulai',
                    ]);
                }
            }
        }
        skip_enroll:
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
            ->when($status === 'sedang_berlangsung', fn($q) => $q
                ->whereIn('peserta_ujian.status', ['belum_mulai', 'sedang_berlangsung'])
                ->where('ujian.start_date', '<=', now())
                ->where('ujian.end_date', '>=', now())
                ->whereExists(fn($q) => $q->select(DB::raw(1))->from('ujian_soal')->whereColumn('ujian_soal.ujian_id', 'ujian.id'))
            )
            ->when($status === 'belum_mulai', fn($q) => $q
                ->where('peserta_ujian.status', 'belum_mulai')
                ->where('ujian.start_date', '>', now())
            )
            ->when($status === 'selesai', fn($q) => $q
                ->where('peserta_ujian.status', 'selesai')
            )
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

        // Untuk tab selesai: satu kartu per ujian (attempt tertinggi saja)
        if ($status === 'selesai') {
            $data = $data->sortByDesc('attempt_ke')->unique('ujian_id')->values();
        }

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
            'jawaban' => 'nullable|string',
        ]);

        $peserta = PesertaUjian::with('user', 'ujian')->findOrFail($request->peserta_ujian_id);

        if ($peserta->user_id !== $request->user()->id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        // Jawaban kosong = hapus jawaban
        if (empty($request->jawaban)) {
            JawabanPeserta::where('peserta_ujian_id', $request->peserta_ujian_id)
                ->where('ujian_soal_id', $request->ujian_soal_id)
                ->delete();
            return response()->json(['status' => 'ok', 'message' => 'Jawaban dihapus']);
        }

        // Auto-grade PG & checklist
        $ujianSoal  = UjianSoal::with(['soal.jenisSoal.opsiJawaban'])->findOrFail($request->ujian_soal_id);
        $jenisSoal  = $ujianSoal->soal?->jenisSoal->first();
        $tipe       = $jenisSoal?->jenis_soal ?? 'essay';
        $bobot      = (float) ($ujianSoal->bobot ?? 0);
        $finalNilai = null;

        if ($tipe === 'pilihan_ganda') {
            $correct    = $jenisSoal->opsiJawaban->firstWhere('is_correct', true)?->opsi ?? '';
            $finalNilai = strtoupper(trim($request->jawaban)) === strtoupper(trim($correct)) ? $bobot : 0.0;
        } elseif ($tipe === 'checklist') {
            $correctOpsi = $jenisSoal->opsiJawaban
                ->where('is_correct', true)->pluck('opsi')
                ->map(fn($o) => strtoupper(trim($o)))->sort()->values()->toArray();
            $jawaban = collect(explode(',', $request->jawaban))
                ->map(fn($s) => strtoupper(trim($s)))->sort()->values()->toArray();
            $finalNilai = $jawaban === $correctOpsi ? $bobot : 0.0;
        }

        JawabanPeserta::updateOrCreate(
            [
                'peserta_ujian_id' => $request->peserta_ujian_id,
                'ujian_soal_id'    => $request->ujian_soal_id,
            ],
            [
                'jawaban'     => $request->jawaban,
                'final_nilai' => $finalNilai,
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
    public function selesaiUjian(Request $request)
    {
        $request->validate(['peserta_ujian_id' => 'required|exists:peserta_ujian,id']);

        $peserta = PesertaUjian::with(['ujian.ujianSetting', 'ujian.gradeSetting', 'jawabanPeserta'])
            ->findOrFail($request->peserta_ujian_id);

        if ($peserta->user_id !== $request->user()->id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        if ($peserta->status === 'selesai') {
            return response()->json(['message' => 'Ujian sudah selesai.'], 422);
        }

        $peserta->update(['status' => 'selesai', 'selesai_at' => now()]);

        $ujian      = $peserta->ujian;
        $totalBobot = UjianSoal::where('ujian_id', $peserta->ujian_id)->sum('bobot');
        $totalEarned = $peserta->jawabanPeserta->whereNotNull('final_nilai')->sum('final_nilai');
        $nilaiTotal = $totalBobot > 0 ? round(($totalEarned / $totalBobot) * 100, 2) : 0;

        $hasUngradedEssay = $peserta->jawabanPeserta->contains(fn($jwb) => $jwb->final_nilai === null);

        $grade = null;
        $lulus = false;
        if (!$hasUngradedEssay) {
            $passingGrade = $ujian->ujianSetting?->passing_grade;
            $lulus        = $passingGrade !== null && $nilaiTotal >= $passingGrade;
            foreach ($ujian->gradeSetting->sortByDesc('nilai_min') as $gs) {
                if ($nilaiTotal >= $gs->nilai_min && $nilaiTotal <= $gs->nilai_max) {
                    $grade = $gs->grade;
                    break;
                }
            }
        }

        NilaiAkhir::updateOrCreate(
            ['peserta_ujian_id' => $peserta->id],
            [
                'nilai_total' => $nilaiTotal,
                'grade'       => $grade,
                'lulus'       => $lulus,
                'graded_at'   => $hasUngradedEssay ? null : now(),
            ]
        );

        // Siapkan attempt berikutnya jika masih ada sisa
        $maxAttempt = $ujian->ujianSetting?->max_attempt ?? 1;
        if ($peserta->attempt_ke < $maxAttempt) {
            PesertaUjian::create([
                'ujian_id'   => $peserta->ujian_id,
                'user_id'    => $peserta->user_id,
                'attempt_ke' => $peserta->attempt_ke + 1,
                'status'     => 'belum_mulai',
            ]);
        }

        return response()->json([
            'message'    => 'Ujian berhasil diselesaikan.',
            'nilai_total' => $nilaiTotal,
            'lulus'      => $lulus,
            'grade'      => $grade,
        ]);
    }

    public function mulaiUjian(Request $request, $pesertaUjianId)
    {
        $authUser = $request->user();

        $peserta = PesertaUjian::with(['ujian.ujianSetting'])
            ->where('id', $pesertaUjianId)
            ->where('user_id', $authUser->id)
            ->firstOrFail();

        $ujian = $peserta->ujian;
        $now   = now();

        if (!$ujian->start_date || $now->lt($ujian->start_date)) {
            return response()->json(['message' => 'Ujian belum dimulai.'], 422);
        }
        if ($ujian->end_date && $now->gt($ujian->end_date)) {
            return response()->json(['message' => 'Ujian sudah berakhir.'], 422);
        }
        if ($peserta->status === 'selesai') {
            return response()->json(['message' => 'Kamu sudah menyelesaikan ujian ini.'], 422);
        }

        if ($ujian->is_kode_aktif) {
            $request->validate(['kode_akses' => 'required|string']);
            if ($request->kode_akses !== $ujian->kode_akses) {
                return response()->json(['message' => 'Kode akses salah.'], 422);
            }
        }

        if ($peserta->status === 'belum_mulai') {
            $peserta->update(['status' => 'sedang_berlangsung', 'mulai_at' => $now]);
        }

        return $this->buildSoalResponse($peserta->fresh(), $ujian);
    }

    public function getSoalMahasiswa(Request $request, $pesertaUjianId)
    {
        $authUser = $request->user();

        $peserta = PesertaUjian::with(['ujian.ujianSetting'])
            ->where('id', $pesertaUjianId)
            ->where('user_id', $authUser->id)
            ->firstOrFail();

        if ($peserta->status !== 'sedang_berlangsung') {
            return response()->json(['message' => 'Ujian tidak sedang berlangsung.'], 422);
        }

        return $this->buildSoalResponse($peserta, $peserta->ujian);
    }

    private function buildSoalResponse(PesertaUjian $peserta, Ujian $ujian)
    {
        $randomize = $ujian->ujianSetting?->randomize_soal ?? false;
        $endAt     = $peserta->mulai_at->copy()->addMinutes($ujian->durasi_menit);

        $existingJawaban = $peserta->jawabanPeserta()->pluck('jawaban', 'ujian_soal_id');

        $soalList = UjianSoal::with(['soal.jenisSoal.opsiJawaban'])
            ->where('ujian_id', $ujian->id)
            ->orderBy('urutan')
            ->get();

        if ($randomize) {
            $soalList = $soalList->shuffle()->values();
        }

        $soal = $soalList->map(fn($us) => [
            'ujian_soal_id' => $us->id,
            'urutan'        => $us->urutan,
            'bobot'         => $us->bobot,
            'deskripsi'     => $us->soal?->deskripsi,
            'jenis_soal'    => $us->soal?->jenisSoal->first()?->jenis_soal,
            'opsi'          => $us->soal?->jenisSoal->first()?->opsiJawaban
                                ->map(fn($o) => ['opsi' => $o->opsi, 'teks' => $o->teks])
                                ->values(),
            'jawaban'       => $existingJawaban[$us->id] ?? null,
        ])->values();

        return response()->json([
            'message' => 'Berhasil.',
            'data'    => [
                'peserta_ujian_id' => $peserta->id,
                'ujian_id'         => $ujian->id,
                'nama_ujian'       => $ujian->nama_ujian,
                'durasi_menit'     => $ujian->durasi_menit,
                'mulai_at'         => $peserta->mulai_at->toISOString(),
                'end_at'           => $endAt->toISOString(),
                'proctoring_aktif' => (bool) ($ujian->ujianSetting?->proctoring_aktif ?? false),
                'soal'             => $soal,
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
            ->withCount(['pesertaUjian', 'ujianSoal'])
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

        $data = collect($paginated->items())->map(function ($ujian) use ($now) {
            $latest = $ujian->pesertaUjian
                ->groupBy('user_id')
                ->map(fn($g) => $g->sortByDesc('attempt_ke')->first());
            $nilaiList = $latest->pluck('nilaiAkhir')->filter();
            return [
                'id'            => $ujian->id,
                'nama_ujian'    => $ujian->nama_ujian,
                'mata_kuliah'   => $ujian->mataKuliah?->nama ?? '-',
                'jenis_ujian'   => $ujian->jenis_ujian ?? '-',
                'start_date'    => $ujian->start_date?->toISOString(),
                'end_date'      => $ujian->end_date?->toISOString(),
                'durasi_menit'  => $ujian->durasi_menit,
                'jumlah_soal'   => $ujian->ujian_soal_count,
                'peserta_count' => $latest->count(),
                'avg_nilai'     => $nilaiList->count() ? round($nilaiList->avg('nilai_total'), 1) : null,
                'total_lulus'   => $nilaiList->where('lulus', true)->count(),
                'status'        => match(true) {
                    $ujian->end_date && $now->gt($ujian->end_date)      => 'Selesai',
                    $ujian->start_date && $now->gte($ujian->start_date) => 'berlangsung',
                    default => 'Belum_mulai',
                },
            ];
        });

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
                    'jawabanPeserta as needs_review' => fn($q) => $q
                        ->where('jawaban_peserta.is_manual_graded', false)
                        ->join('ujian_soal', 'ujian_soal.id', '=', 'jawaban_peserta.ujian_soal_id')
                        ->join('jenis_soal', 'jenis_soal.soal_id', '=', 'ujian_soal.soal_id')
                        ->where('jenis_soal.jenis_soal', 'essay'),
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
            'total_peserta'  => $ujian->pesertaUjian->unique('user_id')->count(),
            'total_soal'     => $ujian->ujianSoal->count(),
        ];

        // Best + all attempts per student
        $bestByUser = NilaiAkhir::bestPerStudent((int) $id);

        // Grouped by user_id for incomplete student detection and needs_review lookup
        $puByUser = $ujian->pesertaUjian->groupBy('user_id');

        $peserta = $puByUser->map(function ($puAttempts, $userId) use ($bestByUser) {
            if (isset($bestByUser[$userId])) {
                $best     = $bestByUser[$userId]['best'];
                $allNilai = $bestByUser[$userId]['attempts'];
                $bestPu   = $puAttempts->firstWhere('id', $best->peserta_ujian_id);

                return [
                    'id'            => $best->peserta_ujian_id,
                    'nama'          => $best->pesertaUjian->user->nama,
                    'nim'           => $best->pesertaUjian->user->nim,
                    'status'        => $bestPu?->needs_review ? 'Perlu Pengecekan' : 'Selesai',
                    'nilai'         => $best->nilai_total,
                    'grade'         => $best->grade,
                    'lulus'         => $best->lulus,
                    'attempt_count' => $allNilai->count(),
                    'attempts'      => $allNilai->map(fn($n) => [
                        'id'      => $n->peserta_ujian_id,
                        'nilai'   => $n->nilai_total,
                        'grade'   => $n->grade ?? '-',
                        'lulus'   => $n->lulus,
                        'tanggal' => $n->pesertaUjian->mulai_at?->format('d/m/y'),
                        'pukul'   => $n->pesertaUjian->mulai_at?->format('H.i'),
                    ])->values(),
                ];
            }

            $latest = $puAttempts->sortByDesc('mulai_at')->first();
            return [
                'id'            => $latest->id,
                'nama'          => $latest->user->nama,
                'nim'           => $latest->user->nim,
                'status'        => match(true) {
                    $latest->status === 'sedang_berlangsung' => 'Berlangsung',
                    $latest->mulai_at === null                => 'Belum Mulai',
                    default                                   => 'Belum Selesai',
                },
                'nilai'         => null,
                'grade'         => null,
                'lulus'         => null,
                'attempt_count' => $puAttempts->count(),
                'attempts'      => [],
            ];
        })->values();

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
                $essay[] = array_merge($row, [
                    'id'               => $jwb->id,
                    'bobot'            => $jwb->ujianSoal?->bobot ?? 0,
                    'is_manual_graded' => (bool) $jwb->is_manual_graded,
                    'ai_feedback'      => $jwb->ai_feedback,
                    'dosen_feedback'   => $jwb->dosen_feedback,
                ]);
            }
        }

        return response()->json([
            'info'    => $info,
            'jawaban' => compact('pilihan_ganda', 'checklist', 'essay'),
        ]);
    }

    public function periksaEssay(Request $request, $ujianId, $pesertaId)
    {
        $authUser = $request->user();

        $ujian = Ujian::with('gradeSetting')
            ->where('id', $ujianId)
            ->where('created_by', $authUser->id)
            ->firstOrFail();

        $peserta = PesertaUjian::with(['nilaiAkhir', 'jawabanPeserta.ujianSoal'])
            ->where('id', $pesertaId)
            ->where('ujian_id', $ujianId)
            ->firstOrFail();

        $request->validate([
            'penilaian'                  => 'required|array',
            'penilaian.*.id'             => 'required|integer',
            'penilaian.*.nilai'          => 'required|numeric|min:0',
            'penilaian.*.dosen_feedback' => 'nullable|string',
        ]);

        foreach ($request->penilaian as $item) {
            $jwb = $peserta->jawabanPeserta->firstWhere('id', $item['id']);
            if (!$jwb) continue;

            $bobot = $jwb->ujianSoal?->bobot ?? 0;
            $nilai = min((float) $item['nilai'], $bobot);

            $jwb->update([
                'nilai'            => $nilai,
                'final_nilai'      => $nilai,
                'is_manual_graded' => true,
                'dosen_feedback'   => $item['dosen_feedback'] ?? null,
            ]);
        }

        // Refresh jawaban setelah update
        $peserta->load('jawabanPeserta');

        $totalBobot  = UjianSoal::where('ujian_id', $ujianId)->sum('bobot');
        $totalEarned = $peserta->jawabanPeserta->whereNotNull('final_nilai')->sum('final_nilai');
        $totalNilai  = $totalBobot > 0 ? round(($totalEarned / $totalBobot) * 100, 2) : 0;

        $grade = null;
        $lulus = false;
        foreach ($ujian->gradeSetting->sortByDesc('nilai_min') as $gs) {
            if ($totalNilai >= $gs->nilai_min && $totalNilai <= $gs->nilai_max) {
                $grade = $gs->grade;
                break;
            }
        }

        $passingGrade = UjianSetting::where('ujian_id', $ujianId)->value('passing_grade');

        if ($passingGrade !== null) {
            $lulus = $totalNilai >= $passingGrade;
        }

        $peserta->nilaiAkhir->update([
            'nilai_total' => round($totalNilai, 2),
            'grade'       => $grade,
            'lulus'       => $lulus,
            'graded_at'   => now(),
        ]);

        return response()->json(['message' => 'Penilaian berhasil disimpan.']);
    }

    public function resetEssay(Request $request, $ujianId, $pesertaId)
    {
        $authUser = $request->user();

        $ujian = Ujian::with(['gradeSetting', 'ujianSoal.soal.jenisSoal'])
            ->where('id', $ujianId)
            ->where('created_by', $authUser->id)
            ->firstOrFail();

        $peserta = PesertaUjian::with(['nilaiAkhir', 'jawabanPeserta.ujianSoal.soal.jenisSoal'])
            ->where('id', $pesertaId)
            ->where('ujian_id', $ujianId)
            ->firstOrFail();

        foreach ($peserta->jawabanPeserta as $jwb) {
            $jenis = $jwb->ujianSoal?->soal?->jenisSoal->first()?->jenis_soal;
            if ($jenis === 'essay') {
                $jwb->update([
                    'nilai'            => null,
                    'final_nilai'      => null,
                    'is_manual_graded' => false,
                ]);
            }
        }

        // Recalculate nilai_akhir (essay = null → 0, normalisasi ke 100)
        $peserta->load('jawabanPeserta');
        $totalBobot  = UjianSoal::where('ujian_id', $ujianId)->sum('bobot');
        $totalEarned = $peserta->jawabanPeserta->whereNotNull('final_nilai')->sum('final_nilai');
        $totalNilai  = $totalBobot > 0 ? round(($totalEarned / $totalBobot) * 100, 2) : 0;

        $grade = null;
        foreach ($ujian->gradeSetting->sortByDesc('nilai_min') as $gs) {
            if ($totalNilai >= $gs->nilai_min && $totalNilai <= $gs->nilai_max) {
                $grade = $gs->grade;
                break;
            }
        }

        $passingGrade = UjianSetting::where('ujian_id', $ujianId)->value('passing_grade');
        $lulus = $passingGrade !== null ? $totalNilai >= $passingGrade : false;

        $peserta->nilaiAkhir->update([
            'nilai_total' => round($totalNilai, 2),
            'grade'       => $grade,
            'lulus'       => $lulus,
        ]);

        return response()->json(['message' => 'Essay berhasil ditandai belum diperiksa.']);
    }

    public function exportPDF(Request $request, $id)
    {
        $authUser = $request->user();

        $ujian = Ujian::with(['gradeSetting', 'ujianSetting'])
            ->where('id', $id)
            ->where('created_by', $authUser->id)
            ->firstOrFail();

        $bestByUser = NilaiAkhir::bestPerStudent((int) $id);

        // Students who never completed any attempt
        $completedUserIds = $bestByUser->keys();
        $incompleteList = PesertaUjian::with('user')
            ->where('ujian_id', $id)
            ->whereNotIn('user_id', $completedUserIds->toArray())
            ->get()
            ->unique('user_id');

        $info = [
            'nama_ujian'    => $ujian->nama_ujian,
            'mata_kuliah'   => $ujian->mataKuliah?->nama ?? '-',
            'jenis_ujian'   => $ujian->jenis_ujian ?? '-',
            'tanggal'       => $ujian->start_date ? \Carbon\Carbon::parse($ujian->start_date)->format('d M Y') : '-',
            'total_peserta' => $bestByUser->count() + $incompleteList->count(),
            'total_soal'    => $ujian->ujianSoal()->count(),
        ];

        $peserta = $bestByUser->map(fn($g) => [
            'nim'   => $g['best']->pesertaUjian->user?->nim ?? '-',
            'nama'  => $g['best']->pesertaUjian->user?->nama ?? '-',
            'nilai' => round($g['best']->nilai_total, 1),
            'grade' => $g['best']->grade,
            'lulus' => $g['best']->lulus,
        ])->merge(
            $incompleteList->map(fn($p) => [
                'nim'   => $p->user?->nim ?? '-',
                'nama'  => $p->user?->nama ?? '-',
                'nilai' => null,
                'grade' => null,
                'lulus' => null,
            ])
        )->sortBy('nama')->values();

        $nilaiList = $peserta->whereNotNull('nilai')->pluck('nilai');
        $totalLulus = $peserta->where('lulus', true)->count();
        $totalDinilai = $nilaiList->count();

        $stats = [
            'rata_rata'    => $totalDinilai > 0 ? round($nilaiList->avg(), 1) : '-',
            'total_lulus'  => $totalLulus,
            'persen_lulus' => $totalDinilai > 0 ? round(($totalLulus / $totalDinilai) * 100, 1) : 0,
        ];

        $pdf = \Barryvdh\DomPDF\Facade\Pdf::loadView('exports.hasil-ujian', compact('info', 'peserta', 'stats'))
            ->setPaper('a4', 'portrait');

        $filename = 'hasil-ujian-' . \Str::slug($ujian->nama_ujian) . '.pdf';

        return $pdf->download($filename);
    }

    public function hasilUjianAdminUniversitas(Request $request)
    {
        $authUser = $request->user();
        $search   = $request->query('search', '');
        $perPage  = (int) $request->query('per_page', 10);
        $now      = now();

        $sortBy  = $request->query('sort_by', 'tanggal');
        $sortDir = in_array($request->query('sort_dir'), ['asc', 'desc']) ? $request->query('sort_dir') : 'desc';

        $query = Ujian::with(['mataKuliah', 'pesertaUjian.nilaiAkhir'])
            ->withCount(['pesertaUjian', 'ujianSoal'])
            ->where('created_by', $authUser->id)
            ->where('jenis_ujian', 'pmb')
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
            'start_date'    => $ujian->start_date?->toISOString(),
            'end_date'      => $ujian->end_date?->toISOString(),
            'durasi_menit'  => $ujian->durasi_menit,
            'jumlah_soal'   => $ujian->ujian_soal_count,
            'peserta_count' => $ujian->pesertaUjian->unique('user_id')->count(),
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
            'message' => 'Hasil ujian PMB berhasil diambil!',
            'data'    => $data,
            'meta'    => [
                'current_page' => $paginated->currentPage(),
                'last_page'    => $paginated->lastPage(),
                'per_page'     => $paginated->perPage(),
                'total'        => $paginated->total(),
            ],
        ]);
    }

    public function nilaiMahasiswa(Request $request)
    {
        $authUser = $request->user();
        $search   = $request->query('search', '');
        $perPage  = (int) $request->query('per_page', 10);
        $sortKey  = $request->query('sort_by', 'tanggal');
        $sortDir  = in_array($request->query('sort_dir'), ['asc', 'desc']) ? $request->query('sort_dir') : 'desc';
        $page     = (int) $request->query('page', 1);

        // Load semua nilai untuk user, sorted: nilai terbaik dulu, terbaru kalau sama
        $all = NilaiAkhir::with(['pesertaUjian.ujian.mataKuliah'])
            ->join('peserta_ujian', 'nilai_akhir.peserta_ujian_id', '=', 'peserta_ujian.id')
            ->join('ujian', 'peserta_ujian.ujian_id', '=', 'ujian.id')
            ->where('peserta_ujian.user_id', $authUser->id)
            ->select('nilai_akhir.*')
            ->when($search, fn($q) => $q->whereRaw('LOWER(ujian.nama_ujian) LIKE ?', ['%' . strtolower($search) . '%']))
            ->orderByDesc('nilai_akhir.nilai_total')
            ->orderByDesc('nilai_akhir.graded_at')
            ->get();

        // Group by ujian_id — first() adalah nilai terbaik karena sudah sorted
        $grouped = $all
            ->groupBy(fn($n) => $n->pesertaUjian?->ujian_id)
            ->map(fn($attempts) => ['best' => $attempts->first(), 'attempts' => $attempts->values()]);

        // Sort hasil group
        $sorted = match ($sortKey) {
            'nama_ujian' => $sortDir === 'asc'
                ? $grouped->sortBy(fn($g) => strtolower($g['best']->pesertaUjian?->ujian?->nama_ujian ?? ''))
                : $grouped->sortByDesc(fn($g) => strtolower($g['best']->pesertaUjian?->ujian?->nama_ujian ?? '')),
            'nilai' => $sortDir === 'asc'
                ? $grouped->sortBy(fn($g) => $g['best']->nilai_total)
                : $grouped->sortByDesc(fn($g) => $g['best']->nilai_total),
            'grade' => $sortDir === 'asc'
                ? $grouped->sortBy(fn($g) => $g['best']->grade)
                : $grouped->sortByDesc(fn($g) => $g['best']->grade),
            default => $sortDir === 'asc'
                ? $grouped->sortBy(fn($g) => $g['best']->graded_at)
                : $grouped->sortByDesc(fn($g) => $g['best']->graded_at),
        };

        $total = $sorted->count();
        $items = $sorted->slice(($page - 1) * $perPage, $perPage)->values();

        $data = $items->map(fn($g) => [
            'id'            => $g['best']->id,
            'ujian_id'      => $g['best']->pesertaUjian?->ujian_id,
            'nama_ujian'    => $g['best']->pesertaUjian?->ujian?->nama_ujian ?? '-',
            'mata_kuliah'   => $g['best']->pesertaUjian?->ujian?->mataKuliah?->nama ?? null,
            'tanggal'       => $g['best']->graded_at?->format('d/m/y'),
            'pukul'         => $g['best']->graded_at?->format('H.i'),
            'nilai'         => $g['best']->nilai_total,
            'grade'         => $g['best']->grade ?? '-',
            'lulus'         => $g['best']->lulus,
            'attempt_count' => $g['attempts']->count(),
            'attempts'      => $g['attempts']->map(fn($a) => [
                'id'     => $a->id,
                'nilai'  => $a->nilai_total,
                'grade'  => $a->grade ?? '-',
                'lulus'  => $a->lulus,
                'tanggal' => $a->graded_at?->format('d/m/y'),
                'pukul'  => $a->graded_at?->format('H.i'),
            ])->values(),
        ]);

        return response()->json([
            'message' => 'Riwayat nilai berhasil diambil!',
            'data'    => $data,
            'meta'    => [
                'current_page' => $page,
                'last_page'    => (int) ceil($total / $perPage) ?: 1,
                'per_page'     => $perPage,
                'total'        => $total,
            ],
        ]);
    }

    // ── Admin Universitas: PMB Ujian ───────────────────────────────────────────

    public function indexPmb(Request $request)
    {
        $authUser = $request->user();
        $search   = $request->query('search', '');
        $perPage  = (int) $request->query('per_page', 10);
        $sortBy   = $request->query('sort_by', 'start_date');
        $sortDir  = in_array($request->query('sort_dir'), ['asc', 'desc']) ? $request->query('sort_dir') : 'desc';
        $now      = now();

        $allowedSort = ['nama_ujian', 'start_date', 'jumlah_soal', 'jumlah_peserta'];
        if (!in_array($sortBy, $allowedSort)) $sortBy = 'start_date';

        $query = Ujian::with(['ujianSetting'])
            ->withCount(['ujianSoal', 'pesertaUjian'])
            ->where('created_by', $authUser->id)
            ->where('jenis_ujian', 'pmb')
            ->when($search, fn($q) => $q->whereRaw('LOWER(nama_ujian) LIKE ?', ['%' . strtolower($search) . '%']))
            ->when($sortBy === 'jumlah_soal', fn($q) => $q->orderBy('ujian_soal_count', $sortDir))
            ->when($sortBy === 'jumlah_peserta', fn($q) => $q->orderBy('peserta_ujian_count', $sortDir))
            ->when(!in_array($sortBy, ['jumlah_soal', 'jumlah_peserta']), fn($q) => $q->orderBy($sortBy, $sortDir));

        $paginated = $query->paginate($perPage);

        $data = collect($paginated->items())->map(fn($u) => [
            'id'             => $u->id,
            'nama_ujian'     => $u->nama_ujian,
            'mata_kuliah'    => null,
            'mata_kuliah_id' => null,
            'start_date'     => $u->start_date,
            'end_date'       => $u->end_date,
            'durasi_menit'   => $u->durasi_menit,
            'jumlah_soal'    => $u->ujian_soal_count,
            'jumlah_peserta' => $u->peserta_ujian_count,
            'passing_grade'  => $u->ujianSetting?->passing_grade,
            'kode_akses'     => $u->kode_akses,
            'is_kode_aktif'  => $u->is_kode_aktif,
            'status'         => match(true) {
                $u->end_date && $now->gt($u->end_date)      => 'selesai',
                $u->start_date && $now->gte($u->start_date) => 'berlangsung',
                default                                      => 'belum_mulai',
            },
        ]);

        return response()->json([
            'message' => 'Daftar ujian PMB berhasil diambil!',
            'data'    => $data,
            'meta'    => [
                'current_page' => $paginated->currentPage(),
                'last_page'    => $paginated->lastPage(),
                'per_page'     => $paginated->perPage(),
                'total'        => $paginated->total(),
            ],
        ]);
    }

    public function storePmb(Request $request)
    {
        $authUser = $request->user();

        $request->validate([
            'nama_ujian'               => 'required|string|max:255',
            'start_date'               => 'required|date',
            'end_date'                 => 'required|date|after:start_date',
            'durasi_menit'             => 'required|integer|min:1',
            'kode_akses'               => 'nullable|string|max:50',
            'is_kode_aktif'            => 'boolean',
            'randomize_soal'           => 'boolean',
            'max_attempt'              => 'integer|min:1',
            'passing_grade'            => 'nullable|numeric|min:0|max:100',
            'soal'                     => 'nullable|array',
            'soal.*.soal_id'           => 'nullable|integer|exists:soal,id',
            'soal.*.bobot'             => 'nullable|numeric|min:0',
            'soal.*.deskripsi'         => 'nullable|string',
            'soal.*.jenis_soal'        => 'nullable|in:pilihan_ganda,essay,checklist',
            'soal.*.tingkat_kesulitan' => 'nullable|in:mudah,sedang,sulit',
            'soal.*.bab_id'            => 'nullable|integer|exists:bab,id',
            'soal.*.bank_soal_id'      => 'nullable|integer|exists:bank_soal,id',
            'soal.*.opsi'              => 'nullable|array',
            'soal.*.kunci'             => 'nullable',
        ], [
            'end_date.after' => 'Tanggal selesai harus setelah tanggal mulai!',
        ]);

        \DB::transaction(function () use ($request, $authUser, &$ujian) {
            $ujian = Ujian::create([
                'created_by'  => $authUser->id,
                'nama_ujian'  => $request->nama_ujian,
                'jenis_ujian' => 'pmb',
                'start_date'  => $request->start_date,
                'end_date'    => $request->end_date,
                'durasi_menit' => $request->durasi_menit,
                'kode_akses'  => $request->kode_akses ?? $this->generateKodeAkses(),
                'is_kode_aktif' => $request->boolean('is_kode_aktif', false),
            ]);

            UjianSetting::create([
                'ujian_id'         => $ujian->id,
                'randomize_soal'   => $request->boolean('randomize_soal', false),
                'max_attempt'      => $request->input('max_attempt', 1),
                'passing_grade'    => $request->input('passing_grade', 60),
                'proctoring_aktif' => true,
            ]);

            foreach (($request->soal ?? []) as $i => $item) {
                $soalId = $item['soal_id'] ?? null;

                if (!$soalId && !empty($item['deskripsi'])) {
                    $newSoal = Soal::create([
                        'bank_soal_id'      => $item['bank_soal_id'] ?? null,
                        'mata_kuliah_id'    => null,
                        'bab_id'            => $item['bab_id'] ?? null,
                        'deskripsi'         => $item['deskripsi'],
                        'tingkat_kesulitan' => $item['tingkat_kesulitan'] ?? 'sedang',
                        'ai_generated'      => false,
                    ]);
                    $jenisSoal = JenisSoal::create([
                        'soal_id'    => $newSoal->id,
                        'jenis_soal' => $item['jenis_soal'] ?? 'essay',
                    ]);
                    if (!empty($item['opsi']) && !empty($item['kunci'])) {
                        $kunci = $item['kunci'];
                        foreach ($item['opsi'] as $huruf => $teks) {
                            OpsiJawaban::create([
                                'jenis_soal_id' => $jenisSoal->id,
                                'opsi'          => $huruf,
                                'teks'          => $teks,
                                'is_correct'    => is_array($kunci) ? in_array($huruf, $kunci) : $huruf === $kunci,
                            ]);
                        }
                    }
                    $soalId = $newSoal->id;
                }

                if ($soalId) {
                    UjianSoal::create([
                        'ujian_id' => $ujian->id,
                        'soal_id'  => $soalId,
                        'bobot'    => $item['bobot'] ?? 1.0,
                        'urutan'   => $i + 1,
                    ]);
                }
            }
        });

        return response()->json([
            'message' => 'Ujian PMB berhasil dibuat!',
            'data'    => ['id' => $ujian->id],
        ], 201);
    }

    // ── Dosen: CRUD Ujian ──────────────────────────────────────────────────────

    public function index(Request $request)
    {
        $authUser = $request->user();
        $search   = $request->query('search', '');
        $perPage  = (int) $request->query('per_page', 10);
        $now      = now();

        $query = Ujian::with(['mataKuliah', 'ujianSetting', 'pesertaUjian' => fn($q) => $q->select(['ujian_id', 'user_id'])])
            ->withCount('ujianSoal')
            ->where('created_by', $authUser->id)
            ->when($search, fn($q) => $q->whereRaw('LOWER(nama_ujian) LIKE ?', ['%' . strtolower($search) . '%']))
            ->orderBy('start_date', 'desc');

        $paginated = $query->paginate($perPage);

        $data = collect($paginated->items())->map(fn($u) => [
            'id'             => $u->id,
            'nama_ujian'     => $u->nama_ujian,
            'mata_kuliah'    => $u->mataKuliah?->nama,
            'mata_kuliah_id' => $u->mata_kuliah_id,
            'start_date'     => $u->start_date,
            'end_date'       => $u->end_date,
            'durasi_menit'   => $u->durasi_menit,
            'jumlah_soal'    => $u->ujian_soal_count,
            'jumlah_peserta' => $u->pesertaUjian->unique('user_id')->count(),
            'passing_grade'  => $u->ujianSetting?->passing_grade,
            'kode_akses'     => $u->kode_akses,
            'is_kode_aktif'  => $u->is_kode_aktif,
            'status'         => match(true) {
                $u->end_date && $now->gt($u->end_date)     => 'selesai',
                $u->start_date && $now->gte($u->start_date) => 'berlangsung',
                default                                     => 'belum_mulai',
            },
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

    public function store(Request $request)
    {
        $authUser = $request->user();

        $request->validate([
            'nama_ujian'     => 'required|string|max:255',
            'mata_kuliah_id' => 'required|exists:mata_kuliah,id',
            'start_date'     => 'required|date',
            'end_date'       => 'required|date|after:start_date',
            'durasi_menit'   => 'required|integer|min:1',
            'kode_akses'     => 'nullable|string|max:50',
            'is_kode_aktif'  => 'boolean',
            'randomize_soal' => 'boolean',
            'max_attempt'    => 'integer|min:1',
            'passing_grade'  => 'nullable|numeric|min:0|max:100',
            'soal'                     => 'nullable|array',
            'soal.*.soal_id'           => 'nullable|integer|exists:soal,id',
            'soal.*.bobot'             => 'nullable|numeric|min:0',
            'soal.*.deskripsi'         => 'nullable|string',
            'soal.*.jenis_soal'        => 'nullable|in:pilihan_ganda,essay,checklist',
            'soal.*.tingkat_kesulitan' => 'nullable|in:mudah,sedang,sulit',
            'soal.*.bab_id'            => 'nullable|integer|exists:bab,id',
            'soal.*.bank_soal_id'      => 'nullable|integer|exists:bank_soal,id',
            'soal.*.opsi'              => 'nullable|array',
            'soal.*.kunci'             => 'nullable',
        ], [
            'end_date.after' => 'Tanggal selesai harus setelah tanggal mulai!',
        ]);

        \DB::transaction(function () use ($request, $authUser, &$ujian) {
            $ujian = Ujian::create([
                'created_by'     => $authUser->id,
                'mata_kuliah_id' => $request->mata_kuliah_id,
                'nama_ujian'     => $request->nama_ujian,
                'jenis_ujian'    => 'perkuliahan',
                'start_date'     => $request->start_date,
                'end_date'       => $request->end_date,
                'durasi_menit'   => $request->durasi_menit,
                'kode_akses'     => $request->kode_akses ?? $this->generateKodeAkses(),
                'is_kode_aktif'  => $request->boolean('is_kode_aktif', false),
            ]);

            UjianSetting::create([
                'ujian_id'         => $ujian->id,
                'randomize_soal'   => $request->boolean('randomize_soal', false),
                'max_attempt'      => $request->input('max_attempt', 1),
                'passing_grade'    => $request->input('passing_grade', 60),
                'proctoring_aktif' => true,
            ]);

            // Auto-enroll semua mahasiswa yang punya KRS aktif untuk mata kuliah ini
            $mahasiswaIds = UserMataKuliah::where('mata_kuliah_id', $ujian->mata_kuliah_id)
                ->where('is_aktif', true)
                ->pluck('user_id');

            foreach ($mahasiswaIds as $userId) {
                PesertaUjian::firstOrCreate(
                    ['ujian_id' => $ujian->id, 'user_id' => $userId],
                    ['attempt_ke' => 1, 'status' => 'belum_mulai'],
                );
            }

            foreach (($request->soal ?? []) as $i => $item) {
                $soalId = $item['soal_id'] ?? null;

                // Buat soal baru inline jika tidak ada soal_id
                if (!$soalId && !empty($item['deskripsi'])) {
                    $newSoal = Soal::create([
                        'bank_soal_id'      => $item['bank_soal_id'] ?? null,
                        'mata_kuliah_id'    => $ujian->mata_kuliah_id,
                        'bab_id'            => $item['bab_id'] ?? null,
                        'deskripsi'         => $item['deskripsi'],
                        'tingkat_kesulitan' => $item['tingkat_kesulitan'] ?? 'sedang',
                        'ai_generated'      => false,
                    ]);
                    $jenisSoal = JenisSoal::create([
                        'soal_id'    => $newSoal->id,
                        'jenis_soal' => $item['jenis_soal'] ?? 'essay',
                    ]);
                    if (!empty($item['opsi']) && !empty($item['kunci'])) {
                        $kunci = $item['kunci'];
                        foreach ($item['opsi'] as $huruf => $teks) {
                            OpsiJawaban::create([
                                'jenis_soal_id' => $jenisSoal->id,
                                'opsi'          => $huruf,
                                'teks'          => $teks,
                                'is_correct'    => is_array($kunci) ? in_array($huruf, $kunci) : $huruf === $kunci,
                            ]);
                        }
                    }
                    $soalId = $newSoal->id;
                }

                if ($soalId) {
                    UjianSoal::create([
                        'ujian_id' => $ujian->id,
                        'soal_id'  => $soalId,
                        'bobot'    => $item['bobot'] ?? 1.0,
                        'urutan'   => $i + 1,
                    ]);
                }
            }
        });

        return response()->json([
            'message' => 'Ujian berhasil dibuat!',
            'data'    => ['id' => $ujian->id],
        ], 201);
    }

    public function show(Request $request, $id)
    {
        $authUser = $request->user();

        $ujian = Ujian::with(['mataKuliah', 'ujianSetting'])
            ->where('created_by', $authUser->id)
            ->findOrFail($id);

        return response()->json([
            'message' => 'Detail ujian berhasil diambil!',
            'data'    => [
                'id'              => $ujian->id,
                'nama_ujian'      => $ujian->nama_ujian,
                'mata_kuliah_id'  => $ujian->mata_kuliah_id,
                'mata_kuliah'     => $ujian->mataKuliah?->nama,
                'start_date'      => $ujian->start_date?->format('Y-m-d\TH:i'),
                'end_date'        => $ujian->end_date?->format('Y-m-d\TH:i'),
                'durasi_menit'    => $ujian->durasi_menit,
                'kode_akses'      => $ujian->kode_akses,
                'is_kode_aktif'   => $ujian->is_kode_aktif,
                'randomize_soal'   => $ujian->ujianSetting?->randomize_soal  ?? false,
                'max_attempt'      => $ujian->ujianSetting?->max_attempt     ?? 1,
                'passing_grade'    => $ujian->ujianSetting?->passing_grade   ?? 60,
                'proctoring_aktif' => (bool) ($ujian->ujianSetting?->proctoring_aktif ?? false),
            ],
        ]);
    }

    public function update(Request $request, $id)
    {
        $authUser = $request->user();

        $ujian = Ujian::where('created_by', $authUser->id)->findOrFail($id);

        $request->validate([
            'nama_ujian'       => 'sometimes|string|max:255',
            'mata_kuliah_id'   => 'sometimes|exists:mata_kuliah,id',
            'start_date'       => 'sometimes|date',
            'end_date'         => 'sometimes|date|after:start_date',
            'durasi_menit'     => 'sometimes|integer|min:1',
            'kode_akses'       => 'nullable|string|max:50',
            'is_kode_aktif'    => 'boolean',
            'randomize_soal'   => 'boolean',
            'max_attempt'      => 'integer|min:1',
            'passing_grade'    => 'nullable|numeric|min:0|max:100',
            'soal_bobot'       => 'sometimes|array',
            'soal_bobot.*.id'  => 'required|integer|exists:ujian_soal,id',
            'soal_bobot.*.bobot' => 'required|numeric|min:0',
        ], [
            'end_date.after' => 'Tanggal selesai harus setelah tanggal mulai!',
        ]);

        $ujian->update($request->only([
            'nama_ujian', 'mata_kuliah_id', 'start_date', 'end_date',
            'durasi_menit', 'kode_akses', 'is_kode_aktif',
        ]));

        UjianSetting::updateOrCreate(
            ['ujian_id' => $ujian->id],
            array_filter([
                'randomize_soal'   => $request->has('randomize_soal')   ? $request->boolean('randomize_soal')   : null,
                'proctoring_aktif' => $request->has('proctoring_aktif') ? $request->boolean('proctoring_aktif') : null,
                'max_attempt'      => $request->input('max_attempt'),
                'passing_grade'    => $request->input('passing_grade'),
            ], fn($v) => $v !== null)
        );

        foreach ($request->input('soal_bobot', []) as $item) {
            UjianSoal::where('ujian_id', $ujian->id)
                ->where('id', $item['id'])
                ->update(['bobot' => (float) $item['bobot']]);
        }

        return response()->json(['message' => 'Ujian berhasil diupdate!']);
    }

    public function destroy(Request $request, $id)
    {
        $authUser = $request->user();

        $ujian = Ujian::where('created_by', $authUser->id)->findOrFail($id);

        $aktif = $ujian->pesertaUjian()
            ->whereIn('status', ['sedang_berlangsung', 'selesai'])
            ->exists();

        if ($aktif) {
            return response()->json([
                'message' => 'Ujian tidak bisa dihapus karena sudah ada peserta yang mengikuti.',
            ], 422);
        }

        $ujian->delete();

        return response()->json(['message' => 'Ujian berhasil dihapus!']);
    }

    // ── Dosen: Manajemen Soal Ujian ────────────────────────────────────────────

    public function getSoal(Request $request, $id)
    {
        $authUser = $request->user();
        $ujian    = Ujian::where('created_by', $authUser->id)->findOrFail($id);

        $soalList = UjianSoal::with([
                'soal.jenisSoal',
                'soal.bab:id,nama_bab',
                'soal.bankSoal:id,nama',
            ])
            ->where('ujian_id', $ujian->id)
            ->orderBy('urutan')
            ->get()
            ->map(fn($us) => [
                'ujian_soal_id'     => $us->id,
                'soal_id'           => $us->soal_id,
                'urutan'            => $us->urutan,
                'bobot'             => $us->bobot,
                'deskripsi'         => $us->soal?->deskripsi,
                'bab'               => $us->soal?->bab?->nama_bab,
                'jenis_soal'        => $us->soal?->jenisSoal->first()?->jenis_soal,
                'tingkat_kesulitan' => $us->soal?->tingkat_kesulitan,
                'dari_bank_soal'    => $us->soal?->bankSoal?->nama,
            ]);

        return response()->json([
            'message' => 'Daftar soal ujian berhasil diambil!',
            'ujian'   => [
                'id'             => $ujian->id,
                'nama_ujian'     => $ujian->nama_ujian,
                'mata_kuliah_id' => $ujian->mata_kuliah_id,
            ],
            'data'    => $soalList,
        ]);
    }

    public function availableSoal(Request $request, $id)
    {
        $authUser = $request->user();

        // Create mode (id=0): mata_kuliah_id passed directly or PMB (no mata_kuliah_id)
        if ($request->has('mata_kuliah_id') || $id == 0) {
            $matkulId   = $request->has('mata_kuliah_id') ? (int) $request->query('mata_kuliah_id') : null;
            $excludeIds = $request->query('exclude_ids')
                ? array_map('intval', explode(',', $request->query('exclude_ids')))
                : [];
        } else {
            $ujian      = Ujian::where('created_by', $authUser->id)->findOrFail($id);
            $matkulId   = $ujian->mata_kuliah_id;
            $excludeIds = UjianSoal::where('ujian_id', $ujian->id)->pluck('soal_id')->toArray();
        }

        $query = Soal::with(['jenisSoal', 'bab:id,nama_bab', 'bankSoal:id,nama'])
            ->when($matkulId !== null, fn($q) => $q->where('mata_kuliah_id', $matkulId))
            ->whereNotIn('id', $excludeIds)
            ->whereHas('bankSoal', fn($bq) => $bq
                ->where('created_by', $authUser->id)
                ->orWhereHas('sharedUsers', fn($sq) => $sq->where('user_id', $authUser->id))
                ->orWhere('permission', 'public')
            );

        if ($request->bab_id) {
            $query->where('bab_id', $request->bab_id);
        }

        if ($request->bank_soal_id) {
            $query->where('bank_soal_id', $request->bank_soal_id);
        }

        if ($request->search) {
            $query->whereRaw('LOWER(deskripsi) LIKE ?', ['%' . strtolower($request->search) . '%']);
        }

        $perPage  = (int) $request->query('per_page', 20);
        $paginated = $query->orderBy('created_at', 'asc')->paginate($perPage);

        $data = collect($paginated->items())->map(fn($s) => [
            'id'                => $s->id,
            'deskripsi'         => $s->deskripsi,
            'bab'               => $s->bab?->nama_bab,
            'bab_id'            => $s->bab_id,
            'jenis_soal'        => $s->jenisSoal->first()?->jenis_soal,
            'tingkat_kesulitan' => $s->tingkat_kesulitan,
            'bank_soal'         => $s->bankSoal?->nama,
        ]);

        return response()->json([
            'message' => 'Soal tersedia berhasil diambil!',
            'data'    => $data,
            'meta'    => [
                'current_page' => $paginated->currentPage(),
                'last_page'    => $paginated->lastPage(),
                'per_page'     => $paginated->perPage(),
                'total'        => $paginated->total(),
            ],
        ]);
    }

    public function addSoal(Request $request, $id)
    {
        $authUser = $request->user();

        $request->validate([
            'soal_ids'   => 'required|array|min:1',
            'soal_ids.*' => 'required|integer|exists:soal,id',
        ]);

        $ujian = Ujian::where('created_by', $authUser->id)->findOrFail($id);

        $existingSoalIds = UjianSoal::where('ujian_id', $ujian->id)->pluck('soal_id')->toArray();
        $nextUrutan      = UjianSoal::where('ujian_id', $ujian->id)->max('urutan') ?? 0;

        $added = 0;
        foreach ($request->soal_ids as $soalId) {
            if (in_array($soalId, $existingSoalIds)) continue;

            $nextUrutan++;
            UjianSoal::create([
                'ujian_id' => $ujian->id,
                'soal_id'  => $soalId,
                'bobot'    => 1.0,
                'urutan'   => $nextUrutan,
            ]);
            $added++;
        }

        return response()->json([
            'message' => "$added soal berhasil ditambahkan ke ujian!",
        ]);
    }

    public function addSoalRandom(Request $request, $id)
    {
        $authUser = $request->user();

        $request->validate([
            'bab_id'       => 'nullable|integer|exists:bab,id',
            'bank_soal_id' => 'nullable|integer|exists:bank_soal,id',
            'jumlah'       => 'required|integer|min:1|max:200',
        ]);

        $ujian = Ujian::where('created_by', $authUser->id)->findOrFail($id);

        $existingSoalIds = UjianSoal::where('ujian_id', $ujian->id)->pluck('soal_id');

        $query = Soal::when($ujian->mata_kuliah_id !== null, fn($q) => $q->where('mata_kuliah_id', $ujian->mata_kuliah_id))
            ->whereNotIn('id', $existingSoalIds)
            ->whereHas('bankSoal', fn($bq) => $bq
                ->where('created_by', $authUser->id)
                ->orWhereHas('sharedUsers', fn($sq) => $sq->where('user_id', $authUser->id))
                ->orWhere('permission', 'public')
            );

        if ($request->bab_id) {
            $query->where('bab_id', $request->bab_id);
        }

        if ($request->bank_soal_id) {
            $query->where('bank_soal_id', $request->bank_soal_id);
        }

        $soalIds = $query->inRandomOrder()->limit($request->jumlah)->pluck('id');

        if ($soalIds->isEmpty()) {
            return response()->json(['message' => 'Tidak ada soal tersedia untuk kriteria tersebut.'], 422);
        }

        $nextUrutan = UjianSoal::where('ujian_id', $ujian->id)->max('urutan') ?? 0;

        foreach ($soalIds as $soalId) {
            $nextUrutan++;
            UjianSoal::create([
                'ujian_id' => $ujian->id,
                'soal_id'  => $soalId,
                'bobot'    => 1.0,
                'urutan'   => $nextUrutan,
            ]);
        }

        return response()->json([
            'message' => "{$soalIds->count()} soal acak berhasil ditambahkan ke ujian!",
        ]);
    }

    public function buatSoal(Request $request, $id)
    {
        $authUser = $request->user();

        $request->validate([
            'jenis_soal'          => 'required|in:pilihan_ganda,essay,checklist',
            'tingkat_kesulitan'   => 'required|in:mudah,sedang,sulit',
            'deskripsi'           => 'required|string',
            'bab_id'              => 'nullable|integer|exists:bab,id',
            'opsi'                => 'nullable|array',
            'kunci'               => 'nullable',
            'simpan_ke_bank_soal' => 'boolean',
            'bank_soal_id'        => 'nullable|integer|exists:bank_soal,id',
            'bobot'               => 'nullable|numeric|min:0',
        ]);

        $ujian = Ujian::where('created_by', $authUser->id)->findOrFail($id);

        $bankSoalId = null;

        if ($request->boolean('simpan_ke_bank_soal')) {
            $request->validate([
                'bank_soal_id' => 'required|integer|exists:bank_soal,id',
            ]);

            // Pastikan bank soal milik dosen ini
            $bankSoal   = BankSoal::where('id', $request->bank_soal_id)
                ->where('created_by', $authUser->id)
                ->firstOrFail();
            $bankSoalId = $bankSoal->id;
        }

        $soal = Soal::create([
            'bank_soal_id'      => $bankSoalId,
            'mata_kuliah_id'    => $ujian->mata_kuliah_id,
            'bab_id'            => $request->bab_id,
            'deskripsi'         => $request->deskripsi,
            'tingkat_kesulitan' => $request->tingkat_kesulitan,
            'ai_generated'      => false,
        ]);

        $jenisSoal = JenisSoal::create([
            'soal_id'    => $soal->id,
            'jenis_soal' => $request->jenis_soal,
        ]);

        if (!empty($request->opsi) && !empty($request->kunci)) {
            $kunci = $request->kunci;
            foreach ($request->opsi as $huruf => $teks) {
                $isCorrect = is_array($kunci)
                    ? in_array($huruf, $kunci)
                    : $huruf === $kunci;

                OpsiJawaban::create([
                    'jenis_soal_id' => $jenisSoal->id,
                    'opsi'          => $huruf,
                    'teks'          => $teks,
                    'is_correct'    => $isCorrect,
                ]);
            }
        }

        $nextUrutan = (UjianSoal::where('ujian_id', $ujian->id)->max('urutan') ?? 0) + 1;

        UjianSoal::create([
            'ujian_id' => $ujian->id,
            'soal_id'  => $soal->id,
            'bobot'    => $request->input('bobot', 1.0),
            'urutan'   => $nextUrutan,
        ]);

        return response()->json([
            'message' => 'Soal berhasil dibuat dan ditambahkan ke ujian!',
        ], 201);
    }

    public function removeSoal(Request $request, $id, $ujianSoalId)
    {
        $authUser = $request->user();
        $ujian    = Ujian::where('created_by', $authUser->id)->findOrFail($id);

        $ujianSoal = UjianSoal::where('ujian_id', $ujian->id)
            ->where('id', $ujianSoalId)
            ->firstOrFail();

        $removedUrutan = $ujianSoal->urutan;
        $ujianSoal->delete();

        // Geser urutan soal di bawahnya
        UjianSoal::where('ujian_id', $ujian->id)
            ->where('urutan', '>', $removedUrutan)
            ->decrement('urutan');

        return response()->json(['message' => 'Soal berhasil dihapus dari ujian!']);
    }

    public function getGradeSetting(Request $request, $id)
    {
        $ujian = Ujian::where('created_by', $request->user()->id)->findOrFail($id);

        $data = \App\Models\GradeSetting::where('ujian_id', $ujian->id)
            ->orderBy('nilai_min', 'desc')
            ->get(['id', 'grade', 'nilai_min', 'nilai_max']);

        return response()->json(['data' => $data]);
    }

    public function saveGradeSetting(Request $request, $id)
    {
        $ujian = Ujian::with('ujianSetting')->where('created_by', $request->user()->id)->findOrFail($id);

        $request->validate([
            'rows'               => 'required|array',
            'rows.*.grade'       => 'required|string|max:10',
            'rows.*.nilai_min'   => 'required|numeric|min:0|max:100',
            'rows.*.nilai_max'   => 'required|numeric|min:0|max:100',
        ]);

        \App\Models\GradeSetting::where('ujian_id', $ujian->id)->delete();

        $gradeSettings = collect();
        foreach ($request->rows as $row) {
            $gs = \App\Models\GradeSetting::create([
                'ujian_id'  => $ujian->id,
                'grade'     => strtoupper(trim($row['grade'])),
                'nilai_min' => (float) $row['nilai_min'],
                'nilai_max' => (float) $row['nilai_max'],
            ]);
            $gradeSettings->push($gs);
        }

        // Recalculate grade & lulus untuk semua peserta yang sudah selesai
        $passingGrade = $ujian->ujianSetting?->passing_grade;
        $selesaiList  = NilaiAkhir::whereHas('pesertaUjian', fn($q) => $q->where('ujian_id', $ujian->id))->get();

        foreach ($selesaiList as $na) {
            $grade = null;
            foreach ($gradeSettings->sortByDesc('nilai_min') as $gs) {
                if ($na->nilai_total >= $gs->nilai_min && $na->nilai_total <= $gs->nilai_max) {
                    $grade = $gs->grade;
                    break;
                }
            }
            $lulus = $passingGrade !== null ? $na->nilai_total >= $passingGrade : false;
            $na->update(['grade' => $grade, 'lulus' => $lulus]);
        }

        return response()->json(['message' => 'Grade setting berhasil disimpan.']);
    }

    public function monitoringList(Request $request)
    {
        $now   = now();
        $dosen = $request->user();

        $ujianList = Ujian::where('created_by', $dosen->id)
            ->where('start_date', '<=', $now)
            ->where('start_date', '>=', $now->copy()->subDays(30))
            ->with([
                'mataKuliah:id,nama',
                'pesertaUjian:id,ujian_id,user_id,attempt_ke,status',
                'pesertaUjian.proctoringLog',
            ])
            ->get();

        $data = $ujianList->map(function ($ujian) use ($now) {
            $latestPerUser = $ujian->pesertaUjian
                ->groupBy('user_id')
                ->map(fn($g) => $g->sortByDesc('attempt_ke')->first());

            $totalViolations = 0;
            $totalRisk       = 0;
            foreach ($ujian->pesertaUjian as $p) {
                foreach ($p->proctoringLog as $log) {
                    $totalViolations++;
                    $totalRisk += $log->risk_score;
                }
            }

            return [
                'id'               => $ujian->id,
                'nama_ujian'       => $ujian->nama_ujian,
                'mata_kuliah'      => $ujian->mataKuliah?->nama,
                'start_date'       => $ujian->start_date?->format('Y-m-d H:i'),
                'end_date'         => $ujian->end_date?->format('Y-m-d H:i'),
                'durasi_menit'     => $ujian->durasi_menit,
                'status'           => $ujian->end_date?->gt($now) ? 'berlangsung' : 'selesai',
                'peserta_aktif'    => $latestPerUser->where('status', 'sedang_berlangsung')->count(),
                'total_peserta'    => $latestPerUser->count(),
                'total_violations' => $totalViolations,
                'total_risk_score' => $totalRisk,
            ];
        });

        return response()->json(['data' => $data]);
    }

    public function monitoringDetail(Request $request, $ujianId)
    {
        $ujian = Ujian::where('created_by', $request->user()->id)
            ->with([
                'mataKuliah:id,nama',
                'ujianSoal:id,ujian_id',
                'pesertaUjian:id,ujian_id,user_id,attempt_ke,status,mulai_at',
                'pesertaUjian.user:id,nama,nim',
                'pesertaUjian.jawabanPeserta:id,peserta_ujian_id',
                'pesertaUjian.proctoringLog',
            ])
            ->findOrFail($ujianId);

        $totalSoal = $ujian->ujianSoal->count();

        $peserta = $ujian->pesertaUjian
            ->groupBy('user_id')
            ->map(function ($g) use ($totalSoal) {
                $latest  = $g->sortByDesc('attempt_ke')->first();
                // Prioritas tampilan: aktif > selesai > terbaru
                // (mencegah attempt baru yg belum_mulai menimpa status selesai)
                $display = $g->firstWhere('status', 'sedang_berlangsung')
                    ?? $g->where('status', 'selesai')->sortByDesc('attempt_ke')->first()
                    ?? $latest;
                $allViol = collect();
                foreach ($g as $attempt) {
                    foreach ($attempt->proctoringLog as $log) {
                        $allViol->push($log);
                    }
                }
                return [
                    'peserta_ujian_id'     => $display->id,
                    'user_id'              => $display->user_id,
                    'nama'                 => $display->user?->nama,
                    'nim'                  => $display->user?->nim,
                    'status'               => $display->status,
                    'attempt_ke'           => $latest->attempt_ke,
                    'mulai_at'             => $display->mulai_at?->format('H:i:s'),
                    'soal_dijawab'         => $display->jawabanPeserta->count(),
                    'total_soal'           => $totalSoal,
                    'violations'           => $allViol->count(),
                    'risk_score'           => $allViol->sum('risk_score'),
                    'violation_breakdown'  => $allViol->groupBy('tipe_pelanggaran')->map(fn($g) => $g->count()),
                ];
            })
            ->sortByDesc('risk_score')
            ->values();

        return response()->json([
            'ujian'   => [
                'id'           => $ujian->id,
                'nama_ujian'   => $ujian->nama_ujian,
                'mata_kuliah'  => $ujian->mataKuliah?->nama,
                'start_date'   => $ujian->start_date?->format('Y-m-d H:i'),
                'end_date'     => $ujian->end_date?->format('Y-m-d H:i'),
                'durasi_menit' => $ujian->durasi_menit,
                'total_soal'   => $totalSoal,
            ],
            'peserta' => $peserta,
        ]);
    }

    public function monitoringPesertaDetail(Request $request, $ujianId, $userId)
    {
        $ujian = Ujian::where('created_by', $request->user()->id)
            ->with([
                'pesertaUjian' => fn($q) => $q
                    ->where('user_id', $userId)
                    ->where('status', '!=', 'belum_mulai')
                    ->with(['user:id,nama,nim', 'jawabanPeserta:id,peserta_ujian_id,ujian_soal_id,jawaban,nilai,final_nilai', 'jawabanPeserta.ujianSoal:id,urutan', 'proctoringLog'])
                    ->orderBy('attempt_ke'),
                'ujianSoal:id,ujian_id',
            ])
            ->findOrFail($ujianId);

        $attempts = $ujian->pesertaUjian;

        if ($attempts->isEmpty()) {
            return response()->json(['message' => 'Peserta tidak ditemukan.'], 404);
        }

        $user      = $attempts->first()->user;
        $totalSoal = $ujian->ujianSoal->count();

        $matchedLogs = collect();
        $attemptRows = [];
        foreach ($attempts as $p) {
            $logs = $p->proctoringLog;
            $matchedLogs = $matchedLogs->concat($logs);
            $attemptRows[] = [
                'peserta_ujian_id' => $p->id,
                'attempt_ke'       => $p->attempt_ke,
                'status'           => $p->status,
                'mulai_at'     => $p->mulai_at?->format('H:i:s'),
                'selesai_at'   => $p->selesai_at?->format('H:i:s'),
                'soal_dijawab' => $p->jawabanPeserta->count(),
                'violations'        => $logs->count(),
                'risk_score'        => $logs->sum('risk_score'),
                'violation_breakdown' => $logs->groupBy('tipe_pelanggaran')->map(fn($g) => $g->count()),
                'foto_bukti'         => $logs->whereNotNull('foto_bukti')->map(fn($l) => [
                    'url'        => $l->foto_bukti,
                    'tipe'       => $l->tipe_pelanggaran,
                    'risk_score' => $l->risk_score,
                    'waktu'      => $l->waktu?->utc()->format('Y-m-d H:i:s'),
                ])->values(),
                'jawaban' => $p->jawabanPeserta->sortBy(fn($j) => $j->ujianSoal?->urutan ?? 999)->map(fn($j) => [
                    'nomor'   => $j->ujianSoal?->urutan ?? '-',
                    'jawaban' => $j->jawaban,
                    'nilai'   => $j->final_nilai ?? $j->nilai,
                ])->values(),
            ];
        }

        $summary = $matchedLogs->groupBy('tipe_pelanggaran')
            ->map(fn($g) => $g->count())
            ->sortByDesc(fn($v) => $v)
            ->toArray();

        return response()->json([
            'peserta' => [
                'user_id' => (int) $userId,
                'nama'    => $user?->nama,
                'nim'     => $user?->nim,
            ],
            'ujian' => [
                'id'         => $ujian->id,
                'nama_ujian' => $ujian->nama_ujian,
                'total_soal' => $totalSoal,
            ],
            'attempts'          => $attemptRows,
            'violation_summary' => $summary,
        ]);
    }

    // ── Admin Universitas: Monitoring ─────────────────────────────────────────

    public function adminMonitoringList(Request $request)
    {
        $now   = now();
        $admin = $request->user();

        $ujianList = Ujian::whereHas('creator', fn($q) => $q->where('universitas_id', $admin->universitas_id))
            ->where('start_date', '<=', $now)
            ->where('end_date', '>=', $now)
            ->with([
                'mataKuliah:id,nama',
                'pesertaUjian:id,ujian_id,user_id,attempt_ke,status',
                'pesertaUjian.proctoringLog',
            ])
            ->get();

        $data = $ujianList->map(function ($ujian) {
            $latestPerUser = $ujian->pesertaUjian
                ->groupBy('user_id')
                ->map(fn($g) => $g->sortByDesc('attempt_ke')->first());

            $totalViolations = 0;
            $totalRisk       = 0;
            foreach ($ujian->pesertaUjian as $p) {
                foreach ($p->proctoringLog as $log) {
                    $totalViolations++;
                    $totalRisk += $log->risk_score;
                }
            }

            return [
                'id'               => $ujian->id,
                'nama_ujian'       => $ujian->nama_ujian,
                'mata_kuliah'      => $ujian->mataKuliah?->nama,
                'start_date'       => $ujian->start_date?->format('Y-m-d H:i'),
                'end_date'         => $ujian->end_date?->format('Y-m-d H:i'),
                'durasi_menit'     => $ujian->durasi_menit,
                'peserta_aktif'    => $latestPerUser->where('status', 'sedang_berlangsung')->count(),
                'total_peserta'    => $latestPerUser->count(),
                'total_violations' => $totalViolations,
                'total_risk_score' => $totalRisk,
            ];
        });

        return response()->json(['data' => $data]);
    }

    public function adminMonitoringDetail(Request $request, $ujianId)
    {
        $admin = $request->user();

        $ujian = Ujian::whereHas('creator', fn($q) => $q->where('universitas_id', $admin->universitas_id))
            ->with([
                'mataKuliah:id,nama',
                'ujianSoal:id,ujian_id',
                'pesertaUjian:id,ujian_id,user_id,attempt_ke,status,mulai_at',
                'pesertaUjian.user:id,nama,nim',
                'pesertaUjian.jawabanPeserta:id,peserta_ujian_id',
                'pesertaUjian.proctoringLog',
            ])
            ->findOrFail($ujianId);

        $totalSoal = $ujian->ujianSoal->count();

        $peserta = $ujian->pesertaUjian
            ->groupBy('user_id')
            ->map(function ($g) use ($totalSoal) {
                $latest  = $g->sortByDesc('attempt_ke')->first();
                $display = $g->firstWhere('status', 'sedang_berlangsung')
                    ?? $g->where('status', 'selesai')->sortByDesc('attempt_ke')->first()
                    ?? $latest;
                $allViol = collect();
                foreach ($g as $attempt) {
                    foreach ($attempt->proctoringLog as $log) {
                        $allViol->push($log);
                    }
                }
                return [
                    'peserta_ujian_id'    => $display->id,
                    'user_id'             => $display->user_id,
                    'nama'                => $display->user?->nama,
                    'nim'                 => $display->user?->nim,
                    'status'              => $display->status,
                    'attempt_ke'          => $latest->attempt_ke,
                    'mulai_at'            => $display->mulai_at?->format('H:i:s'),
                    'soal_dijawab'        => $display->jawabanPeserta->count(),
                    'total_soal'          => $totalSoal,
                    'violations'          => $allViol->count(),
                    'risk_score'          => $allViol->sum('risk_score'),
                    'violation_breakdown' => $allViol->groupBy('tipe_pelanggaran')->map(fn($g) => $g->count()),
                ];
            })
            ->sortByDesc('risk_score')
            ->values();

        return response()->json([
            'ujian'   => [
                'id'           => $ujian->id,
                'nama_ujian'   => $ujian->nama_ujian,
                'mata_kuliah'  => $ujian->mataKuliah?->nama,
                'start_date'   => $ujian->start_date?->format('Y-m-d H:i'),
                'end_date'     => $ujian->end_date?->format('Y-m-d H:i'),
                'durasi_menit' => $ujian->durasi_menit,
                'total_soal'   => $totalSoal,
            ],
            'peserta' => $peserta,
        ]);
    }

    public function adminMonitoringPesertaDetail(Request $request, $ujianId, $userId)
    {
        $admin = $request->user();

        $ujian = Ujian::whereHas('creator', fn($q) => $q->where('universitas_id', $admin->universitas_id))
            ->with([
                'pesertaUjian' => fn($q) => $q
                    ->where('user_id', $userId)
                    ->where('status', '!=', 'belum_mulai')
                    ->with(['user:id,nama,nim', 'jawabanPeserta:id,peserta_ujian_id,ujian_soal_id,jawaban,nilai,final_nilai', 'jawabanPeserta.ujianSoal:id,urutan', 'proctoringLog'])
                    ->orderBy('attempt_ke'),
                'ujianSoal:id,ujian_id',
            ])
            ->findOrFail($ujianId);

        $attempts = $ujian->pesertaUjian;

        if ($attempts->isEmpty()) {
            return response()->json(['message' => 'Peserta tidak ditemukan.'], 404);
        }

        $user      = $attempts->first()->user;
        $totalSoal = $ujian->ujianSoal->count();

        $matchedLogs = collect();
        $attemptRows = [];
        foreach ($attempts as $p) {
            $logs = $p->proctoringLog;
            $matchedLogs = $matchedLogs->concat($logs);
            $attemptRows[] = [
                'peserta_ujian_id'    => $p->id,
                'attempt_ke'          => $p->attempt_ke,
                'status'              => $p->status,
                'mulai_at'            => $p->mulai_at?->format('H:i:s'),
                'selesai_at'          => $p->selesai_at?->format('H:i:s'),
                'soal_dijawab'        => $p->jawabanPeserta->count(),
                'violations'          => $logs->count(),
                'risk_score'          => $logs->sum('risk_score'),
                'violation_breakdown' => $logs->groupBy('tipe_pelanggaran')->map(fn($g) => $g->count()),
                'foto_bukti'          => $logs->whereNotNull('foto_bukti')->map(fn($l) => [
                    'url'        => $l->foto_bukti,
                    'tipe'       => $l->tipe_pelanggaran,
                    'risk_score' => $l->risk_score,
                    'waktu'      => $l->waktu?->utc()->format('Y-m-d H:i:s'),
                ])->values(),
                'jawaban' => $p->jawabanPeserta->sortBy(fn($j) => $j->ujianSoal?->urutan ?? 999)->map(fn($j) => [
                    'nomor'   => $j->ujianSoal?->urutan ?? '-',
                    'jawaban' => $j->jawaban,
                    'nilai'   => $j->final_nilai ?? $j->nilai,
                ])->values(),
            ];
        }

        $summary = $matchedLogs->groupBy('tipe_pelanggaran')
            ->map(fn($g) => $g->count())
            ->sortByDesc(fn($v) => $v)
            ->toArray();

        return response()->json([
            'peserta' => [
                'user_id' => (int) $userId,
                'nama'    => $user?->nama,
                'nim'     => $user?->nim,
            ],
            'ujian' => [
                'id'         => $ujian->id,
                'nama_ujian' => $ujian->nama_ujian,
                'total_soal' => $totalSoal,
            ],
            'attempts'          => $attemptRows,
            'violation_summary' => $summary,
        ]);
    }

}
