<?php

namespace App\Http\Controllers;

use App\Models\BankSoal;
use App\Models\JenisSoal;
use App\Models\MediaSoal;
use App\Models\OpsiJawaban;
use App\Models\Soal;
use Illuminate\Http\Request;

class SoalController extends Controller
{
    public function store(Request $request)
    {
        $request->validate([
            'bank_soal_id'      => 'required|integer|exists:bank_soal,id',
            'jenis_soal'        => 'required|in:pilihan_ganda,essay,checklist',
            'tingkat_kesulitan' => 'required|in:mudah,sedang,sulit',
            'deskripsi'         => 'required|string',
            'bab_id'            => 'nullable|integer|exists:bab,id',
            'opsi'              => 'nullable|array',
            'kunci'             => 'nullable',
            'gambar_url'        => 'nullable|url',
        ]);

        $bankSoal = BankSoal::findOrFail($request->bank_soal_id);

        $soal = Soal::create([
            'bank_soal_id'      => $bankSoal->id,
            'mata_kuliah_id'    => $bankSoal->mata_kuliah_id,
            'bab_id'            => $request->bab_id,
            'deskripsi'         => $request->deskripsi,
            'tingkat_kesulitan' => $request->tingkat_kesulitan,
            'ai_generated'      => false,
        ]);

        $jenisSoal = JenisSoal::create([
            'soal_id'    => $soal->id,
            'jenis_soal' => $request->jenis_soal,
        ]);

        if (!empty($request->opsi) && !empty($request->kunci)) {
            $kunci = $request->kunci;
            foreach ($request->opsi as $huruf => $teks) {
                $isCorrect = is_array($kunci)
                    ? in_array($huruf, $kunci)
                    : $huruf === $kunci;

                OpsiJawaban::create([
                    'jenis_soal_id' => $jenisSoal->id,
                    'opsi'          => $huruf,
                    'teks'          => $teks,
                    'is_correct'    => $isCorrect,
                ]);
            }
        }

        if ($request->filled('gambar_url')) {
            MediaSoal::create([
                'soal_id'    => $soal->id,
                'tipe_media' => 'gambar',
                'url'        => $request->gambar_url,
            ]);
        }

        return response()->json(['message' => 'Soal berhasil disimpan.'], 201);
    }

    public function update(Request $request, int $id)
    {
        $request->validate([
            'jenis_soal'        => 'required|in:pilihan_ganda,essay,checklist',
            'tingkat_kesulitan' => 'required|in:mudah,sedang,sulit',
            'deskripsi'         => 'required|string',
            'bab_id'            => 'nullable|integer|exists:bab,id',
            'opsi'              => 'nullable|array',
            'kunci'             => 'nullable',
            'gambar_url'        => 'nullable|url',
            'hapus_gambar'      => 'nullable|boolean',
        ]);

        $soal = Soal::findOrFail($id);

        $soal->update([
            'deskripsi'         => $request->deskripsi,
            'tingkat_kesulitan' => $request->tingkat_kesulitan,
            'bab_id'            => $request->bab_id,
        ]);

        $jenisSoal = $soal->jenisSoal()->first();
        if ($jenisSoal) {
            $jenisSoal->update(['jenis_soal' => $request->jenis_soal]);
            $jenisSoal->opsiJawaban()->delete();
        } else {
            $jenisSoal = $soal->jenisSoal()->create(['jenis_soal' => $request->jenis_soal]);
        }

        if (!empty($request->opsi) && !empty($request->kunci)) {
            $kunci = $request->kunci;
            foreach ($request->opsi as $huruf => $teks) {
                $isCorrect = is_array($kunci)
                    ? in_array($huruf, $kunci)
                    : $huruf === $kunci;

                OpsiJawaban::create([
                    'jenis_soal_id' => $jenisSoal->id,
                    'opsi'          => $huruf,
                    'teks'          => $teks,
                    'is_correct'    => $isCorrect,
                ]);
            }
        }

        if ($request->filled('gambar_url')) {
            $soal->mediaSoal()->where('tipe_media', 'gambar')->delete();
            MediaSoal::create([
                'soal_id'    => $soal->id,
                'tipe_media' => 'gambar',
                'url'        => $request->gambar_url,
            ]);
        } elseif ($request->boolean('hapus_gambar')) {
            $soal->mediaSoal()->where('tipe_media', 'gambar')->delete();
        }

        return response()->json(['message' => 'Soal berhasil diupdate.']);
    }

    public function destroy(int $id)
    {
        $soal = Soal::findOrFail($id);
        $soal->delete();
        return response()->json(['message' => 'Soal berhasil dihapus.']);
    }

    public function storeBulk(Request $request)
    {
        $request->validate([
            'bank_soal_id'      => 'required|integer|exists:bank_soal,id',
            'jenis_soal'        => 'required|in:pilihan_ganda,essay,checklist',
            'tingkat_kesulitan' => 'required|in:mudah,sedang,sulit',
            'soal'              => 'required|array|min:1',
            'soal.*.deskripsi'  => 'required|string',
            'soal.*.opsi'       => 'nullable|array',
            'soal.*.kunci'      => 'nullable',
        ]);

        $bankSoal = BankSoal::findOrFail($request->bank_soal_id);

        foreach ($request->soal as $item) {
            $soal = Soal::create([
                'bank_soal_id'      => $bankSoal->id,
                'mata_kuliah_id'    => $bankSoal->mata_kuliah_id,
                'deskripsi'         => $item['deskripsi'],
                'tingkat_kesulitan' => $request->tingkat_kesulitan,
                'ai_generated'      => true,
            ]);

            $jenisSoal = JenisSoal::create([
                'soal_id'    => $soal->id,
                'jenis_soal' => $request->jenis_soal,
            ]);

            if (!empty($item['opsi']) && !empty($item['kunci'])) {
                $kunci = $item['kunci'];
                foreach ($item['opsi'] as $huruf => $teks) {
                    $isCorrect = is_array($kunci)
                        ? in_array($huruf, $kunci)
                        : $huruf === $kunci;

                    OpsiJawaban::create([
                        'jenis_soal_id' => $jenisSoal->id,
                        'opsi'          => $huruf,
                        'teks'          => $teks,
                        'is_correct'    => $isCorrect,
                    ]);
                }
            }
        }

        return response()->json(['message' => 'Soal berhasil disimpan.']);
    }
}
