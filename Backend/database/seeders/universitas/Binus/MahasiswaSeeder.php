<?php

namespace Database\Seeders\Universitas\Binus;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class MahasiswaSeeder extends Seeder
{
    public function run(): void
    {
        $binus = DB::table('universitas')->where('kode', 'BINUS')->value('id');

        $prodi = DB::table('prodi')
            ->whereIn('kode', [
                'BCS','BAI','BCYB','BIS','BDS',
                'BIET','BARC','BTSV','BTKE',
                'BAKT','BFIN','BMC',
                'BHI','BENG','BPSI','BHUK',
                'BDKV','BDIN',
            ])
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
            ['BCS',  '510', [2021 => 50, 2022 => 50, 2023 => 50, 2024 => 38, 2025 => 12]],  // 200
            ['BAI',  '511', [2021 => 28, 2022 => 28, 2023 => 27, 2024 => 21, 2025 =>  6]],  // 110
            ['BCYB', '512', [2021 => 28, 2022 => 28, 2023 => 27, 2024 => 21, 2025 =>  6]],  // 110
            ['BIS',  '520', [2021 => 40, 2022 => 40, 2023 => 40, 2024 => 30, 2025 => 10]],  // 160
            ['BDS',  '521', [2021 => 25, 2022 => 25, 2023 => 25, 2024 => 20, 2025 =>  5]],  // 100
            ['BIET', '530', [2021 => 28, 2022 => 28, 2023 => 27, 2024 => 21, 2025 =>  6]],  // 110
            ['BARC', '531', [2021 => 25, 2022 => 25, 2023 => 25, 2024 => 20, 2025 =>  5]],  // 100
            ['BTSV', '532', [2021 => 25, 2022 => 25, 2023 => 25, 2024 => 20, 2025 =>  5]],  // 100
            ['BTKE', '533', [2021 => 28, 2022 => 28, 2023 => 27, 2024 => 21, 2025 =>  6]],  // 110
            ['BAKT', '540', [2021 => 35, 2022 => 35, 2023 => 35, 2024 => 25, 2025 => 10]],  // 140
            ['BFIN', '541', [2021 => 28, 2022 => 28, 2023 => 27, 2024 => 21, 2025 =>  6]],  // 110
            ['BMC',  '542', [2021 => 28, 2022 => 28, 2023 => 27, 2024 => 21, 2025 =>  6]],  // 110
            ['BHI',  '550', [2021 => 25, 2022 => 25, 2023 => 25, 2024 => 20, 2025 =>  5]],  // 100
            ['BENG', '551', [2021 => 20, 2022 => 20, 2023 => 20, 2024 => 15, 2025 =>  5]],  //  80
            ['BPSI', '552', [2021 => 28, 2022 => 28, 2023 => 27, 2024 => 21, 2025 =>  6]],  // 110
            ['BHUK', '553', [2021 => 22, 2022 => 22, 2023 => 22, 2024 => 18, 2025 =>  6]],  //  90
            ['BDKV', '560', [2021 => 22, 2022 => 22, 2023 => 22, 2024 => 18, 2025 =>  6]],  //  90
            ['BDIN', '561', [2021 => 18, 2022 => 18, 2023 => 17, 2024 => 13, 2025 =>  4]],  //  70
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
                        'email'          => strtolower(str_replace(' ', '.', $nama)) . '.' . $nim . '@student.binus.ac.id',
                        'password'       => $pw,
                        'role'           => 'mahasiswa',
                        'nidn'           => null,
                        'nim'            => $nim,
                        'tahun_masuk'    => $year,
                        'universitas_id' => $binus,
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
