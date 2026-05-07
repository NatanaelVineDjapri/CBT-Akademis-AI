<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class MatkulDosenSeeder extends Seeder
{
    public function run(): void
    {
        // Ambil semua matkul per prodi
        $matkuls = DB::table('matkul')
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
                    'matkul_id' => $matkul->id,
                    'dosen_id'  => $dosen1->id,
                    'created_at'=> now(),
                    'updated_at'=> now(),
                ];

                $insertData[] = [
                    'matkul_id' => $matkul->id,
                    'dosen_id'  => $dosen2->id,
                    'created_at'=> now(),
                    'updated_at'=> now(),
                ];
            }
        }

        DB::table('matkul_dosen')->insert($insertData);
    }
}