<?php

namespace App\Http\Controllers;

use App\Models\NilaiAkhir;
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

    public function nilaiMahasiswa(Request $request)
    {
        $authUser = $request->user();
        $search   = $request->query('search', '');
        $perPage  = (int) $request->query('per_page', 10);

        $colMap = [
            'nama_ujian' => 'ujian.nama_ujian',
            'tanggal'    => 'nilai_akhir.graded_at',
            'nilai'      => 'nilai_akhir.nilai_total',
            'grade'      => 'nilai_akhir.grade',
        ];

        $sortBy  = $colMap[$request->query('sort_by', 'tanggal')] ?? 'nilai_akhir.graded_at';
        $sortDir = in_array($request->query('sort_dir'), ['asc', 'desc']) ? $request->query('sort_dir') : 'desc';

        $query = NilaiAkhir::with(['pesertaUjian.ujian'])
            ->join('peserta_ujian', 'nilai_akhir.peserta_ujian_id', '=', 'peserta_ujian.id')
            ->join('ujian', 'peserta_ujian.ujian_id', '=', 'ujian.id')
            ->where('peserta_ujian.user_id', $authUser->id)
            ->select('nilai_akhir.*')
            ->when($search, function ($q) use ($search) {
                $q->whereRaw('LOWER(ujian.nama_ujian) LIKE ?', ['%' . strtolower($search) . '%']);
            })
            ->orderBy($sortBy, $sortDir);

        $paginated = $query->paginate($perPage);

        $data = collect($paginated->items())->map(fn($nilai) => [
            'id'         => $nilai->id,
            'nama_ujian' => $nilai->pesertaUjian->ujian->nama_ujian ?? '-',
            'tanggal'    => $nilai->graded_at?->format('d/m/y'),
            'pukul'      => $nilai->graded_at?->format('H.i'),
            'nilai'      => $nilai->nilai_total,
            'grade'      => $nilai->grade ?? '-',
            'lulus'      => $nilai->lulus,
        ]);

        return response()->json([
            'message' => 'Riwayat nilai berhasil diambil!',
            'data'    => $data,
            'meta'    => [
                'current_page' => $paginated->currentPage(),
                'last_page'    => $paginated->lastPage(),
                'per_page'     => $paginated->perPage(),
                'total'        => $paginated->total(),
            ],
        ]);
    }
}
