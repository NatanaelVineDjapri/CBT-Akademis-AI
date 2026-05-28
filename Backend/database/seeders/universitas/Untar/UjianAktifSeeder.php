<?php

namespace Database\Seeders\Universitas\Untar;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class UjianAktifSeeder extends Seeder
{
    public function run(): void
    {
        $natanaelId = DB::table('users')->where('nim', '535240042')->value('id');
        $dosenId    = DB::table('users')->where('email', 'irvan.lewenusa@untar.ac.id')->value('id');
        $kodeAksesLama = ['KAL-ACT', 'SD-ACT', 'TI-01', 'TI-02', 'SI-01', 'SI-02', 'SI-03'];
        DB::table('ujian')->whereIn('kode_akses', $kodeAksesLama)->delete();

        $now = Carbon::now();


        $ujianBerlangsung = [
            ['matkul' => 'Kalkulus', 'kode' => 'KAL-ACT', 'nama' => 'UTS Kalkulus I'],
            ['matkul' => 'Struktur Data', 'kode' => 'SD-ACT', 'nama' => 'UTS Struktur Data'],
        ];

        foreach ($ujianBerlangsung as $u) {
            $mk = DB::table('mata_kuliah')->where('nama', $u['matkul'])->first();
            
            if ($mk) {
                $start = $now->copy()->subMinutes(30);
                $end   = $now->copy()->addMinutes(90);

                $ujianId = DB::table('ujian')->insertGetId([
                    'created_by'     => $dosenId,
                    'mata_kuliah_id' => $mk->id,
                    'nama_ujian'     => $u['nama'] . ' (Sedang Berjalan)',
                    'jenis_ujian'    => 'perkuliahan',
                    'start_date'     => $start,
                    'end_date'       => $end,
                    'durasi_menit'   => 120,
                    'kode_akses'     => $u['kode'],
                    'is_kode_aktif'  => true,
                    'created_at'     => now(), 'updated_at' => now(),
                ]);

                DB::table('peserta_ujian')->insert([
                    'ujian_id'   => $ujianId,
                    'user_id'    => $natanaelId,
                    'attempt_ke' => 1,
                    'status'     => 'sedang_berlangsung',
                    'mulai_at'   => $start,
                    'selesai_at' => null,
                    'created_at' => now(), 'updated_at' => now(),
                ]);
            }
        }


        $jadwalMendatang = [
            ['matkul' => 'Kecerdasan Buatan', 'nama' => 'UAS Artificial Intelligence', 'kode' => 'TI-01', 'day' => 1, 'jam' => 9],
            ['matkul' => 'Jaringan Komputer', 'nama' => 'UTS Jaringan Komputer', 'kode' => 'TI-02', 'day' => 2, 'jam' => 13],
            ['matkul' => 'Enterprise Resource Planning', 'nama' => 'Kuis ERP', 'kode' => 'SI-01', 'day' => 3, 'jam' => 8],
            ['matkul' => 'E-Business', 'nama' => 'UTS E-Business', 'kode' => 'SI-02', 'day' => 4, 'jam' => 10],
            ['matkul' => 'Business Intelligence', 'nama' => 'UAS BI', 'kode' => 'SI-03', 'day' => 5, 'jam' => 15],
        ];

        
        foreach ($jadwalMendatang as $j) {
            $mk = DB::table('mata_kuliah')->where('nama', $j['matkul'])->first();
            
            if ($mk) {
                $startDate = $now->copy()->addDays($j['day'])->setTime($j['jam'], 0, 0);
                $endDate   = $startDate->copy()->addHours(2);

                $ujianId = DB::table('ujian')->insertGetId([
                    'created_by'     => $dosenId,
                    'mata_kuliah_id' => $mk->id,
                    'nama_ujian'     => $j['nama'],
                    'jenis_ujian'    => 'perkuliahan',
                    'start_date'     => $startDate,
                    'end_date'       => $endDate,
                    'durasi_menit'   => 120,
                    'kode_akses'     => $j['kode'],
                    'is_kode_aktif'  => false,
                    'created_at'     => now(), 'updated_at' => now(),
                ]);


                DB::table('peserta_ujian')->insert([
                    'ujian_id'   => $ujianId,
                    'user_id'    => $natanaelId,
                    'attempt_ke' => 1,
                    'status'     => 'belum_mulai',
                    'mulai_at'   => null,
                    'selesai_at' => null,
                    'created_at' => now(), 'updated_at' => now(),
                ]);
            }
        }
    }
}
