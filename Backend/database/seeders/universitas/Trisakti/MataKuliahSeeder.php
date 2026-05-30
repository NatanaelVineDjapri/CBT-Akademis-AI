<?php

namespace Database\Seeders\Universitas\Trisakti;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class MataKuliahSeeder extends Seeder
{
    public function run(): void
    {
        $prodi = DB::table('prodi')->whereIn('kode', ['TRTI','TRTE','TRTM','TRTIN','TRTS','TRARS','TRMJ','TRAK','TRIH'])->pluck('id', 'kode');
        $data = [
            'TRTI'  => [['kode' => 'TRTI001', 'nama' => 'Algoritma & Pemrograman', 'semester' => 1, 'sks' => 4],
                       ['kode' => 'TRTI002', 'nama' => 'Struktur Data',           'semester' => 2, 'sks' => 3]],
            'TRTE'  => [['kode' => 'TRTE001', 'nama' => 'Rangkaian Listrik',       'semester' => 2, 'sks' => 4],
                       ['kode' => 'TRTE002', 'nama' => 'Elektronika Dasar',       'semester' => 3, 'sks' => 3]],
            'TRTM'  => [['kode' => 'TRTM001', 'nama' => 'Termodinamika',           'semester' => 3, 'sks' => 3],
                       ['kode' => 'TRTM002', 'nama' => 'Mekanika Fluida',         'semester' => 4, 'sks' => 3]],
            'TRTIN' => [['kode' => 'TRTIN001', 'nama' => 'Riset Operasi',          'semester' => 4, 'sks' => 3],
                       ['kode' => 'TRTIN002', 'nama' => 'Ergonomi',               'semester' => 3, 'sks' => 3]],
            'TRTS'  => [['kode' => 'TRTS001', 'nama' => 'Mekanika Tanah',          'semester' => 3, 'sks' => 3],
                       ['kode' => 'TRTS002', 'nama' => 'Struktur Beton',          'semester' => 4, 'sks' => 4]],
            'TRARS' => [['kode' => 'TRARS001', 'nama' => 'Perancangan Arsitektur', 'semester' => 3, 'sks' => 4],
                       ['kode' => 'TRARS002', 'nama' => 'Teori Arsitektur',       'semester' => 2, 'sks' => 3]],
            'TRMJ'  => [['kode' => 'TRMJ001', 'nama' => 'Manajemen Pemasaran',     'semester' => 3, 'sks' => 3],
                       ['kode' => 'TRMJ002', 'nama' => 'Manajemen Keuangan',      'semester' => 3, 'sks' => 3]],
            'TRAK'  => [['kode' => 'TRAK001', 'nama' => 'Akuntansi Keuangan',      'semester' => 2, 'sks' => 4],
                       ['kode' => 'TRAK002', 'nama' => 'Audit',                   'semester' => 4, 'sks' => 3]],
            'TRIH'  => [['kode' => 'TRIH001', 'nama' => 'Hukum Perdata',           'semester' => 2, 'sks' => 3],
                       ['kode' => 'TRIH002', 'nama' => 'Hukum Pidana',            'semester' => 2, 'sks' => 3]],
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
