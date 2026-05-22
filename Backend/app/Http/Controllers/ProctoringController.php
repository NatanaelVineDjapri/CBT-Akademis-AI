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
    public function saveBukti(Request $request)
    {
        $data = $request->validate([
            'peserta_ujian_id' => 'required|integer|exists:peserta_ujian,id',
            'tipe_pelanggaran' => 'required|string',
            'risk_score'       => 'required|numeric',
            'waktu'            => 'required|string',
            'foto'             => 'nullable|image|max:5120',
        ]);

        $fotoBukti = null;
        if ($request->hasFile('foto')) {
            try {
                $tmpPath  = $this->compressImage($request->file('foto')->getRealPath());
                $uploaded = cloudinary()->uploadFile($tmpPath, [
                    'folder'    => 'proctoring',
                    'public_id' => $data['peserta_ujian_id'] . '_' . time(),
                    'overwrite' => false,
                ]);
                @unlink($tmpPath);
                $fotoBukti = $uploaded->getSecurePath();
            } catch (\Throwable $e) {
                \Log::error('[saveBukti] Cloudinary upload failed: ' . $e->getMessage());
            }
        }

        $log = ProctoringLog::create([
            'peserta_ujian_id' => $data['peserta_ujian_id'],
            'tipe_pelanggaran' => $data['tipe_pelanggaran'],
            'risk_score'       => $data['risk_score'],
            'waktu'            => $data['waktu'],
            'foto_bukti'       => $fotoBukti,
        ]);

        $peserta = PesertaUjian::select('id', 'ujian_id', 'user_id')->find($data['peserta_ujian_id']);
        if ($peserta) {
            event(new PelanggaranMasuk([
                'ujian_id'         => $peserta->ujian_id,
                'peserta_ujian_id' => $peserta->id,
                'user_id'          => $peserta->user_id,
                'events'           => [[
                    'tipe_pelanggaran' => $data['tipe_pelanggaran'],
                    'risk_score'       => $data['risk_score'],
                ]],
                'total_risk_score' => $data['risk_score'],
            ]));
        }

        return response()->json(['message' => 'Proctoring log saved', 'id' => $log->id], 201);
    }

    private function compressImage(string $sourcePath): string
    {
        $info = getimagesize($sourcePath);
        $mime = $info['mime'] ?? 'image/jpeg';

        $src = match ($mime) {
            'image/png'  => imagecreatefrompng($sourcePath),
            'image/jpeg' => imagecreatefromjpeg($sourcePath),
            default      => imagecreatefromjpeg($sourcePath),
        };

        $origW = imagesx($src);
        $origH = imagesy($src);
        $maxDim = 480;

        if ($origW > $maxDim || $origH > $maxDim) {
            $ratio = min($maxDim / $origW, $maxDim / $origH);
            $newW  = (int) ($origW * $ratio);
            $newH  = (int) ($origH * $ratio);
            $dst   = imagecreatetruecolor($newW, $newH);
            imagecopyresampled($dst, $src, 0, 0, 0, 0, $newW, $newH, $origW, $origH);
            imagedestroy($src);
            $src = $dst;
        }

        $tmpPath = tempnam(sys_get_temp_dir(), 'proctoring_') . '.jpg';
        imagejpeg($src, $tmpPath, 70);
        imagedestroy($src);

        return $tmpPath;
    }

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