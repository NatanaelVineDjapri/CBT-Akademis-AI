<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class DemoSeeder extends Seeder
{
    public function run(): void
    {
        //Ambil data existing 
        $prodiTI    = DB::table('prodi')->where('kode', 'TI')->first();
        $dosenId    = DB::table('users')->where('email', 'irvan.lewenusa@untar.ac.id')->value('id');
        $natanaelId = DB::table('users')->where('nim', '535240042')->value('id');
        $mhs2Id     = DB::table('users')->where('nim', '535240005')->value('id');
        $mhs3Id     = DB::table('users')->where('nim', '535240003')->value('id');

        // Mata Kuliah (30 total)
        $allMatkul = [
            ['nama' => 'Pemrograman Web',               'kode' => 'TI301'],
            ['nama' => 'Basis Data',                     'kode' => 'TI302'],
            ['nama' => 'Algoritma dan Pemrograman',      'kode' => 'TI101'],
            ['nama' => 'Struktur Data',                  'kode' => 'TI102'],
            ['nama' => 'Sistem Operasi',                 'kode' => 'TI201'],
            ['nama' => 'Jaringan Komputer',              'kode' => 'TI202'],
            ['nama' => 'Pemrograman Berorientasi Objek', 'kode' => 'TI203'],
            ['nama' => 'Rekayasa Perangkat Lunak',       'kode' => 'TI204'],
            ['nama' => 'Kecerdasan Buatan',              'kode' => 'TI401'],
            ['nama' => 'Machine Learning',               'kode' => 'TI402'],
            ['nama' => 'Pengolahan Citra Digital',       'kode' => 'TI403'],
            ['nama' => 'Keamanan Sistem Informasi',      'kode' => 'TI404'],
            ['nama' => 'Pemrograman Mobile',             'kode' => 'TI303'],
            ['nama' => 'Cloud Computing',                'kode' => 'TI405'],
            ['nama' => 'Data Mining',                    'kode' => 'TI406'],
            ['nama' => 'Interaksi Manusia Komputer',     'kode' => 'TI304'],
            ['nama' => 'Matematika Diskrit',             'kode' => 'TI103'],
            ['nama' => 'Kalkulus',                       'kode' => 'TI104'],
            ['nama' => 'Statistika dan Probabilitas',    'kode' => 'TI105'],
            ['nama' => 'Logika Matematika',              'kode' => 'TI106'],
            ['nama' => 'Sistem Informasi',               'kode' => 'TI205'],
            ['nama' => 'Basis Data Lanjut',              'kode' => 'TI305'],
            ['nama' => 'Pemrograman Fungsional',         'kode' => 'TI306'],
            ['nama' => 'Arsitektur Komputer',            'kode' => 'TI206'],
            ['nama' => 'Kompilator',                     'kode' => 'TI407'],
            ['nama' => 'Grafika Komputer',               'kode' => 'TI408'],
            ['nama' => 'Internet of Things',             'kode' => 'TI409'],
            ['nama' => 'Big Data Analytics',             'kode' => 'TI410'],
            ['nama' => 'DevOps',                         'kode' => 'TI411'],
            ['nama' => 'Etika Profesi TI',               'kode' => 'TI001'],
        ];

        $insertMatkul = array_map(fn($m) => [
            'nama'       => $m['nama'],
            'kode'       => $m['kode'],
            'prodi_id'   => $prodiTI->id,
            'created_at' => now(),
            'updated_at' => now(),
        ], $allMatkul);

        DB::table('mata_kuliah')->insertOrIgnore($insertMatkul);

        $matkul1Id = DB::table('mata_kuliah')->where('kode', 'TI301')->value('id');
        $matkul2Id = DB::table('mata_kuliah')->where('kode', 'TI302')->value('id');

        $allMatkulIds = DB::table('mata_kuliah')
            ->whereIn('kode', array_column($allMatkul, 'kode'))
            ->pluck('id')
            ->toArray();

        // Dosen Matkul (semua ke Budi Santoso)
        $dosenMatkulInsert = array_map(fn($id) => [
            'user_id'        => $dosenId,
            'mata_kuliah_id' => $id,
            'tahun_ajaran'   => '2025/2026',
            'created_at'     => now(),
            'updated_at'     => now(),
        ], $allMatkulIds);

        DB::table('dosen_matkul')->insertOrIgnore($dosenMatkulInsert);

        // User Mata Kuliah — Natanael dapat semua 30, mhs lain hanya 2
        $natanaelMatkul = array_map(fn($id) => [
            'user_id'        => $natanaelId,
            'mata_kuliah_id' => $id,
            'tahun_ajaran'   => '2025/2026',
            'is_aktif'       => true,
            'created_at'     => now(),
            'updated_at'     => now(),
        ], $allMatkulIds);

        DB::table('user_mata_kuliah')->insertOrIgnore($natanaelMatkul);

        foreach ([$mhs2Id, $mhs3Id] as $mhsId) {
            DB::table('user_mata_kuliah')->insertOrIgnore([
                ['user_id' => $mhsId, 'mata_kuliah_id' => $matkul1Id, 'tahun_ajaran' => '2025/2026', 'is_aktif' => true, 'created_at' => now(), 'updated_at' => now()],
                ['user_id' => $mhsId, 'mata_kuliah_id' => $matkul2Id, 'tahun_ajaran' => '2025/2026', 'is_aktif' => true, 'created_at' => now(), 'updated_at' => now()],
            ]);
        }

        //Bank Soal 
        $bankSoal1Id = DB::table('bank_soal')->insertGetId([
            'created_by'     => $dosenId,
            'mata_kuliah_id' => $matkul1Id,
            'nama'           => 'Bank Soal Pemrograman Web - Semester Genap 2025/2026',
            'deskripsi'      => 'Kumpulan soal UTS dan UAS Pemrograman Web',
            'permission'     => 'private',
            'created_at'     => now(), 'updated_at' => now(),
        ]);

        $bankSoal2Id = DB::table('bank_soal')->insertGetId([
            'created_by'     => $dosenId,
            'mata_kuliah_id' => $matkul2Id,
            'nama'           => 'Bank Soal Basis Data - Semester Genap 2025/2026',
            'deskripsi'      => 'Kumpulan soal UTS dan UAS Basis Data',
            'permission'     => 'private',
            'created_at'     => now(), 'updated_at' => now(),
        ]);

        //Soal Pemrograman Web 
        $soalPW = [
            ['q' => 'Apa kepanjangan dari HTML?', 'a' => ['HyperText Markup Language', 'HyperText Machine Language', 'Home Tool Markup Language', 'Hyperlinks Text Markup Language'], 'correct' => 0],
            ['q' => 'Tag HTML yang digunakan untuk membuat tautan adalah?', 'a' => ['<link>', '<a>', '<href>', '<url>'], 'correct' => 1],
            ['q' => 'CSS adalah singkatan dari?', 'a' => ['Computer Style Sheets', 'Creative Style Sheets', 'Cascading Style Sheets', 'Colorful Style Sheets'], 'correct' => 2],
            ['q' => 'Properti CSS untuk mengubah warna teks adalah?', 'a' => ['text-color', 'font-color', 'color', 'foreground-color'], 'correct' => 2],
            ['q' => 'Method HTTP yang digunakan untuk mengirim data form secara aman adalah?', 'a' => ['GET', 'POST', 'PUT', 'DELETE'], 'correct' => 1],
        ];

        $soalPWIds = $this->insertSoal($soalPW, $bankSoal1Id, $matkul1Id);

        //Soal Basis Data 
        $soalBD = [
            ['q' => 'SQL adalah singkatan dari?', 'a' => ['Structured Query Language', 'Simple Query Language', 'Standard Query Language', 'Sequential Query Language'], 'correct' => 0],
            ['q' => 'Perintah SQL untuk mengambil data adalah?', 'a' => ['GET', 'FETCH', 'SELECT', 'RETRIEVE'], 'correct' => 2],
            ['q' => 'Primary Key berfungsi untuk?', 'a' => ['Mengenkripsi data', 'Mengidentifikasi record secara unik', 'Menghubungkan dua tabel', 'Mengurutkan data'], 'correct' => 1],
            ['q' => 'Perintah untuk menghapus tabel adalah?', 'a' => ['DELETE TABLE', 'REMOVE TABLE', 'DROP TABLE', 'ERASE TABLE'], 'correct' => 2],
            ['q' => 'JOIN yang menampilkan semua record dari kedua tabel adalah?', 'a' => ['INNER JOIN', 'LEFT JOIN', 'RIGHT JOIN', 'FULL OUTER JOIN'], 'correct' => 3],
        ];

        $soalBDIds = $this->insertSoal($soalBD, $bankSoal2Id, $matkul2Id);

        //Ujian 
        $ujian1Id = DB::table('ujian')->insertGetId([
            'created_by'     => $dosenId,
            'mata_kuliah_id' => $matkul1Id,
            'nama_ujian'     => 'UTS Pemrograman Web 2025/2026',
            'jenis_ujian'    => 'perkuliahan',
            'start_date'     => Carbon::create(2026, 3, 10, 8, 0, 0),
            'end_date'       => Carbon::create(2026, 3, 10, 10, 0, 0),
            'durasi_menit'   => 90,
            'kode_akses'     => 'PWUTS26',
            'is_kode_aktif'  => false,
            'created_at'     => now(), 'updated_at' => now(),
        ]);

        $ujian2Id = DB::table('ujian')->insertGetId([
            'created_by'     => $dosenId,
            'mata_kuliah_id' => $matkul2Id,
            'nama_ujian'     => 'UTS Basis Data 2025/2026',
            'jenis_ujian'    => 'perkuliahan',
            'start_date'     => Carbon::create(2026, 3, 12, 8, 0, 0),
            'end_date'       => Carbon::create(2026, 3, 12, 10, 0, 0),
            'durasi_menit'   => 90,
            'kode_akses'     => 'BDUTS26',
            'is_kode_aktif'  => false,
            'created_at'     => now(), 'updated_at' => now(),
        ]);

        // Ujian Setting 
        DB::table('ujian_setting')->insert([
            ['ujian_id' => $ujian1Id, 'randomize_soal' => true, 'max_attempt' => 1, 'passing_grade' => 60, 'proctoring_aktif' => false, 'created_at' => now(), 'updated_at' => now()],
            ['ujian_id' => $ujian2Id, 'randomize_soal' => true, 'max_attempt' => 1, 'passing_grade' => 60, 'proctoring_aktif' => false, 'created_at' => now(), 'updated_at' => now()],
        ]);

        // Ujian Soal 
        $ujianSoalPW = [];
        foreach ($soalPWIds as $i => $s) {
            $ujianSoalPW[] = DB::table('ujian_soal')->insertGetId([
                'ujian_id' => $ujian1Id, 'soal_id' => $s['soal_id'],
                'bobot' => 20, 'urutan' => $i + 1,
                'created_at' => now(), 'updated_at' => now(),
            ]);
        }

        $ujianSoalBD = [];
        foreach ($soalBDIds as $i => $s) {
            $ujianSoalBD[] = DB::table('ujian_soal')->insertGetId([
                'ujian_id' => $ujian2Id, 'soal_id' => $s['soal_id'],
                'bobot' => 20, 'urutan' => $i + 1,
                'created_at' => now(), 'updated_at' => now(),
            ]);
        }

        // Hasil Ujian 
        // Natanael: PW=80(B lulus), BD=60(C lulus)
        $this->buatHasil($natanaelId, $ujian1Id, $ujianSoalPW, $soalPWIds, [0,1,2,2,1], 80.0, 'B', true, Carbon::create(2026,3,10,8,5), Carbon::create(2026,3,10,9,20));
        $this->buatHasil($natanaelId, $ujian2Id, $ujianSoalBD, $soalBDIds, [0,2,1,2,3], 60.0, 'C', true, Carbon::create(2026,3,12,8,10), Carbon::create(2026,3,12,9,15));

        // Andi: PW=100(A lulus), BD=40(D tidak lulus)
        $this->buatHasil($mhs2Id, $ujian1Id, $ujianSoalPW, $soalPWIds, [0,1,2,2,1], 100.0, 'A', true, Carbon::create(2026,3,10,8,3), Carbon::create(2026,3,10,9,0));
        $this->buatHasil($mhs2Id, $ujian2Id, $ujianSoalBD, $soalBDIds, [0,2,1,2,0], 40.0, 'D', false, Carbon::create(2026,3,12,8,5), Carbon::create(2026,3,12,9,30));

        // Siti: PW=60(C lulus), BD=80(B lulus)
        $this->buatHasil($mhs3Id, $ujian1Id, $ujianSoalPW, $soalPWIds, [0,1,2,2,0], 60.0, 'C', true, Carbon::create(2026,3,10,8,8), Carbon::create(2026,3,10,9,35));
        $this->buatHasil($mhs3Id, $ujian2Id, $ujianSoalBD, $soalBDIds, [0,2,1,2,3], 80.0, 'B', true, Carbon::create(2026,3,12,8,2), Carbon::create(2026,3,12,9,0));
    }

    private function insertSoal(array $soalList, int $bankSoalId, int $matkulId): array
    {
        $result = [];
        $opsiLabels = ['A', 'B', 'C', 'D'];
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
                    'opsi'          => $opsiLabels[$i],
                    'teks'          => $teks,
                    'is_correct'    => ($i === $s['correct']),
                    'created_at'    => now(), 'updated_at' => now(),
                ]);
            }

            $result[] = ['soal_id' => $soalId, 'correct' => $s['correct']];
        }
        return $result;
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

        $opsiLabels = ['A', 'B', 'C', 'D'];
        foreach ($ujianSoalIds as $i => $ujianSoalId) {
            $benar = ($jawabanIdx[$i] === $soalData[$i]['correct']);
            DB::table('jawaban_peserta')->insert([
                'peserta_ujian_id' => $pesertaId,
                'ujian_soal_id'    => $ujianSoalId,
                'jawaban'          => $opsiLabels[$jawabanIdx[$i]],
                'nilai'            => $benar ? 20 : 0,
                'is_manual_graded' => false,
                'final_nilai'      => $benar ? 20 : 0,
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
