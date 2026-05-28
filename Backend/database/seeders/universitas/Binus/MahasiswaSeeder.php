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

        // [kode, nim_prefix, [year => count]]  — total 1000 mahasiswa
        $prodiConfig = [
            ['BCS',  '510', [2021 => 23, 2022 => 23, 2023 => 22, 2024 => 17, 2025 => 5]],  // 90
            ['BAI',  '511', [2021 => 14, 2022 => 14, 2023 => 13, 2024 => 11, 2025 => 3]],  // 55
            ['BCYB', '512', [2021 => 14, 2022 => 14, 2023 => 13, 2024 => 11, 2025 => 3]],  // 55
            ['BIS',  '520', [2021 => 20, 2022 => 20, 2023 => 20, 2024 => 15, 2025 => 5]],  // 80
            ['BDS',  '521', [2021 => 12, 2022 => 12, 2023 => 13, 2024 => 10, 2025 => 3]],  // 50
            ['BIET', '530', [2021 => 15, 2022 => 15, 2023 => 15, 2024 => 12, 2025 => 3]],  // 60
            ['BARC', '531', [2021 => 12, 2022 => 12, 2023 => 13, 2024 => 10, 2025 => 3]],  // 50
            ['BTSV', '532', [2021 => 12, 2022 => 12, 2023 => 13, 2024 => 10, 2025 => 3]],  // 50
            ['BTKE', '533', [2021 => 15, 2022 => 15, 2023 => 15, 2024 => 12, 2025 => 3]],  // 60
            ['BAKT', '540', [2021 => 18, 2022 => 18, 2023 => 17, 2024 => 13, 2025 => 4]],  // 70
            ['BFIN', '541', [2021 => 14, 2022 => 14, 2023 => 13, 2024 => 11, 2025 => 3]],  // 55
            ['BMC',  '542', [2021 => 14, 2022 => 14, 2023 => 13, 2024 => 11, 2025 => 3]],  // 55
            ['BHI',  '550', [2021 => 12, 2022 => 12, 2023 => 13, 2024 => 10, 2025 => 3]],  // 50
            ['BENG', '551', [2021 => 10, 2022 => 10, 2023 => 10, 2024 =>  8, 2025 => 2]],  // 40
            ['BPSI', '552', [2021 => 14, 2022 => 14, 2023 => 13, 2024 => 11, 2025 => 3]],  // 55
            ['BHUK', '553', [2021 => 11, 2022 => 11, 2023 => 11, 2024 =>  9, 2025 => 3]],  // 45
            ['BDKV', '560', [2021 => 11, 2022 => 11, 2023 => 11, 2024 =>  9, 2025 => 3]],  // 45
            ['BDIN', '561', [2021 =>  9, 2022 =>  9, 2023 =>  9, 2024 =>  6, 2025 => 2]],  // 35
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
                    $nama  = $firstNames[$globalSeq % $fnCount] . ' ' . $lastNames[$globalSeq % $lnCount];
                    $nim   = $prefix . $yy . str_pad($i, 4, '0', STR_PAD_LEFT);
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
