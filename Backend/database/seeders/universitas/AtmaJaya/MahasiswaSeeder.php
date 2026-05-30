<?php

namespace Database\Seeders\Universitas\AtmaJaya;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class MahasiswaSeeder extends Seeder
{
    public function run(): void
    {
        $uajj = DB::table('universitas')->where('kode', 'UAJJ')->value('id');

        $prodi = DB::table('prodi')
            ->whereIn('kode', ['AJTI','AJTE','AJTM','AJTIN','AJMJ','AJAK','AJIH','AJARS'])
            ->pluck('id', 'kode');

        $firstNames = [
            'Agus','Ayu','Ahmad','Anisa','Andi','Arif','Amelia','Bayu','Bunga','Bima',
            'Budi','Citra','Dani','Dewi','Dedi','Eko','Fajar','Fitri','Galih','Hendra',
            'Indah','Ivan','Kevin','Laura','Leo','Maya','Muhammad','Nanda','Putri','Reza',
            'Sandi','Wahyu','Yoga','Zainal','Rizki','Oscar','Pandu','Iqbal','Jasmine','Joko',
            'Gilang','Erlangga','Lukman','Nabila','Oki','Krisna','Lina','Denny','Irvan','Tono',
        ];
        $lastNames = [
            'Halim','Tanaka','Wijaya','Santoso','Gunawan','Lim','Chen','Susanto','Hartono','Budiman',
            'Setiawan','Hidayat','Pratama','Nugroho','Kurniawan','Saputra','Wibowo','Purnomo','Hakim','Salim',
            'Chandra','Lukman','Mulyadi','Pranoto','Hermawan','Wahyudi','Utomo','Haryanto','Palupi','Sanjaya',
        ];

        // total 2000 mahasiswa
        $prodiConfig = [
            ['AJTI',  '760', [2021 => 85, 2022 => 85, 2023 => 85, 2024 => 65, 2025 => 20]],  // 340
            ['AJTE',  '761', [2021 => 65, 2022 => 65, 2023 => 65, 2024 => 49, 2025 => 16]],  // 260
            ['AJTM',  '762', [2021 => 58, 2022 => 58, 2023 => 57, 2024 => 43, 2025 => 14]],  // 230
            ['AJTIN', '763', [2021 => 65, 2022 => 65, 2023 => 65, 2024 => 49, 2025 => 16]],  // 260
            ['AJMJ',  '764', [2021 => 68, 2022 => 68, 2023 => 67, 2024 => 51, 2025 => 16]],  // 270
            ['AJAK',  '765', [2021 => 63, 2022 => 63, 2023 => 62, 2024 => 47, 2025 => 15]],  // 250
            ['AJIH',  '766', [2021 => 40, 2022 => 40, 2023 => 40, 2024 => 30, 2025 => 10]],  // 160
            ['AJARS', '767', [2021 => 58, 2022 => 58, 2023 => 57, 2024 => 43, 2025 => 14]],  // 230
        ];

        $pw      = Hash::make('password123');
        $fnCount = count($firstNames);
        $lnCount = count($lastNames);

        foreach ($prodiConfig as [$kode, $prefix, $yearDist]) {
            $prodiId   = $prodi[$kode];
            $rows      = [];
            $globalSeq = 0;

            foreach ($yearDist as $year => $count) {
                $yy = substr((string) $year, 2, 2);
                for ($i = 1; $i <= $count; $i++, $globalSeq++) {
                    $nama   = $firstNames[$globalSeq % $fnCount] . ' ' . $lastNames[$globalSeq % $lnCount];
                    $nim    = $prefix . $yy . str_pad($i, 4, '0', STR_PAD_LEFT);
                    $rows[] = [
                        'nama'           => $nama,
                        'email'          => strtolower(str_replace(' ', '.', $nama)) . '.' . $nim . '@student.atmajaya.ac.id',
                        'password'       => $pw,
                        'role'           => 'mahasiswa',
                        'nidn'           => null,
                        'nim'            => $nim,
                        'tahun_masuk'    => $year,
                        'universitas_id' => $uajj,
                        'prodi_id'       => $prodiId,
                        'is_temporary'   => false,
                        'expired_at'     => null,
                        'status'         => 'aktif',
                        'created_at'     => now(),
                        'updated_at'     => now(),
                    ];
                }
            }

            DB::table('users')->insertOrIgnore($rows);
        }
    }
}
