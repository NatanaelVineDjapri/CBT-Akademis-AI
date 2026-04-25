<?php

namespace Database\Seeders;

// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        DB::statement('TRUNCATE TABLE
            nilai_akhir, jawaban_peserta, peserta_ujian, ujian_soal, grade_setting,
            ujian_setting, ujian, rubrik_essay, opsi_jawaban, jenis_soal, media_soal,
            soal, bab, bank_soal_shared, bank_soal, proctoring_log, section,
            user_mata_kuliah, dosen_matkul, mata_kuliah, pengumuman,
            ai_generate_log, users, prodi, fakultas, universitas,
            personal_access_tokens
        RESTART IDENTITY CASCADE');

        $this->call([
            UniversitasSeeder::class,
            FakultasSeeder::class,
            ProdiSeeder::class,
            UserSeeder::class,
            MahasiswaSeeder::class,
            DemoSeeder::class,
            UjianSeeder::class,
            NilaiSeeder::class,
            UjianAktifSeeder::class,
            UjianDenganSoalSeeder::class,
            BankSoalBabSeeder::class,
            BankSoalExternalUnivSeeder::class,
        ]);
    }
}
