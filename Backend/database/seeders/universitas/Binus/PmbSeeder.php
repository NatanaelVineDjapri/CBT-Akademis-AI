<?php
namespace Database\Seeders\Universitas\Binus;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
class PmbSeeder extends Seeder
{
    public function run(): void
    {
        $binus = DB::table('universitas')->where('kode', 'BINUS')->value('id');
        $firstNames = ['Agus','Ayu','Ahmad','Anisa','Andi','Arif','Amelia','Bayu','Bunga','Bima','Budi','Citra','Dani','Dewi','Dedi','Eko','Fajar','Fitri','Galih','Hendra','Indah','Ivan','Kevin','Laura','Leo','Maya','Muhammad','Nanda','Putri','Reza','Sandi','Wahyu','Yoga','Zainal','Rizki','Oscar','Pandu','Iqbal','Jasmine','Joko','Gilang','Erlangga','Lukman','Nabila','Oki','Krisna','Lina','Denny','Irvan','Tono'];
        $lastNames = ['Halim','Tanaka','Wijaya','Santoso','Gunawan','Lim','Chen','Susanto','Hartono','Budiman','Setiawan','Hidayat','Pratama','Nugroho','Kurniawan','Saputra','Wibowo','Purnomo','Hakim','Salim','Chandra','Lukman','Mulyadi','Pranoto','Hermawan','Wahyudi','Utomo','Haryanto','Palupi','Sanjaya'];
        $pw = Hash::make('password123');
        $fnCount = count($firstNames);
        $lnCount = count($lastNames);
        $rows = [];
        for ($i = 1; $i <= 1000; $i++) {
            $nama = $firstNames[($i - 1) % $fnCount] . ' ' . $lastNames[($i - 1) % $lnCount];
            $rows[] = [
                'nama' => $nama,
                'email' => strtolower(str_replace(' ', '.', $nama)) . '.pmb' . $i . '@student.binus.ac.id',
                'password' => $pw,
                'role' => 'peserta_mahasiswa_baru',
                'universitas_id' => $binus,
                'status' => 'pending',
                'created_at' => now(),
                'updated_at' => now(),
            ];
        }
        DB::table('users')->insertOrIgnore($rows);
    }
}
