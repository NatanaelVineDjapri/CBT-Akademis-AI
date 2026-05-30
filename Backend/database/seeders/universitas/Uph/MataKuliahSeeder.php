<?php

namespace Database\Seeders\Universitas\Uph;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class MataKuliahSeeder extends Seeder
{
    public function run(): void
    {
        $prodi = DB::table('prodi')->whereIn('kode', ['PHTI','PHSIS','PHMJ','PHAK','PHIK','PHIH','PHKD','PHDKV'])->pluck('id', 'kode');
        $data = [
            'PHTI'  => [['kode' => 'PHTI001', 'nama' => 'Algoritma & Pemrograman', 'semester' => 1, 'sks' => 4],
                       ['kode' => 'PHTI002', 'nama' => 'Struktur Data',           'semester' => 2, 'sks' => 3],
                       ['kode' => 'PHTI003', 'nama' => 'Basis Data',              'semester' => 3, 'sks' => 3]],
            'PHSIS' => [['kode' => 'PHSIS001', 'nama' => 'Analisis Sistem',        'semester' => 3, 'sks' => 3],
                       ['kode' => 'PHSIS002', 'nama' => 'Manajemen Proyek TI',    'semester' => 4, 'sks' => 3]],
            'PHMJ'  => [['kode' => 'PHMJ001', 'nama' => 'Manajemen Pemasaran',     'semester' => 3, 'sks' => 3],
                       ['kode' => 'PHMJ002', 'nama' => 'Manajemen Keuangan',      'semester' => 3, 'sks' => 3]],
            'PHAK'  => [['kode' => 'PHAK001', 'nama' => 'Akuntansi Keuangan',      'semester' => 2, 'sks' => 4],
                       ['kode' => 'PHAK002', 'nama' => 'Audit',                   'semester' => 4, 'sks' => 3]],
            'PHIK'  => [['kode' => 'PHIK001', 'nama' => 'Komunikasi Massa',        'semester' => 2, 'sks' => 3],
                       ['kode' => 'PHIK002', 'nama' => 'Public Relations',        'semester' => 3, 'sks' => 3]],
            'PHIH'  => [['kode' => 'PHIH001', 'nama' => 'Hukum Perdata',           'semester' => 2, 'sks' => 3],
                       ['kode' => 'PHIH002', 'nama' => 'Hukum Pidana',            'semester' => 2, 'sks' => 3]],
            'PHKD'  => [['kode' => 'PHKD001', 'nama' => 'Anatomi',                 'semester' => 1, 'sks' => 4],
                       ['kode' => 'PHKD002', 'nama' => 'Fisiologi',               'semester' => 2, 'sks' => 4]],
            'PHDKV' => [['kode' => 'PHDKV001', 'nama' => 'Desain Grafis',          'semester' => 1, 'sks' => 4],
                       ['kode' => 'PHDKV002', 'nama' => 'Tipografi',              'semester' => 2, 'sks' => 3]],
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
