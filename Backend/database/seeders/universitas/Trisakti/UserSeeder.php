<?php

namespace Database\Seeders\Universitas\Trisakti;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        $trisakti = DB::table('universitas')->where('kode', 'TRISAKTI')->value('id');

        $trti  = DB::table('prodi')->where('kode', 'TRTI')->value('id');
        $trte  = DB::table('prodi')->where('kode', 'TRTE')->value('id');
        $trtm  = DB::table('prodi')->where('kode', 'TRTM')->value('id');
        $trtin = DB::table('prodi')->where('kode', 'TRTIN')->value('id');
        $trts  = DB::table('prodi')->where('kode', 'TRTS')->value('id');
        $trars = DB::table('prodi')->where('kode', 'TRARS')->value('id');
        $trmj  = DB::table('prodi')->where('kode', 'TRMJ')->value('id');
        $trak  = DB::table('prodi')->where('kode', 'TRAK')->value('id');
        $trih  = DB::table('prodi')->where('kode', 'TRIH')->value('id');

        DB::table('users')->insert([[
            'nama'           => 'Admin Trisakti',
            'email'          => 'admin@trisakti.ac.id',
            'password'       => Hash::make('password123'),
            'role'           => 'admin_universitas',
            'nidn'           => null, 'nim' => null, 'tahun_masuk' => null,
            'universitas_id' => $trisakti, 'prodi_id' => null,
            'is_temporary'   => false, 'expired_at' => null, 'status' => 'aktif',
            'created_at'     => now(), 'updated_at' => now(),
        ]]);

        $pw = Hash::make('password123');
        $d  = fn($nama, $email, $nidn, $prodi_id) => [
            'nama' => $nama, 'email' => $email, 'password' => $pw,
            'role' => 'dosen', 'nidn' => $nidn, 'nim' => null, 'tahun_masuk' => null,
            'universitas_id' => $trisakti, 'prodi_id' => $prodi_id,
            'is_temporary' => false, 'expired_at' => null, 'status' => 'aktif',
            'created_at' => now(), 'updated_at' => now(),
        ];

        DB::table('users')->insert([
            // TRFTI — TRTI (2)
            $d('Djoko Budiyanto',         'djoko.budiyanto@trisakti.ac.id',      '3002037201', $trti),
            $d('Adhi Kusnadi',            'adhi.kusnadi@trisakti.ac.id',         '3107028001', $trti),
            // TRFTI — TRTE (2)
            $d('Budi Sudiarto',           'budi.sudiarto@trisakti.ac.id',        '3205057701', $trte),
            $d('Diah Anggreini',          'diah.anggreini@trisakti.ac.id',       '3309088401', $trte),
            // TRFTI — TRTM (2)
            $d('Hery Purnomo',            'hery.purnomo@trisakti.ac.id',         '3405067601', $trtm),
            $d('Irwan Hermawan',          'irwan.hermawan@trisakti.ac.id',       '3512088101', $trtm),
            // TRFTI — TRTIN (2)
            $d('Joko Sulistio',           'joko.sulistio@trisakti.ac.id',        '3601097401', $trtin),
            $d('Lia Mulyaningsih',        'lia.mulyaningsih@trisakti.ac.id',     '3708128601', $trtin),
            // TRFTS — TRTS (2)
            $d('Mardjoeki Notosoegondo', 'mardjoeki.noto@trisakti.ac.id',       '3806017301', $trts),
            $d('Nila Keumala',            'nila.keumala@trisakti.ac.id',         '3904068901', $trts),
            // TRFTS — TRARS (2)
            $d('Oka Kusumah',             'oka.kusumah@trisakti.ac.id',          '3002097801', $trars),
            $d('Prasetya Agung',          'prasetya.agung@trisakti.ac.id',       '3110057601', $trars),
            // TRFEB — TRMJ (2)
            $d('Ratna Widiastuti',        'ratna.widiastuti@trisakti.ac.id',     '3212087001', $trmj),
            $d('Setia Mulyawan',          'setia.mulyawan@trisakti.ac.id',       '3301047801', $trmj),
            // TRFEB — TRAK (2)
            $d('Tita Rosita',             'tita.rosita@trisakti.ac.id',          '3407097501', $trak),
            $d('Umi Muawanah',            'umi.muawanah@trisakti.ac.id',         '3509068301', $trak),
            // TRFH — TRIH (2)
            $d('Vivin Arumningtyas',      'vivin.arumningtyas@trisakti.ac.id',   '3601027201', $trih),
            $d('Wirya Wardaya',           'wirya.wardaya@trisakti.ac.id',        '3706018001', $trih),
        ]);
    }
}
