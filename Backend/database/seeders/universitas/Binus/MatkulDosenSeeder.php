<?php
namespace Database\Seeders\Universitas\Binus;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
class MatkulDosenSeeder extends Seeder
{
    public function run(): void
    {
        $dosens = DB::table('users')->where('role', 'dosen')->where('universitas_id', DB::table('universitas')->where('kode', 'BINUS')->value('id'))->pluck('id');
        if ($dosens->isEmpty()) return;
        $matkuls = DB::table('mata_kuliah')->whereIn('prodi_id', DB::table('prodi')->whereIn('kode', ['BCS','BAI','BCYB','BIS','BDS','BIET','BARC','BTSV','BTKE','BAKT','BFIN','BMC','BHI','BENG','BPSI','BHUK','BDKV','BDIN'])->pluck('id'))->get();
        $insertData = [];
        foreach ($matkuls as $idx => $mk) {
            $dosen = $dosens[$idx % $dosens->count()];
            $insertData[] = ['user_id' => $dosen, 'mata_kuliah_id' => $mk->id, 'tahun_ajaran' => '2024/2025', 'created_at' => now(), 'updated_at' => now()];
        }
        if (!empty($insertData)) DB::table('dosen_matkul')->insertOrIgnore($insertData);
    }
}
