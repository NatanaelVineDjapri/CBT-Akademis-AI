<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

/**
 * Simulasi ujian dengan soal essay untuk verifikasi logika status:
 *  - Perlu Pengecekan : ada nilai_akhir + essay belum dikoreksi dosen
 *  - Selesai          : ada nilai_akhir + semua essay sudah dikoreksi
 *  - Belum Mulai      : tidak ada mulai_at
 *  - Berlangsung      : status = sedang_berlangsung
 *  - Selesai (PG only): ada nilai_akhir, tidak ada essay → harus Selesai, bukan Perlu Pengecekan
 */
class SimulasiEssaySeeder extends Seeder
{
    private array $opsiLabels = ['A', 'B', 'C', 'D'];

    public function run(): void
    {
        $dosenId  = DB::table('users')->where('email', 'irvan.lewenusa@untar.ac.id')->value('id');
        $matkulAP = DB::table('mata_kuliah')->where('kode', 'TI101')->first();

        // Ambil 4 mahasiswa berbeda selain Natanael
        $mahasiswaIds = DB::table('users')
            ->where('role', 'mahasiswa')
            ->where('nim', '!=', '535240042')
            ->limit(4)
            ->pluck('id')
            ->toArray();

        $natanaelId = DB::table('users')->where('nim', '535240042')->value('id');

        // Semua peserta yang akan dipakai: [natanael, mhs1, mhs2, mhs3, mhs4]
        $pesertaList = array_merge([$natanaelId], $mahasiswaIds);

        // ── Bank Soal ──────────────────────────────────────────────────
        $bankId = DB::table('bank_soal')->insertGetId([
            'created_by'     => $dosenId,
            'mata_kuliah_id' => $matkulAP->id,
            'nama'           => 'Bank Soal Essay - Simulasi',
            'permission'     => 'private',
            'created_at'     => now(), 'updated_at' => now(),
        ]);

        // ── Soal PG (2 soal) ──────────────────────────────────────────
        $pgSoal = [
            ['q' => 'Apa kepanjangan dari CPU?', 'a' => ['Central Processing Unit', 'Computer Personal Unit', 'Core Processing Utility', 'Central Program Unit'], 'correct' => 0],
            ['q' => 'Manakah tipe data berikut yang menyimpan bilangan desimal?', 'a' => ['int', 'char', 'float', 'bool'], 'correct' => 2],
        ];

        $pgUjianSoalIds = [];
        foreach ($pgSoal as $i => $s) {
            $soalId = DB::table('soal')->insertGetId([
                'bank_soal_id'      => $bankId,
                'mata_kuliah_id'    => $matkulAP->id,
                'deskripsi'         => $s['q'],
                'tingkat_kesulitan' => 'mudah',
                'ai_generated'      => false,
                'created_at'        => now(), 'updated_at' => now(),
            ]);
            $jenisSoalId = DB::table('jenis_soal')->insertGetId([
                'soal_id'    => $soalId,
                'jenis_soal' => 'pilihan_ganda',
                'created_at' => now(), 'updated_at' => now(),
            ]);
            foreach ($s['a'] as $j => $teks) {
                DB::table('opsi_jawaban')->insert([
                    'jenis_soal_id' => $jenisSoalId,
                    'opsi'          => $this->opsiLabels[$j],
                    'teks'          => $teks,
                    'is_correct'    => ($j === $s['correct']),
                    'created_at'    => now(), 'updated_at' => now(),
                ]);
            }
            $pgUjianSoalIds[] = ['soal_id' => $soalId, 'correct' => $s['correct']];
        }

        // ── Soal Essay (2 soal) ───────────────────────────────────────
        $essaySoal = [
            'Jelaskan perbedaan antara stack dan queue beserta contoh penggunaannya!',
            'Apa yang dimaksud dengan kompleksitas waktu dan ruang dalam algoritma? Berikan contoh!',
        ];

        $essayUjianSoalIds = [];
        foreach ($essaySoal as $s) {
            $soalId = DB::table('soal')->insertGetId([
                'bank_soal_id'      => $bankId,
                'mata_kuliah_id'    => $matkulAP->id,
                'deskripsi'         => $s,
                'tingkat_kesulitan' => 'sedang',
                'ai_generated'      => false,
                'created_at'        => now(), 'updated_at' => now(),
            ]);
            DB::table('jenis_soal')->insert([
                'soal_id'    => $soalId,
                'jenis_soal' => 'essay',
                'created_at' => now(), 'updated_at' => now(),
            ]);
            $essayUjianSoalIds[] = $soalId;
        }

        // ── Ujian (sudah selesai, 1 minggu lalu) ──────────────────────
        $tanggal = Carbon::now()->subWeek();

        $ujianId = DB::table('ujian')->insertGetId([
            'created_by'     => $dosenId,
            'mata_kuliah_id' => $matkulAP->id,
            'nama_ujian'     => 'UTS Algoritma - Simulasi Essay',
            'jenis_ujian'    => 'perkuliahan',
            'start_date'     => $tanggal,
            'end_date'       => $tanggal->copy()->addHours(2),
            'durasi_menit'   => 90,
            'kode_akses'     => 'SIMESS01',
            'is_kode_aktif'  => false,
            'created_at'     => now(), 'updated_at' => now(),
        ]);

        DB::table('ujian_setting')->insert([
            'ujian_id'         => $ujianId,
            'randomize_soal'   => false,
            'max_attempt'      => 1,
            'passing_grade'    => 65,
            'proctoring_aktif' => false,
            'created_at'       => now(), 'updated_at' => now(),
        ]);

        $this->insertGradeSetting($ujianId, [
            ['A', 85, 100], ['B', 75, 84], ['C', 65, 74], ['D', 55, 64], ['E', 0, 54],
        ]);

        // Daftarkan ujian soal: 2 PG + 2 Essay
        $ujianSoalPG = [];
        foreach ($pgUjianSoalIds as $i => $s) {
            $ujianSoalPG[] = DB::table('ujian_soal')->insertGetId([
                'ujian_id'   => $ujianId,
                'soal_id'    => $s['soal_id'],
                'bobot'      => 20,
                'urutan'     => $i + 1,
                'created_at' => now(), 'updated_at' => now(),
            ]);
        }

        $ujianSoalEssay = [];
        foreach ($essayUjianSoalIds as $i => $soalId) {
            $ujianSoalEssay[] = DB::table('ujian_soal')->insertGetId([
                'ujian_id'   => $ujianId,
                'soal_id'    => $soalId,
                'bobot'      => 30,
                'urutan'     => count($pgUjianSoalIds) + $i + 1,
                'created_at' => now(), 'updated_at' => now(),
            ]);
        }

        // ── SKENARIO 1: Natanael — essay belum dikoreksi → "Perlu Pengecekan" ──
        $this->buatPeserta($pesertaList[0], $ujianId, $ujianSoalPG, $pgUjianSoalIds, $ujianSoalEssay, [
            'status'           => 'selesai',
            'mulai_at'         => $tanggal,
            'selesai_at'       => $tanggal->copy()->addMinutes(80),
            'essay_graded'     => false,   // belum dikoreksi dosen
            'nilai'            => 40.0,    // hanya dari PG, essay belum dihitung
            'grade'            => 'E',
            'lulus'            => false,
        ]);

        // ── SKENARIO 2: Mahasiswa 1 — essay sudah dikoreksi → "Selesai" ──────
        $this->buatPeserta($pesertaList[1], $ujianId, $ujianSoalPG, $pgUjianSoalIds, $ujianSoalEssay, [
            'status'       => 'selesai',
            'mulai_at'     => $tanggal,
            'selesai_at'   => $tanggal->copy()->addMinutes(75),
            'essay_graded' => true,   // sudah dikoreksi dosen
            'nilai'        => 80.0,
            'grade'        => 'B',
            'lulus'        => true,
        ]);

        // ── SKENARIO 3: Mahasiswa 2 — belum mulai → "Belum Mulai" ────────────
        $this->buatPesertaBelumMulai($pesertaList[2], $ujianId);

        // ── SKENARIO 4: Mahasiswa 3 — sedang berlangsung → "Berlangsung" ─────
        $this->buatPesertaBerlangsung($pesertaList[3], $ujianId, $tanggal);

        // ── Ujian 2: Pure PG — harusnya "Selesai", bukan "Perlu Pengecekan" ──
        $ujianPGId = DB::table('ujian')->insertGetId([
            'created_by'     => $dosenId,
            'mata_kuliah_id' => $matkulAP->id,
            'nama_ujian'     => 'Quiz PG Only - Simulasi',
            'jenis_ujian'    => 'perkuliahan',
            'start_date'     => $tanggal,
            'end_date'       => $tanggal->copy()->addHours(1),
            'durasi_menit'   => 30,
            'kode_akses'     => 'SIMPG01',
            'is_kode_aktif'  => false,
            'created_at'     => now(), 'updated_at' => now(),
        ]);

        DB::table('ujian_setting')->insert([
            'ujian_id'         => $ujianPGId,
            'randomize_soal'   => false,
            'max_attempt'      => 1,
            'passing_grade'    => 65,
            'proctoring_aktif' => false,
            'created_at'       => now(), 'updated_at' => now(),
        ]);

        $this->insertGradeSetting($ujianPGId, [
            ['A', 85, 100], ['B', 75, 84], ['C', 65, 74], ['D', 55, 64], ['E', 0, 54],
        ]);

        $ujianSoalPGOnly = [];
        foreach ($pgUjianSoalIds as $i => $s) {
            $ujianSoalPGOnly[] = DB::table('ujian_soal')->insertGetId([
                'ujian_id'   => $ujianPGId,
                'soal_id'    => $s['soal_id'],
                'bobot'      => 50,
                'urutan'     => $i + 1,
                'created_at' => now(), 'updated_at' => now(),
            ]);
        }

        // Natanael ikut ujian pure PG → harus "Selesai" walaupun is_manual_graded = false
        $pesertaPGId = DB::table('peserta_ujian')->insertGetId([
            'ujian_id'   => $ujianPGId,
            'user_id'    => $pesertaList[0],
            'attempt_ke' => 1,
            'status'     => 'selesai',
            'mulai_at'   => $tanggal,
            'selesai_at' => $tanggal->copy()->addMinutes(25),
            'created_at' => now(), 'updated_at' => now(),
        ]);

        foreach ($ujianSoalPGOnly as $i => $ujianSoalId) {
            $benar = ($pgUjianSoalIds[$i]['correct'] === 0);
            DB::table('jawaban_peserta')->insert([
                'peserta_ujian_id' => $pesertaPGId,
                'ujian_soal_id'    => $ujianSoalId,
                'jawaban'          => $this->opsiLabels[0],
                'nilai'            => $benar ? 50 : 0,
                'is_manual_graded' => false, // PG tidak pernah di-set true
                'final_nilai'      => $benar ? 50 : 0,
                'created_at'       => now(), 'updated_at' => now(),
            ]);
        }

        DB::table('nilai_akhir')->insert([
            'peserta_ujian_id' => $pesertaPGId,
            'nilai_total'      => 50.0,
            'lulus'            => false,
            'grade'            => 'D',
            'graded_at'        => $tanggal->copy()->addMinutes(30),
            'created_at'       => now(), 'updated_at' => now(),
        ]);
    }

    // ── Helpers ───────────────────────────────────────────────────────────────

    private function buatPeserta(int $userId, int $ujianId, array $ujianSoalPG, array $pgData, array $ujianSoalEssay, array $opts): void
    {
        $pesertaId = DB::table('peserta_ujian')->insertGetId([
            'ujian_id'   => $ujianId,
            'user_id'    => $userId,
            'attempt_ke' => 1,
            'status'     => $opts['status'],
            'mulai_at'   => $opts['mulai_at'],
            'selesai_at' => $opts['selesai_at'],
            'created_at' => now(), 'updated_at' => now(),
        ]);

        // Jawaban PG
        foreach ($ujianSoalPG as $i => $ujianSoalId) {
            $jawaban = $this->opsiLabels[$pgData[$i]['correct']]; // jawab benar semua
            DB::table('jawaban_peserta')->insert([
                'peserta_ujian_id' => $pesertaId,
                'ujian_soal_id'    => $ujianSoalId,
                'jawaban'          => $jawaban,
                'nilai'            => 20,
                'is_manual_graded' => false,
                'final_nilai'      => 20,
                'created_at'       => now(), 'updated_at' => now(),
            ]);
        }

        // Jawaban Essay
        $essayJawaban = [
            'Stack adalah LIFO (Last In First Out), contohnya undo di text editor. Queue adalah FIFO (First In First Out), contohnya antrian printer.',
            'Kompleksitas waktu mengukur seberapa lama algoritma berjalan, kompleksitas ruang mengukur memori. Contoh: Binary Search O(log n) waktu, O(1) ruang.',
        ];

        foreach ($ujianSoalEssay as $i => $ujianSoalId) {
            DB::table('jawaban_peserta')->insert([
                'peserta_ujian_id' => $pesertaId,
                'ujian_soal_id'    => $ujianSoalId,
                'jawaban'          => $essayJawaban[$i],
                'nilai'            => $opts['essay_graded'] ? 28 : null,
                'is_manual_graded' => $opts['essay_graded'],
                'ai_skor'          => null,
                'ai_feedback'      => null,
                'final_nilai'      => $opts['essay_graded'] ? 28 : null,
                'created_at'       => now(), 'updated_at' => now(),
            ]);
        }

        DB::table('nilai_akhir')->insert([
            'peserta_ujian_id' => $pesertaId,
            'nilai_total'      => $opts['nilai'],
            'lulus'            => $opts['lulus'],
            'grade'            => $opts['grade'],
            'graded_at'        => $opts['selesai_at'],
            'created_at'       => now(), 'updated_at' => now(),
        ]);
    }

    private function buatPesertaBelumMulai(int $userId, int $ujianId): void
    {
        DB::table('peserta_ujian')->insertGetId([
            'ujian_id'   => $ujianId,
            'user_id'    => $userId,
            'attempt_ke' => 1,
            'status'     => 'berlangsung',
            'mulai_at'   => null,
            'selesai_at' => null,
            'created_at' => now(), 'updated_at' => now(),
        ]);
    }

    private function buatPesertaBerlangsung(int $userId, int $ujianId, Carbon $tanggal): void
    {
        DB::table('peserta_ujian')->insertGetId([
            'ujian_id'   => $ujianId,
            'user_id'    => $userId,
            'attempt_ke' => 1,
            'status'     => 'sedang_berlangsung',
            'mulai_at'   => $tanggal,
            'selesai_at' => null,
            'created_at' => now(), 'updated_at' => now(),
        ]);
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
}
