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

        // total 600 mahasiswa
        $prodiConfig = [
            ['TRTI',  '702', [2021 => 23, 2022 => 23, 2023 => 22, 2024 => 17, 2025 => 5]],  // 90
            ['TRTE',  '703', [2021 => 18, 2022 => 18, 2023 => 17, 2024 => 13, 2025 => 4]],  // 70
            ['TRTM',  '704', [2021 => 16, 2022 => 16, 2023 => 16, 2024 => 13, 2025 => 4]],  // 65
            ['TRTIN', '705', [2021 => 18, 2022 => 18, 2023 => 17, 2024 => 13, 2025 => 4]],  // 70
            ['TRTS',  '706', [2021 => 16, 2022 => 16, 2023 => 16, 2024 => 13, 2025 => 4]],  // 65
            ['TRARS', '707', [2021 => 14, 2022 => 14, 2023 => 13, 2024 => 11, 2025 => 3]],  // 55
            ['TRMJ',  '708', [2021 => 18, 2022 => 18, 2023 => 17, 2024 => 13, 2025 => 4]],  // 70
            ['TRAK',  '709', [2021 => 15, 2022 => 15, 2023 => 15, 2024 => 12, 2025 => 3]],  // 60
            ['TRIH',  '710', [2021 => 14, 2022 => 14, 2023 => 13, 2024 => 11, 2025 => 3]],  // 55
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
