<?php

namespace Database\Seeders\Universitas\Binus;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class ProdiSeeder extends Seeder
{
    public function run(): void
    {
        $fakultas = DB::table('fakultas')->pluck('id', 'kode');

        $data = [
            'BFCS' => [
                ['nama' => 'Computer Science',        'kode' => 'BCS',  'nim_prefix' => '510', 'krs_mulai_semester' => 4],
                ['nama' => 'Artificial Intelligence', 'kode' => 'BAI',  'nim_prefix' => '511', 'krs_mulai_semester' => 4],
                ['nama' => 'Cyber Security',          'kode' => 'BCYB', 'nim_prefix' => '512', 'krs_mulai_semester' => 4],
            ],
            'BFIS' => [
                ['nama' => 'Information Systems', 'kode' => 'BIS', 'nim_prefix' => '520', 'krs_mulai_semester' => 4],
                ['nama' => 'Data Science',        'kode' => 'BDS', 'nim_prefix' => '521', 'krs_mulai_semester' => 4],
            ],
            'BFEN' => [
                ['nama' => 'Industrial Engineering', 'kode' => 'BIET', 'nim_prefix' => '530', 'krs_mulai_semester' => 3],
                ['nama' => 'Architecture',           'kode' => 'BARC', 'nim_prefix' => '531', 'krs_mulai_semester' => 3],
                ['nama' => 'Civil Engineering',      'kode' => 'BTSV', 'nim_prefix' => '532', 'krs_mulai_semester' => 3],
                ['nama' => 'Computer Engineering',   'kode' => 'BTKE', 'nim_prefix' => '533', 'krs_mulai_semester' => 3],
            ],
            'BFEC' => [
                ['nama' => 'Accounting',              'kode' => 'BAKT', 'nim_prefix' => '540', 'krs_mulai_semester' => 3],
                ['nama' => 'Finance',                 'kode' => 'BFIN', 'nim_prefix' => '541', 'krs_mulai_semester' => 3],
                ['nama' => 'Marketing Communication','kode' => 'BMC',  'nim_prefix' => '542', 'krs_mulai_semester' => 3],
            ],
            'BFHU' => [
                ['nama' => 'International Relations', 'kode' => 'BHI',  'nim_prefix' => '550', 'krs_mulai_semester' => 3],
                ['nama' => 'English Literature',      'kode' => 'BENG', 'nim_prefix' => '551', 'krs_mulai_semester' => 3],
                ['nama' => 'Psychology',              'kode' => 'BPSI', 'nim_prefix' => '552', 'krs_mulai_semester' => 3],
                ['nama' => 'Law',                     'kode' => 'BHUK', 'nim_prefix' => '553', 'krs_mulai_semester' => 3],
            ],
            'BSOD' => [
                ['nama' => 'Visual Communication Design', 'kode' => 'BDKV', 'nim_prefix' => '560', 'krs_mulai_semester' => 3],
                ['nama' => 'Interior Design',             'kode' => 'BDIN', 'nim_prefix' => '561', 'krs_mulai_semester' => 3],
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
