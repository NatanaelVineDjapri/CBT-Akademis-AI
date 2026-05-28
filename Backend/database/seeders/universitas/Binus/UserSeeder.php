<?php

namespace Database\Seeders\Universitas\Binus;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        $binus = DB::table('universitas')->where('kode', 'BINUS')->value('id');

        $bcs  = DB::table('prodi')->where('kode', 'BCS')->value('id');
        $bai  = DB::table('prodi')->where('kode', 'BAI')->value('id');
        $bcyb = DB::table('prodi')->where('kode', 'BCYB')->value('id');
        $bis  = DB::table('prodi')->where('kode', 'BIS')->value('id');
        $bds  = DB::table('prodi')->where('kode', 'BDS')->value('id');
        $biet = DB::table('prodi')->where('kode', 'BIET')->value('id');
        $barc = DB::table('prodi')->where('kode', 'BARC')->value('id');
        $btsv = DB::table('prodi')->where('kode', 'BTSV')->value('id');
        $btke = DB::table('prodi')->where('kode', 'BTKE')->value('id');
        $bakt = DB::table('prodi')->where('kode', 'BAKT')->value('id');
        $bfin = DB::table('prodi')->where('kode', 'BFIN')->value('id');
        $bmc  = DB::table('prodi')->where('kode', 'BMC')->value('id');
        $bhi  = DB::table('prodi')->where('kode', 'BHI')->value('id');
        $beng = DB::table('prodi')->where('kode', 'BENG')->value('id');
        $bpsi = DB::table('prodi')->where('kode', 'BPSI')->value('id');
        $bhuk = DB::table('prodi')->where('kode', 'BHUK')->value('id');
        $bdkv = DB::table('prodi')->where('kode', 'BDKV')->value('id');
        $bdin = DB::table('prodi')->where('kode', 'BDIN')->value('id');

        DB::table('users')->insert([[
            'nama'           => 'Admin BINUS',
            'email'          => 'admin@binus.ac.id',
            'password'       => Hash::make('password123'),
            'role'           => 'admin_universitas',
            'nidn'           => null, 'nim' => null, 'tahun_masuk' => null,
            'universitas_id' => $binus, 'prodi_id' => null,
            'is_temporary'   => false, 'expired_at' => null, 'status' => 'aktif',
            'created_at'     => now(), 'updated_at' => now(),
        ]]);

        $pw = Hash::make('password123');
        $d  = fn($nama, $email, $nidn, $prodi_id) => [
            'nama' => $nama, 'email' => $email, 'password' => $pw,
            'role' => 'dosen', 'nidn' => $nidn, 'nim' => null, 'tahun_masuk' => null,
            'universitas_id' => $binus, 'prodi_id' => $prodi_id,
            'is_temporary' => false, 'expired_at' => null, 'status' => 'aktif',
            'created_at' => now(), 'updated_at' => now(),
        ];

        DB::table('users')->insert([
            // BFCS — BCS (3)
            $d('Rinaldi Munir',             'rinaldi.munir@binus.ac.id',             '1015087201', $bcs),
            $d('Wida Susanty',              'wida.susanty@binus.ac.id',              '1205097801', $bcs),
            $d('Arief Bramanto Wicaksono',  'arief.bramanto@binus.ac.id',            '1012108001', $bcs),

            // BFCS — BAI (2)
            $d('Lim Eng Wah',               'lim.engwah@binus.ac.id',                '1101027601', $bai),
            $d('Devyano Luhukay',           'devyano.luhukay@binus.ac.id',           '1507087901', $bai),

            // BFCS — BCYB (2)
            $d('Johan Muliadi Kerta',       'johan.muliadi@binus.ac.id',             '1201068101', $bcyb),
            $d('Budi Rahardjo',             'budi.rahardjo@binus.ac.id',             '1212087501', $bcyb),

            // BFIS — BIS (3)
            $d('Eka Miranda',               'eka.miranda@binus.ac.id',               '1509077201', $bis),
            $d('Harjanto Prabowo',          'harjanto.prabowo@binus.ac.id',          '1210067001', $bis),
            $d('Theresia Widia Suryaningrum','theresia.widia@binus.ac.id',           '1303088201', $bis),

            // BFIS — BDS (2)
            $d('Leon Andretti Abdillah',    'leon.andretti@binus.ac.id',             '1104038301', $bds),
            $d('Rini Wulandari',            'rini.wulandari@binus.ac.id',            '1209077901', $bds),

            // BFEN — BIET (2)
            $d('Purnawan Adi Wicaksono',    'purnawan.adi@binus.ac.id',              '1312067301', $biet),
            $d('Kartika Gunadi',            'kartika.gunadi@binus.ac.id',            '1406088501', $biet),

            // BFEN — BARC (2)
            $d('Fredy Kurniawan',           'fredy.kurniawan@binus.ac.id',           '1507067901', $barc),
            $d('Yuni Vivanti Pranoto',      'yuni.vivanti@binus.ac.id',              '1009088001', $barc),

            // BFEN — BTSV (2)
            $d('Angga Rusdinar',            'angga.rusdinar@binus.ac.id',            '1301027801', $btsv),
            $d('Susi Dariani',              'susi.dariani@binus.ac.id',              '1207038201', $btsv),

            // BFEN — BTKE (2)
            $d('Antonius Aditya Hartanto',  'antonius.aditya@binus.ac.id',           '1110077601', $btke),
            $d('Sri Poernomo Sari',         'sri.poernomo@binus.ac.id',              '1312097901', $btke),

            // BFEC — BAKT (3)
            $d('Siswanto Imam Santoso',     'siswanto.imam@binus.ac.id',             '1208046801', $bakt),
            $d('Hendry J. Wijaya',          'hendry.wijaya@binus.ac.id',             '1505037401', $bakt),
            $d('Nency Gunawan',             'nency.gunawan@binus.ac.id',             '1301018001', $bakt),

            // BFEC — BFIN (2)
            $d('Raymond Setia Halim',       'raymond.setia@binus.ac.id',             '1412077701', $bfin),
            $d('Lim Sanny',                 'lim.sanny@binus.ac.id',                 '1204047901', $bfin),

            // BFEC — BMC (2)
            $d('Erna Sofriana Imaningsih',  'erna.sofriana@binus.ac.id',             '1109038301', $bmc),
            $d('Muhammad Aras',             'muhammad.aras@binus.ac.id',             '1501027801', $bmc),

            // BFHU — BHI (2)
            $d('Tirta Nugraha Mursitama',   'tirta.nugraha@binus.ac.id',             '1307027501', $bhi),
            $d('Siti Kurnia Rahayu',        'siti.kurnia@binus.ac.id',               '1206108101', $bhi),

            // BFHU — BENG (2)
            $d('Lily Thamrin',              'lily.thamrin@binus.ac.id',              '1104027801', $beng),
            $d('Jimmy Sentosa',             'jimmy.sentosa@binus.ac.id',             '1512047601', $beng),

            // BFHU — BPSI (2)
            $d('Monty P. Satiadarma',       'monty.satiadarma@binus.ac.id',          '1301016501', $bpsi),
            $d('Annisa Resti Darmawanti',   'annisa.resti@binus.ac.id',              '1207038601', $bpsi),

            // BFHU — BHUK (2)
            $d('Ahmad Sofian',              'ahmad.sofian@binus.ac.id',              '1508027301', $bhuk),
            $d('Shinto Agung Nugroho',      'shinto.agung@binus.ac.id',              '1209057701', $bhuk),

            // BSOD — BDKV (2)
            $d('Listia Natadjaja',          'listia.natadjaja@binus.ac.id',          '1103037901', $bdkv),
            $d('Hanson E. Kusuma',          'hanson.kusuma@binus.ac.id',             '1405087501', $bdkv),

            // BSOD — BDIN (2)
            $d('Yusita Kusumarini',         'yusita.kusumarini@binus.ac.id',         '1612068301', $bdin),
            $d('Lintu Tulistyantoro',       'lintu.tulistyantoro@binus.ac.id',       '1208057601', $bdin),
        ]);
    }
}
