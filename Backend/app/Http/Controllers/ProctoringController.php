<?php
 
namespace App\Http\Controllers;
 
use Illuminate\Http\Request;
use App\Models\ProctoringLog;
 
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
            'events.*.waktu'            => 'required|date',
        ]);
 
        $rows = array_map(fn($ev) => [
            'peserta_ujian_id' => $data['peserta_ujian_id'],
            'tipe_pelanggaran' => $ev['tipe_pelanggaran'],
            'risk_score'       => $ev['risk_score'],
            'waktu'            => $ev['waktu'],
            'created_at'       => now(),
            'updated_at'       => now(),
        ], $data['events']);
 
        // Insert sekaligus (lebih efisien dari looping save())
        ProctoringLog::insert($rows);
 
        return response()->json([
            'message' => 'Proctoring log saved',
            'count'   => count($rows),
        ], 201);
    }
}