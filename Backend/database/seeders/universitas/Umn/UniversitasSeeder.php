<?php

namespace Database\Seeders\Universitas\Umn;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class UniversitasSeeder extends Seeder
{
    public function run(): void
    {
        DB::table('universitas')->insert([[
            'nama'       => 'Universitas Multimedia Nusantara',
            'kode'       => 'UMN',
            'logo'       => null,
            'alamat'     => 'Jl. Scientia Boulevard, Gading Serpong, Tangerang 15811',
            'created_at' => now(),
            'updated_at' => now(),
        ]]);
    }
}
