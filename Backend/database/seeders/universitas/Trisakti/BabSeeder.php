<?php
namespace Database\Seeders\Universitas\Trisakti;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
class BabSeeder extends Seeder
{
    public function run(): void
    {
        $univId = DB::table('universitas')->where('kode', 'TRISAKTI')->value('id');
        $prodiIds = DB::table('prodi')
            ->join('fakultas', 'prodi.fakultas_id', '=', 'fakultas.id')
            ->where('fakultas.universitas_id', $univId)
            ->pluck('prodi.id');
        $matkuls = DB::table('mata_kuliah')->whereIn('prodi_id', $prodiIds)->get();
        $insertData = [];
        foreach ($matkuls as $mk) {
            for ($i = 1; $i <= 5; $i++) {
                $insertData[] = ['mata_kuliah_id' => $mk->id, 'urutan' => $i, 'nama_bab' => "Bab {$i}", 'created_at' => now(), 'updated_at' => now()];
            }
        }
        DB::table('bab')->insert($insertData);
    }
}
