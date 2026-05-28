<?php

namespace Database\Seeders\Universitas\Umn;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        $umn  = DB::table('universitas')->where('kode', 'UMN')->value('id');

        $uti  = DB::table('prodi')->where('kode', 'UTI')->value('id');
        $usi  = DB::table('prodi')->where('kode', 'USI')->value('id');
        $utke = DB::table('prodi')->where('kode', 'UTKE')->value('id');
        $umnj = DB::table('prodi')->where('kode', 'UMNJ')->value('id');
        $uakt = DB::table('prodi')->where('kode', 'UAKT')->value('id');
        $uik  = DB::table('prodi')->where('kode', 'UIK')->value('id');
        $ujr  = DB::table('prodi')->where('kode', 'UJR')->value('id');
        $udkv = DB::table('prodi')->where('kode', 'UDKV')->value('id');
        $udin = DB::table('prodi')->where('kode', 'UDIN')->value('id');
        $uflm = DB::table('prodi')->where('kode', 'UFLM')->value('id');
        $uih  = DB::table('prodi')->where('kode', 'UIH')->value('id');

        DB::table('users')->insert([[
            'nama'           => 'Admin UMN',
            'email'          => 'admin@umn.ac.id',
            'password'       => Hash::make('password123'),
            'role'           => 'admin_universitas',
            'nidn'           => null, 'nim' => null, 'tahun_masuk' => null,
            'universitas_id' => $umn, 'prodi_id' => null,
            'is_temporary'   => false, 'expired_at' => null, 'status' => 'aktif',
            'created_at'     => now(), 'updated_at' => now(),
        ]]);

        $pw = Hash::make('password123');
        $d  = fn($nama, $email, $nidn, $prodi_id) => [
            'nama' => $nama, 'email' => $email, 'password' => $pw,
            'role' => 'dosen', 'nidn' => $nidn, 'nim' => null, 'tahun_masuk' => null,
            'universitas_id' => $umn, 'prodi_id' => $prodi_id,
            'is_temporary' => false, 'expired_at' => null, 'status' => 'aktif',
            'created_at' => now(), 'updated_at' => now(),
        ];

        DB::table('users')->insert([
            // UFTI — UTI (2)
            $d('Nanang Fakhrur Rozi',          'nanang.fakhrur@umn.ac.id',          '1701028701', $uti),
            $d('Sri Rahayu',                   'sri.rahayu@umn.ac.id',              '1605078201', $uti),

            // UFTI — USI (2)
            $d('Friska Natalia',               'friska.natalia@umn.ac.id',          '1612038601', $usi),
            $d('Wirawan Istiono',              'wirawan.istiono@umn.ac.id',         '1904097501', $usi),

            // UFTI — UTKE (2)
            $d('Andreas Soegandi',             'andreas.soegandi@umn.ac.id',        '1710057801', $utke),
            $d('Marlinda Vasty Overbeek',      'marlinda.vasty@umn.ac.id',          '1803068301', $utke),

            // UFB — UMNJ (2)
            $d('Yenni Lim',                    'yenni.lim@umn.ac.id',               '1809037701', $umnj),
            $d('Nurina Vidya Pramesti',        'nurina.vidya@umn.ac.id',            '1712098401', $umnj),

            // UFB — UAKT (2)
            $d('Hendro Lukman',                'hendro.lukman@umn.ac.id',           '1811027201', $uakt),
            $d('Elisa Tjondro',                'elisa.tjondro@umn.ac.id',           '1906038501', $uakt),

            // UFIK — UIK (2)
            $d('Inco Hary Perdana',            'inco.hary@umn.ac.id',               '1703097901', $uik),
            $d('Cendera Rizky Anugrah Bangun', 'cendera.rizky@umn.ac.id',           '1809128601', $uik),

            // UFIK — UJR (2)
            $d('Lilik Dwi Mardjianto',         'lilik.dwi@umn.ac.id',               '1704047801', $ujr),
            $d('Albertus Magnus Prestianta',   'albertus.magnus@umn.ac.id',         '1811068201', $ujr),

            // UFSD — UDKV (2)
            $d('Adhreza Brahma',               'adhreza.brahma@umn.ac.id',          '1705038901', $udkv),
            $d('Mohammad Rizaldi',             'mohammad.rizaldi@umn.ac.id',        '1612057901', $udkv),

            // UFSD — UDIN (1)
            $d('Irma Indriani',                'irma.indriani@umn.ac.id',           '1908048301', $udin),

            // UFSD — UFLM (1)
            $d('Bharoto Yekti',                'bharoto.yekti@umn.ac.id',           '1706058001', $uflm),

            // UFHU — UIH (1)
            $d('Endah Hartati',                'endah.hartati@umn.ac.id',           '1810027601', $uih),
        ]);
    }
}
