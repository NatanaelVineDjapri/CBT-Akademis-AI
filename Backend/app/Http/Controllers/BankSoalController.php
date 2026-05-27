<?php

namespace App\Http\Controllers;

use App\Models\Bab;
use App\Models\BankSoal;
use App\Models\BankSoalShared;
use App\Models\DosenMatkul;
use App\Models\Soal;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use App\Mail\BankSoalSharedMail;
use Illuminate\Support\Facades\Mail;

class BankSoalController extends Controller
{
    public function index(Request $request)
    {
        $authUser = $request->user();

        $bankSoal = BankSoal::with([
                'mataKuliah', 'bab', 'creator',
                'soal.jenisSoal',
            ])
            ->withCount('soal')
            ->where(function ($q) use ($authUser) {
                $q->where('created_by', $authUser->id)
                    ->orWhereHas('sharedUsers', fn($q) => $q->where('user_id', $authUser->id));
            })
            ->when($request->mata_kuliah_id, fn($q) => $q->where('mata_kuliah_id', $request->mata_kuliah_id))
            ->when($request->search, fn($q) => $q->whereRaw('LOWER(nama) LIKE ?', ['%' . strtolower($request->search) . '%']))
            ->paginate($request->per_page ?? 10);

        $data = collect($bankSoal->items())->map(fn($item) => [
            'id'             => $item->id,
            'nama'           => $item->nama,
            'deskripsi'      => $item->deskripsi,
            'permission'     => $item->permission,
            'created_by'     => $item->created_by,
            'mata_kuliah_id' => $item->mata_kuliah_id,
            'mata_kuliah'    => $item->mataKuliah,
            'bab_id'         => $item->bab_id,
            'bab'            => $item->bab,
            'creator'        => $item->creator,
            'soal_count'     => $item->soal_count,
            'jenis_soal'     => $item->soal->flatMap(fn($s) => $s->jenisSoal->pluck('jenis_soal'))->unique()->sort()->values(),
            'updated_at'     => $item->updated_at?->toISOString(),
        ]);

        return response()->json([
            'message' => 'Data bank soal berhasil diambil!',
            'data' => $data,
            'meta' => [
                'total' => $bankSoal->total(),
                'per_page' => $bankSoal->perPage(),
                'current_page' => $bankSoal->currentPage(),
                'last_page' => $bankSoal->lastPage(),
            ],
        ], 200);
    }

    public function myList(Request $request)
    {
        $authUser = $request->user();
        $sortBy  = $request->query('sort_by', 'nama');
        $sortDir = in_array($request->query('sort_dir'), ['asc', 'desc']) ? $request->query('sort_dir') : 'asc';

        $query = BankSoal::with(['creator', 'mataKuliah'])->withCount('soal')
            ->where(function ($q) use ($authUser) {
                $q->where('created_by', $authUser->id)
                  ->orWhereHas('sharedUsers', fn($q) => $q->where('user_id', $authUser->id));
            })
            ->when($request->search, fn($q) => $q->whereRaw('LOWER(nama) LIKE ?', ['%' . strtolower($request->search) . '%']));

        match ($sortBy) {
            'soal_count' => $query->orderBy('soal_count', $sortDir),
            default      => $query->orderByRaw('LOWER(nama) ' . $sortDir),
        };

        $data = $query->get()->map(fn($item) => [
            'id'          => $item->id,
            'nama'        => $item->nama,
            'soal_count'  => $item->soal_count,
            'mata_kuliah' => $item->mataKuliah?->nama,
            'creator'     => $item->creator?->nama,
        ]);

        return response()->json(['data' => $data]);
    }

    public function global(Request $request)
    {
        $bankSoal = BankSoal::with(['mataKuliah.bab', 'creator.universitas'])->withCount('soal')
            ->where('permission', 'public')
            ->when($request->search, function ($q) use ($request) {
                $s = '%' . strtolower($request->search) . '%';
                $q->where(function ($q) use ($s) {
                    $q->whereRaw('LOWER(bank_soal.nama) LIKE ?', [$s])
                        ->orWhereHas('creator', fn($q) => $q->whereRaw('LOWER(nama) LIKE ?', [$s]))
                        ->orWhereHas('creator.universitas', fn($q) => $q->whereRaw('LOWER(nama) LIKE ?', [$s])
                            ->orWhereRaw('LOWER(kode) LIKE ?', [$s]));
                });
            })
            ->when($request->mata_kuliah_id, fn($q) => $q->where('mata_kuliah_id', $request->mata_kuliah_id))
            ->when($request->bab_id, fn($q) => $q->whereHas('soal', fn($q2) => $q2->where('bab_id', $request->bab_id)))
            ->orderBy('created_at', 'desc')
            ->orderBy('id', 'desc')
            ->paginate($request->per_page ?? 10);

        return response()->json([
            'message' => 'Data bank soal global berhasil diambil!',
            'data' => $bankSoal->items(),
            'meta' => [
                'total' => $bankSoal->total(),
                'per_page' => $bankSoal->perPage(),
                'current_page' => $bankSoal->currentPage(),
                'last_page' => $bankSoal->lastPage(),
            ],
        ], 200);
    }

    public function showGlobal(Request $request, $id)
    {
        $bankSoal = BankSoal::with(['mataKuliah', 'creator.universitas'])
            ->where('permission', 'public')
            ->findOrFail($id);

        $babs = [];
        if ($bankSoal->mata_kuliah_id) {
            $babs = Bab::where('mata_kuliah_id', $bankSoal->mata_kuliah_id)
                ->orderBy('urutan', 'asc')
                ->get()
                ->map(function ($bab) use ($id) {
                    return [
                        'id' => $bab->id,
                        'nama_bab' => $bab->nama_bab,
                        'urutan' => $bab->urutan,
                        'soal_count' => Soal::where('bank_soal_id', $id)
                            ->where('bab_id', $bab->id)
                            ->count(),
                    ];
                });
        }

        return response()->json([
            'message' => 'Detail bank soal global berhasil diambil!',
            'data' => [
                'bank_soal' => $bankSoal,
                'babs' => $babs,
            ],
        ], 200);
    }

    public function soal(Request $request, $id)
    {
        $authUser = $request->user();
        $bankSoal = BankSoal::with(['mataKuliah', 'bab', 'creator'])->withCount('soal')->findOrFail($id);

        // Cek akses
        $hasAccess = $bankSoal->created_by === $authUser->id
            || $bankSoal->permission === 'public'
            || $bankSoal->sharedUsers()->where('user_id', $authUser->id)->exists();

        if (!$hasAccess) {
            return response()->json(['message' => 'Tidak punya akses!'], 403);
        }

        // Cek bisa edit: creator atau dosen yang mengajar matkul ini
        $canEdit = $bankSoal->created_by === $authUser->id
            || ($bankSoal->mata_kuliah_id && DosenMatkul::where('mata_kuliah_id', $bankSoal->mata_kuliah_id)
                ->where('user_id', $authUser->id)
                ->exists());

        $sortKey = $request->query('sort_by', 'created_at');
        $sortDir = in_array($request->query('sort_dir'), ['asc', 'desc']) ? $request->query('sort_dir') : 'asc';

        $soalQuery = Soal::with(['jenisSoal.opsiJawaban', 'mediaSoal', 'bab'])
            ->where('bank_soal_id', $id)
            ->when($request->search, fn($q) => $q->whereRaw('LOWER(deskripsi) LIKE ?', ['%' . strtolower($request->search) . '%']));

        match ($sortKey) {
            'deskripsi'          => $soalQuery->orderByRaw('LOWER(deskripsi) ' . $sortDir),
            'tingkat_kesulitan'  => $soalQuery->orderByRaw(
                "CASE tingkat_kesulitan WHEN 'mudah' THEN 1 WHEN 'sedang' THEN 2 WHEN 'sulit' THEN 3 ELSE 4 END " . $sortDir
            ),
            default              => $soalQuery->orderBy('created_at', $sortDir),
        };

        $page = (int) $request->query('page', 0);

        if ($page > 0) {
            $perPage = (int) $request->query('per_page', 10);
            $paginated = $soalQuery->paginate($perPage);
            return response()->json([
                'message'   => 'Data soal berhasil diambil!',
                'can_edit'  => $canEdit,
                'bank_soal' => $bankSoal,
                'data'      => $paginated->items(),
                'meta'      => [
                    'current_page' => $paginated->currentPage(),
                    'last_page'    => $paginated->lastPage(),
                    'per_page'     => $paginated->perPage(),
                    'total'        => $paginated->total(),
                ],
            ], 200);
        }

        return response()->json([
            'message'   => 'Data soal berhasil diambil!',
            'can_edit'  => $canEdit,
            'bank_soal' => $bankSoal,
            'data'      => $soalQuery->get(),
        ], 200);
    }

    public function store(Request $request)
    {
        $request->validate([
            'nama' => 'required|string|max:255',
            'deskripsi' => 'nullable|string',
            'mata_kuliah_id' => 'required|exists:mata_kuliah,id',
            'bab_id' => 'required|exists:bab,id',
            'permission' => 'required|in:public,shared,private',
        ], [
            'nama.required' => 'Nama bank soal wajib diisi!',
            'mata_kuliah_id.required' => 'Mata kuliah wajib dipilih!',
            'mata_kuliah_id.exists' => 'Mata kuliah tidak ditemukan!',
            'bab_id.required' => 'Bab wajib dipilih!',
            'bab_id.exists' => 'Bab tidak ditemukan!',
            'permission.in' => 'Permission tidak valid!',
        ]);

        $bankSoal = BankSoal::create([
            'created_by' => $request->user()->id,
            'mata_kuliah_id' => $request->mata_kuliah_id,
            'bab_id' => $request->bab_id,
            'nama' => $request->nama,
            'deskripsi' => $request->deskripsi,
            'permission' => $request->permission,
        ]);

        return response()->json([
            'message' => 'Bank soal berhasil dibuat!',
            'data' => $bankSoal->load('mataKuliah', 'bab'),
        ], 201);
    }

    public function update(Request $request, $id)
    {
        $authUser = $request->user();
        $bankSoal = BankSoal::findOrFail($id);

        if ($bankSoal->created_by !== $authUser->id) {
            return response()->json(['message' => 'Tidak punya akses!'], 403);
        }

        $request->validate([
            'nama' => 'sometimes|string|max:255',
            'deskripsi' => 'nullable|string',
            'mata_kuliah_id' => 'nullable|exists:mata_kuliah,id',
            'bab_id' => 'nullable|exists:bab,id',
            'permission' => 'sometimes|in:public,shared,private',
        ], [
            'permission.in' => 'Permission tidak valid!',
        ]);

        if ($request->permission === 'private') {
            BankSoalShared::where('bank_soal_id', $id)->delete();
        }

        $bankSoal->update([
            'nama' => $request->nama ?? $bankSoal->nama,
            'deskripsi' => $request->deskripsi ?? $bankSoal->deskripsi,
            'mata_kuliah_id' => $request->has('mata_kuliah_id') ? $request->mata_kuliah_id : $bankSoal->mata_kuliah_id,
            'bab_id' => $request->has('bab_id') ? $request->bab_id : $bankSoal->bab_id,
            'permission' => $request->permission ?? $bankSoal->permission,
        ]);

        return response()->json([
            'message' => 'Bank soal berhasil diupdate!',
            'data' => $bankSoal,
        ], 200);
    }

    public function destroy(Request $request, $id)
    {
        $authUser = $request->user();
        $bankSoal = BankSoal::findOrFail($id);

        if ($bankSoal->created_by !== $authUser->id) {
            return response()->json(['message' => 'Tidak punya akses!'], 403);
        }

        // Hapus semua shared access dulu sebelum hapus bank soal
        BankSoalShared::where('bank_soal_id', $id)->delete();
        $bankSoal->delete();

        return response()->json([
            'message' => 'Bank soal berhasil dihapus!',
        ], 200);
    }

    public function getSharedUsers(Request $request, $id)
    {
        $authUser = $request->user();
        $bankSoal = BankSoal::findOrFail($id);

        if ($bankSoal->created_by !== $authUser->id) {
            return response()->json(['message' => 'Tidak punya akses!'], 403);
        }

        $shared = BankSoalShared::with('user:id,nama,email')
            ->where('bank_soal_id', $id)
            ->get()
            ->map(fn($s) => [
                'id'    => $s->user->id,
                'nama'  => $s->user->nama,
                'email' => $s->user->email,
            ]);

        return response()->json(['data' => $shared]);
    }

    public function shareByEmail(Request $request, $id)
    {
        $authUser = $request->user();
        $bankSoal = BankSoal::findOrFail($id);

        if ($bankSoal->created_by !== $authUser->id) {
            return response()->json(['message' => 'Tidak punya akses!'], 403);
        }

        if ($bankSoal->permission !== 'shared') {
            return response()->json(['message' => 'Bank soal harus berstatus shared!'], 400);
        }

        $request->validate([
            'email' => 'required|email|exists:users,email',
        ], [
            'email.required' => 'Email wajib diisi!',
            'email.email' => 'Format email tidak valid!',
            'email.exists' => 'Email tidak terdaftar!',
        ]);

        $targetUser = User::where('email', $request->email)->first();

        // Cek kalau sudah pernah di-share ke user ini
        $alreadyShared = BankSoalShared::where('bank_soal_id', $id)
            ->where('user_id', $targetUser->id)
            ->exists();

        if ($alreadyShared) {
            return response()->json(['message' => 'Bank soal sudah di-share ke user ini!'], 400);
        }

        BankSoalShared::create([
            'bank_soal_id' => $id,
            'user_id' => $targetUser->id,
            'token' => null,
            'expired_at' => null,
        ]);

        Mail::to($targetUser->email)->queue(
            new BankSoalSharedMail($targetUser, $authUser, $bankSoal)
        );


        return response()->json([
            'message' => 'Bank soal berhasil di-share ke ' . $targetUser->nama . '!',
        ], 200);
    }

    public function searchUsers(Request $request)
    {
        $query = $request->get('q', '');

        if (strlen($query) < 2) {
            return response()->json(['data' => []]);
        }

        $users = User::where(function ($q) use ($query) {
            $q->where('email', 'like', "%{$query}%")
                ->orWhere('nama', 'like', "%{$query}%");
        })
            ->where('id', '!=', $request->user()->id)
            ->select('id', 'nama', 'email')
            ->limit(5)
            ->get();

        return response()->json(['data' => $users]);
    }

    // Generate link → buat token unik → kirim link ke frontend
    public function generateLink(Request $request, $id)
    {
        $authUser = $request->user();
        $bankSoal = BankSoal::findOrFail($id);

        if ($bankSoal->created_by !== $authUser->id) {
            return response()->json(['message' => 'Tidak punya akses!'], 403);
        }

        if ($bankSoal->permission !== 'shared') {
            return response()->json(['message' => 'Bank soal harus berstatus shared!'], 400);
        }

        // Kembalikan link yang sudah ada jika sudah pernah digenerate
        $existing = BankSoalShared::where('bank_soal_id', $id)
            ->whereNotNull('token')
            ->whereNull('user_id')
            ->first();

        if ($existing) {
            $link = env('FRONTEND_URL') . '/bank-soal/join?token=' . $existing->token;
            return response()->json(['message' => 'Link berhasil digenerate!', 'link' => $link], 200);
        }

        $token = Str::random(32);

        BankSoalShared::create([
            'bank_soal_id' => $id,
            'user_id' => null,
            'token' => $token,
        ]);

        $link = env('FRONTEND_URL') . '/bank-soal/join?token=' . $token;

        return response()->json([
            'message' => 'Link berhasil digenerate!',
            'link' => $link,
        ], 200);
    }

    // User klik link → validasi token → tambah akses ke user yang login
    public function joinByLink(Request $request)
    {
        $authUser = $request->user();

        $request->validate([
            'token' => 'required|string',
        ], [
            'token.required' => 'Token wajib diisi!',
        ]);

        // Cari record berdasarkan token
        $shared = BankSoalShared::where('token', $request->token)
            ->whereNull('user_id') // hanya yang belum diklaim
            ->first();

        if (!$shared) {
            return response()->json(['message' => 'Link tidak valid!'], 400);
        }

        // Cek apakah link sudah expired
        if ($shared->expired_at && now()->gt($shared->expired_at)) {
            return response()->json(['message' => 'Link sudah expired!'], 400);
        }

        // Cek kalau sudah pernah join bank soal ini
        $alreadyJoined = BankSoalShared::where('bank_soal_id', $shared->bank_soal_id)
            ->where('user_id', $authUser->id)
            ->exists();

        if ($alreadyJoined) {
            return response()->json([
                'message' => 'Kamu sudah punya akses ke bank soal ini!',
                'data' => $shared->bankSoal,
            ], 200);
        }

        // Buat record baru untuk user yang join, biarkan token record tetap aktif
        BankSoalShared::create([
            'bank_soal_id' => $shared->bank_soal_id,
            'user_id' => $authUser->id,
            'token' => null,
        ]);

        return response()->json([
            'message' => 'Berhasil join bank soal!',
            'data' => $shared->bankSoal,
        ], 200);
    }

    // Hapus akses shared user tertentu
    public function removeShared(Request $request, $id)
    {
        $authUser = $request->user();
        $bankSoal = BankSoal::findOrFail($id);

        if ($bankSoal->created_by !== $authUser->id) {
            return response()->json(['message' => 'Tidak punya akses!'], 403);
        }

        $request->validate([
            'user_id' => 'required|exists:users,id',
        ], [
            'user_id.required' => 'User wajib dipilih!',
            'user_id.exists' => 'User tidak ditemukan!',
        ]);

        // Hapus akses shared user tertentu
        BankSoalShared::where('bank_soal_id', $id)
            ->where('user_id', $request->user_id)
            ->delete();

        return response()->json([
            'message' => 'Akses shared berhasil dihapus!',
        ], 200);
    }
}