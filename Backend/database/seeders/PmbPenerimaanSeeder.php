<?php

namespace Database\Seeders;

use App\Models\PmbPenerimaan;
use App\Models\Universitas;
use Illuminate\Database\Seeder;

class PmbPenerimaanSeeder extends Seeder
{
    public function run(): void
    {
        $universitasIds = Universitas::pluck('id');

        $dataPerTahun = [
            2022 => ['pendaftar' => 320, 'diterima' => 210],
            2023 => ['pendaftar' => 415, 'diterima' => 280],
            2024 => ['pendaftar' => 480, 'diterima' => 350],
            2025 => ['pendaftar' => 512, 'diterima' => 390],
            2026 => ['pendaftar' => 198, 'diterima' => 0],
        ];

        foreach ($universitasIds as $univId) {
            foreach ($dataPerTahun as $tahun => $val) {
                PmbPenerimaan::updateOrCreate(
                    ['universitas_id' => $univId, 'tahun' => $tahun],
                    [
                        'total_pendaftar' => $val['pendaftar'],
                        'total_diterima'  => $val['diterima'],
                    ]
                );
            }
        }
    }
}
