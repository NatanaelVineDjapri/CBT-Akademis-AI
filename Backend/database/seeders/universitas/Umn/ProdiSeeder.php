<?php

namespace Database\Seeders\Universitas\Umn;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class ProdiSeeder extends Seeder
{
    public function run(): void
    {
        $fakultas = DB::table('fakultas')->pluck('id', 'kode');

        $data = [
            'UFTI' => [
                ['nama' => 'Teknik Informatika', 'kode' => 'UTI',  'nim_prefix' => '810', 'krs_mulai_semester' => 4],
                ['nama' => 'Sistem Informasi',   'kode' => 'USI',  'nim_prefix' => '811', 'krs_mulai_semester' => 4],
                ['nama' => 'Teknik Komputer',    'kode' => 'UTKE', 'nim_prefix' => '812', 'krs_mulai_semester' => 4],
            ],
            'UFB' => [
                ['nama' => 'Manajemen',  'kode' => 'UMNJ', 'nim_prefix' => '820', 'krs_mulai_semester' => 3],
                ['nama' => 'Akuntansi',  'kode' => 'UAKT', 'nim_prefix' => '821', 'krs_mulai_semester' => 3],
            ],
            'UFIK' => [
                ['nama' => 'Ilmu Komunikasi', 'kode' => 'UIK', 'nim_prefix' => '830', 'krs_mulai_semester' => 3],
                ['nama' => 'Jurnalistik',     'kode' => 'UJR', 'nim_prefix' => '831', 'krs_mulai_semester' => 3],
            ],
            'UFSD' => [
                ['nama' => 'Desain Komunikasi Visual', 'kode' => 'UDKV', 'nim_prefix' => '840', 'krs_mulai_semester' => 3],
                ['nama' => 'Desain Interior',          'kode' => 'UDIN', 'nim_prefix' => '841', 'krs_mulai_semester' => 3],
                ['nama' => 'Film',                     'kode' => 'UFLM', 'nim_prefix' => '842', 'krs_mulai_semester' => 3],
            ],
            'UFHU' => [
                ['nama' => 'Ilmu Hukum', 'kode' => 'UIH', 'nim_prefix' => '850', 'krs_mulai_semester' => 3],
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
