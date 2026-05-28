<?php

namespace Database\Seeders\Universitas\AtmaJaya;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class FakultasSeeder extends Seeder
{
    public function run(): void
    {
        $uajj = DB::table('universitas')->where('kode', 'UAJJ')->value('id');

        DB::table('fakultas')->insert([
            ['universitas_id' => $uajj, 'nama' => 'Fakultas Teknik dan Informatika', 'kode' => 'AJFTI', 'created_at' => now(), 'updated_at' => now()],
            ['universitas_id' => $uajj, 'nama' => 'Fakultas Ekonomi dan Bisnis',     'kode' => 'AJFEB', 'created_at' => now(), 'updated_at' => now()],
            ['universitas_id' => $uajj, 'nama' => 'Fakultas Hukum',                  'kode' => 'AJFH',  'created_at' => now(), 'updated_at' => now()],
            ['universitas_id' => $uajj, 'nama' => 'Fakultas Arsitektur dan Desain',  'kode' => 'AJFAR', 'created_at' => now(), 'updated_at' => now()],
        ]);
    }
}
