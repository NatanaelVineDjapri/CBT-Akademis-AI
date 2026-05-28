<?php

namespace Database\Seeders\Universitas\Untar;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class MatkulDosenSeeder extends Seeder
{
    public function run(): void
    {
        // Ambil semua matkul per prodi
        $matkuls = DB::table('mata_kuliah')
            ->orderBy('id')
            ->get()
            ->groupBy('prodi_id');

        $dosens = DB::table('users')
            ->where('role', 'dosen')
            ->orderBy('id')
            ->get()
            ->groupBy('prodi_id');

        $insertData = [];

        foreach ($matkuls as $prodiId => $listMatkul) {

            $dosenList = $dosens[$prodiId] ?? collect();

            if ($dosenList->count() == 0) continue;

            $dosenArray = $dosenList->values();

            foreach ($listMatkul as $index => $matkul) {

                $dosen1 = $dosenArray[$index % $dosenArray->count()];
                $dosen2 = $dosenArray[($index + 1) % $dosenArray->count()];

                $insertData[] = [
                    'mata_kuliah_id' => $matkul->id,
                    'user_id'        => $dosen1->id,
                    'tahun_ajaran'   => '2025/2026',
                    'created_at'     => now(),
                    'updated_at'     => now(),
                ];

                if ($dosen2->id !== $dosen1->id) {
                    $insertData[] = [
                        'mata_kuliah_id' => $matkul->id,
                        'user_id'        => $dosen2->id,
                        'tahun_ajaran'   => '2025/2026',
                        'created_at'     => now(),
                        'updated_at'     => now(),
                    ];
                }
            }
        }

        DB::table('dosen_matkul')->insertOrIgnore($insertData);
    }
}
