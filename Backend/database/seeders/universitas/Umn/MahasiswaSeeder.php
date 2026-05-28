<?php

namespace Database\Seeders\Universitas\Umn;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class MahasiswaSeeder extends Seeder
{
    public function run(): void
    {
        $umn = DB::table('universitas')->where('kode', 'UMN')->value('id');

        $prodi = DB::table('prodi')
            ->whereIn('kode', ['UTI','USI','UTKE','UMNJ','UAKT','UIK','UJR','UDKV','UDIN','UFLM','UIH'])
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

        // [kode, nim_prefix, [year => count]]  — total 600 mahasiswa
        $prodiConfig = [
            ['UTI',  '810', [2021 => 23, 2022 => 23, 2023 => 22, 2024 => 17, 2025 => 5]],  // 90
            ['USI',  '811', [2021 => 18, 2022 => 18, 2023 => 17, 2024 => 13, 2025 => 4]],  // 70
            ['UTKE', '812', [2021 => 15, 2022 => 15, 2023 => 15, 2024 => 12, 2025 => 3]],  // 60
            ['UMNJ', '820', [2021 => 18, 2022 => 18, 2023 => 17, 2024 => 13, 2025 => 4]],  // 70
            ['UAKT', '821', [2021 => 16, 2022 => 16, 2023 => 16, 2024 => 13, 2025 => 4]],  // 65
            ['UIK',  '830', [2021 => 18, 2022 => 18, 2023 => 17, 2024 => 13, 2025 => 4]],  // 70
            ['UJR',  '831', [2021 => 12, 2022 => 12, 2023 => 13, 2024 => 10, 2025 => 3]],  // 50
            ['UDKV', '840', [2021 => 11, 2022 => 11, 2023 => 11, 2024 =>  9, 2025 => 3]],  // 45
            ['UDIN', '841', [2021 =>  9, 2022 =>  9, 2023 =>  9, 2024 =>  6, 2025 => 2]],  // 35
            ['UFLM', '842', [2021 =>  7, 2022 =>  8, 2023 =>  7, 2024 =>  6, 2025 => 2]],  // 30
            ['UIH',  '850', [2021 =>  4, 2022 =>  4, 2023 =>  3, 2024 =>  3, 2025 => 1]],  // 15
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
                        'email'          => strtolower(str_replace(' ', '.', $nama)) . '.' . $nim . '@student.umn.ac.id',
                        'password'       => $pw,
                        'role'           => 'mahasiswa',
                        'nidn'           => null,
                        'nim'            => $nim,
                        'tahun_masuk'    => $year,
                        'universitas_id' => $umn,
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
