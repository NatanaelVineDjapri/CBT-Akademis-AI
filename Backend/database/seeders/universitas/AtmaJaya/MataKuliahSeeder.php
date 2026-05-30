<?php

namespace Database\Seeders\Universitas\AtmaJaya;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class MataKuliahSeeder extends Seeder
{
    public function run(): void
    {
        $prodi = DB::table('prodi')->whereIn('kode', ['AJTI','AJTE','AJTM','AJTIN','AJMJ','AJAK','AJIH','AJARS'])->pluck('id', 'kode');
        $data = [
            'AJTI'  => [['kode' => 'AJTI001', 'nama' => 'Algoritma & Pemrograman', 'semester' => 1, 'sks' => 4],
                       ['kode' => 'AJTI002', 'nama' => 'Struktur Data',           'semester' => 2, 'sks' => 3]],
            'AJTE'  => [['kode' => 'AJTE001', 'nama' => 'Rangkaian Listrik',       'semester' => 2, 'sks' => 4],
                       ['kode' => 'AJTE002', 'nama' => 'Elektronika Dasar',       'semester' => 3, 'sks' => 3]],
            'AJTM'  => [['kode' => 'AJTM001', 'nama' => 'Termodinamika',           'semester' => 3, 'sks' => 3],
                       ['kode' => 'AJTM002', 'nama' => 'Mekanika Fluida',         'semester' => 4, 'sks' => 3]],
            'AJTIN' => [['kode' => 'AJTIN001', 'nama' => 'Riset Operasi',          'semester' => 4, 'sks' => 3],
                       ['kode' => 'AJTIN002', 'nama' => 'Ergonomi',               'semester' => 3, 'sks' => 3]],
            'AJMJ'  => [['kode' => 'AJMJ001', 'nama' => 'Manajemen Pemasaran',     'semester' => 3, 'sks' => 3],
                       ['kode' => 'AJMJ002', 'nama' => 'Manajemen Keuangan',      'semester' => 3, 'sks' => 3]],
            'AJAK'  => [['kode' => 'AJAK001', 'nama' => 'Akuntansi Keuangan',      'semester' => 2, 'sks' => 4],
                       ['kode' => 'AJAK002', 'nama' => 'Audit',                   'semester' => 4, 'sks' => 3]],
            'AJIH'  => [['kode' => 'AJIH001', 'nama' => 'Hukum Perdata',           'semester' => 2, 'sks' => 3],
                       ['kode' => 'AJIH002', 'nama' => 'Hukum Pidana',            'semester' => 2, 'sks' => 3]],
            'AJARS' => [['kode' => 'AJARS001', 'nama' => 'Perancangan Arsitektur', 'semester' => 3, 'sks' => 4],
                       ['kode' => 'AJARS002', 'nama' => 'Teori Arsitektur',       'semester' => 2, 'sks' => 3]],
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
