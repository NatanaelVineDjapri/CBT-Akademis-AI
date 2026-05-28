<?php

namespace Database\Seeders\Universitas\Uph;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class ProdiSeeder extends Seeder
{
    public function run(): void
    {
        $fakultas = DB::table('fakultas')->pluck('id', 'kode');

        $data = [
            'PFTI' => [
                ['nama' => 'Teknik Informatika', 'kode' => 'PHTI',  'nim_prefix' => '600', 'krs_mulai_semester' => 4],
                ['nama' => 'Sistem Informasi',   'kode' => 'PHSIS', 'nim_prefix' => '601', 'krs_mulai_semester' => 4],
            ],
            'PFB' => [
                ['nama' => 'Manajemen',  'kode' => 'PHMJ', 'nim_prefix' => '602', 'krs_mulai_semester' => 3],
                ['nama' => 'Akuntansi',  'kode' => 'PHAK', 'nim_prefix' => '603', 'krs_mulai_semester' => 3],
            ],
            'PFIK' => [
                ['nama' => 'Ilmu Komunikasi', 'kode' => 'PHIK', 'nim_prefix' => '604', 'krs_mulai_semester' => 3],
            ],
            'PFHK' => [
                ['nama' => 'Ilmu Hukum', 'kode' => 'PHIH', 'nim_prefix' => '605', 'krs_mulai_semester' => 3],
            ],
            'PFKD' => [
                ['nama' => 'Pendidikan Dokter', 'kode' => 'PHKD', 'nim_prefix' => '606', 'krs_mulai_semester' => 3],
            ],
            'PFSD' => [
                ['nama' => 'Desain Komunikasi Visual', 'kode' => 'PHDKV', 'nim_prefix' => '607', 'krs_mulai_semester' => 3],
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
