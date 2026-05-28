<?php

namespace Database\Seeders\Universitas\Trisakti;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class FakultasSeeder extends Seeder
{
    public function run(): void
    {
        $trisakti = DB::table('universitas')->where('kode', 'TRISAKTI')->value('id');

        DB::table('fakultas')->insert([
            ['universitas_id' => $trisakti, 'nama' => 'Fakultas Teknologi Industri',              'kode' => 'TRFTI', 'created_at' => now(), 'updated_at' => now()],
            ['universitas_id' => $trisakti, 'nama' => 'Fakultas Teknik Sipil dan Perencanaan',    'kode' => 'TRFTS', 'created_at' => now(), 'updated_at' => now()],
            ['universitas_id' => $trisakti, 'nama' => 'Fakultas Ekonomi dan Bisnis',              'kode' => 'TRFEB', 'created_at' => now(), 'updated_at' => now()],
            ['universitas_id' => $trisakti, 'nama' => 'Fakultas Hukum',                           'kode' => 'TRFH',  'created_at' => now(), 'updated_at' => now()],
        ]);
    }
}
