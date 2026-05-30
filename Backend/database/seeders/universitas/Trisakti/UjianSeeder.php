<?php
namespace Database\Seeders\Universitas\Trisakti;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;
class UjianSeeder extends Seeder
{
    public function run(): void
    {
        $univId = DB::table('universitas')->where('kode', 'TRISAKTI')->value('id');
        $prodis = DB::table('prodi')
            ->join('fakultas', 'prodi.fakultas_id', '=', 'fakultas.id')
            ->where('fakultas.universitas_id', $univId)
            ->select('prodi.*')
            ->get();
        foreach ($prodis as $p) {
            $dosen = DB::table('users')->where('role', 'dosen')->where('prodi_id', $p->id)->first();
            $mk = DB::table('mata_kuliah')->where('prodi_id', $p->id)->first();
            if (!$dosen || !$mk) continue;
            $tipe = rand(0, 2);
            $now = Carbon::now();
            if ($tipe === 0) {
                $start = $now->copy()->subDays(rand(0, 2));
                $end = $now->copy()->addDays(14);
                $isKodeAktif = true;
            } elseif ($tipe === 1) {
                $start = $now->copy()->subDays(rand(5, 30));
                $end = $start->copy()->addHours(2);
                $isKodeAktif = false;
            } else {
                $start = $now->copy()->addDays(rand(7, 60));
                $end = $start->copy()->addHours(2);
                $isKodeAktif = true;
            }
            $kodeAkses = strtoupper(substr($p->kode, 0, 6)) . rand(1000, 9999);
            $ujianId = DB::table('ujian')->insertGetId([
                'created_by'      => $dosen->id,
                'mata_kuliah_id'  => $mk->id,
                'nama_ujian'      => "UTS {$mk->nama}",
                'jenis_ujian'     => 'perkuliahan',
                'start_date'      => $start,
                'end_date'        => $end,
                'durasi_menit'    => 90,
                'kode_akses'      => $kodeAkses,
                'is_kode_aktif'   => $isKodeAktif,
                'created_at'      => now(), 'updated_at' => now()
            ]);
            DB::table('ujian_setting')->insert([
                'ujian_id'         => $ujianId,
                'randomize_soal'   => true,
                'max_attempt'      => 1,
                'passing_grade'    => 60,
                'total_skor'       => 100,
                'proctoring_aktif' => false,
                'created_at'       => now(), 'updated_at' => now()
            ]);
            $ujianSoalIds = [];
            for ($i = 0; $i < 3; $i++) {
                $soalId = DB::table('soal')->insertGetId([
                    'bank_soal_id'      => null,
                    'mata_kuliah_id'    => $mk->id,
                    'bab_id'            => null,
                    'deskripsi'         => "Soal nomor " . ($i + 1),
                    'tingkat_kesulitan' => ['mudah', 'sedang', 'sulit'][$i],
                    'ai_generated'      => false,
                    'created_at'        => now(), 'updated_at' => now()
                ]);
                $jenisSoalId = DB::table('jenis_soal')->insertGetId([
                    'soal_id' => $soalId, 'jenis_soal' => 'pilihan_ganda',
                    'created_at' => now(), 'updated_at' => now()
                ]);
                foreach (['A', 'B', 'C', 'D'] as $j => $opsi) {
                    DB::table('opsi_jawaban')->insert([
                        'jenis_soal_id' => $jenisSoalId, 'opsi' => $opsi,
                        'teks' => "Pilihan $opsi", 'is_correct' => ($j === 1),
                        'created_at' => now(), 'updated_at' => now()
                    ]);
                }
                $ujianSoalIds[] = DB::table('ujian_soal')->insertGetId([
                    'ujian_id' => $ujianId, 'soal_id' => $soalId,
                    'bobot' => 33.33, 'urutan' => $i + 1,
                    'created_at' => now(), 'updated_at' => now()
                ]);
            }
            if ($tipe === 1) {
                $mahasiswas = DB::table('users')->where('role', 'mahasiswa')->where('prodi_id', $p->id)->inRandomOrder()->limit(20)->get();
                foreach ($mahasiswas as $mhs) {
                    $pesertaId = DB::table('peserta_ujian')->insertGetId([
                        'ujian_id' => $ujianId, 'user_id' => $mhs->id,
                        'attempt_ke' => 1, 'status' => 'selesai',
                        'mulai_at' => $start->copy()->addMinutes(rand(0, 5)),
                        'selesai_at' => $start->copy()->addHours(2)->subMinutes(rand(0, 5)),
                        'created_at' => now(), 'updated_at' => now()
                    ]);
                    $nilaiTotal = 0;
                    foreach ($ujianSoalIds as $ujianSoalId) {
                        $isBenar = (rand(0, 100) < 70);
                        $nilaiSoal = $isBenar ? 33.33 : 0;
                        DB::table('jawaban_peserta')->insert([
                            'peserta_ujian_id' => $pesertaId, 'ujian_soal_id' => $ujianSoalId,
                            'jawaban' => $isBenar ? 'B' : ['A', 'C', 'D'][rand(0, 2)],
                            'nilai' => $nilaiSoal,
                            'created_at' => now(), 'updated_at' => now()
                        ]);
                        $nilaiTotal += $nilaiSoal;
                    }
                    DB::table('nilai_akhir')->insert([
                        'peserta_ujian_id' => $pesertaId, 'nilai_total' => $nilaiTotal,
                        'lulus' => $nilaiTotal >= 60, 'graded_at' => now(),
                        'created_at' => now(), 'updated_at' => now()
                    ]);
                }
            }
        }
    }
}
