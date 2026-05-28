<?php

namespace Database\Seeders\Universitas\Binus;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class UniversitasSeeder extends Seeder
{
    public function run(): void
    {
        DB::table('universitas')->insert([
            [
                'nama'       => 'Universitas Bina Nusantara',
                'kode'       => 'BINUS',
                'logo'       => null,
                'alamat'     => 'Jl. K.H. Syahdan No.9, Kemanggisan, Jakarta Barat 11480',
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ]);
    }
}
