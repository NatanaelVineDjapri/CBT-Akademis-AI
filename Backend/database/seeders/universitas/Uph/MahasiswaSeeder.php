<?php

namespace Database\Seeders\Universitas\Uph;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class MahasiswaSeeder extends Seeder
{
    public function run(): void
    {
        $uph = DB::table('universitas')->where('kode', 'UPH')->value('id');

        $prodi = DB::table('prodi')
            ->whereIn('kode', ['PHTI','PHSIS','PHMJ','PHAK','PHIK','PHIH','PHKD','PHDKV'])
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
            ['PHTI',  '600', [2021 => 23, 2022 => 23, 2023 => 22, 2024 => 17, 2025 => 5]],  // 90
            ['PHSIS', '601', [2021 => 19, 2022 => 19, 2023 => 18, 2024 => 14, 2025 => 5]],  // 75
            ['PHMJ',  '602', [2021 => 16, 2022 => 16, 2023 => 16, 2024 => 13, 2025 => 4]],  // 65
            ['PHAK',  '603', [2021 => 15, 2022 => 15, 2023 => 15, 2024 => 12, 2025 => 3]],  // 60
            ['PHIK',  '604', [2021 => 15, 2022 => 15, 2023 => 15, 2024 => 12, 2025 => 3]],  // 60
            ['PHIH',  '605', [2021 => 10, 2022 => 10, 2023 => 10, 2024 =>  8, 2025 => 2]],  // 40
            ['PHKD',  '606', [2021 => 15, 2022 => 15, 2023 => 15, 2024 => 12, 2025 => 3]],  // 60
            ['PHDKV', '607', [2021 => 12, 2022 => 12, 2023 => 13, 2024 => 10, 2025 => 3]],  // 50
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
                        'email'          => strtolower(str_replace(' ', '.', $nama)) . '.' . $nim . '@student.uph.edu',
                        'password'       => $pw,
                        'role'           => 'mahasiswa',
                        'nidn'           => null,
                        'nim'            => $nim,
                        'tahun_masuk'    => $year,
                        'universitas_id' => $uph,
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
