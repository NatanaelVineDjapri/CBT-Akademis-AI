<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class BankSoalExternalUnivSeeder extends Seeder
{
    public function run(): void
    {
        $univIds = [
            'BINUS' => DB::table('universitas')->where('kode', 'BINUS')->value('id'),
            'UMN'   => DB::table('universitas')->where('kode', 'UMN')->value('id'),
            'UI'    => DB::table('universitas')->insertGetId([
                'nama'       => 'Universitas Indonesia',
                'kode'       => 'UI',
                'logo'       => null,
                'alamat'     => 'Kampus UI Depok, Jawa Barat 16424',
                'created_at' => now(),
                'updated_at' => now(),
            ]),
        ];

        $uiFakId = DB::table('fakultas')->insertGetId([
            'universitas_id' => $univIds['UI'],
            'nama'           => 'Fakultas Ilmu Komputer',
            'kode'           => 'FASILKOM-UI',
            'created_at'     => now(),
            'updated_at'     => now(),
        ]);

        $prodiIds = [
            'BINUS' => DB::table('prodi')->where('kode', 'BCS')->value('id'),
            'UMN'   => DB::table('prodi')->where('kode', 'UTI')->value('id'),
            'UI'    => DB::table('prodi')->insertGetId([
                'fakultas_id'        => $uiFakId,
                'nama'               => 'Ilmu Komputer',
                'kode'               => 'UICS',
                'nim_prefix'         => '920',
                'krs_mulai_semester' => 4,
                'created_at'         => now(),
                'updated_at'         => now(),
            ]),
        ];

        $dosenIds = [
            'BINUS' => DB::table('users')->where('email', 'rinaldi.munir@binus.ac.id')->value('id'),
            'UMN'   => DB::table('users')->where('email', 'nanang.fakhrur@umn.ac.id')->value('id'),
            'UI'    => DB::table('users')->insertGetId([
                'nama'           => 'Dr. Rizky Pratama, Ph.D',
                'email'          => 'rizky.pratama@ui.ac.id',
                'password'       => Hash::make('password123'),
                'role'           => 'dosen',
                'nidn'           => '5001027801',
                'nim'            => null,
                'tahun_masuk'    => null,
                'universitas_id' => $univIds['UI'],
                'prodi_id'       => $prodiIds['UI'],
                'is_temporary'   => false,
                'expired_at'     => null,
                'status'         => 'aktif',
                'created_at'     => now(),
                'updated_at'     => now(),
            ]),
        ];

        $matkulConfig = [
            'BINUS' => [
                ['nama' => 'Kalkulus',         'kode' => 'MAT101-BNS', 'babs' => ['Limit & Kontinuitas', 'Turunan', 'Integral', 'Deret Taylor']],
                ['nama' => 'Fisika Dasar',      'kode' => 'FIS101-BNS', 'babs' => ['Kinematika', 'Dinamika', 'Usaha & Energi', 'Fluida']],
                ['nama' => 'Struktur Data',     'kode' => 'IF201-BNS',  'babs' => ['Array & Linked List', 'Stack & Queue', 'Tree', 'Graph']],
                ['nama' => 'Kecerdasan Buatan', 'kode' => 'IF401-BNS',  'babs' => ['Searching', 'Machine Learning Dasar', 'Neural Network']],
            ],
            'UMN' => [
                ['nama' => 'Pemrograman Mobile', 'kode' => 'IF301-UMN', 'babs' => ['Android Dasar', 'UI Components', 'Database Mobile', 'API Integration']],
                ['nama' => 'Keamanan Siber',     'kode' => 'IF401-UMN', 'babs' => ['Kriptografi', 'Ethical Hacking', 'Firewall & IDS']],
                ['nama' => 'Cloud Computing',    'kode' => 'IF402-UMN', 'babs' => ['Virtualisasi', 'AWS Dasar', 'Docker & Kubernetes', 'Serverless']],
                ['nama' => 'Pengolahan Citra',   'kode' => 'IF403-UMN', 'babs' => ['Histogram', 'Filtering', 'Segmentasi', 'Deteksi Tepi']],
            ],
            'UI' => [
                ['nama' => 'Aljabar Linear',     'kode' => 'MAT201-UI', 'babs' => ['Matriks', 'Determinan', 'Vektor', 'Transformasi Linear']],
                ['nama' => 'Statistika',         'kode' => 'MAT202-UI', 'babs' => ['Distribusi Normal', 'Uji Hipotesis', 'Regresi', 'ANOVA']],
                ['nama' => 'Basis Data Lanjut',  'kode' => 'IF301-UI',  'babs' => ['Query Optimization', 'Indexing', 'Stored Procedure', 'Replikasi']],
                ['nama' => 'Rekayasa Perangkat', 'kode' => 'IF302-UI',  'babs' => ['SDLC', 'UML', 'Agile & Scrum', 'Testing']],
            ],
        ];

        foreach ($matkulConfig as $univKode => $matkulList) {
            foreach ($matkulList as $mk) {
                $matkulId = DB::table('mata_kuliah')->insertGetId([
                    'prodi_id'   => $prodiIds[$univKode],
                    'nama'       => $mk['nama'],
                    'kode'       => $mk['kode'],
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);

                $babIds = [];
                foreach ($mk['babs'] as $urutan => $namaBab) {
                    $babIds[] = DB::table('bab')->insertGetId([
                        'mata_kuliah_id' => $matkulId,
                        'nama_bab'       => $namaBab,
                        'urutan'         => $urutan + 1,
                        'created_at'     => now(),
                        'updated_at'     => now(),
                    ]);
                }

                $bankSoalNames = [
                    "Bank Soal {$mk['nama']} - Materi Lengkap",
                    "Bank Soal {$mk['nama']} - Latihan UTS",
                ];

                foreach ($bankSoalNames as $idx => $bsNama) {
                    $babId = $babIds[$idx % count($babIds)];

                    $bankSoalId = DB::table('bank_soal')->insertGetId([
                        'created_by'     => $dosenIds[$univKode],
                        'mata_kuliah_id' => $matkulId,
                        'bab_id'         => $babId,
                        'nama'           => $bsNama,
                        'deskripsi'      => "Kumpulan soal {$mk['nama']} mencakup materi {$mk['babs'][0]} dan topik lainnya.",
                        'permission'     => 'public',
                        'created_at'     => now(),
                        'updated_at'     => now(),
                    ]);

                    $this->insertSoalDummy($bankSoalId, $matkulId, $babId);
                }
            }
        }
    }

    private function insertSoalDummy(int $bankSoalId, int $matkulId, int $babId): void
    {
        $opsiLabels = ['A', 'B', 'C', 'D'];

        for ($i = 1; $i <= 5; $i++) {
            $soalId = DB::table('soal')->insertGetId([
                'bank_soal_id'      => $bankSoalId,
                'mata_kuliah_id'    => $matkulId,
                'bab_id'            => $babId,
                'deskripsi'         => "Soal dummy {$i}",
                'tingkat_kesulitan' => ['mudah', 'sedang', 'sulit'][array_rand(['mudah', 'sedang', 'sulit'])],
                'ai_generated'      => false,
                'created_at'        => now(),
                'updated_at'        => now(),
            ]);

            $jenisSoalId = DB::table('jenis_soal')->insertGetId([
                'soal_id'    => $soalId,
                'jenis_soal' => 'pilihan_ganda',
                'created_at' => now(),
                'updated_at' => now(),
            ]);

            $correct = rand(0, 3);
            foreach ($opsiLabels as $j => $opsi) {
                DB::table('opsi_jawaban')->insert([
                    'jenis_soal_id' => $jenisSoalId,
                    'opsi'          => $opsi,
                    'teks'          => $j === $correct ? 'Jawaban Benar' : "Jawaban Salah {$j}",
                    'is_correct'    => $j === $correct,
                    'created_at'    => now(),
                    'updated_at'    => now(),
                ]);
            }
        }
    }
}
