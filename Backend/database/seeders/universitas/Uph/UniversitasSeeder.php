<?php

namespace Database\Seeders\Universitas\Uph;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class UniversitasSeeder extends Seeder
{
    public function run(): void
    {
        DB::table('universitas')->insert([[
            'nama'       => 'Universitas Pelita Harapan',
            'kode'       => 'UPH',
            'logo'       => null,
            'alamat'     => 'MH. Thamrin Boulevard No.1100, Lippo Village, Karawaci, Tangerang 15811',
            'created_at' => now(),
            'updated_at' => now(),
        ]]);
    }
}
