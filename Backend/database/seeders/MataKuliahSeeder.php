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
                'Pemrograman Web','Basis Data','Algoritma dan Pemrograman','Struktur Data',
                'Sistem Operasi','Jaringan Komputer','Pemrograman Berorientasi Objek',
                'Rekayasa Perangkat Lunak','Kecerdasan Buatan','Machine Learning',
                'Pengolahan Citra Digital','Keamanan Sistem Informasi','Pemrograman Mobile',
                'Cloud Computing','Data Mining','Interaksi Manusia Komputer',
                'Matematika Diskrit','Kalkulus','Statistika dan Probabilitas',
                'Logika Matematika','Basis Data Lanjut','Pemrograman Fungsional',
                'Arsitektur Komputer','Kompilator','Grafika Komputer',
                'Internet of Things','Big Data Analytics','DevOps','Etika Profesi TI',
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