<?php

namespace Database\Seeders\Universitas\Trisakti;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class UniversitasSeeder extends Seeder
{
    public function run(): void
    {
        DB::table('universitas')->insert([[
            'nama'       => 'Universitas Trisakti',
            'kode'       => 'TRISAKTI',
            'logo'       => null,
            'alamat'     => 'Jl. Kyai Tapa No.1, Grogol, Jakarta Barat 11440',
            'created_at' => now(),
            'updated_at' => now(),
        ]]);
    }
}
