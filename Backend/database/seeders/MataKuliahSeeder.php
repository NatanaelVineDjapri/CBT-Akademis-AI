<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class MataKuliahSeeder extends Seeder
{
    public function run(): void
    {
        $prodi = DB::table('prodi')->pluck('id', 'kode');

        // TI entries are already seeded by DemoSeeder with proper kode values.
        $data = [

            // FTI - SI
            'SI' => [
                ['kode' => 'SI001', 'nama' => 'Analisis Sistem',             'semester' => 3, 'sks' => 3],
                ['kode' => 'SI002', 'nama' => 'Perancangan Sistem',          'semester' => 4, 'sks' => 3],
                ['kode' => 'SI003', 'nama' => 'Enterprise Resource Planning','semester' => 5, 'sks' => 3],
                ['kode' => 'SI004', 'nama' => 'Audit Sistem Informasi',      'semester' => 6, 'sks' => 3],
                ['kode' => 'SI005', 'nama' => 'Manajemen Proyek TI',         'semester' => 5, 'sks' => 3],
                ['kode' => 'SI006', 'nama' => 'Sistem Pendukung Keputusan',  'semester' => 6, 'sks' => 3],
                ['kode' => 'SI007', 'nama' => 'Manajemen Basis Data',        'semester' => 3, 'sks' => 4],
                ['kode' => 'SI008', 'nama' => 'E-Business',                  'semester' => 5, 'sks' => 3],
                ['kode' => 'SI009', 'nama' => 'Business Intelligence',       'semester' => 6, 'sks' => 3],
                ['kode' => 'SI010', 'nama' => 'IT Governance',               'semester' => 7, 'sks' => 3],
                ['kode' => 'SI011', 'nama' => 'Manajemen Layanan TI',        'semester' => 7, 'sks' => 3],
            ],

            // FT
            'TS' => [
                ['kode' => 'TS001', 'nama' => 'Mekanika Tanah',          'semester' => 3, 'sks' => 3],
                ['kode' => 'TS002', 'nama' => 'Struktur Beton',          'semester' => 4, 'sks' => 4],
                ['kode' => 'TS003', 'nama' => 'Hidrolika',               'semester' => 3, 'sks' => 3],
                ['kode' => 'TS004', 'nama' => 'Manajemen Konstruksi',    'semester' => 5, 'sks' => 3],
                ['kode' => 'TS005', 'nama' => 'Rekayasa Transportasi',   'semester' => 5, 'sks' => 3],
                ['kode' => 'TS006', 'nama' => 'Geoteknik',               'semester' => 4, 'sks' => 3],
                ['kode' => 'TS007', 'nama' => 'Struktur Baja',           'semester' => 5, 'sks' => 3],
            ],

            'TM' => [
                ['kode' => 'TM001', 'nama' => 'Termodinamika',       'semester' => 3, 'sks' => 3],
                ['kode' => 'TM002', 'nama' => 'Mekanika Fluida',     'semester' => 4, 'sks' => 3],
                ['kode' => 'TM003', 'nama' => 'Perpindahan Panas',   'semester' => 4, 'sks' => 3],
                ['kode' => 'TM004', 'nama' => 'Elemen Mesin',        'semester' => 3, 'sks' => 3],
                ['kode' => 'TM005', 'nama' => 'Proses Manufaktur',   'semester' => 5, 'sks' => 3],
                ['kode' => 'TM006', 'nama' => 'Getaran Mekanik',     'semester' => 5, 'sks' => 3],
            ],

            'TE' => [
                ['kode' => 'TE001', 'nama' => 'Rangkaian Listrik',      'semester' => 2, 'sks' => 4],
                ['kode' => 'TE002', 'nama' => 'Elektronika Dasar',      'semester' => 3, 'sks' => 3],
                ['kode' => 'TE003', 'nama' => 'Sistem Tenaga Listrik',  'semester' => 4, 'sks' => 3],
                ['kode' => 'TE004', 'nama' => 'Kontrol Otomatis',       'semester' => 5, 'sks' => 3],
                ['kode' => 'TE005', 'nama' => 'Telekomunikasi',         'semester' => 4, 'sks' => 3],
                ['kode' => 'TE006', 'nama' => 'Mikrokontroler',         'semester' => 5, 'sks' => 3],
            ],

            'TIN' => [
                ['kode' => 'TIN001', 'nama' => 'Riset Operasi',            'semester' => 4, 'sks' => 3],
                ['kode' => 'TIN002', 'nama' => 'Ergonomi',                 'semester' => 3, 'sks' => 3],
                ['kode' => 'TIN003', 'nama' => 'Perencanaan Produksi',     'semester' => 5, 'sks' => 3],
                ['kode' => 'TIN004', 'nama' => 'Manajemen Kualitas',       'semester' => 5, 'sks' => 3],
                ['kode' => 'TIN005', 'nama' => 'Sistem Produksi',          'semester' => 4, 'sks' => 3],
                ['kode' => 'TIN006', 'nama' => 'Analisis Perancangan Kerja','semester' => 3, 'sks' => 3],
                ['kode' => 'TIN007', 'nama' => 'Statistik Industri',       'semester' => 3, 'sks' => 3],
                ['kode' => 'TIN008', 'nama' => 'Manajemen Rantai Pasok',   'semester' => 6, 'sks' => 3],
            ],

            'ARS' => [
                ['kode' => 'ARS001', 'nama' => 'Perancangan Arsitektur', 'semester' => 3, 'sks' => 4],
                ['kode' => 'ARS002', 'nama' => 'Teori Arsitektur',       'semester' => 2, 'sks' => 3],
                ['kode' => 'ARS003', 'nama' => 'Struktur Bangunan',      'semester' => 3, 'sks' => 3],
                ['kode' => 'ARS004', 'nama' => 'Utilitas Bangunan',      'semester' => 4, 'sks' => 3],
                ['kode' => 'ARS005', 'nama' => 'Arsitektur Lingkungan',  'semester' => 5, 'sks' => 3],
            ],

            // FEB
            'MNJ' => [
                ['kode' => 'MNJ001', 'nama' => 'Manajemen Pemasaran', 'semester' => 3, 'sks' => 3],
                ['kode' => 'MNJ002', 'nama' => 'Manajemen Keuangan',  'semester' => 3, 'sks' => 3],
                ['kode' => 'MNJ003', 'nama' => 'Manajemen SDM',       'semester' => 4, 'sks' => 3],
                ['kode' => 'MNJ004', 'nama' => 'Perilaku Organisasi', 'semester' => 4, 'sks' => 3],
                ['kode' => 'MNJ005', 'nama' => 'Kewirausahaan',       'semester' => 5, 'sks' => 3],
                ['kode' => 'MNJ006', 'nama' => 'Manajemen Operasi',   'semester' => 5, 'sks' => 3],
            ],

            'AKT' => [
                ['kode' => 'AKT001', 'nama' => 'Akuntansi Keuangan',         'semester' => 2, 'sks' => 4],
                ['kode' => 'AKT002', 'nama' => 'Akuntansi Manajemen',        'semester' => 3, 'sks' => 3],
                ['kode' => 'AKT003', 'nama' => 'Audit',                      'semester' => 4, 'sks' => 3],
                ['kode' => 'AKT004', 'nama' => 'Perpajakan',                 'semester' => 4, 'sks' => 3],
                ['kode' => 'AKT005', 'nama' => 'Sistem Informasi Akuntansi', 'semester' => 5, 'sks' => 3],
            ],

            // FH
            'IH' => [
                ['kode' => 'IH001', 'nama' => 'Hukum Perdata',       'semester' => 2, 'sks' => 3],
                ['kode' => 'IH002', 'nama' => 'Hukum Pidana',        'semester' => 2, 'sks' => 3],
                ['kode' => 'IH003', 'nama' => 'Hukum Tata Negara',   'semester' => 3, 'sks' => 3],
                ['kode' => 'IH004', 'nama' => 'Hukum Internasional', 'semester' => 4, 'sks' => 3],
                ['kode' => 'IH005', 'nama' => 'Hukum Bisnis',        'semester' => 5, 'sks' => 3],
            ],

            // FK
            'KD' => [
                ['kode' => 'KD001', 'nama' => 'Anatomi',      'semester' => 1, 'sks' => 4],
                ['kode' => 'KD002', 'nama' => 'Fisiologi',    'semester' => 2, 'sks' => 4],
                ['kode' => 'KD003', 'nama' => 'Biokimia',     'semester' => 1, 'sks' => 4],
                ['kode' => 'KD004', 'nama' => 'Patologi',     'semester' => 3, 'sks' => 3],
                ['kode' => 'KD005', 'nama' => 'Farmakologi',  'semester' => 4, 'sks' => 3],
                ['kode' => 'KD006', 'nama' => 'Ilmu Klinik',  'semester' => 5, 'sks' => 4],
            ],

            // FSRD
            'DKV' => [
                ['kode' => 'DKV001', 'nama' => 'Desain Grafis', 'semester' => 1, 'sks' => 4],
                ['kode' => 'DKV002', 'nama' => 'Tipografi',     'semester' => 2, 'sks' => 3],
                ['kode' => 'DKV003', 'nama' => 'Ilustrasi',     'semester' => 2, 'sks' => 3],
                ['kode' => 'DKV004', 'nama' => 'Animasi',       'semester' => 3, 'sks' => 3],
                ['kode' => 'DKV005', 'nama' => 'Branding',      'semester' => 4, 'sks' => 3],
            ],

            'DI' => [
                ['kode' => 'DI001', 'nama' => 'Desain Interior Dasar', 'semester' => 1, 'sks' => 4],
                ['kode' => 'DI002', 'nama' => 'Material Interior',     'semester' => 2, 'sks' => 3],
                ['kode' => 'DI003', 'nama' => 'Pencahayaan',           'semester' => 3, 'sks' => 3],
                ['kode' => 'DI004', 'nama' => 'Furniture Design',      'semester' => 4, 'sks' => 3],
                ['kode' => 'DI005', 'nama' => 'Ergonomi Interior',     'semester' => 4, 'sks' => 3],
            ],

            // FPSI
            'PSI' => [
                ['kode' => 'PSI001', 'nama' => 'Psikologi Umum',     'semester' => 1, 'sks' => 3],
                ['kode' => 'PSI002', 'nama' => 'Psikologi Sosial',   'semester' => 2, 'sks' => 3],
                ['kode' => 'PSI003', 'nama' => 'Psikologi Klinis',   'semester' => 4, 'sks' => 3],
                ['kode' => 'PSI004', 'nama' => 'Psikologi Industri', 'semester' => 4, 'sks' => 3],
                ['kode' => 'PSI005', 'nama' => 'Psikometri',         'semester' => 3, 'sks' => 3],
            ],

            // FIKOM (KRS mulai semester 2)
            'IK' => [
                ['kode' => 'IK001', 'nama' => 'Public Relations',  'semester' => 2, 'sks' => 3],
                ['kode' => 'IK002', 'nama' => 'Jurnalistik',       'semester' => 2, 'sks' => 3],
                ['kode' => 'IK003', 'nama' => 'Komunikasi Massa',  'semester' => 3, 'sks' => 3],
                ['kode' => 'IK004', 'nama' => 'Broadcasting',      'semester' => 3, 'sks' => 3],
                ['kode' => 'IK005', 'nama' => 'Media Digital',     'semester' => 4, 'sks' => 3],
            ],
        ];

        $insertData = [];

        foreach ($data as $kodeProdi => $matkuls) {
            foreach ($matkuls as $m) {
                $insertData[] = [
                    'prodi_id'   => $prodi[$kodeProdi],
                    'kode'       => $m['kode'],
                    'nama'       => $m['nama'],
                    'semester'   => $m['semester'],
                    'sks'        => $m['sks'],
                    'created_at' => now(),
                    'updated_at' => now(),
                ];
            }
        }

        DB::table('mata_kuliah')->insert($insertData);
    }
}