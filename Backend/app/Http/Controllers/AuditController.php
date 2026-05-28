<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use OwenIt\Auditing\Models\Audit;

class AuditController extends Controller
{
    private const MODEL_MAP = [
        'user'           => \App\Models\User::class,
        'nilai_akhir'    => \App\Models\NilaiAkhir::class,
        'ujian'          => \App\Models\Ujian::class,
        'peserta_ujian'  => \App\Models\PesertaUjian::class,
        'soal'           => \App\Models\Soal::class,
        'pmb_penerimaan' => \App\Models\PmbPenerimaan::class,
    ];

    private const MODEL_LABEL = [
        'User'          => 'Pengguna',
        'NilaiAkhir'    => 'Nilai Akhir',
        'Ujian'         => 'Ujian',
        'PesertaUjian'  => 'Peserta Ujian',
        'Soal'          => 'Soal',
        'PmbPenerimaan' => 'Penerimaan PMB',
    ];

    private const FIELD_LABEL = [
        'nama'            => 'nama',
        'email'           => 'email',
        'role'            => 'peran',
        'password'        => 'password',
        'nilai_total'     => 'nilai total',
        'lulus'           => 'status kelulusan',
        'grade'           => 'grade',
        'status'          => 'status',
        'nama_ujian'      => 'nama ujian',
        'jenis_ujian'     => 'jenis ujian',
        'start_date'      => 'tanggal mulai',
        'end_date'        => 'tanggal selesai',
        'pertanyaan'      => 'pertanyaan',
        'bobot'           => 'bobot',
        'total_pendaftar' => 'total pendaftar',
        'total_diterima'  => 'total diterima',
        'tahun'           => 'tahun',
        'attempt_ke'      => 'percobaan ke',
    ];

    private const VALUE_LABEL = [
        'true'             => 'ya',
        'false'            => 'tidak',
        '1'                => 'ya',
        '0'                => 'tidak',
        'admin_universitas'=> 'Admin Universitas',
        'dosen'            => 'Dosen',
        'mahasiswa'        => 'Mahasiswa',
        'pendaftar'        => 'Pendaftar',
        'selesai'          => 'Selesai',
        'sedang_berlangsung' => 'Sedang Berlangsung',
        'belum_mulai'      => 'Belum Mulai',
        'expired'          => 'Kedaluwarsa',
        'pg'               => 'Pilihan Ganda',
        'essay'            => 'Essay',
        'pmb'              => 'PMB',
        'reguler'          => 'Reguler',
    ];

    private function formatValue(mixed $value): string
    {
        if ($value === null) return '(kosong)';
        $str = (string) $value;
        return self::VALUE_LABEL[$str] ?? $str;
    }

    private function buildKeterangan(Audit $a): string
    {
        $actor      = $a->user?->getAttribute('nama') ?? 'Sistem';
        $type       = (string) $a->getAttribute('auditable_type');
        $modelId    = (int)    $a->getAttribute('auditable_id');
        $event      = (string) $a->getAttribute('event');
        $oldValues  = (array)  $a->getAttribute('old_values');
        $newValues  = (array)  $a->getAttribute('new_values');
        $modelLabel = self::MODEL_LABEL[class_basename($type)] ?? class_basename($type);

        if ($event === 'created') {
            return "{$actor} menambahkan {$modelLabel} baru (ID: {$modelId}).";
        }

        if ($event === 'deleted') {
            return "{$actor} menghapus {$modelLabel} (ID: {$modelId}).";
        }

        if ($event === 'updated') {
            $parts = [];
            foreach ($newValues as $field => $newVal) {
                $oldVal    = $oldValues[$field] ?? null;
                $fieldName = self::FIELD_LABEL[$field] ?? $field;
                $parts[]   = "{$fieldName} dari \"{$this->formatValue($oldVal)}\" → \"{$this->formatValue($newVal)}\"";
            }
            if (empty($parts)) {
                return "{$actor} memperbarui {$modelLabel} (ID: {$modelId}).";
            }
            return "{$actor} mengubah " . implode(', ', $parts) . " pada {$modelLabel} (ID: {$modelId}).";
        }

        return "{$actor} melakukan {$event} pada {$modelLabel} (ID: {$modelId}).";
    }

    public function index(Request $request)
    {
        $authUser = $request->user();
        $sortBy   = in_array($request->sort_by, ['created_at', 'event', 'auditable_type']) ? $request->sort_by : 'created_at';
        $sortDir  = $request->sort_dir === 'asc' ? 'asc' : 'desc';

        $univUserIds = \App\Models\User::where('universitas_id', $authUser->universitas_id)->pluck('id');

        $query = Audit::with('user:id,nama,email,role')
            ->whereIn('user_id', $univUserIds)
            ->orderBy($sortBy, $sortDir);

        if ($request->filled('model')) {
            $modelClass = self::MODEL_MAP[$request->input('model')] ?? null;
            if ($modelClass) {
                $query->where('auditable_type', $modelClass);
            }
        }

        if ($request->filled('event')) {
            $query->where('event', $request->input('event'));
        }

        if ($request->filled('user_id')) {
            $query->where('user_id', $request->input('user_id'));
        }

        if ($request->filled('search')) {
            $q = $request->input('search');
            $query->where(function ($sub) use ($q) {
                $sub->whereHas('user', fn ($u) => $u->where('nama', 'like', "%{$q}%"))
                    ->orWhere('auditable_type', 'like', "%{$q}%");
            });
        }

        $perPage = max(1, (int) $request->input('per_page', 15));
        $paginated = $query->paginate($perPage);

        return response()->json([
            'data'      => collect($paginated->items())->map(fn ($a) => $this->formatAudit($a)),
            'total'     => $paginated->total(),
            'per_page'  => $paginated->perPage(),
            'last_page' => $paginated->lastPage(),
            'page'      => $paginated->currentPage(),
        ]);
    }

    public function adminAkademisIndex(Request $request)
    {
        $sortBy  = in_array($request->sort_by, ['created_at', 'event', 'auditable_type']) ? $request->sort_by : 'created_at';
        $sortDir = $request->sort_dir === 'asc' ? 'asc' : 'desc';

        $query = Audit::with(['user:id,nama,email,role,universitas_id', 'user.universitas:id,nama,kode'])->orderBy($sortBy, $sortDir);

        if ($request->filled('model')) {
            $modelClass = self::MODEL_MAP[$request->input('model')] ?? null;
            if ($modelClass) {
                $query->where('auditable_type', $modelClass);
            }
        }

        if ($request->filled('event')) {
            $query->where('event', $request->input('event'));
        }

        if ($request->filled('universitas_id')) {
            $univUserIds = \App\Models\User::where('universitas_id', $request->input('universitas_id'))->pluck('id');
            $query->whereIn('user_id', $univUserIds);
        }

        if ($request->filled('search')) {
            $q = $request->input('search');
            $query->where(function ($sub) use ($q) {
                $sub->whereHas('user', fn ($u) => $u->where('nama', 'like', "%{$q}%"))
                    ->orWhere('auditable_type', 'like', "%{$q}%");
            });
        }

        $perPage   = max(1, (int) $request->input('per_page', 15));
        $paginated = $query->paginate($perPage);

        return response()->json([
            'data'      => collect($paginated->items())->map(fn ($a) => $this->formatAuditGlobal($a)),
            'total'     => $paginated->total(),
            'per_page'  => $paginated->perPage(),
            'last_page' => $paginated->lastPage(),
            'page'      => $paginated->currentPage(),
        ]);
    }

    public function show(string $model, int $id)
    {
        $modelClass = self::MODEL_MAP[$model] ?? null;

        if (!$modelClass) {
            return response()->json(['message' => 'Model tidak ditemukan.'], 404);
        }

        $instance = $modelClass::findOrFail($id);

        $audits = $instance->audits()
            ->with('user:id,nama,email,role')
            ->latest()
            ->get()
            ->map(fn ($a) => $this->formatAudit($a));

        return response()->json($audits);
    }

    private function formatAudit(Audit $a): array
    {
        return [
            'id'          => $a->id,
            'model'       => self::MODEL_LABEL[class_basename((string) $a->getAttribute('auditable_type'))]
                             ?? class_basename((string) $a->getAttribute('auditable_type')),
            'model_id'    => (int) $a->getAttribute('auditable_id'),
            'event'       => (string) $a->getAttribute('event'),
            'keterangan'  => $this->buildKeterangan($a),
            'old_values'  => (array) $a->getAttribute('old_values'),
            'new_values'  => (array) $a->getAttribute('new_values'),
            'user'        => $a->user ? [
                'id'    => $a->user->getAttribute('id'),
                'nama'  => $a->user->getAttribute('nama'),
                'email' => $a->user->getAttribute('email'),
                'role'  => $a->user->getAttribute('role'),
            ] : null,
            'ip_address'  => $a->getAttribute('ip_address'),
            'created_at'  => $a->getAttribute('created_at')?->format('d M Y H:i:s'),
        ];
    }

    private function formatAuditGlobal(Audit $a): array
    {
        $base = $this->formatAudit($a);

        if ($a->user) {
            $univ = $a->user->universitas;
            $base['user']['universitas_id']   = $a->user->getAttribute('universitas_id');
            $base['user']['universitas_nama'] = $univ?->getAttribute('nama');
            $base['user']['universitas_kode'] = $univ?->getAttribute('kode');
        }

        return $base;
    }
}
