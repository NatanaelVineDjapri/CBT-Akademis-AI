<?php

namespace Database\Seeders\Universitas\Binus;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class FakultasSeeder extends Seeder
{
    public function run(): void
    {
        $binus = DB::table('universitas')->where('kode', 'BINUS')->value('id');

        DB::table('fakultas')->insert([
            ['universitas_id' => $binus, 'nama' => 'Faculty of Computer Science',          'kode' => 'BFCS',  'created_at' => now(), 'updated_at' => now()],
            ['universitas_id' => $binus, 'nama' => 'Faculty of Information Systems',        'kode' => 'BFIS',  'created_at' => now(), 'updated_at' => now()],
            ['universitas_id' => $binus, 'nama' => 'Faculty of Engineering',                'kode' => 'BFEN',  'created_at' => now(), 'updated_at' => now()],
            ['universitas_id' => $binus, 'nama' => 'Faculty of Economics and Communication','kode' => 'BFEC',  'created_at' => now(), 'updated_at' => now()],
            ['universitas_id' => $binus, 'nama' => 'Faculty of Humanities',                 'kode' => 'BFHU',  'created_at' => now(), 'updated_at' => now()],
            ['universitas_id' => $binus, 'nama' => 'School of Design',                      'kode' => 'BSOD',  'created_at' => now(), 'updated_at' => now()],
        ]);
    }
}
