<?php

namespace Database\Seeders\Universitas\Uph;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        $uph   = DB::table('universitas')->where('kode', 'UPH')->value('id');

        $phti  = DB::table('prodi')->where('kode', 'PHTI')->value('id');
        $phsis = DB::table('prodi')->where('kode', 'PHSIS')->value('id');
        $phmj  = DB::table('prodi')->where('kode', 'PHMJ')->value('id');
        $phak  = DB::table('prodi')->where('kode', 'PHAK')->value('id');
        $phik  = DB::table('prodi')->where('kode', 'PHIK')->value('id');
        $phih  = DB::table('prodi')->where('kode', 'PHIH')->value('id');
        $phkd  = DB::table('prodi')->where('kode', 'PHKD')->value('id');
        $phdkv = DB::table('prodi')->where('kode', 'PHDKV')->value('id');

        DB::table('users')->insert([[
            'nama'           => 'Admin UPH',
            'email'          => 'admin@uph.edu',
            'password'       => Hash::make('password123'),
            'role'           => 'admin_universitas',
            'nidn'           => null, 'nim' => null, 'tahun_masuk' => null,
            'universitas_id' => $uph, 'prodi_id' => null,
            'is_temporary'   => false, 'expired_at' => null, 'status' => 'aktif',
            'created_at'     => now(), 'updated_at' => now(),
        ]]);

        $pw = Hash::make('password123');
        $d  = fn($nama, $email, $nidn, $prodi_id) => [
            'nama' => $nama, 'email' => $email, 'password' => $pw,
            'role' => 'dosen', 'nidn' => $nidn, 'nim' => null, 'tahun_masuk' => null,
            'universitas_id' => $uph, 'prodi_id' => $prodi_id,
            'is_temporary' => false, 'expired_at' => null, 'status' => 'aktif',
            'created_at' => now(), 'updated_at' => now(),
        ];

        DB::table('users')->insert([
            // PFTI — PHTI (2)
            $d('Henry Novianus Palit',      'henry.palit@uph.edu',       '2004037801', $phti),
            $d('Maria Priscilla',           'maria.priscilla@uph.edu',   '2109068301', $phti),
            // PFTI — PHSIS (2)
            $d('Raymond Kosala',            'raymond.kosala@uph.edu',    '2112057201', $phsis),
            $d('Verdi Yasin',               'verdi.yasin@uph.edu',       '2007048601', $phsis),
            // PFB — PHMJ (2)
            $d('Yolanda Masnita',           'yolanda.masnita@uph.edu',   '2305077901', $phmj),
            $d('Diah Palupi Rini',          'diah.palupi@uph.edu',       '2210088501', $phmj),
            // PFB — PHAK (2)
            $d('Ronny Andesto',             'ronny.andesto@uph.edu',     '2401057301', $phak),
            $d('Fransisca Hanita',          'fransisca.hanita@uph.edu',  '2506068201', $phak),
            // PFIK — PHIK (2)
            $d('Judy Djoko Hartono',        'judy.djoko@uph.edu',        '2611037601', $phik),
            $d('Rani Dwi Lestari',          'rani.dwilestari@uph.edu',   '2708098401', $phik),
            // PFHK — PHIH (2)
            $d('Shanti Rachmadsyah',        'shanti.rachmad@uph.edu',    '2809047801', $phih),
            $d('Bernard Nainggolan',        'bernard.nainggolan@uph.edu','2903027501', $phih),
            // PFKD — PHKD (2)
            $d('Elisabeth Surbakti',        'elisabeth.surbakti@uph.edu','2712046901', $phkd),
            $d('Samuel Wijaya',             'samuel.wijaya@uph.edu',     '2105057401', $phkd),
            // PFSD — PHDKV (2)
            $d('Johanna Martina Loekito',   'johanna.loekito@uph.edu',   '2306068001', $phdkv),
            $d('Agustinus Prasetyo Edi',    'agustinus.prasetyo@uph.edu','2401078501', $phdkv),
        ]);
    }
}
