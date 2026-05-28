<?php

namespace Database\Seeders\Universitas\AtmaJaya;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class UniversitasSeeder extends Seeder
{
    public function run(): void
    {
        DB::table('universitas')->insert([[
            'nama'       => 'Universitas Atma Jaya Jakarta',
            'kode'       => 'UAJJ',
            'logo'       => null,
            'alamat'     => 'Jl. Jend. Sudirman No.51, Semanggi, Jakarta Selatan 12930',
            'created_at' => now(),
            'updated_at' => now(),
        ]]);
    }
}
