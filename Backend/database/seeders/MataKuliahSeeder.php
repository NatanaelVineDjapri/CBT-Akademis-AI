<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class MatkulSeeder extends Seeder
{
    public function run(): void
    {
        $prodi = DB::table('prodi')->pluck('id', 'kode');

        $data = [

            // FTI
            'TI' => [
                'Etika Profesi TI','DevOps','Big Data Analytics','Internet of Things',
                'Grafika Komputer','Kompilator','Arsitektur Komputer','Pemrograman Fungsional',
                'Basis Data Lanjut','Logika Matematika','Struktur Data', 'Kalkulus'
            ],

            'SI' => [
                'Analisis Sistem','Perancangan Sistem','Enterprise Resource Planning',
                'Audit Sistem Informasi','Manajemen Proyek TI','Sistem Pendukung Keputusan',
                'Manajemen Basis Data','E-Business','Business Intelligence',
                'IT Governance','Manajemen Layanan TI'
            ],

            // FT
            'TS' => [
                'Mekanika Tanah','Struktur Beton','Hidrolika','Manajemen Konstruksi',
                'Rekayasa Transportasi','Geoteknik','Struktur Baja'
            ],

            'TM' => [
                'Termodinamika','Mekanika Fluida','Perpindahan Panas','Elemen Mesin',
                'Proses Manufaktur','Getaran Mekanik'
            ],

            'TE' => [
                'Rangkaian Listrik','Elektronika Dasar','Sistem Tenaga Listrik',
                'Kontrol Otomatis','Telekomunikasi','Mikrokontroler'
            ],

            'TIN' => [
                'Riset Operasi','Ergonomi', 'Perencanaan Produksi','Manajemen Kualitas',
                'Sistem Produksi', 'Analisis Perancangan Kerja', 'Statistik Industri',
                'Manajemen Rantai Pasok'
            ],
            'ARS' => [
                'Perancangan Arsitektur','Teori Arsitektur','Struktur Bangunan',
                'Utilitas Bangunan','Arsitektur Lingkungan'
    
            ],
            // FEB
            'MAN' => [
                'Manajemen Pemasaran','Manajemen Keuangan','Manajemen SDM',
                'Perilaku Organisasi','Kewirausahaan','Manajemen Operasi'
            ],

            'AKT' => [
                'Akuntansi Keuangan','Akuntansi Manajemen','Audit','Perpajakan',
                'Sistem Informasi Akuntansi'
            ],

            // FH
            'IH' => [
                'Hukum Perdata','Hukum Pidana','Hukum Tata Negara',
                'Hukum Internasional','Hukum Bisnis'
            ],

            // FK
            'PD' => [
                'Anatomi','Fisiologi','Biokimia','Patologi','Farmakologi','Ilmu Klinik'
            ],

            // FSRD
            'DKV' => [
                'Desain Grafis','Tipografi','Ilustrasi','Animasi','Branding'
            ],

            'DI' => [
                'Desain Interior Dasar','Material Interior','Pencahayaan',
                'Furniture Design','Ergonomi'
            ],

            // FPSI
            'PSI' => [
                'Psikologi Umum','Psikologi Sosial','Psikologi Klinis',
                'Psikologi Industri','Psikometri'
            ],

            // FIKOM
            'IK' => [
                'Public Relations','Jurnalistik','Komunikasi Massa',
                'Broadcasting','Media Digital'
            ],
        ];

        $insertData = [];

        foreach ($data as $kodeProdi => $matkuls) {
            foreach ($matkuls as $namaMatkul) {
                $insertData[] = [
                    'prodi_id'   => $prodi[$kodeProdi],
                    'nama'       => $namaMatkul,
                    'created_at' => now(),
                    'updated_at' => now(),
                ];
            }
        }

        DB::table('matkul')->insert($insertData);
    }
}