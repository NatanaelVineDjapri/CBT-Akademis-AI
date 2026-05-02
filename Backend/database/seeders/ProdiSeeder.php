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

        $data = [
            'FTI' => [
                ['nama' => 'Teknik Informatika', 'kode' => 'TI'],
                ['nama' => 'Sistem Informasi',   'kode' => 'SI'],
            ],

            'FT' => [
                ['nama' => 'Teknik Sipil',      'kode' => 'TS'],
                ['nama' => 'Teknik Mesin',      'kode' => 'TM'],
                ['nama' => 'Teknik Elektro',    'kode' => 'TE'],
                ['nama' => 'Arsitektur',        'kode' => 'ARS'],
            ],

            'FEB' => [
                ['nama' => 'Manajemen',         'kode' => 'MAN'],
                ['nama' => 'Akuntansi',         'kode' => 'AKT'],
            ],

            'FH' => [
                ['nama' => 'Ilmu Hukum',        'kode' => 'IH'],
            ],

            'FK' => [
                ['nama' => 'Pendidikan Dokter', 'kode' => 'PD'],
            ],

            'FSRD' => [
                ['nama' => 'Desain Komunikasi Visual', 'kode' => 'DKV'],
                ['nama' => 'Desain Interior',          'kode' => 'DI'],
            ],

            'FPSI' => [
                ['nama' => 'Psikologi',         'kode' => 'PSI'],
            ],

            'FIKOM' => [
                ['nama' => 'Ilmu Komunikasi',   'kode' => 'IK'],
            ],
        ];

        $insertData = [];

        foreach ($data as $kodeFakultas => $prodis) {
            foreach ($prodis as $prodi) {
                $insertData[] = [
                    'fakultas_id' => $fakultas[$kodeFakultas],
                    'nama'        => $prodi['nama'],
                    'kode'        => $prodi['kode'],
                    'created_at'  => now(),
                    'updated_at'  => now(),
                ];
            }
        }

        DB::table('prodi')->insert($insertData);
    }
}