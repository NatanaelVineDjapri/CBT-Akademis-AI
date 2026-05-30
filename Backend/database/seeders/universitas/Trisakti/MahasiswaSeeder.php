<?php

namespace Database\Seeders\Universitas\Trisakti;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class MahasiswaSeeder extends Seeder
{
    public function run(): void
    {
        $trisakti = DB::table('universitas')->where('kode', 'TRISAKTI')->value('id');

        $prodi = DB::table('prodi')
            ->whereIn('kode', ['TRTI','TRTE','TRTM','TRTIN','TRTS','TRARS','TRMJ','TRAK','TRIH'])
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
            ['TRTI',  '702', [2021 => 80, 2022 => 80, 2023 => 80, 2024 => 60, 2025 => 20]],  // 320
            ['TRTE',  '703', [2021 => 63, 2022 => 63, 2023 => 62, 2024 => 47, 2025 => 15]],  // 250
            ['TRTM',  '704', [2021 => 63, 2022 => 63, 2023 => 62, 2024 => 47, 2025 => 15]],  // 250
            ['TRTIN', '705', [2021 => 63, 2022 => 63, 2023 => 62, 2024 => 47, 2025 => 15]],  // 250
            ['TRTS',  '706', [2021 => 58, 2022 => 58, 2023 => 57, 2024 => 43, 2025 => 14]],  // 230
            ['TRARS', '707', [2021 => 50, 2022 => 50, 2023 => 50, 2024 => 38, 2025 => 12]],  // 200
            ['TRMJ',  '708', [2021 => 63, 2022 => 63, 2023 => 62, 2024 => 47, 2025 => 15]],  // 250
            ['TRAK',  '709', [2021 => 55, 2022 => 55, 2023 => 55, 2024 => 42, 2025 => 13]],  // 220
            ['TRIH',  '710', [2021 => 33, 2022 => 33, 2023 => 32, 2024 => 24, 2025 =>  8]],  //  30
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
                        'email'          => strtolower(str_replace(' ', '.', $nama)) . '.' . $nim . '@student.trisakti.ac.id',
                        'password'       => $pw,
                        'role'           => 'mahasiswa',
                        'nidn'           => null,
                        'nim'            => $nim,
                        'tahun_masuk'    => $year,
                        'universitas_id' => $trisakti,
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
