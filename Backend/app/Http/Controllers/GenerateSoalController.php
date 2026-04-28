<?php

namespace App\Http\Controllers;

use App\Models\Soal;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;

class GenerateSoalController extends Controller
{
    public function generate(Request $request)
    {
        $request->validate([
            'jenis_soal'         => 'required|in:pilihan_ganda,essay,checklist',
            'jumlah'             => 'required|integer|min:1|max:100',
            'topik'              => 'nullable|string|max:500',
            'tingkat_kesulitan'  => 'required|in:mudah,sedang,sulit',
            'referensi_bab_ids'  => 'nullable|array',
            'referensi_bab_ids.*'=> 'integer|exists:bab,id',
        ]);

        $referensi = [];
        if (!empty($request->referensi_bab_ids)) {
            $referensi = Soal::with('jenisSoal')
                ->whereIn('bab_id', $request->referensi_bab_ids)
                ->inRandomOrder()
                ->limit(8)
                ->get()
                ->map(fn($s) => $s->deskripsi)
                ->toArray();
        }

        $prompt = $this->buildPrompt(
            $request->jenis_soal,
            $request->jumlah,
            $request->topik,
            $request->tingkat_kesulitan,
            $referensi
        );

        $response = Http::timeout(120)->retry(3, 2000)->withHeaders([
            'Authorization' => 'Bearer ' . env('GROQ_API_KEY'),
        ])->post('https://api.groq.com/openai/v1/chat/completions', [
            'model'           => 'openai/gpt-oss-120b',
            'messages'        => [
                [
                    'role'    => 'system',
                    'content' => 'Kamu adalah asisten pembuat soal ujian akademik. Selalu balas HANYA dengan JSON yang valid, tanpa teks tambahan apapun.',
                ],
                [
                    'role'    => 'user',
                    'content' => $prompt,
                ],
            ],
            'temperature'     => 0.7,
            'max_tokens'      => 32768,
            'response_format' => ['type' => 'json_object'],
        ]);

        if (!$response->successful()) {
            return response()->json(['message' => 'Gagal menghubungi AI. Coba lagi.'], 500);
        }

        $content = $response->json('choices.0.message.content');
        $decoded = json_decode($content, true);
        $soal = array_slice($decoded['soal'] ?? [], 0, $request->jumlah);

        return response()->json(['soal' => $soal]);
    }

    private function buildPrompt(string $jenis, int $jumlah, ?string $topik, string $kesulitan, array $referensi): string
    {
        $jenisLabel = match ($jenis) {
            'pilihan_ganda' => 'pilihan ganda (4 opsi A, B, C, D — hanya 1 jawaban benar)',
            'checklist'     => 'checklist (4 opsi A, B, C, D — bisa lebih dari 1 jawaban benar)',
            'essay'         => 'essay (pertanyaan terbuka)',
        };

        $prompt = "Buatkan {$jumlah} soal {$jenisLabel} dengan tingkat kesulitan {$kesulitan}";

        if ($topik) {
            $prompt .= " tentang topik: \"{$topik}\"";
        }

        if (!empty($referensi)) {
            $prompt .= "\n\nGunakan soal-soal berikut sebagai referensi gaya dan topik:\n";
            foreach ($referensi as $i => $s) {
                $prompt .= ($i + 1) . ". {$s}\n";
            }
        }

        $contoh = match ($jenis) {
            'pilihan_ganda' => '{"soal":[{"deskripsi":"Pertanyaan...","bobot":10,"opsi":{"A":"...","B":"...","C":"...","D":"..."},"kunci":"A"}]}',
            'checklist'     => '{"soal":[{"deskripsi":"Pertanyaan...","bobot":10,"opsi":{"A":"...","B":"...","C":"...","D":"..."},"kunci":["A","C"]}]}',
            'essay'         => '{"soal":[{"deskripsi":"Pertanyaan...","bobot":25}]}',
        };

        $prompt .= "\n\nBalas HANYA dengan JSON format berikut:\n{$contoh}";

        return $prompt;
    }
}
