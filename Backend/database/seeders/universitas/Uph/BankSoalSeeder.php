<?php
namespace Database\Seeders\Universitas\Uph;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
class BankSoalSeeder extends Seeder
{
    private array $permissions = ['private', 'share', 'public'];
    private array $soalTipe = ['pilihan_ganda', 'essay', 'checkbox'];
    public function run(): void
    {
        $dosens = DB::table('users')->where('role', 'dosen')->where('universitas_id', DB::table('universitas')->where('kode', 'UPH')->value('id'))->get();
        foreach ($dosens as $dosen) {
            for ($i = 0; $i < 3; $i++) {
                $matkul = DB::table('mata_kuliah')->where('prodi_id', $dosen->prodi_id)->inRandomOrder()->first();
                if (!$matkul) continue;
                $bab = DB::table('bab')->where('mata_kuliah_id', $matkul->id)->inRandomOrder()->first();
                $bankId = DB::table('bank_soal')->insertGetId(['created_by' => $dosen->id, 'mata_kuliah_id' => $matkul->id, 'bab_id' => $bab?->id, 'nama' => "Bank Soal {$matkul->nama} - Set " . ($i + 1), 'deskripsi' => "Kumpulan soal untuk " . $matkul->nama, 'permission' => $this->permissions[rand(0, 2)], 'created_at' => now(), 'updated_at' => now()]);
                $soalCount = rand(30, 50);
                for ($s = 0; $s < $soalCount; $s++) {
                    $tipe = $this->soalTipe[0];
                    $r = rand(0, 100);
                    if ($r > 60 && $r <= 85) $tipe = $this->soalTipe[1];
                    elseif ($r > 85) $tipe = $this->soalTipe[2];
                    $soalId = DB::table('soal')->insertGetId(['bank_soal_id' => $bankId, 'mata_kuliah_id' => $matkul->id, 'bab_id' => $bab?->id, 'deskripsi' => "Soal {$tipe} nomor " . ($s + 1), 'tingkat_kesulitan' => ['mudah', 'sedang', 'sulit'][rand(0, 2)], 'ai_generated' => false, 'created_at' => now(), 'updated_at' => now()]);
                    $jenisSoalId = DB::table('jenis_soal')->insertGetId(['soal_id' => $soalId, 'jenis_soal' => $tipe, 'created_at' => now(), 'updated_at' => now()]);
                    if ($tipe === 'pilihan_ganda') { $correctIndex = rand(0, 3); foreach (['A', 'B', 'C', 'D'] as $j => $opsi) { DB::table('opsi_jawaban')->insert(['jenis_soal_id' => $jenisSoalId, 'opsi' => $opsi, 'teks' => "Opsi $opsi", 'is_correct' => ($j === $correctIndex), 'created_at' => now(), 'updated_at' => now()]); } }
                    elseif ($tipe === 'checkbox') { foreach (['A', 'B', 'C', 'D'] as $j => $opsi) { DB::table('opsi_jawaban')->insert(['jenis_soal_id' => $jenisSoalId, 'opsi' => $opsi, 'teks' => "Pilihan $opsi", 'is_correct' => (rand(0, 100) > 50), 'created_at' => now(), 'updated_at' => now()]); } }
                }
            }
        }
    }
}
