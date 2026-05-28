<?php

namespace Database\Seeders\Universitas\Uph;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class FakultasSeeder extends Seeder
{
    public function run(): void
    {
        $uph = DB::table('universitas')->where('kode', 'UPH')->value('id');

        DB::table('fakultas')->insert([
            ['universitas_id' => $uph, 'nama' => 'Fakultas Teknologi Informasi', 'kode' => 'PFTI', 'created_at' => now(), 'updated_at' => now()],
            ['universitas_id' => $uph, 'nama' => 'Fakultas Bisnis',              'kode' => 'PFB',  'created_at' => now(), 'updated_at' => now()],
            ['universitas_id' => $uph, 'nama' => 'Fakultas Ilmu Komunikasi',     'kode' => 'PFIK', 'created_at' => now(), 'updated_at' => now()],
            ['universitas_id' => $uph, 'nama' => 'Fakultas Hukum',               'kode' => 'PFHK', 'created_at' => now(), 'updated_at' => now()],
            ['universitas_id' => $uph, 'nama' => 'Fakultas Kedokteran',          'kode' => 'PFKD', 'created_at' => now(), 'updated_at' => now()],
            ['universitas_id' => $uph, 'nama' => 'Fakultas Seni dan Desain',     'kode' => 'PFSD', 'created_at' => now(), 'updated_at' => now()],
        ]);
    }
}
