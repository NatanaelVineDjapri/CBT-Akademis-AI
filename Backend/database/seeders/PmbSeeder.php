<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Carbon\Carbon;

class PmbSeeder extends Seeder
{
    private array $opsiLabels = ['A', 'B', 'C', 'D'];

    public function run(): void
    {
        $adminId = DB::table('users')->where('email', 'admin@untar.ac.id')->value('id');
        $tiId    = DB::table('prodi')->where('kode', 'TI')->value('id');

        // ── Mata Kuliah PMB ───────────────────────────────────────────
        $mkPmb = DB::table('mata_kuliah')->insertGetId([
            'nama'       => 'Seleksi Penerimaan Mahasiswa Baru',
            'kode'       => 'PMB-TPA',
            'prodi_id'   => $tiId,
            'created_at' => now(), 'updated_at' => now(),
        ]);

        // ── Bank Soal (created_by admin universitas) ──────────────────
        $bankId = DB::table('bank_soal')->insertGetId([
            'created_by'     => $adminId,
            'mata_kuliah_id' => $mkPmb,
            'nama'           => 'Bank Soal TPA PMB 2025/2026',
            'deskripsi'      => 'Tes Potensi Akademik untuk seleksi PMB UNTAR 2025/2026',
            'permission'     => 'private',
            'created_at'     => now(), 'updated_at' => now(),
        ]);

        // ── Soal TPA (10 PG + 2 Essay) ────────────────────────────────
        $soalPG = [
            ['q' => 'Jika 3x + 5 = 20, maka nilai x adalah?', 'a' => ['3', '4', '5', '6'], 'correct' => 2],
            ['q' => 'Pola bilangan: 2, 6, 12, 20, 30, ... nilai berikutnya adalah?', 'a' => ['38', '40', '42', '44'], 'correct' => 2],
            ['q' => 'Antonim kata "Konkret" adalah?', 'a' => ['Nyata', 'Abstrak', 'Jelas', 'Pasti'], 'correct' => 1],
            ['q' => 'Sinonim kata "Proliferasi" adalah?', 'a' => ['Penurunan', 'Penyebaran luas', 'Penggabungan', 'Pemisahan'], 'correct' => 1],
            ['q' => 'Luas persegi dengan diagonal 10√2 cm adalah?', 'a' => ['50 cm²', '100 cm²', '200 cm²', '400 cm²'], 'correct' => 1],
            ['q' => 'Rata-rata dari 7, 8, 9, 10, 11 adalah?', 'a' => ['8', '8,5', '9', '9,5'], 'correct' => 2],
            ['q' => 'Indonesia merdeka pada tanggal?', 'a' => ['17 Agustus 1944', '17 Agustus 1945', '17 Agustus 1946', '17 Agustus 1947'], 'correct' => 1],
            ['q' => 'Kecepatan cahaya di ruang hampa sekitar?', 'a' => ['3 × 10⁵ km/s', '3 × 10⁶ km/s', '3 × 10⁷ km/s', '3 × 10⁸ m/s'], 'correct' => 3],
            ['q' => 'Jika a = 3 dan b = 4, nilai a² + b² adalah?', 'a' => ['14', '24', '25', '49'], 'correct' => 2],
            ['q' => 'Deret geometri dengan rasio 2 dan suku pertama 3: suku ke-5 adalah?', 'a' => ['24', '36', '48', '56'], 'correct' => 2],
        ];

        $soalEssay = [
            ['q' => 'Mengapa pendidikan tinggi penting bagi perkembangan diri dan kemajuan bangsa? Jelaskan pendapatmu disertai contoh nyata!'],
            ['q' => 'Deskripsikan tujuan dan motivasimu memilih program studi yang kamu daftarkan, serta rencana kontribusimu setelah lulus!'],
        ];

        $pgIds    = $this->insertSoalPG($soalPG, $bankId, $mkPmb);
        $essayIds = $this->insertSoalEssay($soalEssay, $bankId, $mkPmb);

        // ── 100 Peserta PMB ───────────────────────────────────────────
        $pw       = Hash::make('password123');
        $pesertaUsers = [];
        for ($i = 1; $i <= 100; $i++) {
            $no   = str_pad($i, 3, '0', STR_PAD_LEFT);
            $uid  = DB::table('users')->insertGetId([
                'nama'           => "Calon Mahasiswa PMB $no",
                'email'          => "pmb.peserta$no@pmb.untar.ac.id",
                'password'       => $pw,
                'role'           => 'peserta_mahasiswa_baru',
                'nim'            => null,
                'nidn'           => null,
                'universitas_id' => DB::table('users')->where('id', $adminId)->value('universitas_id'),
                'prodi_id'       => null,
                'is_temporary'   => true,
                'expired_at'     => now()->addYear(),
                'status'         => 'aktif',
                'created_at'     => now(), 'updated_at' => now(),
            ]);
            $pesertaUsers[] = $uid;
        }

        // ── 5 Gelombang PMB (selesai) + 1 Aktif ──────────────────────
        $gradeRanges = [['A', 85, 100], ['B', 75, 84], ['C', 60, 74], ['D', 45, 59], ['E', 0, 44]];

        $gelombang = [
            ['PMB Gel A 2025/2026', Carbon::create(2025, 10,  5, 8, 0), 60, 75], // avg ~67
            ['PMB Gel B 2025/2026', Carbon::create(2025, 11, 10, 8, 0), 55, 80], // avg ~68
            ['PMB Gel C 2025/2026', Carbon::create(2026,  1, 15, 8, 0), 58, 82], // avg ~70
            ['PMB Gel D 2025/2026', Carbon::create(2026,  2, 20, 8, 0), 62, 85], // avg ~73
            ['PMB Gel E 2025/2026', Carbon::create(2026,  3, 25, 8, 0), 65, 88], // avg ~76
        ];

        foreach ($gelombang as $idx => [$namaUjian, $start, $minScore, $maxScore]) {
            $kode    = 'PMB' . chr(65 + $idx) . '2526';
            $ujianId = DB::table('ujian')->insertGetId([
                'created_by'     => $adminId,
                'mata_kuliah_id' => $mkPmb,
                'nama_ujian'     => $namaUjian,
                'jenis_ujian'    => 'pmb',
                'start_date'     => $start,
                'end_date'       => $start->copy()->addHours(2),
                'durasi_menit'   => 90,
                'kode_akses'     => $kode,
                'is_kode_aktif'  => false,
                'created_at'     => now(), 'updated_at' => now(),
            ]);

            DB::table('ujian_setting')->insert([
                'ujian_id'          => $ujianId,
                'randomize_soal'    => true,
                'max_attempt'       => 1,
                'passing_grade'     => 60,
                'proctoring_aktif'  => false,
                'created_at'        => now(), 'updated_at' => now(),
            ]);

            $this->insertGradeSetting($ujianId, $gradeRanges);

            $ujianSoal = $this->linkUjianSoal($ujianId, $pgIds, $essayIds);

            // 100 peserta, skor random dalam range
            foreach ($pesertaUsers as $i => $uid) {
                // Distribusi normal sederhana: tengah lebih banyak
                $skor = (float) ($minScore + (($maxScore - $minScore) * (sin(($i / 100) * M_PI) * 0.6 + rand(0, 40) / 100)));
                $skor = round(max($minScore, min($maxScore, $skor)), 1);
                $this->buatPeserta($uid, $ujianId, $ujianSoal, $skor, $start);
            }
        }

        // ── 1 Ujian PMB aktif (akan datang) ──────────────────────────
        $nextStart = Carbon::create(2026, 5, 10, 8, 0);
        DB::table('ujian')->insertGetId([
            'created_by'     => $adminId,
            'mata_kuliah_id' => $mkPmb,
            'nama_ujian'     => 'PMB Gel F 2025/2026',
            'jenis_ujian'    => 'pmb',
            'start_date'     => $nextStart,
            'end_date'       => $nextStart->copy()->addHours(2),
            'durasi_menit'   => 90,
            'kode_akses'     => 'PMBF2526',
            'is_kode_aktif'  => true,
            'created_at'     => now(), 'updated_at' => now(),
        ]);

        // ── Pengumuman PMB ────────────────────────────────────────────
        DB::table('pengumuman')->insert([
            [
                'created_by' => $adminId,
                'judul'      => 'Pendaftaran PMB Gelombang F Dibuka',
                'isi'        => 'Pendaftaran PMB Gelombang F Tahun Ajaran 2025/2026 resmi dibuka mulai 1 Mei 2026. Ujian seleksi akan dilaksanakan pada 10 Mei 2026 pukul 08.00 WIB. Pastikan kelengkapan dokumen sebelum mendaftar.',
                'expired_at' => Carbon::create(2026, 5, 10),
                'created_at' => now(), 'updated_at' => now(),
            ],
            [
                'created_by' => $adminId,
                'judul'      => 'Pengumuman Hasil PMB Gelombang E',
                'isi'        => 'Hasil seleksi PMB Gelombang E 2025/2026 telah diumumkan. Peserta yang lolos seleksi dapat melakukan registrasi ulang hingga 15 April 2026.',
                'expired_at' => Carbon::create(2026, 4, 15),
                'created_at' => now(), 'updated_at' => now(),
            ],
        ]);
    }

    // ── Helpers ───────────────────────────────────────────────────────

    private function insertSoalPG(array $soalList, int $bankId, int $mkId): array
    {
        $result = [];
        foreach ($soalList as $s) {
            $soalId = DB::table('soal')->insertGetId([
                'bank_soal_id'      => $bankId,
                'mata_kuliah_id'    => $mkId,
                'deskripsi'         => $s['q'],
                'tingkat_kesulitan' => 'sedang',
                'ai_generated'      => false,
                'created_at'        => now(), 'updated_at' => now(),
            ]);
            $jsId = DB::table('jenis_soal')->insertGetId([
                'soal_id'    => $soalId,
                'jenis_soal' => 'pilihan_ganda',
                'created_at' => now(), 'updated_at' => now(),
            ]);
            foreach ($s['a'] as $i => $teks) {
                DB::table('opsi_jawaban')->insert([
                    'jenis_soal_id' => $jsId,
                    'opsi'          => $this->opsiLabels[$i],
                    'teks'          => $teks,
                    'is_correct'    => ($i === $s['correct']),
                    'created_at'    => now(), 'updated_at' => now(),
                ]);
            }
            $result[] = ['soal_id' => $soalId, 'correct' => $s['correct'], 'tipe' => 'pilihan_ganda'];
        }
        return $result;
    }

    private function insertSoalEssay(array $soalList, int $bankId, int $mkId): array
    {
        $result = [];
        foreach ($soalList as $s) {
            $soalId = DB::table('soal')->insertGetId([
                'bank_soal_id'      => $bankId,
                'mata_kuliah_id'    => $mkId,
                'deskripsi'         => $s['q'],
                'tingkat_kesulitan' => 'sedang',
                'ai_generated'      => false,
                'created_at'        => now(), 'updated_at' => now(),
            ]);
            DB::table('jenis_soal')->insert([
                'soal_id'    => $soalId,
                'jenis_soal' => 'essay',
                'created_at' => now(), 'updated_at' => now(),
            ]);
            $result[] = ['soal_id' => $soalId, 'tipe' => 'essay'];
        }
        return $result;
    }

    private function linkUjianSoal(int $ujianId, array $pgIds, array $essayIds): array
    {
        $result = [];
        $urutan = 1;
        foreach ($pgIds as $s) {
            $result[] = [
                'id'      => DB::table('ujian_soal')->insertGetId(['ujian_id' => $ujianId, 'soal_id' => $s['soal_id'], 'bobot' => 8, 'urutan' => $urutan++, 'created_at' => now(), 'updated_at' => now()]),
                'tipe'    => 'pilihan_ganda',
                'correct' => $s['correct'],
            ];
        }
        foreach ($essayIds as $s) {
            $result[] = [
                'id'   => DB::table('ujian_soal')->insertGetId(['ujian_id' => $ujianId, 'soal_id' => $s['soal_id'], 'bobot' => 20, 'urutan' => $urutan++, 'created_at' => now(), 'updated_at' => now()]),
                'tipe' => 'essay',
            ];
        }
        return $result;
    }

    private function insertGradeSetting(int $ujianId, array $grades): void
    {
        foreach ($grades as [$grade, $min, $max]) {
            DB::table('grade_setting')->insert([
                'ujian_id'   => $ujianId,
                'grade'      => $grade,
                'nilai_min'  => $min,
                'nilai_max'  => $max,
                'created_at' => now(), 'updated_at' => now(),
            ]);
        }
    }

    private function getComponentScores(float $total, int $pgCount): array
    {
        // bobot: 10 PG × 8 = 80, 2 essay × 20 = 40 (total max 120 tapi dinormalisasi ke 100)
        // Sederhanakan: PG contributes total*0.8, essay total*0.2
        $pgScore    = $total * 0.8;
        $pgCorrect  = (int) min($pgCount, round($pgScore / 8));
        $essayTotal = (int) round($total - ($pgCorrect * 8));
        return [$pgCorrect, max(0, $essayTotal)];
    }

    private function buatPeserta(int $userId, int $ujianId, array $ujianSoal, float $score, Carbon $tanggal): void
    {
        $pgSoal    = array_filter($ujianSoal, fn($s) => $s['tipe'] === 'pilihan_ganda');
        $essaySoal = array_filter($ujianSoal, fn($s) => $s['tipe'] === 'essay');

        [$pgCorrect, $essayTotal] = $this->getComponentScores($score, count($pgSoal));

        $mulai   = $tanggal->copy()->addMinutes(rand(0, 15));
        $selesai = $mulai->copy()->addMinutes(rand(55, 88));

        $pesertaId = DB::table('peserta_ujian')->insertGetId([
            'ujian_id'   => $ujianId,
            'user_id'    => $userId,
            'attempt_ke' => 1,
            'status'     => 'selesai',
            'mulai_at'   => $mulai,
            'selesai_at' => $selesai,
            'created_at' => now(), 'updated_at' => now(),
        ]);

        $pgIdx = 0;
        foreach ($pgSoal as $entry) {
            $benar   = $pgIdx < $pgCorrect;
            $correct = $entry['correct'];
            $jawaban = $benar ? $this->opsiLabels[$correct] : $this->opsiLabels[($correct + 1) % 4];
            DB::table('jawaban_peserta')->insert([
                'peserta_ujian_id' => $pesertaId,
                'ujian_soal_id'    => $entry['id'],
                'jawaban'          => $jawaban,
                'nilai'            => $benar ? 8.0 : 0.0,
                'is_manual_graded' => false,
                'final_nilai'      => $benar ? 8.0 : 0.0,
                'created_at'       => now(), 'updated_at' => now(),
            ]);
            $pgIdx++;
        }

        $essayTexts = [
            'Pendidikan tinggi memberikan kesempatan untuk mengembangkan potensi diri secara optimal. Dengan ilmu yang diperoleh, saya berharap dapat berkontribusi positif bagi masyarakat dan bangsa Indonesia.',
            'Saya memilih program studi ini karena sesuai dengan minat dan bakat yang saya miliki. Setelah lulus, saya berencana untuk bekerja di bidang yang relevan dan terus berinovasi.',
        ];
        $essIdx = 0;
        foreach ($essaySoal as $entry) {
            $essayScore = $essIdx === 0 ? (int) ceil($essayTotal / 2) : (int) floor($essayTotal / 2);
            DB::table('jawaban_peserta')->insert([
                'peserta_ujian_id' => $pesertaId,
                'ujian_soal_id'    => $entry['id'],
                'jawaban'          => $essayTexts[$essIdx % 2],
                'nilai'            => 0,
                'is_manual_graded' => true,
                'final_nilai'      => (float) $essayScore,
                'created_at'       => now(), 'updated_at' => now(),
            ]);
            $essIdx++;
        }

        $grade = match (true) {
            $score >= 85 => 'A',
            $score >= 75 => 'B',
            $score >= 60 => 'C',
            $score >= 45 => 'D',
            default      => 'E',
        };

        DB::table('nilai_akhir')->insert([
            'peserta_ujian_id' => $pesertaId,
            'nilai_total'      => $score,
            'lulus'            => $score >= 60,
            'grade'            => $grade,
            'graded_at'        => $selesai->copy()->addDays(2),
            'created_at'       => now(), 'updated_at' => now(),
        ]);
    }
}
