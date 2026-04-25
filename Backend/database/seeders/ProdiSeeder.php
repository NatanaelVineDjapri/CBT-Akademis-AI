<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class ProdiSeeder extends Seeder
{
    public function run(): void
    {
        $fti  = DB::table('fakultas')->where('kode', 'FTI')->value('id');
        $ft   = DB::table('fakultas')->where('kode', 'FT')->value('id');
        $feb  = DB::table('fakultas')->where('kode', 'FEB')->value('id');
        $fh   = DB::table('fakultas')->where('kode', 'FH')->value('id');
        $fk   = DB::table('fakultas')->where('kode', 'FK')->value('id');
        $fsrd = DB::table('fakultas')->where('kode', 'FSRD')->value('id');
        $fpsi = DB::table('fakultas')->where('kode', 'FPSI')->value('id');
        $fkom = DB::table('fakultas')->where('kode', 'FIKOM')->value('id');

        DB::table('prodi')->insert([
            ['fakultas_id' => $fti,  'nama' => 'Teknik Informatika',        'kode' => 'TI',  'created_at' => now(), 'updated_at' => now()],
            ['fakultas_id' => $fti,  'nama' => 'Sistem Informasi',          'kode' => 'SI',  'created_at' => now(), 'updated_at' => now()],
            ['fakultas_id' => $ft,   'nama' => 'Teknik Sipil',              'kode' => 'TS',  'created_at' => now(), 'updated_at' => now()],
            ['fakultas_id' => $ft,   'nama' => 'Teknik Elektro',            'kode' => 'TE',  'created_at' => now(), 'updated_at' => now()],
            ['fakultas_id' => $ft,   'nama' => 'Teknik Mesin',              'kode' => 'TM',  'created_at' => now(), 'updated_at' => now()],
            ['fakultas_id' => $ft,   'nama' => 'Teknik Industri',           'kode' => 'TIN', 'created_at' => now(), 'updated_at' => now()],
            ['fakultas_id' => $ft,   'nama' => 'Arsitektur',                'kode' => 'ARS', 'created_at' => now(), 'updated_at' => now()],
            ['fakultas_id' => $feb,  'nama' => 'Manajemen',                 'kode' => 'MNJ', 'created_at' => now(), 'updated_at' => now()],
            ['fakultas_id' => $feb,  'nama' => 'Akuntansi',                 'kode' => 'AKT', 'created_at' => now(), 'updated_at' => now()],
            ['fakultas_id' => $fh,   'nama' => 'Ilmu Hukum',               'kode' => 'IH',  'created_at' => now(), 'updated_at' => now()],
            ['fakultas_id' => $fk,   'nama' => 'Kedokteran',               'kode' => 'KD',  'created_at' => now(), 'updated_at' => now()],
            ['fakultas_id' => $fsrd, 'nama' => 'Desain Interior',          'kode' => 'DI',  'created_at' => now(), 'updated_at' => now()],
            ['fakultas_id' => $fsrd, 'nama' => 'Desain Komunikasi Visual', 'kode' => 'DKV', 'created_at' => now(), 'updated_at' => now()],
            ['fakultas_id' => $fpsi, 'nama' => 'Psikologi',                'kode' => 'PSI', 'created_at' => now(), 'updated_at' => now()],
            ['fakultas_id' => $fkom, 'nama' => 'Ilmu Komunikasi',          'kode' => 'IK',  'created_at' => now(), 'updated_at' => now()],
        ]);
    }
}
