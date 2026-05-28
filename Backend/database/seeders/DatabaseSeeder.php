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
use Database\Seeders\Universitas\Binus\UniversitasSeeder   as BinusUniversitasSeeder;
use Database\Seeders\Universitas\Binus\FakultasSeeder      as BinusFakultasSeeder;
use Database\Seeders\Universitas\Binus\ProdiSeeder         as BinusProdiSeeder;
use Database\Seeders\Universitas\Binus\UserSeeder          as BinusUserSeeder;
use Database\Seeders\Universitas\Binus\MahasiswaSeeder     as BinusMahasiswaSeeder;
use Database\Seeders\Universitas\Umn\UniversitasSeeder     as UmnUniversitasSeeder;
use Database\Seeders\Universitas\Umn\FakultasSeeder        as UmnFakultasSeeder;
use Database\Seeders\Universitas\Umn\ProdiSeeder           as UmnProdiSeeder;
use Database\Seeders\Universitas\Umn\UserSeeder            as UmnUserSeeder;
use Database\Seeders\Universitas\Umn\MahasiswaSeeder       as UmnMahasiswaSeeder;
use Database\Seeders\Universitas\Uph\UniversitasSeeder     as UphUniversitasSeeder;
use Database\Seeders\Universitas\Uph\FakultasSeeder        as UphFakultasSeeder;
use Database\Seeders\Universitas\Uph\ProdiSeeder           as UphProdiSeeder;
use Database\Seeders\Universitas\Uph\UserSeeder            as UphUserSeeder;
use Database\Seeders\Universitas\Uph\MahasiswaSeeder       as UphMahasiswaSeeder;
use Database\Seeders\Universitas\Trisakti\UniversitasSeeder as TrisaktiUniversitasSeeder;
use Database\Seeders\Universitas\Trisakti\FakultasSeeder   as TrisaktiFakultasSeeder;
use Database\Seeders\Universitas\Trisakti\ProdiSeeder      as TrisaktiProdiSeeder;
use Database\Seeders\Universitas\Trisakti\UserSeeder       as TrisaktiUserSeeder;
use Database\Seeders\Universitas\Trisakti\MahasiswaSeeder  as TrisaktiMahasiswaSeeder;
use Database\Seeders\Universitas\AtmaJaya\UniversitasSeeder as AtmaJayaUniversitasSeeder;
use Database\Seeders\Universitas\AtmaJaya\FakultasSeeder   as AtmaJayaFakultasSeeder;
use Database\Seeders\Universitas\AtmaJaya\ProdiSeeder      as AtmaJayaProdiSeeder;
use Database\Seeders\Universitas\AtmaJaya\UserSeeder       as AtmaJayaUserSeeder;
use Database\Seeders\Universitas\AtmaJaya\MahasiswaSeeder  as AtmaJayaMahasiswaSeeder;

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
            UmnUniversitasSeeder::class,
            UphUniversitasSeeder::class,
            TrisaktiUniversitasSeeder::class,
            AtmaJayaUniversitasSeeder::class,
            FakultasSeeder::class,
            BinusFakultasSeeder::class,
            UmnFakultasSeeder::class,
            UphFakultasSeeder::class,
            TrisaktiFakultasSeeder::class,
            AtmaJayaFakultasSeeder::class,
            ProdiSeeder::class,
            BinusProdiSeeder::class,
            UmnProdiSeeder::class,
            UphProdiSeeder::class,
            TrisaktiProdiSeeder::class,
            AtmaJayaProdiSeeder::class,
            UserSeeder::class,
            BinusUserSeeder::class,
            UmnUserSeeder::class,
            UphUserSeeder::class,
            TrisaktiUserSeeder::class,
            AtmaJayaUserSeeder::class,
            MahasiswaSeeder::class,
            BinusMahasiswaSeeder::class,
            UmnMahasiswaSeeder::class,
            UphMahasiswaSeeder::class,
            TrisaktiMahasiswaSeeder::class,
            AtmaJayaMahasiswaSeeder::class,
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
