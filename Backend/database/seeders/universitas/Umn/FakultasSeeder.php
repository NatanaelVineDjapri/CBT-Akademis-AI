<?php

namespace Database\Seeders\Universitas\Umn;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class FakultasSeeder extends Seeder
{
    public function run(): void
    {
        $umn = DB::table('universitas')->where('kode', 'UMN')->value('id');

        DB::table('fakultas')->insert([
            ['universitas_id' => $umn, 'nama' => 'Fakultas Teknologi Informasi', 'kode' => 'UFTI', 'created_at' => now(), 'updated_at' => now()],
            ['universitas_id' => $umn, 'nama' => 'Fakultas Bisnis',              'kode' => 'UFB',  'created_at' => now(), 'updated_at' => now()],
            ['universitas_id' => $umn, 'nama' => 'Fakultas Ilmu Komunikasi',     'kode' => 'UFIK', 'created_at' => now(), 'updated_at' => now()],
            ['universitas_id' => $umn, 'nama' => 'Fakultas Seni dan Desain',     'kode' => 'UFSD', 'created_at' => now(), 'updated_at' => now()],
            ['universitas_id' => $umn, 'nama' => 'Fakultas Hukum',               'kode' => 'UFHU', 'created_at' => now(), 'updated_at' => now()],
        ]);
    }
}
