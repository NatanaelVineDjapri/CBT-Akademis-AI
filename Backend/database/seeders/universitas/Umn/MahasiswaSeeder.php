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

        // total 2000 mahasiswa
        $prodiConfig = [
            ['UTI',  '810', [2021 => 70, 2022 => 70, 2023 => 70, 2024 => 55, 2025 => 15]],  // 280
            ['USI',  '811', [2021 => 55, 2022 => 55, 2023 => 55, 2024 => 42, 2025 => 13]],  // 220
            ['UTKE', '812', [2021 => 48, 2022 => 48, 2023 => 47, 2024 => 36, 2025 => 11]],  // 190
            ['UMNJ', '820', [2021 => 58, 2022 => 58, 2023 => 57, 2024 => 43, 2025 => 14]],  // 230
            ['UAKT', '821', [2021 => 53, 2022 => 53, 2023 => 52, 2024 => 40, 2025 => 12]],  // 210
            ['UIK',  '830', [2021 => 55, 2022 => 55, 2023 => 55, 2024 => 42, 2025 => 13]],  // 220
            ['UJR',  '831', [2021 => 43, 2022 => 43, 2023 => 42, 2024 => 32, 2025 => 10]],  // 170
            ['UDKV', '840', [2021 => 38, 2022 => 38, 2023 => 37, 2024 => 28, 2025 =>  9]],  // 150
            ['UDIN', '841', [2021 => 28, 2022 => 28, 2023 => 27, 2024 => 21, 2025 =>  6]],  // 110
            ['UFLM', '842', [2021 => 23, 2022 => 22, 2023 => 22, 2024 => 17, 2025 =>  6]],  //  90
            ['UIH',  '850', [2021 => 33, 2022 => 33, 2023 => 32, 2024 => 24, 2025 =>  8]],  // 130
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
