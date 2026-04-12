<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class UjianAktifSeeder extends Seeder
{
    public function run(): void
    {
        $natanaelId = DB::table('users')->where('email', 'natanaelvinedj@gmail.com')->value('id');
        $dosenId    = DB::table('users')->where('email', 'budi.santoso@untar.ac.id')->value('id');
        $allMatkul  = DB::table('mata_kuliah')->orderBy('id')->get();

        $now = Carbon::now();

        // ── Ujian sedang berlangsung ──────────────────────────────
        $matkulSegera = $allMatkul[0];
        $startSegera  = $now->copy()->subMinutes(30);
        $endSegera    = $now->copy()->addMinutes(90);

        $ujianSegeraId = DB::table('ujian')->insertGetId([
            'created_by'     => $dosenId,
            'mata_kuliah_id' => $matkulSegera->id,
            'nama_ujian'     => 'UTS Pemrograman Web Lanjut',
            'jenis_ujian'    => 'perkuliahan',
            'start_date'     => $startSegera,
            'end_date'       => $endSegera,
            'durasi_menit'   => 90,
            'kode_akses'     => 'PWLX01',
            'is_kode_aktif'  => true,
            'created_at'     => now(), 'updated_at' => now(),
        ]);

        DB::table('peserta_ujian')->insert([
            'ujian_id'   => $ujianSegeraId,
            'user_id'    => $natanaelId,
            'attempt_ke' => 1,
            'status'     => 'sedang_berlangsung',
            'mulai_at'   => $startSegera,
            'selesai_at' => null,
            'created_at' => now(), 'updated_at' => now(),
        ]);

        // ── Ujian akan datang ─────────────────────────────────────
        $akanDatang = [
            [
                'nama'   => 'UAS Kecerdasan Buatan',
                'kode'   => 'KBAX01',
                'offset' => 1,   // besok
                'jam'    => 9,
            ],
            [
                'nama'   => 'UTS Basis Data Lanjut',
                'kode'   => 'BDLX01',
                'offset' => 3,   // 3 hari lagi
                'jam'    => 13,
            ],
            [
                'nama'   => 'UAS Rekayasa Perangkat Lunak',
                'kode'   => 'RPLX01',
                'offset' => 7,   // seminggu lagi
                'jam'    => 10,
            ],
        ];

        foreach ($akanDatang as $i => $d) {
            $matkul    = $allMatkul[($i + 1) % $allMatkul->count()];
            $startDate = $now->copy()->addDays($d['offset'])->setTime($d['jam'], 0, 0);
            $endDate   = $startDate->copy()->addHours(2);

            $ujianId = DB::table('ujian')->insertGetId([
                'created_by'     => $dosenId,
                'mata_kuliah_id' => $matkul->id,
                'nama_ujian'     => $d['nama'],
                'jenis_ujian'    => 'perkuliahan',
                'start_date'     => $startDate,
                'end_date'       => $endDate,
                'durasi_menit'   => 90,
                'kode_akses'     => $d['kode'],
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
