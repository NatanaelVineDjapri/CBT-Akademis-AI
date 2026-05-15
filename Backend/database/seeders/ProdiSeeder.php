<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class ProdiSeeder extends Seeder
{
    public function run(): void
    {
        // Ambil semua fakultas berdasarkan kode
        $fakultas = DB::table('fakultas')
            ->pluck('id', 'kode'); // ['FTI' => 1, ...]

        // krs_mulai_semester: semester pertama mahasiswa boleh isi KRS sendiri
        $data = [
            'FTI' => [
                ['nama' => 'Teknik Informatika', 'kode' => 'TI',  'nim_prefix' => '535', 'krs_mulai_semester' => 4],
                ['nama' => 'Sistem Informasi',   'kode' => 'SI',  'nim_prefix' => '536', 'krs_mulai_semester' => 4],
            ],

            'FT' => [
                ['nama' => 'Teknik Sipil',    'kode' => 'TS',  'nim_prefix' => '312', 'krs_mulai_semester' => 3],
                ['nama' => 'Teknik Mesin',    'kode' => 'TM',  'nim_prefix' => '314', 'krs_mulai_semester' => 3],
                ['nama' => 'Teknik Elektro',  'kode' => 'TE',  'nim_prefix' => '313', 'krs_mulai_semester' => 3],
                ['nama' => 'Teknik Industri', 'kode' => 'TIN', 'nim_prefix' => '315', 'krs_mulai_semester' => 3],
                ['nama' => 'Arsitektur',      'kode' => 'ARS', 'nim_prefix' => '316', 'krs_mulai_semester' => 3],
            ],

            'FEB' => [
                ['nama' => 'Manajemen',  'kode' => 'MNJ', 'nim_prefix' => '621', 'krs_mulai_semester' => 3],
                ['nama' => 'Akuntansi',  'kode' => 'AKT', 'nim_prefix' => '622', 'krs_mulai_semester' => 3],
            ],

            'FH' => [
                ['nama' => 'Ilmu Hukum', 'kode' => 'IH', 'nim_prefix' => '741', 'krs_mulai_semester' => 3],
            ],

            'FK' => [
                ['nama' => 'Pendidikan Dokter', 'kode' => 'KD', 'nim_prefix' => '911', 'krs_mulai_semester' => 3],
            ],

            'FSRD' => [
                ['nama' => 'Desain Komunikasi Visual', 'kode' => 'DKV', 'nim_prefix' => '213', 'krs_mulai_semester' => 3],
                ['nama' => 'Desain Interior',          'kode' => 'DI',  'nim_prefix' => '212', 'krs_mulai_semester' => 3],
            ],

            'FPSI' => [
                ['nama' => 'Psikologi', 'kode' => 'PSI', 'nim_prefix' => '732', 'krs_mulai_semester' => 3],
            ],

            'FIKOM' => [
                ['nama' => 'Ilmu Komunikasi', 'kode' => 'IK', 'nim_prefix' => '701', 'krs_mulai_semester' => 2],
            ],
        ];

        $insertData = [];

        foreach ($data as $kodeFakultas => $prodis) {
            foreach ($prodis as $prodi) {
                $insertData[] = [
                    'fakultas_id'        => $fakultas[$kodeFakultas],
                    'nama'               => $prodi['nama'],
                    'kode'               => $prodi['kode'],
                    'nim_prefix'         => $prodi['nim_prefix'],
                    'krs_mulai_semester' => $prodi['krs_mulai_semester'],
                    'created_at'         => now(),
                    'updated_at'         => now(),
                ];
            }
        }

        DB::table('prodi')->insert($insertData);
    }
}