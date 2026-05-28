<?php

namespace Database\Seeders\Universitas\Trisakti;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class ProdiSeeder extends Seeder
{
    public function run(): void
    {
        $fakultas = DB::table('fakultas')->pluck('id', 'kode');

        $data = [
            'TRFTI' => [
                ['nama' => 'Teknik Informatika', 'kode' => 'TRTI',  'nim_prefix' => '702', 'krs_mulai_semester' => 4],
                ['nama' => 'Teknik Elektro',     'kode' => 'TRTE',  'nim_prefix' => '703', 'krs_mulai_semester' => 3],
                ['nama' => 'Teknik Mesin',       'kode' => 'TRTM',  'nim_prefix' => '704', 'krs_mulai_semester' => 3],
                ['nama' => 'Teknik Industri',    'kode' => 'TRTIN', 'nim_prefix' => '705', 'krs_mulai_semester' => 3],
            ],
            'TRFTS' => [
                ['nama' => 'Teknik Sipil', 'kode' => 'TRTS',  'nim_prefix' => '706', 'krs_mulai_semester' => 3],
                ['nama' => 'Arsitektur',   'kode' => 'TRARS', 'nim_prefix' => '707', 'krs_mulai_semester' => 3],
            ],
            'TRFEB' => [
                ['nama' => 'Manajemen',  'kode' => 'TRMJ', 'nim_prefix' => '708', 'krs_mulai_semester' => 3],
                ['nama' => 'Akuntansi',  'kode' => 'TRAK', 'nim_prefix' => '709', 'krs_mulai_semester' => 3],
            ],
            'TRFH' => [
                ['nama' => 'Ilmu Hukum', 'kode' => 'TRIH', 'nim_prefix' => '710', 'krs_mulai_semester' => 3],
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
