<?php

namespace Database\Seeders\Universitas\Umn;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class MataKuliahSeeder extends Seeder
{
    public function run(): void
    {
        $prodi = DB::table('prodi')->whereIn('kode', ['UTI','USI','UTKE','UMNJ','UAKT','UIK','UJR','UDKV','UDIN','UFLM','UIH'])->pluck('id', 'kode');
        $data = [
            'UTI'  => [['kode' => 'UTI001', 'nama' => 'Algoritma & Pemrograman',  'semester' => 1, 'sks' => 4],
                      ['kode' => 'UTI002', 'nama' => 'Struktur Data',            'semester' => 2, 'sks' => 3],
                      ['kode' => 'UTI003', 'nama' => 'Basis Data',               'semester' => 3, 'sks' => 3],
                      ['kode' => 'UTI004', 'nama' => 'Rekayasa Perangkat Lunak', 'semester' => 4, 'sks' => 3]],
            'USI'  => [['kode' => 'USI001', 'nama' => 'Analisis Sistem',          'semester' => 3, 'sks' => 3],
                      ['kode' => 'USI002', 'nama' => 'Manajemen Proyek TI',      'semester' => 4, 'sks' => 3]],
            'UTKE' => [['kode' => 'UTKE001', 'nama' => 'Mikrokontroler',          'semester' => 4, 'sks' => 3],
                      ['kode' => 'UTKE002', 'nama' => 'Elektronika Dasar',       'semester' => 2, 'sks' => 3]],
            'UMNJ' => [['kode' => 'UMNJ001', 'nama' => 'Manajemen Pemasaran',     'semester' => 3, 'sks' => 3],
                      ['kode' => 'UMNJ002', 'nama' => 'Manajemen Keuangan',      'semester' => 3, 'sks' => 3]],
            'UAKT' => [['kode' => 'UAKT001', 'nama' => 'Akuntansi Keuangan',      'semester' => 2, 'sks' => 4],
                      ['kode' => 'UAKT002', 'nama' => 'Audit',                   'semester' => 4, 'sks' => 3]],
            'UIK'  => [['kode' => 'UIK001', 'nama' => 'Komunikasi Massa',         'semester' => 2, 'sks' => 3],
                      ['kode' => 'UIK002', 'nama' => 'Public Relations',         'semester' => 3, 'sks' => 3]],
            'UJR'  => [['kode' => 'UJR001', 'nama' => 'Jurnalistik Dasar',        'semester' => 2, 'sks' => 3],
                      ['kode' => 'UJR002', 'nama' => 'Reportase',                'semester' => 3, 'sks' => 3]],
            'UDKV' => [['kode' => 'UDKV001', 'nama' => 'Desain Grafis',           'semester' => 1, 'sks' => 4],
                      ['kode' => 'UDKV002', 'nama' => 'Tipografi',               'semester' => 2, 'sks' => 3]],
            'UDIN' => [['kode' => 'UDIN001', 'nama' => 'Desain Interior Dasar',   'semester' => 1, 'sks' => 4],
                      ['kode' => 'UDIN002', 'nama' => 'Material Interior',       'semester' => 2, 'sks' => 3]],
            'UFLM' => [['kode' => 'UFLM001', 'nama' => 'Produksi Film',           'semester' => 3, 'sks' => 3],
                      ['kode' => 'UFLM002', 'nama' => 'Sinematografi',           'semester' => 4, 'sks' => 3]],
            'UIH'  => [['kode' => 'UIH001', 'nama' => 'Hukum Perdata',            'semester' => 2, 'sks' => 3],
                      ['kode' => 'UIH002', 'nama' => 'Hukum Pidana',             'semester' => 2, 'sks' => 3]],
        ];
        $this->insertMatkul($prodi, $data);
    }
    private function insertMatkul($prodi, $data): void
    {
        $insertData = [];
        foreach ($data as $kodeProdi => $matkuls) {
            if (!isset($prodi[$kodeProdi])) continue;
            foreach ($matkuls as $m) {
                $insertData[] = ['prodi_id' => $prodi[$kodeProdi], 'kode' => $m['kode'], 'nama' => $m['nama'], 'semester' => $m['semester'], 'sks' => $m['sks'], 'created_at' => now(), 'updated_at' => now()];
            }
        }
        DB::table('mata_kuliah')->insert($insertData);
    }
}
