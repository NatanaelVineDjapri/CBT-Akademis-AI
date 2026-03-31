<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Imports\UsersImport;
use Maatwebsite\Excel\Facades\Excel;
use Illuminate\Support\Facades\Storage;

class UserController extends Controller
{
    //Admin
    public function index(Request $request)
    {
        $users = User::with('prodi')
            ->when($request->role, fn($q) => $q->where('role', $request->role))
            ->when($request->prodi_id, fn($q) => $q->where('prodi_id', $request->prodi_id))
            ->when($request->search, fn($q) => $q->where('nama', 'like', '%' . $request->search . '%')
                ->orWhere('email', 'like', '%' . $request->search . '%'))
            ->paginate($request->per_page ?? 10);

        return response()->json([
            'message' => 'Data user berhasil diambil!',
            'data' => $users->items(),
            'meta' => [
                'total' => $users->total(),
                'per_page' => $users->perPage(),
                'current_page' => $users->currentPage(),
                'last_page' => $users->lastPage(),
            ],
        ], 200);
    }

    public function importBulk(Request $request)
    {
        $request->validate([
            'file_excel' => 'required|mimes:xlsx,xls|max:5120',
            'file_zip' => 'nullable|mimes:zip|max:51200',
        ], [
            'file_excel.required' => 'File Excel wajib diupload!',
            'file_excel.mimes' => 'File harus berformat Excel (.xlsx/.xls)!',
            'file_zip.mimes' => 'File foto harus berformat ZIP!',
        ]);

        $fotoMap = [];

        // Proses ZIP foto kalau ada
        if ($request->hasFile('file_zip')) {
            $zipPath = $request->file('file_zip')->store('temp', 'local');
            $zipFullPath = storage_path('app/' . $zipPath);
            $extractPath = storage_path('app/public/users/');

            $zip = new \ZipArchive();
            if ($zip->open($zipFullPath) === true) {
                for ($i = 0; $i < $zip->numFiles; $i++) {
                    $filename = $zip->getNameIndex($i);
                    $nim = pathinfo($filename, PATHINFO_FILENAME);
                    $zip->extractTo($extractPath, $filename);
                    $fotoMap[$nim] = 'users/' . $filename;
                }
                $zip->close();
            }

            Storage::disk('local')->delete($zipPath);
        }

        // Import Excel
        $import = new UsersImport($fotoMap);
        Excel::import($import, $request->file('file_excel'));

        $failedRows = [];
        foreach ($import->failures() as $failure) {
            $failedRows[] = [
                'baris' => $failure->row(),
                'kolom' => $failure->attribute(),
                'error' => $failure->errors()[0],
                'values' => $failure->values(),
            ];
        }

        return response()->json([
            'message' => 'Import selesai!',
            'gagal' => $failedRows,
        ], 200);
    }

    public function show($id)
    {
        $user = User::with('prodi.fakultas.universitas')->findOrFail($id);

        return response()->json([
            'message' => 'Detail user berhasil diambil!',
            'data' => $user,
        ], 200);
    }

    public function updateByAdmin(Request $request, $id)
    {
        $user = User::findOrFail($id);

        $request->validate([
            'nama' => 'sometimes|string|max:255',
            'email' => 'sometimes|email|unique:users,email,' . $id,
            'role' => 'sometimes|in:admin,dosen,mahasiswa,peserta_mahasiswa_baru',
            'nim' => 'nullable|string',
            'nidn' => 'nullable|string',
            'no_telp' => 'nullable|string',
            'alamat' => 'nullable|string',
            'tahun_masuk' => 'nullable|integer',
            'prodi_id' => 'nullable|exists:prodi,id',
            'foto' => 'nullable|image|mimes:jpg,jpeg,png|max:2048',
        ], [
            'email.unique' => 'Email sudah digunakan!',
            'role.in' => 'Role tidak valid!',
            'foto.image' => 'Foto harus berupa gambar!',
            'foto.max' => 'Ukuran foto maksimal 2MB!',
        ]);

        if ($request->hasFile('foto')) {
            if ($user->foto) {
                Storage::disk('public')->delete($user->foto);
            }
            $user->foto = $request->file('foto')->store('users', 'public');
        }

        $user->update([
            'nama' => $request->nama ?? $user->nama,
            'email' => $request->email ?? $user->email,
            'role' => $request->role ?? $user->role,
            'nim' => $request->nim ?? $user->nim,
            'nidn' => $request->nidn ?? $user->nidn,
            'no_telp' => $request->no_telp ?? $user->no_telp,
            'alamat' => $request->alamat ?? $user->alamat,
            'tahun_masuk' => $request->tahun_masuk ?? $user->tahun_masuk,
            'prodi_id' => $request->prodi_id ?? $user->prodi_id,
            'foto' => $user->foto,
        ]);

        return response()->json([
            'message' => 'User berhasil diupdate!',
            'data' => $user,
        ], 200);
    }

    public function updateProfile(Request $request)
    {
        $user = $request->user();

        $request->validate([
            'nama' => 'sometimes|string|max:255',
            'nim' => 'nullable|string',
            'no_telp' => 'nullable|string',
            'alamat' => 'nullable|string',
            'foto' => 'nullable|image|mimes:jpg,jpeg,png|max:2048',
        ], [
            'foto.image' => 'Foto harus berupa gambar!',
            'foto.max' => 'Ukuran foto maksimal 2MB!',
        ]);

        if ($request->hasFile('foto')) {
            if ($user->foto) {
                Storage::disk('public')->delete($user->foto);
            }
            $user->foto = $request->file('foto')->store('users', 'public');
        }

        $user->update([
            'nama' => $request->nama ?? $user->nama,
            'nim' => $request->nim ?? $user->nim,
            'no_telp' => $request->no_telp ?? $user->no_telp,
            'alamat' => $request->alamat ?? $user->alamat,
            'foto' => $user->foto,
        ]);

        return response()->json([
            'message' => 'Profil berhasil diupdate!',
            'data' => $user,
        ], 200);
    }

    public function updatePassword(Request $request)
    {
        $user = $request->user();

        $request->validate([
            'password_lama' => 'required',
            'password_baru' => 'required|min:8|confirmed',
        ], [
            'password_lama.required' => 'Password lama wajib diisi!',
            'password_baru.required' => 'Password baru wajib diisi!',
            'password_baru.min' => 'Password baru minimal 8 karakter!',
            'password_baru.confirmed' => 'Konfirmasi password tidak cocok!',
        ]);

        if (!Hash::check($request->password_lama, $user->password)) {
            return response()->json([
                'message' => 'Password lama tidak sesuai!',
            ], 400);
        }

        $user->update([
            'password' => Hash::make($request->password_baru),
        ]);

        return response()->json([
            'message' => 'Password berhasil diupdate!',
        ], 200);
    }
}
