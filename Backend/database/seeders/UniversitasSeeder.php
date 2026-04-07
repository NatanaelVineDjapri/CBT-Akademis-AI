<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class UniversitasSeeder extends Seeder
{
    public function run(): void
    {
        DB::table('universitas')->insert([
            [
                'nama' => 'Universitas Tarumanagara',
                'kode' => 'UNTAR',
                'logo' => null,
                'alamat' => 'Jl. Letjen S. Parman No.1, Grogol, Jakarta Barat',
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ]);
    }
}
