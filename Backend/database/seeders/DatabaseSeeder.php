<?php

namespace Database\Seeders;

// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $this->call([
            UniversitasSeeder::class,
            FakultasSeeder::class,
            ProdiSeeder::class,
            UserSeeder::class,
            DemoSeeder::class,
            NilaiSeeder::class,
            UjianAktifSeeder::class,
            UjianDenganSoalSeeder::class,
            BankSoalBabSeeder::class,
            BankSoalExternalUnivSeeder::class,
        ]);
    }
}
