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

        // total 2000 mahasiswa
        $prodiConfig = [
            ['PHTI',  '600', [2021 =>  88, 2022 =>  88, 2023 =>  87, 2024 =>  66, 2025 => 21]],  // 350
            ['PHSIS', '601', [2021 =>  75, 2022 =>  75, 2023 =>  75, 2024 =>  57, 2025 => 18]],  // 300
            ['PHMJ',  '602', [2021 =>  70, 2022 =>  70, 2023 =>  70, 2024 =>  53, 2025 => 17]],  // 280
            ['PHAK',  '603', [2021 =>  65, 2022 =>  65, 2023 =>  65, 2024 =>  49, 2025 => 16]],  // 260
            ['PHIK',  '604', [2021 =>  63, 2022 =>  63, 2023 =>  62, 2024 =>  47, 2025 => 15]],  // 250
            ['PHIH',  '605', [2021 =>  40, 2022 =>  40, 2023 =>  40, 2024 =>  30, 2025 => 10]],  // 160
            ['PHKD',  '606', [2021 =>  58, 2022 =>  58, 2023 =>  57, 2024 =>  43, 2025 => 14]],  // 230
            ['PHDKV', '607', [2021 =>  43, 2022 =>  43, 2023 =>  42, 2024 =>  32, 2025 => 10]],  // 170
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
