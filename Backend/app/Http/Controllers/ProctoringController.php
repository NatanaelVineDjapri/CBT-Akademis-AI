<?php
 
namespace App\Http\Controllers;
 
use Illuminate\Http\Request;
use App\Models\ProctoringLog;
use App\Models\PesertaUjian;
use App\Events\PelanggaranMasuk;
use App\Events\WebRtcSignal;

class ProctoringController extends Controller
{
    private const TIPE_ALLOWED = ['tab','fullscreen','copypaste','no_face','multiple_faces','looking_away'];

    public function webrtcSignal(Request $request)
    {
        $data = $request->validate([
            'peserta_ujian_id' => 'required|integer',
            'type'             => 'required|string',
            'from'             => 'required|string',
        ]);

        try {
            broadcast(new WebRtcSignal((int) $data['peserta_ujian_id'], $data));
        } catch (\Throwable $e) {
            \Log::warning('[webrtcSignal] Broadcast failed: ' . $e->getMessage());
        }

        return response()->json(['ok' => true]);
    }

    public function storeOffer(Request $request)
    {
        $data = $request->validate([
            'peserta_ujian_id' => 'required|integer',
            'sdp'              => 'required|string',
            'type'             => 'required|in:cam,screen',
        ]);

        $key = "webrtc_offer_{$data['type']}_{$data['peserta_ujian_id']}";
        \Cache::put($key, $data['sdp'], now()->addHours(2));

        return response()->json(['ok' => true]);
    }

    public function getOffer(Request $request, int $pesertaUjianId)
    {
        $type = $request->query('type', 'cam');
        $key  = "webrtc_offer_{$type}_{$pesertaUjianId}";
        $sdp  = \Cache::get($key);

        return response()->json(['sdp' => $sdp]);
    }

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
            'tipe_pelanggaran' => ['required', 'string', 'in:' . implode(',', self::TIPE_ALLOWED)],
            'risk_score'       => 'required|numeric',
            'waktu'            => 'required|string',
            'foto'             => 'nullable|image|max:5120',
        ]);

        $pesertaCheck = PesertaUjian::select('id', 'user_id')->find($data['peserta_ujian_id']);
        if (!$pesertaCheck || $pesertaCheck->user_id !== $request->user()->id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

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
            try {
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
            } catch (\Throwable $e) {
                \Log::warning('[saveBukti] Broadcast failed: ' . $e->getMessage());
            }
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
            'events.*.tipe_pelanggaran' => ['required', 'string', 'in:' . implode(',', self::TIPE_ALLOWED)],
            'events.*.risk_score'       => 'required|numeric',
            'events.*.waktu'            => 'required|string',
        ]);

        $pesertaCheck = PesertaUjian::select('id', 'user_id')->find($data['peserta_ujian_id']);
        if (!$pesertaCheck || $pesertaCheck->user_id !== $request->user()->id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $rows = array_map(fn($ev) => [
            'peserta_ujian_id' => $data['peserta_ujian_id'],
            'tipe_pelanggaran' => $ev['tipe_pelanggaran'],
            'risk_score'       => $ev['risk_score'],
            'waktu'            => $ev['waktu'],
            'created_at'       => now(),
            'updated_at'       => now(),
        ], $data['events']);
 
        ProctoringLog::insert($rows);

        $peserta = PesertaUjian::select('id', 'ujian_id', 'user_id')->find($data['peserta_ujian_id']);
        if ($peserta) {
            try {
                event(new PelanggaranMasuk([
                    'ujian_id'         => $peserta->ujian_id,
                    'peserta_ujian_id' => $peserta->id,
                    'user_id'          => $peserta->user_id,
                    'events'           => $data['events'],
                    'total_risk_score' => array_sum(array_column($data['events'], 'risk_score')),
                ]));
            } catch (\Throwable $e) {
                \Log::warning('[save] Broadcast failed: ' . $e->getMessage());
            }
        }

        return response()->json([
            'message' => 'Proctoring log saved',
            'count'   => \count($rows),
        ], 201);
    }
}