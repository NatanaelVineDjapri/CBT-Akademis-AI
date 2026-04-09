<?php

namespace App\Http\Controllers;

use App\Models\PesertaUjian;
use Illuminate\Http\Request;

class UjianController extends Controller
{
    public function jadwalMahasiswa(Request $request)
    {
        $authUser = $request->user();

        $ujianList = PesertaUjian::with(['ujian.mataKuliah'])
            ->where('user_id', $authUser->id)
            ->get()
            ->map(fn($peserta) => [
                'id'          => $peserta->ujian->id,
                'title'       => $peserta->ujian->nama_ujian,
                'mata_kuliah' => $peserta->ujian->mataKuliah?->nama,
                'start'       => $peserta->ujian->start_date,
                'end'         => $peserta->ujian->end_date,
                'status'      => $peserta->status,
            ]);

        return response()->json([
            'message' => 'Jadwal ujian berhasil diambil!',
            'data'    => $ujianList,
        ], 200);
    }
}
