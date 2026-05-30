<?php

namespace Database\Seeders\Universitas\Binus;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class MataKuliahSeeder extends Seeder
{
    public function run(): void
    {
        $prodi = DB::table('prodi')
            ->whereIn('kode', ['BCS','BAI','BCYB','BIS','BDS','BIET','BARC','BTSV','BTKE','BAKT','BFIN','BMC','BHI','BENG','BPSI','BHUK','BDKV','BDIN'])
            ->pluck('id', 'kode');

        $data = [
            'BCS'  => [['kode' => 'BCS001', 'nama' => 'Algoritma & Pemrograman',  'semester' => 1, 'sks' => 4],
                      ['kode' => 'BCS002', 'nama' => 'Struktur Data',            'semester' => 2, 'sks' => 3],
                      ['kode' => 'BCS003', 'nama' => 'Basis Data',               'semester' => 3, 'sks' => 3],
                      ['kode' => 'BCS004', 'nama' => 'Jaringan Komputer',        'semester' => 3, 'sks' => 3],
                      ['kode' => 'BCS005', 'nama' => 'Rekayasa Perangkat Lunak', 'semester' => 4, 'sks' => 3]],
            'BAI'  => [['kode' => 'BAI001', 'nama' => 'Kecerdasan Buatan',        'semester' => 3, 'sks' => 3],
                      ['kode' => 'BAI002', 'nama' => 'Machine Learning',         'semester' => 4, 'sks' => 3],
                      ['kode' => 'BAI003', 'nama' => 'Deep Learning',            'semester' => 5, 'sks' => 3]],
            'BCYB' => [['kode' => 'BCYB001', 'nama' => 'Keamanan Jaringan',      'semester' => 3, 'sks' => 3],
                      ['kode' => 'BCYB002', 'nama' => 'Kriptografi',            'semester' => 4, 'sks' => 3],
                      ['kode' => 'BCYB003', 'nama' => 'Ethical Hacking',        'semester' => 5, 'sks' => 3]],
            'BIS'  => [['kode' => 'BIS001', 'nama' => 'Analisis Sistem',          'semester' => 3, 'sks' => 3],
                      ['kode' => 'BIS002', 'nama' => 'Enterprise Resource Planning','semester' => 4, 'sks' => 3],
                      ['kode' => 'BIS003', 'nama' => 'Business Intelligence',    'semester' => 5, 'sks' => 3]],
            'BDS'  => [['kode' => 'BDS001', 'nama' => 'Statistika',               'semester' => 2, 'sks' => 3],
                      ['kode' => 'BDS002', 'nama' => 'Data Mining',              'semester' => 4, 'sks' => 3],
                      ['kode' => 'BDS003', 'nama' => 'Big Data Analytics',       'semester' => 5, 'sks' => 3]],
            'BIET' => [['kode' => 'BIET001', 'nama' => 'Riset Operasi',           'semester' => 4, 'sks' => 3],
                      ['kode' => 'BIET002', 'nama' => 'Ergonomi',                'semester' => 3, 'sks' => 3],
                      ['kode' => 'BIET003', 'nama' => 'Manajemen Kualitas',      'semester' => 5, 'sks' => 3]],
            'BARC' => [['kode' => 'BARC001', 'nama' => 'Perancangan Arsitektur',  'semester' => 3, 'sks' => 4],
                      ['kode' => 'BARC002', 'nama' => 'Teori Arsitektur',        'semester' => 2, 'sks' => 3]],
            'BTSV' => [['kode' => 'BTSV001', 'nama' => 'Mekanika Tanah',          'semester' => 3, 'sks' => 3],
                      ['kode' => 'BTSV002', 'nama' => 'Struktur Beton',          'semester' => 4, 'sks' => 4]],
            'BTKE' => [['kode' => 'BTKE001', 'nama' => 'Mikrokontroler',          'semester' => 4, 'sks' => 3],
                      ['kode' => 'BTKE002', 'nama' => 'Sistem Digital',          'semester' => 3, 'sks' => 3]],
            'BAKT' => [['kode' => 'BAKT001', 'nama' => 'Akuntansi Keuangan',      'semester' => 2, 'sks' => 4],
                      ['kode' => 'BAKT002', 'nama' => 'Audit',                   'semester' => 4, 'sks' => 3]],
            'BFIN' => [['kode' => 'BFIN001', 'nama' => 'Manajemen Keuangan',      'semester' => 3, 'sks' => 3],
                      ['kode' => 'BFIN002', 'nama' => 'Pasar Modal',             'semester' => 4, 'sks' => 3]],
            'BMC'  => [['kode' => 'BMC001', 'nama' => 'Komunikasi Pemasaran',     'semester' => 3, 'sks' => 3],
                      ['kode' => 'BMC002', 'nama' => 'Digital Marketing',        'semester' => 4, 'sks' => 3]],
            'BHI'  => [['kode' => 'BHI001', 'nama' => 'Hubungan Internasional',   'semester' => 2, 'sks' => 3],
                      ['kode' => 'BHI002', 'nama' => 'Diplomasi',                'semester' => 3, 'sks' => 3]],
            'BENG' => [['kode' => 'BENG001', 'nama' => 'Sastra Inggris',          'semester' => 2, 'sks' => 3],
                      ['kode' => 'BENG002', 'nama' => 'Linguistik',              'semester' => 3, 'sks' => 3]],
            'BPSI' => [['kode' => 'BPSI001', 'nama' => 'Psikologi Umum',          'semester' => 1, 'sks' => 3],
                      ['kode' => 'BPSI002', 'nama' => 'Psikologi Sosial',        'semester' => 2, 'sks' => 3]],
            'BHUK' => [['kode' => 'BHUK001', 'nama' => 'Hukum Perdata',           'semester' => 2, 'sks' => 3],
                      ['kode' => 'BHUK002', 'nama' => 'Hukum Pidana',            'semester' => 2, 'sks' => 3]],
            'BDKV' => [['kode' => 'BDKV001', 'nama' => 'Desain Grafis',           'semester' => 1, 'sks' => 4],
                      ['kode' => 'BDKV002', 'nama' => 'Tipografi',               'semester' => 2, 'sks' => 3]],
            'BDIN' => [['kode' => 'BDIN001', 'nama' => 'Desain Interior Dasar',   'semester' => 1, 'sks' => 4],
                      ['kode' => 'BDIN002', 'nama' => 'Material Interior',       'semester' => 2, 'sks' => 3]],
        ];

        $insertData = [];
        foreach ($data as $kodeProdi => $matkuls) {
            if (!isset($prodi[$kodeProdi])) continue;
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
