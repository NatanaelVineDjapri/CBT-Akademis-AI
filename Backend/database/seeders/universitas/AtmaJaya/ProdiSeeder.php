<?php

namespace Database\Seeders\Universitas\AtmaJaya;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class ProdiSeeder extends Seeder
{
    public function run(): void
    {
        $fakultas = DB::table('fakultas')->pluck('id', 'kode');

        $data = [
            'AJFTI' => [
                ['nama' => 'Teknik Informatika', 'kode' => 'AJTI',  'nim_prefix' => '760', 'krs_mulai_semester' => 4],
                ['nama' => 'Teknik Elektro',     'kode' => 'AJTE',  'nim_prefix' => '761', 'krs_mulai_semester' => 3],
                ['nama' => 'Teknik Mesin',       'kode' => 'AJTM',  'nim_prefix' => '762', 'krs_mulai_semester' => 3],
                ['nama' => 'Teknik Industri',    'kode' => 'AJTIN', 'nim_prefix' => '763', 'krs_mulai_semester' => 3],
            ],
            'AJFEB' => [
                ['nama' => 'Manajemen',  'kode' => 'AJMJ', 'nim_prefix' => '764', 'krs_mulai_semester' => 3],
                ['nama' => 'Akuntansi',  'kode' => 'AJAK', 'nim_prefix' => '765', 'krs_mulai_semester' => 3],
            ],
            'AJFH' => [
                ['nama' => 'Ilmu Hukum', 'kode' => 'AJIH', 'nim_prefix' => '766', 'krs_mulai_semester' => 3],
            ],
            'AJFAR' => [
                ['nama' => 'Arsitektur', 'kode' => 'AJARS', 'nim_prefix' => '767', 'krs_mulai_semester' => 3],
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
