<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        $untar = DB::table('universitas')->where('kode', 'UNTAR')->value('id');

        $ti  = DB::table('prodi')->where('kode', 'TI')->value('id');
        $si  = DB::table('prodi')->where('kode', 'SI')->value('id');
        $ts  = DB::table('prodi')->where('kode', 'TS')->value('id');
        $te  = DB::table('prodi')->where('kode', 'TE')->value('id');
        $tm  = DB::table('prodi')->where('kode', 'TM')->value('id');
        $tin = DB::table('prodi')->where('kode', 'TIN')->value('id');
        $ars = DB::table('prodi')->where('kode', 'ARS')->value('id');
        $mnj = DB::table('prodi')->where('kode', 'MNJ')->value('id');
        $akt = DB::table('prodi')->where('kode', 'AKT')->value('id');
        $ih  = DB::table('prodi')->where('kode', 'IH')->value('id');
        $kd  = DB::table('prodi')->where('kode', 'KD')->value('id');
        $di  = DB::table('prodi')->where('kode', 'DI')->value('id');
        $dkv = DB::table('prodi')->where('kode', 'DKV')->value('id');
        $psi = DB::table('prodi')->where('kode', 'PSI')->value('id');
        $ik  = DB::table('prodi')->where('kode', 'IK')->value('id');

        DB::table('users')->insert([
            [
                'nama' => 'Super Admin',
                'email' => 'admin@akademis.ai',
                'password' => Hash::make('password123'),
                'role' => 'admin_akademis_ai',
                'nidn' => null, 'nim' => null, 'tahun_masuk' => null,
                'universitas_id' => null, 'prodi_id' => null,
                'is_temporary' => false, 'expired_at' => null, 'status' => 'aktif',
                'created_at' => now(), 'updated_at' => now(),
            ],
            [
                'nama' => 'Admin UNTAR',
                'email' => 'admin@untar.ac.id',
                'password' => Hash::make('password123'),
                'role' => 'admin_universitas',
                'nidn' => null, 'nim' => null, 'tahun_masuk' => null,
                'universitas_id' => $untar, 'prodi_id' => null,
                'is_temporary' => false, 'expired_at' => null, 'status' => 'aktif',
                'created_at' => now(), 'updated_at' => now(),
            ],
        ]);

        $pw = Hash::make('password123');
        $d  = fn($nama, $email, $nidn, $prodi_id) => [
            'nama' => $nama, 'email' => $email, 'password' => $pw,
            'role' => 'dosen', 'nidn' => $nidn, 'nim' => null, 'tahun_masuk' => null,
            'universitas_id' => $untar, 'prodi_id' => $prodi_id,
            'is_temporary' => false, 'expired_at' => null, 'status' => 'aktif',
            'created_at' => now(), 'updated_at' => now(),
        ];

        DB::table('users')->insert([
            // FTI — TI (14)
            $d('Irvan Lewenusa',           'irvan.lewenusa@untar.ac.id',           '0312107601', $ti),
            $d('Agus Budi Dharmawan',      'agus.budi.dharmawan@untar.ac.id',      '0105037201', $ti),
            $d('Bagus Mulyawan',           'bagus.mulyawan@untar.ac.id',           '0215087501', $ti),
            $d('Chairisni Lubis',          'chairisni.lubis@untar.ac.id',          '0301057801', $ti),
            $d('Darius Andana Haris',      'darius.andana.haris@untar.ac.id',      '0501027601', $ti),
            $d('Dedi Trisnawarman',        'dedi.trisnawarman@untar.ac.id',        '0712077001', $ti),
            $d('Jap Tji Beng',             'jap.tji.beng@untar.ac.id',             '1505066801', $ti),
            $d('Jeanny Pragantha',         'jeanny.pragantha@untar.ac.id',         '0712107201', $ti),
            $d('Lely Hiryanto',            'lely.hiryanto@untar.ac.id',            '0105027501', $ti),
            $d('Manatap Dolok Lauro',      'manatap.dolok.lauro@untar.ac.id',      '0912057601', $ti),
            $d('Novario Jaya Perdana',     'novario.jaya.perdana@untar.ac.id',     '0210118401', $ti),
            $d('Tony',                     'tony@untar.ac.id',                     '1010067001', $ti),
            $d('Tri Sutrisno',             'tri.sutrisno@untar.ac.id',             '0907087201', $ti),
            $d('Wasino',                   'wasino@untar.ac.id',                   '0505016801', $ti),

            // FTI — SI (6)
            $d('Desi Arisandi',            'desi.arisandi@untar.ac.id',            '0901128001', $si),
            $d('Dyah Erny Herwindiati',    'dyah.erny.herwindiati@untar.ac.id',    '1210077301', $si),
            $d('Janson Hendryli',          'janson.hendryli@untar.ac.id',          '0203018101', $si),
            $d('Lina',                     'lina@untar.ac.id',                     '0808027801', $si),
            $d('Teny Handhayani',          'teny.handhayani@untar.ac.id',          '0102037901', $si),
            $d('Viny Christanti Mawardi',  'viny.christanti.mawardi@untar.ac.id',  '0601027701', $si),

            // FT — TS (7)
            $d('Abrar Riza',               'abrar.riza@untar.ac.id',               '0103017501', $ts),
            $d('Adianto',                  'adianto@untar.ac.id',                  '0507027001', $ts),
            $d('Ahmad Saladin',            'ahmad.saladin@untar.ac.id',            '0103037801', $ts),
            $d('Arianti Sutandi',          'arianti.sutandi@untar.ac.id',          '0405077601', $ts),
            $d('Arif Sandjaya',            'arif.sandjaya@untar.ac.id',            '0908068001', $ts),
            $d('Budijanto Chandra',        'budijanto.chandra@untar.ac.id',        '0201047201', $ts),
            $d('Chaidir Anwar Makarim',    'chaidir.anwar.makarim@untar.ac.id',    '0606067001', $ts),

            // FT — TE (7)
            $d('Adelia Andani',            'adelia.andani@untar.ac.id',            '0301108501', $te),
            $d('Agus Halim',               'agus.halim@untar.ac.id',               '0712077401', $te),
            $d('Agustinus Sutanto',        'agustinus.sutanto@untar.ac.id',        '0101037501', $te),
            $d('Alfred Jonathan Susilo',   'alfred.jonathan.susilo@untar.ac.id',   '0505098001', $te),
            $d('Alvin Hadiwono',           'alvin.hadiwono@untar.ac.id',           '0210097801', $te),
            $d('Andy Prabowo Pho',         'andy.prabowo.pho@untar.ac.id',         '0712057601', $te),
            $d('Denny Husin',              'denny.husin@untar.ac.id',              '0808047201', $te),

            // FT — TM (7)
            $d('Carla Olyvia Doaly',       'carla.olyvia.doaly@untar.ac.id',       '0903108501', $tm),
            $d('Daniel Christianto',       'daniel.christianto@untar.ac.id',       '0901027601', $tm),
            $d('Dewi Ratnaningrum',        'dewi.ratnaningrum@untar.ac.id',        '0505057901', $tm),
            $d('Irene Syona Darmady',      'irene.syona.darmady@untar.ac.id',      '1110088001', $tm),
            $d('Joni Fat',                 'joni.fat@untar.ac.id',                 '0203027001', $tm),
            $d('Judah Yosia Wanjoyo',      'judah.yosia.wanjoyo@untar.ac.id',      '0501028301', $tm),
            $d('Kevin Raynaldo',           'kevin.raynaldo@untar.ac.id',           '0709118901', $tm),

            // FT — TIN (8)
            $d('Klara Puspa Indrawati',    'klara.puspa.indrawati@untar.ac.id',    '0305077801', $tin),
            $d('Lamto Widodo',             'lamto.widodo@untar.ac.id',             '0601077001', $tin),
            $d('Laura Tri Agustin',        'laura.tri.agustin@untar.ac.id',        '0803128401', $tin),
            $d('Leksmono Suryo Putranto',  'leksmono.suryo.putranto@untar.ac.id',  '0303037201', $tin),
            $d('Lidwina Sri Ayu',          'lidwina.sri.ayu@untar.ac.id',          '0809067901', $tin),
            $d('Lina Gozali',              'lina.gozali@untar.ac.id',              '0101107501', $tin),
            $d('Lithrone Laricha Salomon', 'lithrone.laricha.salomon@untar.ac.id', '0907047601', $tin),
            $d('Leo S. Tedianto',          'leo.tedianto@untar.ac.id',             '0201057301', $tin),

            // FT — ARS (7)
            $d('Lucia Indah Pramanti',     'lucia.indah.pramanti@untar.ac.id',     '0709047901', $ars),
            $d('M. J. Dewi Linggasari',    'dewi.linggasari@untar.ac.id',          '0102077801', $ars),
            $d('M. Sobron Yamin Lubis',    'sobron.yamin.lubis@untar.ac.id',       '0101027101', $ars),
            $d('Maria Veronica Gandha',    'maria.veronica.gandha@untar.ac.id',    '0405067601', $ars),
            $d('Martin Halim',             'martin.halim@untar.ac.id',             '0205037501', $ars),
            $d('Agustinus Purna Irawan',   'agustinus.purna.irawan@untar.ac.id',   '0908037201', $ars),
            $d('Joni Chin',                'joni.chin@untar.ac.id',                '0301017001', $ars),

            // FEB — MNJ (11)
            $d('Carunia Mulya Firdausy',   'carunia.mulya.firdausy@untar.ac.id',   '0101016501', $mnj),
            $d('Cokki',                    'cokki@untar.ac.id',                    '0505027401', $mnj),
            $d('Haris Maupa',              'haris.maupa@untar.ac.id',              '0303037001', $mnj),
            $d('Ignatius Roni Setyawan',   'ignatius.roni.setyawan@untar.ac.id',   '0601077601', $mnj),
            $d('Indra Widjaja',            'indra.widjaja@untar.ac.id',            '0908017501', $mnj),
            $d('Sarwo Edy Handoyo',        'sarwo.edy.handoyo@untar.ac.id',        '0204067201', $mnj),
            $d('Agus Zainul Arifin',       'agus.zainul.arifin@untar.ac.id',       '0312077801', $mnj),
            $d('Eddy Supriyatna',          'eddy.supriyatna@untar.ac.id',          '0512067001', $mnj),
            $d('Hendang Tanusdjaja',       'hendang.tanusdjaja@untar.ac.id',       '1001067501', $mnj),
            $d('Hetty Karunia Tunjungsari','hetty.karunia.tunjungsari@untar.ac.id','0912077901', $mnj),
            $d('Keni',                     'keni@untar.ac.id',                     '0707038001', $mnj),

            // FEB — AKT (10)
            $d('Miharni Tjokrosaputro',    'miharni.tjokrosaputro@untar.ac.id',    '0101017602', $akt),
            $d('Mochamat Helmi',           'mochamat.helmi@untar.ac.id',           '0801027401', $akt),
            $d('Mohammad Agung Saryatmo',  'mohammad.agung.saryatmo@untar.ac.id',  '0201027201', $akt),
            $d('Rezi Erdiansyah',          'rezi.erdiansyah@untar.ac.id',          '0507118401', $akt),
            $d('Riris Loisa',              'riris.loisa@untar.ac.id',              '0809037901', $akt),
            $d('Rostiana',                 'rostiana@untar.ac.id',                 '0905087501', $akt),
            $d('Sawidji Widoatmodjo',      'sawidji.widoatmodjo@untar.ac.id',      '0201016301', $akt),
            $d('Shirly Gunawan',           'shirly.gunawan@untar.ac.id',           '0512017801', $akt),
            $d('Yanuar',                   'yanuar@untar.ac.id',                   '0811018001', $akt),
            $d('Hendri Prabowo',           'hendri.prabowo@untar.ac.id',           '0901027701', $akt),

            // FH — IH (3)
            $d('Sri Wardah Hanifah',       'sri.wardah.hanifah@untar.ac.id',       '0601027301', $ih),
            $d('Tommy Hendra Purwaka',     'tommy.hendra.purwaka@untar.ac.id',     '0305036801', $ih),
            $d('Gunawan Djajaputra',       'gunawan.djajaputra@untar.ac.id',       '0101017001', $ih),

            // FK — KD (5)
            $d('Fiastuti Witjaksono',      'fiastuti.witjaksono@untar.ac.id',      '0201016502', $kd),
            $d('Wiwin Herwinda',           'wiwin.herwinda@untar.ac.id',           '0409077601', $kd),
            $d('Ni Nyoman Rachmawati',     'ni.nyoman.rachmawati@untar.ac.id',     '1010077501', $kd),
            $d('Listya Tresnasari',        'listya.tresnasari@untar.ac.id',        '0512087801', $kd),
            $d('Manfaluthy Hakim',         'manfaluthy.hakim@untar.ac.id',         '0901027102', $kd),

            // FSRD — DI (3)
            $d('Nanang Ganda Prawira',     'nanang.ganda.prawira@untar.ac.id',     '0901077601', $di),
            $d('Yeremia Lukas',            'yeremia.lukas@untar.ac.id',            '0505038101', $di),
            $d('Elisabeth Christine',      'elisabeth.christine@untar.ac.id',      '0212087901', $di),

            // FSRD — DKV (2)
            $d('Gracia Dian Pertiwi',      'gracia.dian.pertiwi@untar.ac.id',      '0901048601', $dkv),
            $d('Yuni Herlina',             'yuni.herlina@untar.ac.id',             '0501057801', $dkv),

            // FPSI — PSI (5)
            $d('Marisa Fransisca Silvana', 'marisa.fransisca.silvana@untar.ac.id', '0601028101', $psi),
            $d('Fransisca Rosa Ully',      'fransisca.rosa.ully@untar.ac.id',      '0909077901', $psi),
            $d('Yuli Asmi Rozali',         'yuli.asmi.rozali@untar.ac.id',         '0507087801', $psi),
            $d('Naomi Soetikno',           'naomi.soetikno@untar.ac.id',           '0104017501', $psi),
            $d('Ahmad Gimmy Prathama',     'ahmad.gimmy.prathama@untar.ac.id',     '0302117601', $psi),

            // FIKOM — IK (5)
            $d('Sinta Paramita',           'sinta.paramita@untar.ac.id',           '0201018301', $ik),
            $d('Roswita Oktavianti',       'roswita.oktavianti@untar.ac.id',       '0601107801', $ik),
            $d('Gustavo Hermawan',         'gustavo.hermawan@untar.ac.id',         '0707117901', $ik),
            $d('Desi Kristianti Natalia',  'desi.kristianti.natalia@untar.ac.id',  '0901048501', $ik),
            $d('Rezi Aprianto',            'rezi.aprianto@untar.ac.id',            '0512048801', $ik),
        ]);
    }
}
