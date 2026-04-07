<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class ProdiSeeder extends Seeder
{
    public function run(): void
    {
        $fti = DB::table('fakultas')->where('kode', 'FTI')->value('id');
        $ft  = DB::table('fakultas')->where('kode', 'FT')->value('id');
        $feb = DB::table('fakultas')->where('kode', 'FEB')->value('id');
        $fh  = DB::table('fakultas')->where('kode', 'FH')->value('id');

        DB::table('prodi')->insert([
            // FTI
            ['fakultas_id' => $fti, 'nama' => 'Teknik Informatika', 'kode' => 'TI', 'created_at' => now(), 'updated_at' => now()],
            ['fakultas_id' => $fti, 'nama' => 'Sistem Informasi', 'kode' => 'SI', 'created_at' => now(), 'updated_at' => now()],
            // FT
            ['fakultas_id' => $ft, 'nama' => 'Teknik Sipil', 'kode' => 'TS', 'created_at' => now(), 'updated_at' => now()],
            ['fakultas_id' => $ft, 'nama' => 'Teknik Elektro', 'kode' => 'TE', 'created_at' => now(), 'updated_at' => now()],
            // FEB
            ['fakultas_id' => $feb, 'nama' => 'Manajemen', 'kode' => 'MNJ', 'created_at' => now(), 'updated_at' => now()],
            ['fakultas_id' => $feb, 'nama' => 'Akuntansi', 'kode' => 'AKT', 'created_at' => now(), 'updated_at' => now()],
            // FH
            ['fakultas_id' => $fh, 'nama' => 'Ilmu Hukum', 'kode' => 'IH', 'created_at' => now(), 'updated_at' => now()],
        ]);
    }
}
