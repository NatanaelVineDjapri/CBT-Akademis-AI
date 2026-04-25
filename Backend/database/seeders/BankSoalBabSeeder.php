<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class BankSoalBabSeeder extends Seeder
{
    public function run(): void
    {
        $dosenId = DB::table('users')->where('email', 'irvan.lewenusa@untar.ac.id')->value('id');

        $matkulPW  = DB::table('mata_kuliah')->where('kode', 'TI301')->first();
        $matkulBD  = DB::table('mata_kuliah')->where('kode', 'TI302')->first();
        $matkulAP  = DB::table('mata_kuliah')->where('kode', 'TI101')->first();
        $matkulSO  = DB::table('mata_kuliah')->where('kode', 'TI201')->first();
        $matkulJK  = DB::table('mata_kuliah')->where('kode', 'TI202')->first();

        // ── Bab ──────────────────────────────────────────────────────
        $babData = [
            $matkulPW->id => [
                ['nama_bab' => 'Dasar HTML & CSS',         'urutan' => 1],
                ['nama_bab' => 'JavaScript Dasar',          'urutan' => 2],
                ['nama_bab' => 'DOM & Event Handling',      'urutan' => 3],
                ['nama_bab' => 'HTTP & REST API',           'urutan' => 4],
                ['nama_bab' => 'Framework Frontend',        'urutan' => 5],
            ],
            $matkulBD->id => [
                ['nama_bab' => 'Pengenalan Basis Data',     'urutan' => 1],
                ['nama_bab' => 'DDL & DML',                 'urutan' => 2],
                ['nama_bab' => 'JOIN & Subquery',           'urutan' => 3],
                ['nama_bab' => 'Normalisasi',               'urutan' => 4],
                ['nama_bab' => 'Transaksi & Concurrency',   'urutan' => 5],
            ],
            $matkulAP->id => [
                ['nama_bab' => 'Dasar Algoritma',           'urutan' => 1],
                ['nama_bab' => 'Tipe Data & Variabel',      'urutan' => 2],
                ['nama_bab' => 'Percabangan',               'urutan' => 3],
                ['nama_bab' => 'Perulangan',                'urutan' => 4],
                ['nama_bab' => 'Fungsi & Rekursi',          'urutan' => 5],
            ],
            $matkulSO->id => [
                ['nama_bab' => 'Pengenalan Sistem Operasi', 'urutan' => 1],
                ['nama_bab' => 'Manajemen Proses',          'urutan' => 2],
                ['nama_bab' => 'Manajemen Memori',          'urutan' => 3],
                ['nama_bab' => 'Sistem File',               'urutan' => 4],
            ],
            $matkulJK->id => [
                ['nama_bab' => 'Model OSI & TCP/IP',        'urutan' => 1],
                ['nama_bab' => 'Pengalamatan IP',           'urutan' => 2],
                ['nama_bab' => 'Routing & Switching',       'urutan' => 3],
                ['nama_bab' => 'Keamanan Jaringan',         'urutan' => 4],
            ],
        ];

        $babIds = [];
        foreach ($babData as $matkulId => $babs) {
            $babIds[$matkulId] = [];
            foreach ($babs as $bab) {
                $id = DB::table('bab')->insertGetId([
                    'mata_kuliah_id' => $matkulId,
                    'nama_bab'       => $bab['nama_bab'],
                    'urutan'         => $bab['urutan'],
                    'created_at'     => now(),
                    'updated_at'     => now(),
                ]);
                $babIds[$matkulId][] = $id;
            }
        }

        // ── Bank Soal per Bab ─────────────────────────────────────────
        $bankSoalData = [
            // Pemrograman Web
            ['matkul_id' => $matkulPW->id, 'bab_urutan' => 0, 'nama' => 'Bank Soal HTML & CSS - Dasar',       'permission' => 'public'],
            ['matkul_id' => $matkulPW->id, 'bab_urutan' => 1, 'nama' => 'Bank Soal JavaScript - Dasar',       'permission' => 'private'],
            ['matkul_id' => $matkulPW->id, 'bab_urutan' => 3, 'nama' => 'Bank Soal HTTP & REST API',          'permission' => 'public'],

            // Basis Data
            ['matkul_id' => $matkulBD->id, 'bab_urutan' => 0, 'nama' => 'Bank Soal Pengenalan Basis Data',   'permission' => 'public'],
            ['matkul_id' => $matkulBD->id, 'bab_urutan' => 1, 'nama' => 'Bank Soal DDL & DML',               'permission' => 'private'],
            ['matkul_id' => $matkulBD->id, 'bab_urutan' => 2, 'nama' => 'Bank Soal JOIN & Subquery',         'permission' => 'shared'],

            // Algoritma dan Pemrograman
            ['matkul_id' => $matkulAP->id, 'bab_urutan' => 0, 'nama' => 'Bank Soal Dasar Algoritma',         'permission' => 'public'],
            ['matkul_id' => $matkulAP->id, 'bab_urutan' => 2, 'nama' => 'Bank Soal Percabangan',             'permission' => 'private'],
            ['matkul_id' => $matkulAP->id, 'bab_urutan' => 4, 'nama' => 'Bank Soal Fungsi & Rekursi',        'permission' => 'private'],

            // Sistem Operasi
            ['matkul_id' => $matkulSO->id, 'bab_urutan' => 0, 'nama' => 'Bank Soal Pengenalan SO',           'permission' => 'public'],
            ['matkul_id' => $matkulSO->id, 'bab_urutan' => 1, 'nama' => 'Bank Soal Manajemen Proses',        'permission' => 'private'],

            // Jaringan Komputer
            ['matkul_id' => $matkulJK->id, 'bab_urutan' => 0, 'nama' => 'Bank Soal OSI & TCP/IP',            'permission' => 'public'],
            ['matkul_id' => $matkulJK->id, 'bab_urutan' => 1, 'nama' => 'Bank Soal Pengalamatan IP',         'permission' => 'private'],
        ];

        foreach ($bankSoalData as $bs) {
            $babId = $babIds[$bs['matkul_id']][$bs['bab_urutan']];

            $bankSoalId = DB::table('bank_soal')->insertGetId([
                'created_by'     => $dosenId,
                'mata_kuliah_id' => $bs['matkul_id'],
                'bab_id'         => $babId,
                'nama'           => $bs['nama'],
                'deskripsi'      => null,
                'permission'     => $bs['permission'],
                'created_at'     => now(),
                'updated_at'     => now(),
            ]);

            // Seed beberapa soal dummy per bank soal
            $this->insertSoalDummy($bankSoalId, $bs['matkul_id'], $babId, $bs['nama']);
        }
    }

    private function insertSoalDummy(int $bankSoalId, int $matkulId, int $babId, string $bankSoalNama): void
    {
        $soalList = [
            [
                'q' => "Soal 1 dari {$bankSoalNama}",
                'a' => ['Pilihan A', 'Pilihan B (Benar)', 'Pilihan C', 'Pilihan D'],
                'correct' => 1,
            ],
            [
                'q' => "Soal 2 dari {$bankSoalNama}",
                'a' => ['Jawaban Salah', 'Jawaban Salah', 'Jawaban Salah', 'Jawaban Benar'],
                'correct' => 3,
            ],
            [
                'q' => "Soal 3 dari {$bankSoalNama}",
                'a' => ['Opsi Benar', 'Opsi Salah', 'Opsi Salah', 'Opsi Salah'],
                'correct' => 0,
            ],
        ];

        $opsiLabels = ['A', 'B', 'C', 'D'];

        foreach ($soalList as $s) {
            $soalId = DB::table('soal')->insertGetId([
                'bank_soal_id'      => $bankSoalId,
                'mata_kuliah_id'    => $matkulId,
                'bab_id'            => $babId,
                'deskripsi'         => $s['q'],
                'tingkat_kesulitan' => 'sedang',
                'ai_generated'      => false,
                'created_at'        => now(),
                'updated_at'        => now(),
            ]);

            $jenisSoalId = DB::table('jenis_soal')->insertGetId([
                'soal_id'    => $soalId,
                'jenis_soal' => 'pilihan_ganda',
                'created_at' => now(),
                'updated_at' => now(),
            ]);

            foreach ($s['a'] as $i => $teks) {
                DB::table('opsi_jawaban')->insert([
                    'jenis_soal_id' => $jenisSoalId,
                    'opsi'          => $opsiLabels[$i],
                    'teks'          => $teks,
                    'is_correct'    => ($i === $s['correct']),
                    'created_at'    => now(),
                    'updated_at'    => now(),
                ]);
            }
        }
    }
}
