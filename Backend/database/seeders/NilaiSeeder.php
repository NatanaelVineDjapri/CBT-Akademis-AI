<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class NilaiSeeder extends Seeder
{
    public function run(): void
    {
        $natanaelId = DB::table('users')->where('email', 'natanaelvinedj@gmail.com')->value('id');
        $dosenId    = DB::table('users')->where('email', 'budi.santoso@untar.ac.id')->value('id');
        $allMatkul  = DB::table('mata_kuliah')->orderBy('id')->get();

        $ujianData = [
            ['nama' => 'UTS Pemrograman Web',               'nilai' => 85, 'grade' => 'A', 'lulus' => true,  'bulan' => 1],
            ['nama' => 'UAS Basis Data',                    'nilai' => 78, 'grade' => 'B', 'lulus' => true,  'bulan' => 1],
            ['nama' => 'UTS Algoritma dan Pemrograman',     'nilai' => 92, 'grade' => 'A', 'lulus' => true,  'bulan' => 1],
            ['nama' => 'UAS Struktur Data',                 'nilai' => 65, 'grade' => 'C', 'lulus' => true,  'bulan' => 1],
            ['nama' => 'UTS Sistem Operasi',                'nilai' => 55, 'grade' => 'D', 'lulus' => false, 'bulan' => 2],
            ['nama' => 'UAS Jaringan Komputer',             'nilai' => 88, 'grade' => 'A', 'lulus' => true,  'bulan' => 2],
            ['nama' => 'UTS Pemrograman Berorientasi Objek','nilai' => 72, 'grade' => 'B', 'lulus' => true,  'bulan' => 2],
            ['nama' => 'UAS Rekayasa Perangkat Lunak',      'nilai' => 60, 'grade' => 'C', 'lulus' => true,  'bulan' => 2],
            ['nama' => 'UTS Kecerdasan Buatan',             'nilai' => 45, 'grade' => 'E', 'lulus' => false, 'bulan' => 2],
            ['nama' => 'UAS Machine Learning',              'nilai' => 95, 'grade' => 'A', 'lulus' => true,  'bulan' => 2],
            ['nama' => 'UTS Pengolahan Citra Digital',      'nilai' => 80, 'grade' => 'B', 'lulus' => true,  'bulan' => 3],
            ['nama' => 'UAS Keamanan Sistem Informasi',     'nilai' => 68, 'grade' => 'C', 'lulus' => true,  'bulan' => 3],
            ['nama' => 'UTS Pemrograman Mobile',            'nilai' => 90, 'grade' => 'A', 'lulus' => true,  'bulan' => 3],
            ['nama' => 'UAS Cloud Computing',               'nilai' => 75, 'grade' => 'B', 'lulus' => true,  'bulan' => 3],
            ['nama' => 'UTS Data Mining',                   'nilai' => 52, 'grade' => 'D', 'lulus' => false, 'bulan' => 3],
            ['nama' => 'UAS Interaksi Manusia Komputer',    'nilai' => 83, 'grade' => 'B', 'lulus' => true,  'bulan' => 3],
            ['nama' => 'UTS Matematika Diskrit',            'nilai' => 70, 'grade' => 'B', 'lulus' => true,  'bulan' => 3],
            ['nama' => 'UAS Kalkulus',                      'nilai' => 62, 'grade' => 'C', 'lulus' => true,  'bulan' => 3],
            ['nama' => 'UTS Statistika dan Probabilitas',   'nilai' => 88, 'grade' => 'A', 'lulus' => true,  'bulan' => 3],
            ['nama' => 'UAS Logika Matematika',             'nilai' => 77, 'grade' => 'B', 'lulus' => true,  'bulan' => 3],
            ['nama' => 'UTS Sistem Informasi',              'nilai' => 40, 'grade' => 'E', 'lulus' => false, 'bulan' => 3],
            ['nama' => 'UAS Basis Data Lanjut',             'nilai' => 91, 'grade' => 'A', 'lulus' => true,  'bulan' => 3],
            ['nama' => 'UTS Pemrograman Fungsional',        'nilai' => 66, 'grade' => 'C', 'lulus' => true,  'bulan' => 3],
            ['nama' => 'UAS Arsitektur Komputer',           'nilai' => 79, 'grade' => 'B', 'lulus' => true,  'bulan' => 3],
            ['nama' => 'UTS Kompilator',                    'nilai' => 85, 'grade' => 'A', 'lulus' => true,  'bulan' => 3],
            ['nama' => 'UAS Grafika Komputer',              'nilai' => 58, 'grade' => 'D', 'lulus' => false, 'bulan' => 3],
            ['nama' => 'UTS Internet of Things',            'nilai' => 93, 'grade' => 'A', 'lulus' => true,  'bulan' => 3],
            ['nama' => 'UAS Big Data Analytics',            'nilai' => 74, 'grade' => 'B', 'lulus' => true,  'bulan' => 3],
            ['nama' => 'UTS DevOps',                        'nilai' => 81, 'grade' => 'B', 'lulus' => true,  'bulan' => 3],
            ['nama' => 'UAS Etika Profesi TI',              'nilai' => 96, 'grade' => 'A', 'lulus' => true,  'bulan' => 3],
        ];

        foreach ($ujianData as $i => $d) {
            $matkul = $allMatkul[$i % $allMatkul->count()];
            $tanggal = Carbon::create(2026, $d['bulan'], rand(5, 28), rand(8, 14), 0, 0);

            $ujianId = DB::table('ujian')->insertGetId([
                'created_by'     => $dosenId,
                'mata_kuliah_id' => $matkul->id,
                'nama_ujian'     => $d['nama'],
                'jenis_ujian'    => 'perkuliahan',
                'start_date'     => $tanggal,
                'end_date'       => $tanggal->copy()->addHours(2),
                'durasi_menit'   => 90,
                'kode_akses'     => strtoupper(substr(str_replace(' ', '', $d['nama']), 0, 4)) . str_pad($i + 1, 2, '0', STR_PAD_LEFT),
                'is_kode_aktif'  => false,
                'created_at'     => now(), 'updated_at' => now(),
            ]);

            $pesertaId = DB::table('peserta_ujian')->insertGetId([
                'ujian_id'   => $ujianId,
                'user_id'    => $natanaelId,
                'attempt_ke' => 1,
                'status'     => 'selesai',
                'mulai_at'   => $tanggal,
                'selesai_at' => $tanggal->copy()->addHour(),
                'created_at' => now(), 'updated_at' => now(),
            ]);

            DB::table('nilai_akhir')->insert([
                'peserta_ujian_id' => $pesertaId,
                'nilai_total'      => $d['nilai'],
                'lulus'            => $d['lulus'],
                'grade'            => $d['grade'],
                'graded_at'        => $tanggal->copy()->addHours(3),
                'created_at'       => now(), 'updated_at' => now(),
            ]);
        }
    }
}
