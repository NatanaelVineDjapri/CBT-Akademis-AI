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
use Database\Seeders\Universitas\Binus\MataKuliahSeeder   as BinusMataKuliahSeeder;
use Database\Seeders\Universitas\Binus\MatkulDosenSeeder  as BinusMatkulDosenSeeder;
use Database\Seeders\Universitas\Binus\UjianSeeder        as BinusUjianSeeder;
use Database\Seeders\Universitas\Umn\UniversitasSeeder     as UmnUniversitasSeeder;
use Database\Seeders\Universitas\Umn\FakultasSeeder        as UmnFakultasSeeder;
use Database\Seeders\Universitas\Umn\ProdiSeeder           as UmnProdiSeeder;
use Database\Seeders\Universitas\Umn\UserSeeder            as UmnUserSeeder;
use Database\Seeders\Universitas\Umn\MahasiswaSeeder       as UmnMahasiswaSeeder;
use Database\Seeders\Universitas\Umn\MataKuliahSeeder     as UmnMataKuliahSeeder;
use Database\Seeders\Universitas\Umn\MatkulDosenSeeder    as UmnMatkulDosenSeeder;
use Database\Seeders\Universitas\Umn\UjianSeeder          as UmnUjianSeeder;
use Database\Seeders\Universitas\Uph\UniversitasSeeder     as UphUniversitasSeeder;
use Database\Seeders\Universitas\Uph\FakultasSeeder        as UphFakultasSeeder;
use Database\Seeders\Universitas\Uph\ProdiSeeder           as UphProdiSeeder;
use Database\Seeders\Universitas\Uph\UserSeeder            as UphUserSeeder;
use Database\Seeders\Universitas\Uph\MahasiswaSeeder       as UphMahasiswaSeeder;
use Database\Seeders\Universitas\Uph\MataKuliahSeeder     as UphMataKuliahSeeder;
use Database\Seeders\Universitas\Uph\MatkulDosenSeeder    as UphMatkulDosenSeeder;
use Database\Seeders\Universitas\Uph\UjianSeeder          as UphUjianSeeder;
use Database\Seeders\Universitas\Trisakti\UniversitasSeeder as TrisaktiUniversitasSeeder;
use Database\Seeders\Universitas\Trisakti\FakultasSeeder   as TrisaktiFakultasSeeder;
use Database\Seeders\Universitas\Trisakti\ProdiSeeder      as TrisaktiProdiSeeder;
use Database\Seeders\Universitas\Trisakti\UserSeeder       as TrisaktiUserSeeder;
use Database\Seeders\Universitas\Trisakti\MahasiswaSeeder  as TrisaktiMahasiswaSeeder;
use Database\Seeders\Universitas\Trisakti\MataKuliahSeeder as TrisaktiMataKuliahSeeder;
use Database\Seeders\Universitas\Trisakti\MatkulDosenSeeder as TrisaktiMatkulDosenSeeder;
use Database\Seeders\Universitas\Trisakti\UjianSeeder      as TrisaktiUjianSeeder;
use Database\Seeders\Universitas\AtmaJaya\UniversitasSeeder as AtmaJayaUniversitasSeeder;
use Database\Seeders\Universitas\AtmaJaya\FakultasSeeder   as AtmaJayaFakultasSeeder;
use Database\Seeders\Universitas\AtmaJaya\ProdiSeeder      as AtmaJayaProdiSeeder;
use Database\Seeders\Universitas\AtmaJaya\UserSeeder       as AtmaJayaUserSeeder;
use Database\Seeders\Universitas\AtmaJaya\MahasiswaSeeder  as AtmaJayaMahasiswaSeeder;
use Database\Seeders\Universitas\AtmaJaya\MataKuliahSeeder as AtmaJayaMataKuliahSeeder;
use Database\Seeders\Universitas\AtmaJaya\MatkulDosenSeeder as AtmaJayaMatkulDosenSeeder;
use Database\Seeders\Universitas\AtmaJaya\UjianSeeder      as AtmaJayaUjianSeeder;
use Database\Seeders\Universitas\Binus\BabSeeder          as BinusBabSeeder;
use Database\Seeders\Universitas\Binus\BankSoalSeeder     as BinusBankSoalSeeder;
use Database\Seeders\Universitas\Umn\BabSeeder            as UmnBabSeeder;
use Database\Seeders\Universitas\Umn\BankSoalSeeder       as UmnBankSoalSeeder;
use Database\Seeders\Universitas\Uph\BabSeeder            as UphBabSeeder;
use Database\Seeders\Universitas\Uph\BankSoalSeeder       as UphBankSoalSeeder;
use Database\Seeders\Universitas\Trisakti\BabSeeder       as TrisaktiaBabSeeder;
use Database\Seeders\Universitas\Trisakti\BankSoalSeeder  as TrisaktiBankSoalSeeder;
use Database\Seeders\Universitas\AtmaJaya\BabSeeder       as AtmaJayaBabSeeder;
use Database\Seeders\Universitas\AtmaJaya\BankSoalSeeder  as AtmaJayaBankSoalSeeder;
use Database\Seeders\Universitas\Binus\PmbSeeder         as BinusPmbSeeder;
use Database\Seeders\Universitas\Umn\PmbSeeder           as UmnPmbSeeder;
use Database\Seeders\Universitas\Uph\PmbSeeder           as UphPmbSeeder;
use Database\Seeders\Universitas\Trisakti\PmbSeeder      as TrisaktiPmbSeeder;
use Database\Seeders\Universitas\AtmaJaya\PmbSeeder      as AtmaJayaPmbSeeder;

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
            PmbSeeder::class,
            BinusPmbSeeder::class,
            UmnPmbSeeder::class,
            UphPmbSeeder::class,
            TrisaktiPmbSeeder::class,
            AtmaJayaPmbSeeder::class,
            MahasiswaSeeder::class,
            BinusMahasiswaSeeder::class,
            UmnMahasiswaSeeder::class,
            UphMahasiswaSeeder::class,
            TrisaktiMahasiswaSeeder::class,
            AtmaJayaMahasiswaSeeder::class,
            MataKuliahSeeder::class,
            BinusMataKuliahSeeder::class,
            UmnMataKuliahSeeder::class,
            UphMataKuliahSeeder::class,
            TrisaktiMataKuliahSeeder::class,
            AtmaJayaMataKuliahSeeder::class,
            BinusBabSeeder::class,
            UmnBabSeeder::class,
            UphBabSeeder::class,
            TrisaktiaBabSeeder::class,
            AtmaJayaBabSeeder::class,
            BinusMatkulDosenSeeder::class,
            UmnMatkulDosenSeeder::class,
            UphMatkulDosenSeeder::class,
            TrisaktiMatkulDosenSeeder::class,
            AtmaJayaMatkulDosenSeeder::class,
            BinusBankSoalSeeder::class,
            UmnBankSoalSeeder::class,
            UphBankSoalSeeder::class,
            TrisaktiBankSoalSeeder::class,
            AtmaJayaBankSoalSeeder::class,
            BinusUjianSeeder::class,
            UmnUjianSeeder::class,
            UphUjianSeeder::class,
            TrisaktiUjianSeeder::class,
            AtmaJayaUjianSeeder::class,
            DemoSeeder::class,
            UjianSeeder::class,
            NilaiSeeder::class,
            UjianAktifSeeder::class,
            UjianDenganSoalSeeder::class,
            BankSoalBabSeeder::class,
            BankSoalExternalUnivSeeder::class,
            SimulasiEssaySeeder::class,
        ]);
    }
}
