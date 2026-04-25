<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class FakultasSeeder extends Seeder
{
    public function run(): void
    {
        $untar = DB::table('universitas')->where('kode', 'UNTAR')->value('id');

        DB::table('fakultas')->insert([
            ['universitas_id' => $untar, 'nama' => 'Fakultas Teknologi Informasi',  'kode' => 'FTI',  'created_at' => now(), 'updated_at' => now()],
            ['universitas_id' => $untar, 'nama' => 'Fakultas Teknik',               'kode' => 'FT',   'created_at' => now(), 'updated_at' => now()],
            ['universitas_id' => $untar, 'nama' => 'Fakultas Ekonomi dan Bisnis',   'kode' => 'FEB',  'created_at' => now(), 'updated_at' => now()],
            ['universitas_id' => $untar, 'nama' => 'Fakultas Hukum',                'kode' => 'FH',   'created_at' => now(), 'updated_at' => now()],
            ['universitas_id' => $untar, 'nama' => 'Fakultas Kedokteran',           'kode' => 'FK',   'created_at' => now(), 'updated_at' => now()],
            ['universitas_id' => $untar, 'nama' => 'Fakultas Seni Rupa dan Desain', 'kode' => 'FSRD', 'created_at' => now(), 'updated_at' => now()],
            ['universitas_id' => $untar, 'nama' => 'Fakultas Psikologi',            'kode' => 'FPSI', 'created_at' => now(), 'updated_at' => now()],
            ['universitas_id' => $untar, 'nama' => 'Fakultas Ilmu Komunikasi',      'kode' => 'FIKOM','created_at' => now(), 'updated_at' => now()],
        ]);
    }
}
