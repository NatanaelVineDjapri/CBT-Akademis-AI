<?php
 
namespace App\Http\Controllers;
 
use Illuminate\Http\Request;
use App\Models\ProctoringLog;
use App\Models\PesertaUjian;
use App\Events\PelanggaranMasuk;
 
class ProctoringController extends Controller
{
    /**
     *
     * Body JSON yang dikirim Python:
     * {
     *   "peserta_ujian_id": 42,
     *   "events": [
     *     {
     *       "tipe_pelanggaran": "looking_away",
     *       "risk_score": 5,
     *       "waktu": "2025-01-15T10:30:00.123Z"
     *     },
     *     ...
     *   ]
     * }
     */
    public function save(Request $request)
    {
        $data = $request->validate([
            'peserta_ujian_id'          => 'required|integer|exists:peserta_ujian,id',
            'events'                    => 'required|array|min:1',
            'events.*.tipe_pelanggaran' => 'required|string',
            'events.*.risk_score'       => 'required|numeric',
            'events.*.waktu'            => 'required|string',
        ]);
 
        $rows = array_map(fn($ev) => [
            'peserta_ujian_id' => $data['peserta_ujian_id'],
            'tipe_pelanggaran' => $ev['tipe_pelanggaran'],
            'risk_score'       => $ev['risk_score'],
            'waktu'            => $ev['waktu'],
            'created_at'       => now(),
            'updated_at'       => now(),
        ], $data['events']);
 
        ProctoringLog::insert($rows);

        // Broadcast ke monitoring dosen via Pusher
        $peserta = PesertaUjian::select('id', 'ujian_id', 'user_id')->find($data['peserta_ujian_id']);
        if ($peserta) {
            event(new PelanggaranMasuk([
                'ujian_id'        => $peserta->ujian_id,
                'peserta_ujian_id'=> $peserta->id,
                'user_id'         => $peserta->user_id,
                'events'          => $data['events'],
                'total_risk_score'=> array_sum(array_column($data['events'], 'risk_score')),
            ]));
        }

        return response()->json([
            'message' => 'Proctoring log saved',
            'count'   => \count($rows),
        ], 201);
    }
}