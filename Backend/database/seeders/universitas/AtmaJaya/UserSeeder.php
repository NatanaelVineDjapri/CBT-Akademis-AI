<?php

namespace Database\Seeders\Universitas\AtmaJaya;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        $uajj  = DB::table('universitas')->where('kode', 'UAJJ')->value('id');

        $ajti  = DB::table('prodi')->where('kode', 'AJTI')->value('id');
        $ajte  = DB::table('prodi')->where('kode', 'AJTE')->value('id');
        $ajtm  = DB::table('prodi')->where('kode', 'AJTM')->value('id');
        $ajtin = DB::table('prodi')->where('kode', 'AJTIN')->value('id');
        $ajmj  = DB::table('prodi')->where('kode', 'AJMJ')->value('id');
        $ajak  = DB::table('prodi')->where('kode', 'AJAK')->value('id');
        $ajih  = DB::table('prodi')->where('kode', 'AJIH')->value('id');
        $ajars = DB::table('prodi')->where('kode', 'AJARS')->value('id');

        DB::table('users')->insert([[
            'nama'           => 'Admin Atma Jaya',
            'email'          => 'admin@atmajaya.ac.id',
            'password'       => Hash::make('password123'),
            'role'           => 'admin_universitas',
            'nidn'           => null, 'nim' => null, 'tahun_masuk' => null,
            'universitas_id' => $uajj, 'prodi_id' => null,
            'is_temporary'   => false, 'expired_at' => null, 'status' => 'aktif',
            'created_at'     => now(), 'updated_at' => now(),
        ]]);

        $pw = Hash::make('password123');
        $d  = fn($nama, $email, $nidn, $prodi_id) => [
            'nama' => $nama, 'email' => $email, 'password' => $pw,
            'role' => 'dosen', 'nidn' => $nidn, 'nim' => null, 'tahun_masuk' => null,
            'universitas_id' => $uajj, 'prodi_id' => $prodi_id,
            'is_temporary' => false, 'expired_at' => null, 'status' => 'aktif',
            'created_at' => now(), 'updated_at' => now(),
        ];

        DB::table('users')->insert([
            // AJFTI — AJTI (2)
            $d('Bernadetta Danur Wijayanti','bernadetta.danur@atmajaya.ac.id',   '4012037801', $ajti),
            $d('Cecilia Esti Nugraheni',    'cecilia.esti@atmajaya.ac.id',       '4105068301', $ajti),
            // AJFTI — AJTE (2)
            $d('Djauhari Manfaat',          'djauhari.manfaat@atmajaya.ac.id',   '4209047501', $ajte),
            $d('Erwin Susanto',             'erwin.susanto@atmajaya.ac.id',      '4302088601', $ajte),
            // AJFTI — AJTM (2)
            $d('Filsuf Sahputra',           'filsuf.sahputra@atmajaya.ac.id',    '4407067201', $ajtm),
            $d('Gema Dewantara',            'gema.dewantara@atmajaya.ac.id',     '4501098001', $ajtm),
            // AJFTI — AJTIN (2)
            $d('Hendrawan Koesbandoro',     'hendrawan.koesbandoro@atmajaya.ac.id','4609017601',$ajtin),
            $d('Indira Sari',               'indira.sari@atmajaya.ac.id',        '4712038501', $ajtin),
            // AJFEB — AJMJ (2)
            $d('Johanna Venecia',           'johanna.venecia@atmajaya.ac.id',    '4811077301', $ajmj),
            $d('Kirnan Siahaan',            'kirnan.siahaan@atmajaya.ac.id',     '4905028801', $ajmj),
            // AJFEB — AJAK (2)
            $d('Lestari Wahyuningsih',      'lestari.wahyuningsih@atmajaya.ac.id','4010047901',$ajak),
            $d('Maria Kristi Endah',        'maria.kristi@atmajaya.ac.id',       '4112087401', $ajak),
            // AJFH — AJIH (2)
            $d('Nindyo Pramono',            'nindyo.pramono@atmajaya.ac.id',     '4205027101', $ajih),
            $d('Okie Listiani Wardhani',    'okie.listiani@atmajaya.ac.id',      '4309068201', $ajih),
            // AJFAR — AJARS (2)
            $d('Priscilla Epifania',        'priscilla.epifania@atmajaya.ac.id', '4412028701', $ajars),
            $d('Quirino Petrus Haryanto',   'quirino.petrus@atmajaya.ac.id',     '4508057601', $ajars),
        ]);
    }
}
