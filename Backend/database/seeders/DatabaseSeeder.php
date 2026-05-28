<?php

namespace Database\Seeders;

// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Database\Seeders\Universitas\Untar\UniversitasSeeder;
use Database\Seeders\Universitas\Untar\FakultasSeeder;
use Database\Seeders\Universitas\Untar\ProdiSeeder;
use Database\Seeders\Universitas\Untar\UserSeeder;
use Database\Seeders\Universitas\Untar\MahasiswaSeeder;
use Database\Seeders\Universitas\Untar\DemoSeeder;
use Database\Seeders\Universitas\Untar\UjianSeeder;
use Database\Seeders\Universitas\Untar\NilaiSeeder;
use Database\Seeders\Universitas\Untar\UjianAktifSeeder;
use Database\Seeders\Universitas\Untar\UjianDenganSoalSeeder;
use Database\Seeders\Universitas\Untar\BankSoalBabSeeder;
use Database\Seeders\Universitas\Untar\SimulasiEssaySeeder;
use Database\Seeders\Universitas\Untar\PmbSeeder;
use Database\Seeders\Universitas\Untar\MataKuliahSeeder;
use Database\Seeders\Universitas\Untar\MatkulDosenSeeder;
use Database\Seeders\Universitas\Binus\UniversitasSeeder as BinusUniversitasSeeder;
use Database\Seeders\Universitas\Binus\FakultasSeeder    as BinusFakultasSeeder;
use Database\Seeders\Universitas\Binus\ProdiSeeder       as BinusProdiSeeder;
use Database\Seeders\Universitas\Binus\UserSeeder        as BinusUserSeeder;
use Database\Seeders\Universitas\Binus\MahasiswaSeeder   as BinusMahasiswaSeeder;

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
            BinusUniversitasSeeder::class,
            FakultasSeeder::class,
            BinusFakultasSeeder::class,
            ProdiSeeder::class,
            BinusProdiSeeder::class,
            UserSeeder::class,
            BinusUserSeeder::class,
            MahasiswaSeeder::class,
            BinusMahasiswaSeeder::class,
            DemoSeeder::class,
            UjianSeeder::class,
            NilaiSeeder::class,
            UjianAktifSeeder::class,
            UjianDenganSoalSeeder::class,
            BankSoalBabSeeder::class,
            BankSoalExternalUnivSeeder::class,
            SimulasiEssaySeeder::class,
            PmbSeeder::class,
            MataKuliahSeeder::class,
            MatkulDosenSeeder::class,
        ]);
    }
}
