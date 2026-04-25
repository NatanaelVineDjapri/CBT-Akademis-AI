<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class UjianDenganSoalSeeder extends Seeder
{
    private array $opsiLabels = ['A', 'B', 'C', 'D'];

    public function run(): void
    {
        $natanaelId = DB::table('users')->where('nim', '535240042')->value('id');
        $dosenId    = DB::table('users')->where('email', 'irvan.lewenusa@untar.ac.id')->value('id');

        $matkulPW  = DB::table('mata_kuliah')->where('kode', 'TI301')->first();
        $matkulBD  = DB::table('mata_kuliah')->where('kode', 'TI302')->first();
        $matkulAP  = DB::table('mata_kuliah')->where('kode', 'TI101')->first();

        // ── Bank Soal ─────────────────────────────────────────────
        $bankPW = DB::table('bank_soal')->insertGetId([
            'created_by'     => $dosenId,
            'mata_kuliah_id' => $matkulPW->id,
            'nama'           => 'Bank Soal Pemrograman Web - Quiz',
            'deskripsi'      => 'Soal quiz harian Pemrograman Web',
            'permission'     => 'private',
            'created_at'     => now(), 'updated_at' => now(),
        ]);

        $bankBD = DB::table('bank_soal')->insertGetId([
            'created_by'     => $dosenId,
            'mata_kuliah_id' => $matkulBD->id,
            'nama'           => 'Bank Soal Basis Data - Quiz',
            'deskripsi'      => 'Soal quiz harian Basis Data',
            'permission'     => 'private',
            'created_at'     => now(), 'updated_at' => now(),
        ]);

        $bankAP = DB::table('bank_soal')->insertGetId([
            'created_by'     => $dosenId,
            'mata_kuliah_id' => $matkulAP->id,
            'nama'           => 'Bank Soal Algoritma - Mix',
            'deskripsi'      => 'Soal pilihan ganda dan checklist Algoritma',
            'permission'     => 'private',
            'created_at'     => now(), 'updated_at' => now(),
        ]);

        // ── Soal ──────────────────────────────────────────────────
        $soalPW = [
            ['q' => 'Apa fungsi dari tag <head> dalam HTML?', 'a' => ['Menampilkan konten halaman', 'Menyimpan metadata dan resource halaman', 'Membuat header visual halaman', 'Menentukan ukuran halaman'], 'correct' => 1],
            ['q' => 'Dalam CSS, properti "display: flex" digunakan untuk?', 'a' => ['Menyembunyikan elemen', 'Mengatur tata letak elemen dalam satu dimensi', 'Membuat elemen menjadi blok', 'Mengatur posisi absolut'], 'correct' => 1],
            ['q' => 'JavaScript berjalan di sisi mana secara default?', 'a' => ['Server', 'Database', 'Client (browser)', 'CDN'], 'correct' => 2],
            ['q' => 'Apa output dari: console.log(typeof null)?', 'a' => ['null', 'undefined', 'object', 'boolean'], 'correct' => 2],
            ['q' => 'HTTP status code 404 berarti?', 'a' => ['Server error', 'Unauthorized', 'Resource not found', 'Bad request'], 'correct' => 2],
            ['q' => 'Event listener yang tepat untuk klik tombol di JavaScript adalah?', 'a' => ['onclick', 'addEventListener("click", ...)', 'onpress', 'Pilihan A dan B benar'], 'correct' => 3],
        ];

        $soalBD = [
            ['q' => 'Apa yang dimaksud normalisasi dalam basis data?', 'a' => ['Proses mengenkripsi data', 'Proses menghapus data duplikat', 'Proses mengorganisasi tabel untuk mengurangi redundansi', 'Proses membuat indeks tabel'], 'correct' => 2],
            ['q' => 'Bentuk Normal Pertama (1NF) mensyaratkan?', 'a' => ['Tidak ada dependensi transitif', 'Setiap kolom bernilai atomik', 'Setiap tabel memiliki foreign key', 'Tidak ada kolom NULL'], 'correct' => 1],
            ['q' => 'Perintah SQL untuk menambah kolom baru ke tabel yang sudah ada adalah?', 'a' => ['ALTER TABLE ... ADD', 'UPDATE TABLE ... ADD COLUMN', 'MODIFY TABLE ... INSERT', 'CHANGE TABLE ... ADD'], 'correct' => 0],
            ['q' => 'Apa perbedaan WHERE dan HAVING dalam SQL?', 'a' => ['Tidak ada perbedaan', 'WHERE untuk filter baris, HAVING untuk filter hasil GROUP BY', 'HAVING untuk filter baris, WHERE untuk hasil GROUP BY', 'WHERE hanya untuk DELETE, HAVING untuk SELECT'], 'correct' => 1],
            ['q' => 'Index pada kolom tabel berfungsi untuk?', 'a' => ['Mengunci baris saat update', 'Mempercepat proses pencarian data', 'Membatasi nilai unik pada kolom', 'Menyimpan backup otomatis'], 'correct' => 1],
        ];

        // Soal PG untuk Algoritma
        $soalAPpg = [
            ['q' => 'Kompleksitas waktu algoritma Binary Search adalah?', 'a' => ['O(n)', 'O(n²)', 'O(log n)', 'O(1)'], 'correct' => 2],
            ['q' => 'Struktur data Stack menggunakan prinsip?', 'a' => ['FIFO', 'LIFO', 'Random Access', 'Priority Based'], 'correct' => 1],
            ['q' => 'Dalam algoritma Bubble Sort, berapa kali iterasi yang diperlukan untuk array berukuran n?', 'a' => ['n', 'n/2', 'n-1', 'n²'], 'correct' => 2],
            ['q' => 'Rekursi adalah teknik di mana fungsi?', 'a' => ['Memanggil fungsi lain', 'Memanggil dirinya sendiri', 'Dijalankan secara paralel', 'Mengembalikan void'], 'correct' => 1],
        ];

        // Soal Checklist untuk Algoritma
        $soalAPcb = [
            [
                'q'       => 'Manakah yang termasuk algoritma sorting?',
                'options' => ['Bubble Sort', 'Binary Search', 'Merge Sort', 'Depth First Search'],
                'correct' => [0, 2], // A dan C
            ],
            [
                'q'       => 'Manakah yang merupakan karakteristik algoritma yang baik?',
                'options' => ['Finiteness (berhenti dalam waktu terbatas)', 'Input tidak diperlukan', 'Definiteness (setiap langkah jelas)', 'Berjalan selamanya'],
                'correct' => [0, 2], // A dan C
            ],
        ];

        $soalPWIds  = $this->insertSoalPG($soalPW, $bankPW, $matkulPW->id);
        $soalBDIds  = $this->insertSoalPG($soalBD, $bankBD, $matkulBD->id);
        $soalAPpgIds = $this->insertSoalPG($soalAPpg, $bankAP, $matkulAP->id);
        $soalAPcbIds = $this->insertSoalCB($soalAPcb, $bankAP, $matkulAP->id);

        // ── Ujian ─────────────────────────────────────────────────
        $tanggal1 = Carbon::create(2026, 3, 15, 9, 0, 0);
        $tanggal2 = Carbon::create(2026, 3, 20, 13, 0, 0);
        $tanggal3 = Carbon::create(2026, 4, 2, 8, 0, 0);

        $ujian1Id = DB::table('ujian')->insertGetId([
            'created_by'     => $dosenId,
            'mata_kuliah_id' => $matkulPW->id,
            'nama_ujian'     => 'Quiz Pemrograman Web - Bab 3',
            'jenis_ujian'    => 'perkuliahan',
            'start_date'     => $tanggal1,
            'end_date'       => $tanggal1->copy()->addHours(2),
            'durasi_menit'   => 60,
            'kode_akses'     => 'QPWB301',
            'is_kode_aktif'  => false,
            'created_at'     => now(), 'updated_at' => now(),
        ]);

        $ujian2Id = DB::table('ujian')->insertGetId([
            'created_by'     => $dosenId,
            'mata_kuliah_id' => $matkulBD->id,
            'nama_ujian'     => 'Quiz Basis Data - Normalisasi',
            'jenis_ujian'    => 'perkuliahan',
            'start_date'     => $tanggal2,
            'end_date'       => $tanggal2->copy()->addHours(2),
            'durasi_menit'   => 60,
            'kode_akses'     => 'QBDN01',
            'is_kode_aktif'  => false,
            'created_at'     => now(), 'updated_at' => now(),
        ]);

        $ujian3Id = DB::table('ujian')->insertGetId([
            'created_by'     => $dosenId,
            'mata_kuliah_id' => $matkulAP->id,
            'nama_ujian'     => 'Quiz Algoritma - Sorting & Rekursi',
            'jenis_ujian'    => 'perkuliahan',
            'start_date'     => $tanggal3,
            'end_date'       => $tanggal3->copy()->addHours(2),
            'durasi_menit'   => 60,
            'kode_akses'     => 'QASR01',
            'is_kode_aktif'  => false,
            'created_at'     => now(), 'updated_at' => now(),
        ]);

        // Ujian Setting
        DB::table('ujian_setting')->insert([
            ['ujian_id' => $ujian1Id, 'randomize_soal' => false, 'max_attempt' => 1, 'passing_grade' => 65, 'proctoring_aktif' => false, 'created_at' => now(), 'updated_at' => now()],
            ['ujian_id' => $ujian2Id, 'randomize_soal' => false, 'max_attempt' => 1, 'passing_grade' => 65, 'proctoring_aktif' => false, 'created_at' => now(), 'updated_at' => now()],
            ['ujian_id' => $ujian3Id, 'randomize_soal' => false, 'max_attempt' => 1, 'passing_grade' => 65, 'proctoring_aktif' => false, 'created_at' => now(), 'updated_at' => now()],
        ]);

        // Grade Setting — tiap ujian bisa beda range
        $this->insertGradeSetting($ujian1Id, [
            ['A', 85, 100], ['B', 75, 84], ['C', 65, 74], ['D', 55, 64], ['E', 0, 54],
        ]);
        $this->insertGradeSetting($ujian2Id, [
            ['A', 90, 100], ['B', 80, 89], ['C', 70, 79], ['D', 60, 69], ['E', 0, 59],
        ]);
        $this->insertGradeSetting($ujian3Id, [
            ['A', 88, 100], ['B', 75, 87], ['C', 65, 74], ['D', 50, 64], ['E', 0, 49],
        ]);

        // ── Ujian Soal (link soal ke ujian) ───────────────────────
        $ujianSoalPW = $this->insertUjianSoal($ujian1Id, $soalPWIds);
        $ujianSoalBD = $this->insertUjianSoal($ujian2Id, $soalBDIds);

        // Ujian 3: gabungan PG + Checklist
        $ujianSoalAP = array_merge(
            $this->insertUjianSoal($ujian3Id, $soalAPpgIds),
            $this->insertUjianSoalCB($ujian3Id, $soalAPcbIds, count($soalAPpgIds))
        );

        // ── Hasil Ujian Natanael ───────────────────────────────────
        // Ujian 1 (PW): benar 5/6 = 83.3 → grade B, lulus
        $this->buatHasil(
            $natanaelId, $ujian1Id, $ujianSoalPW, $soalPWIds,
            [1, 1, 2, 2, 2, 3], // jawaban (semua PG)
            83.0, 'B', true,
            $tanggal1, $tanggal1->copy()->addMinutes(45)
        );

        // Ujian 2 (BD): benar 3/5 = 60 → grade C, lulus
        $this->buatHasil(
            $natanaelId, $ujian2Id, $ujianSoalBD, $soalBDIds,
            [2, 1, 0, 0, 1], // jawaban (no 4 salah)
            60.0, 'C', true,
            $tanggal2, $tanggal2->copy()->addMinutes(50)
        );

        // Ujian 3 (AP): PG 3/4 + CB 1/2 → 75 → grade B, lulus
        $this->buatHasilMix(
            $natanaelId, $ujian3Id,
            $ujianSoalAP,
            $soalAPpgIds, $soalAPcbIds,
            [2, 1, 2, 0],        // jawaban PG (no 4 salah)
            ['A,C', 'A,C'],      // jawaban checklist (no 2 salah → harusnya A,C tapi...)
            75.0, 'B', true,
            $tanggal3, $tanggal3->copy()->addMinutes(55)
        );
    }

    // ── Helpers ───────────────────────────────────────────────────

    private function insertGradeSetting(int $ujianId, array $grades): void
    {
        foreach ($grades as [$grade, $min, $max]) {
            DB::table('grade_setting')->insert([
                'ujian_id'   => $ujianId,
                'grade'      => $grade,
                'nilai_min'  => $min,
                'nilai_max'  => $max,
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }
    }

    private function insertSoalPG(array $soalList, int $bankSoalId, int $matkulId): array
    {
        $result = [];
        foreach ($soalList as $s) {
            $soalId = DB::table('soal')->insertGetId([
                'bank_soal_id'      => $bankSoalId,
                'mata_kuliah_id'    => $matkulId,
                'deskripsi'         => $s['q'],
                'tingkat_kesulitan' => 'sedang',
                'ai_generated'      => false,
                'created_at'        => now(), 'updated_at' => now(),
            ]);

            $jenisSoalId = DB::table('jenis_soal')->insertGetId([
                'soal_id'    => $soalId,
                'jenis_soal' => 'pilihan_ganda',
                'created_at' => now(), 'updated_at' => now(),
            ]);

            foreach ($s['a'] as $i => $teks) {
                DB::table('opsi_jawaban')->insert([
                    'jenis_soal_id' => $jenisSoalId,
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

    private function insertSoalCB(array $soalList, int $bankSoalId, int $matkulId): array
    {
        $result = [];
        foreach ($soalList as $s) {
            $soalId = DB::table('soal')->insertGetId([
                'bank_soal_id'      => $bankSoalId,
                'mata_kuliah_id'    => $matkulId,
                'deskripsi'         => $s['q'],
                'tingkat_kesulitan' => 'sedang',
                'ai_generated'      => false,
                'created_at'        => now(), 'updated_at' => now(),
            ]);

            $jenisSoalId = DB::table('jenis_soal')->insertGetId([
                'soal_id'    => $soalId,
                'jenis_soal' => 'checklist',
                'created_at' => now(), 'updated_at' => now(),
            ]);

            foreach ($s['options'] as $i => $teks) {
                DB::table('opsi_jawaban')->insert([
                    'jenis_soal_id' => $jenisSoalId,
                    'opsi'          => $this->opsiLabels[$i],
                    'teks'          => $teks,
                    'is_correct'    => in_array($i, $s['correct']),
                    'created_at'    => now(), 'updated_at' => now(),
                ]);
            }

            $kunci = implode(',', array_map(fn($idx) => $this->opsiLabels[$idx], $s['correct']));
            $result[] = ['soal_id' => $soalId, 'kunci' => $kunci, 'tipe' => 'checklist'];
        }
        return $result;
    }

    private function insertUjianSoal(int $ujianId, array $soalData, int $offset = 0): array
    {
        $ids = [];
        foreach ($soalData as $i => $s) {
            $ids[] = DB::table('ujian_soal')->insertGetId([
                'ujian_id'   => $ujianId,
                'soal_id'    => $s['soal_id'],
                'bobot'      => round(100 / count($soalData), 2),
                'urutan'     => $offset + $i + 1,
                'created_at' => now(), 'updated_at' => now(),
            ]);
        }
        return $ids;
    }

    private function insertUjianSoalCB(int $ujianId, array $soalData, int $offset): array
    {
        $ids = [];
        foreach ($soalData as $i => $s) {
            $ids[] = DB::table('ujian_soal')->insertGetId([
                'ujian_id'   => $ujianId,
                'soal_id'    => $s['soal_id'],
                'bobot'      => 12.5,
                'urutan'     => $offset + $i + 1,
                'created_at' => now(), 'updated_at' => now(),
            ]);
        }
        return $ids;
    }

    private function buatHasil(int $userId, int $ujianId, array $ujianSoalIds, array $soalData, array $jawabanIdx, float $nilaiTotal, string $grade, bool $lulus, Carbon $mulai, Carbon $selesai): void
    {
        $pesertaId = DB::table('peserta_ujian')->insertGetId([
            'ujian_id'   => $ujianId,
            'user_id'    => $userId,
            'attempt_ke' => 1,
            'status'     => 'selesai',
            'mulai_at'   => $mulai,
            'selesai_at' => $selesai,
            'created_at' => now(), 'updated_at' => now(),
        ]);

        $bobot = round(100 / count($ujianSoalIds), 2);
        foreach ($ujianSoalIds as $i => $ujianSoalId) {
            $jawaban = $this->opsiLabels[$jawabanIdx[$i]];
            $benar   = ($jawabanIdx[$i] === $soalData[$i]['correct']);
            DB::table('jawaban_peserta')->insert([
                'peserta_ujian_id' => $pesertaId,
                'ujian_soal_id'    => $ujianSoalId,
                'jawaban'          => $jawaban,
                'nilai'            => $benar ? $bobot : 0,
                'is_manual_graded' => false,
                'final_nilai'      => $benar ? $bobot : 0,
                'created_at'       => now(), 'updated_at' => now(),
            ]);
        }

        DB::table('nilai_akhir')->insert([
            'peserta_ujian_id' => $pesertaId,
            'nilai_total'      => $nilaiTotal,
            'lulus'            => $lulus,
            'grade'            => $grade,
            'graded_at'        => $selesai,
            'created_at'       => now(), 'updated_at' => now(),
        ]);
    }

    private function buatHasilMix(int $userId, int $ujianId, array $ujianSoalIds, array $soalPGData, array $soalCBData, array $jawabanPGIdx, array $jawabanCB, float $nilaiTotal, string $grade, bool $lulus, Carbon $mulai, Carbon $selesai): void
    {
        $pesertaId = DB::table('peserta_ujian')->insertGetId([
            'ujian_id'   => $ujianId,
            'user_id'    => $userId,
            'attempt_ke' => 1,
            'status'     => 'selesai',
            'mulai_at'   => $mulai,
            'selesai_at' => $selesai,
            'created_at' => now(), 'updated_at' => now(),
        ]);

        $pgBobot = round(100 / count($soalPGData) / 1.5, 2);
        $cbBobot = round(100 / count($soalCBData) / 1.5, 2);

        // Jawaban PG
        foreach ($soalPGData as $i => $s) {
            $jawaban = $this->opsiLabels[$jawabanPGIdx[$i]];
            $benar   = ($jawabanPGIdx[$i] === $s['correct']);
            DB::table('jawaban_peserta')->insert([
                'peserta_ujian_id' => $pesertaId,
                'ujian_soal_id'    => $ujianSoalIds[$i],
                'jawaban'          => $jawaban,
                'nilai'            => $benar ? $pgBobot : 0,
                'is_manual_graded' => false,
                'final_nilai'      => $benar ? $pgBobot : 0,
                'created_at'       => now(), 'updated_at' => now(),
            ]);
        }

        // Jawaban Checklist
        $pgCount = count($soalPGData);
        foreach ($soalCBData as $i => $s) {
            $jawaban = $jawabanCB[$i];
            $benar   = ($jawaban === $s['kunci']);
            DB::table('jawaban_peserta')->insert([
                'peserta_ujian_id' => $pesertaId,
                'ujian_soal_id'    => $ujianSoalIds[$pgCount + $i],
                'jawaban'          => $jawaban,
                'nilai'            => $benar ? $cbBobot : 0,
                'is_manual_graded' => false,
                'final_nilai'      => $benar ? $cbBobot : 0,
                'created_at'       => now(), 'updated_at' => now(),
            ]);
        }

        DB::table('nilai_akhir')->insert([
            'peserta_ujian_id' => $pesertaId,
            'nilai_total'      => $nilaiTotal,
            'lulus'            => $lulus,
            'grade'            => $grade,
            'graded_at'        => $selesai,
            'created_at'       => now(), 'updated_at' => now(),
        ]);
    }
}
