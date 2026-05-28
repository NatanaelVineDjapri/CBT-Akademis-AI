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

        // total 500 mahasiswa
        $prodiConfig = [
            ['AJTI',  '760', [2021 => 21, 2022 => 21, 2023 => 21, 2024 => 17, 2025 => 5]],  // 85
            ['AJTE',  '761', [2021 => 16, 2022 => 16, 2023 => 16, 2024 => 13, 2025 => 4]],  // 65
            ['AJTM',  '762', [2021 => 15, 2022 => 15, 2023 => 15, 2024 => 12, 2025 => 3]],  // 60
            ['AJTIN', '763', [2021 => 16, 2022 => 16, 2023 => 16, 2024 => 13, 2025 => 4]],  // 65
            ['AJMJ',  '764', [2021 => 16, 2022 => 16, 2023 => 16, 2024 => 13, 2025 => 4]],  // 65
            ['AJAK',  '765', [2021 => 15, 2022 => 15, 2023 => 15, 2024 => 12, 2025 => 3]],  // 60
            ['AJIH',  '766', [2021 => 10, 2022 => 10, 2023 => 10, 2024 =>  8, 2025 => 2]],  // 40
            ['AJARS', '767', [2021 => 15, 2022 => 15, 2023 => 15, 2024 => 12, 2025 => 3]],  // 60
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
