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
                ['kode' => 'SI001', 'nama' => 'Analisis Sistem'],
                ['kode' => 'SI002', 'nama' => 'Perancangan Sistem'],
                ['kode' => 'SI003', 'nama' => 'Enterprise Resource Planning'],
                ['kode' => 'SI004', 'nama' => 'Audit Sistem Informasi'],
                ['kode' => 'SI005', 'nama' => 'Manajemen Proyek TI'],
                ['kode' => 'SI006', 'nama' => 'Sistem Pendukung Keputusan'],
                ['kode' => 'SI007', 'nama' => 'Manajemen Basis Data'],
                ['kode' => 'SI008', 'nama' => 'E-Business'],
                ['kode' => 'SI009', 'nama' => 'Business Intelligence'],
                ['kode' => 'SI010', 'nama' => 'IT Governance'],
                ['kode' => 'SI011', 'nama' => 'Manajemen Layanan TI'],
            ],

            // FT
            'TS' => [
                ['kode' => 'TS001', 'nama' => 'Mekanika Tanah'],
                ['kode' => 'TS002', 'nama' => 'Struktur Beton'],
                ['kode' => 'TS003', 'nama' => 'Hidrolika'],
                ['kode' => 'TS004', 'nama' => 'Manajemen Konstruksi'],
                ['kode' => 'TS005', 'nama' => 'Rekayasa Transportasi'],
                ['kode' => 'TS006', 'nama' => 'Geoteknik'],
                ['kode' => 'TS007', 'nama' => 'Struktur Baja'],
            ],

            'TM' => [
                ['kode' => 'TM001', 'nama' => 'Termodinamika'],
                ['kode' => 'TM002', 'nama' => 'Mekanika Fluida'],
                ['kode' => 'TM003', 'nama' => 'Perpindahan Panas'],
                ['kode' => 'TM004', 'nama' => 'Elemen Mesin'],
                ['kode' => 'TM005', 'nama' => 'Proses Manufaktur'],
                ['kode' => 'TM006', 'nama' => 'Getaran Mekanik'],
            ],

            'TE' => [
                ['kode' => 'TE001', 'nama' => 'Rangkaian Listrik'],
                ['kode' => 'TE002', 'nama' => 'Elektronika Dasar'],
                ['kode' => 'TE003', 'nama' => 'Sistem Tenaga Listrik'],
                ['kode' => 'TE004', 'nama' => 'Kontrol Otomatis'],
                ['kode' => 'TE005', 'nama' => 'Telekomunikasi'],
                ['kode' => 'TE006', 'nama' => 'Mikrokontroler'],
            ],

            'TIN' => [
                ['kode' => 'TIN001', 'nama' => 'Riset Operasi'],
                ['kode' => 'TIN002', 'nama' => 'Ergonomi'],
                ['kode' => 'TIN003', 'nama' => 'Perencanaan Produksi'],
                ['kode' => 'TIN004', 'nama' => 'Manajemen Kualitas'],
                ['kode' => 'TIN005', 'nama' => 'Sistem Produksi'],
                ['kode' => 'TIN006', 'nama' => 'Analisis Perancangan Kerja'],
                ['kode' => 'TIN007', 'nama' => 'Statistik Industri'],
                ['kode' => 'TIN008', 'nama' => 'Manajemen Rantai Pasok'],
            ],

            'ARS' => [
                ['kode' => 'ARS001', 'nama' => 'Perancangan Arsitektur'],
                ['kode' => 'ARS002', 'nama' => 'Teori Arsitektur'],
                ['kode' => 'ARS003', 'nama' => 'Struktur Bangunan'],
                ['kode' => 'ARS004', 'nama' => 'Utilitas Bangunan'],
                ['kode' => 'ARS005', 'nama' => 'Arsitektur Lingkungan'],
            ],

            // FEB
            'MNJ' => [
                ['kode' => 'MNJ001', 'nama' => 'Manajemen Pemasaran'],
                ['kode' => 'MNJ002', 'nama' => 'Manajemen Keuangan'],
                ['kode' => 'MNJ003', 'nama' => 'Manajemen SDM'],
                ['kode' => 'MNJ004', 'nama' => 'Perilaku Organisasi'],
                ['kode' => 'MNJ005', 'nama' => 'Kewirausahaan'],
                ['kode' => 'MNJ006', 'nama' => 'Manajemen Operasi'],
            ],

            'AKT' => [
                ['kode' => 'AKT001', 'nama' => 'Akuntansi Keuangan'],
                ['kode' => 'AKT002', 'nama' => 'Akuntansi Manajemen'],
                ['kode' => 'AKT003', 'nama' => 'Audit'],
                ['kode' => 'AKT004', 'nama' => 'Perpajakan'],
                ['kode' => 'AKT005', 'nama' => 'Sistem Informasi Akuntansi'],
            ],

            // FH
            'IH' => [
                ['kode' => 'IH001', 'nama' => 'Hukum Perdata'],
                ['kode' => 'IH002', 'nama' => 'Hukum Pidana'],
                ['kode' => 'IH003', 'nama' => 'Hukum Tata Negara'],
                ['kode' => 'IH004', 'nama' => 'Hukum Internasional'],
                ['kode' => 'IH005', 'nama' => 'Hukum Bisnis'],
            ],

            // FK
            'KD' => [
                ['kode' => 'KD001', 'nama' => 'Anatomi'],
                ['kode' => 'KD002', 'nama' => 'Fisiologi'],
                ['kode' => 'KD003', 'nama' => 'Biokimia'],
                ['kode' => 'KD004', 'nama' => 'Patologi'],
                ['kode' => 'KD005', 'nama' => 'Farmakologi'],
                ['kode' => 'KD006', 'nama' => 'Ilmu Klinik'],
            ],

            // FSRD
            'DKV' => [
                ['kode' => 'DKV001', 'nama' => 'Desain Grafis'],
                ['kode' => 'DKV002', 'nama' => 'Tipografi'],
                ['kode' => 'DKV003', 'nama' => 'Ilustrasi'],
                ['kode' => 'DKV004', 'nama' => 'Animasi'],
                ['kode' => 'DKV005', 'nama' => 'Branding'],
            ],

            'DI' => [
                ['kode' => 'DI001', 'nama' => 'Desain Interior Dasar'],
                ['kode' => 'DI002', 'nama' => 'Material Interior'],
                ['kode' => 'DI003', 'nama' => 'Pencahayaan'],
                ['kode' => 'DI004', 'nama' => 'Furniture Design'],
                ['kode' => 'DI005', 'nama' => 'Ergonomi Interior'],
            ],

            // FPSI
            'PSI' => [
                ['kode' => 'PSI001', 'nama' => 'Psikologi Umum'],
                ['kode' => 'PSI002', 'nama' => 'Psikologi Sosial'],
                ['kode' => 'PSI003', 'nama' => 'Psikologi Klinis'],
                ['kode' => 'PSI004', 'nama' => 'Psikologi Industri'],
                ['kode' => 'PSI005', 'nama' => 'Psikometri'],
            ],

            // FIKOM
            'IK' => [
                ['kode' => 'IK001', 'nama' => 'Public Relations'],
                ['kode' => 'IK002', 'nama' => 'Jurnalistik'],
                ['kode' => 'IK003', 'nama' => 'Komunikasi Massa'],
                ['kode' => 'IK004', 'nama' => 'Broadcasting'],
                ['kode' => 'IK005', 'nama' => 'Media Digital'],
            ],
        ];

        $insertData = [];

        foreach ($data as $kodeProdi => $matkuls) {
            foreach ($matkuls as $m) {
                $insertData[] = [
                    'prodi_id'   => $prodi[$kodeProdi],
                    'kode'       => $m['kode'],
                    'nama'       => $m['nama'],
                    'created_at' => now(),
                    'updated_at' => now(),
                ];
            }
        }

        DB::table('mata_kuliah')->insert($insertData);
    }
}