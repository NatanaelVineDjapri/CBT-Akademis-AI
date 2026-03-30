<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;

class AuthController extends Controller
{
    public function register(Request $request)
    {
        $request->validate([
            'nama' => 'required|string|max:255',
            'email' => 'required|email|unique:users',
            'password' => 'required|min:8|confirmed',
            'role' => 'required|in:admin,dosen,peserta',
            'nim' => 'nullable|string',
            'nidn' => 'nullable|string',
            'no_telp' => 'nullable|string',
            'alamat' => 'nullable|string',
            'tahun_masuk' => 'nullable|integer',
            'prodi_id' => 'nullable|exists:prodi,id',
        ], [
            'nama.required' => 'Nama wajib diisi!',
            'email.required' => 'Email wajib diisi!',
            'email.email' => 'Format email tidak valid!',
            'email.unique' => 'Email sudah terdaftar!',
            'password.required' => 'Password wajib diisi!',
            'password.min' => 'Password minimal 8 karakter!',
            'password.confirmed' => 'Konfirmasi password tidak cocok!',
            'role.required' => 'Role wajib diisi!',
            'role.in' => 'Role tidak valid!',
            'prodi_id.exists' => 'Prodi tidak ditemukan!',
        ]);

        $user = User::create([
            'nama' => $request->nama,
            'email' => $request->email,
            'password' => Hash::make($request->password), 
            'role' => $request->role,
            'nim' => $request->nim,
            'nidn' => $request->nidn,
            'no_telp' => $request->no_telp,
            'alamat' => $request->alamat,
            'tahun_masuk' => $request->tahun_masuk,
            'prodi_id' => $request->prodi_id,
            'is_temporary' => false,
        ]);

        return response()->json([
            'message' => 'Register berhasil!',
            'user' => [
                'id' => $user->id,
                'nama' => $user->nama,
                'email' => $user->email,
                'role' => $user->role,
            ],
        ], 201);
    }

    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required',
            'remember' => 'nullable|boolean',
        ], [
            'email.required' => 'Email wajib diisi!',
            'email.email' => 'Format email tidak valid!',
            'password.required' => 'Password wajib diisi!',
        ]);

        $user = User::where('email', $request->email)->first();

        if (!$user || !Hash::check($request->password, $user->password)) {
            return response()->json([
                'message' => 'Email atau password salah!',
            ], 401);
        }

        if ($user->is_temporary && $user->expired_at && now()->gt($user->expired_at)) {
            return response()->json([
                'message' => 'Akun sudah kedaluwarsa!',
            ], 403);
        }

        $remember = $request->boolean('remember');
        Auth::login($user, $remember);
        $request->session()->regenerate();

        return response()->json([
            'message' => 'Login berhasil!',
            'user' => [
                'id' => $user->id,
                'nama' => $user->nama,
                'email' => $user->email,
                'role' => $user->role,
            ],
        ], 200);
    }

    public function logout(Request $request)
    {
        $request->session()->invalidate(); // Invalidate the session after logout
        $request->session()->regenerateToken(); // Regenerate CSRF token after logout

        return response()->json([
            'message' => 'Logout berhasil!',
        ], 200);
    }

    public function me(Request $request) // Endpoint untuk mendapatkan data user yang sedang login
    {
        return response()->json([
            'user' => [
                'id' => $request->user()->id,
                'nama' => $request->user()->nama,
                'email' => $request->user()->email,
                'role' => $request->user()->role,
                'nim' => $request->user()->nim,
                'nidn' => $request->user()->nidn,
                'no_telp' => $request->user()->no_telp,
                'alamat' => $request->user()->alamat,
                'tahun_masuk' => $request->user()->tahun_masuk,
                'prodi_id' => $request->user()->prodi_id,
            ],
        ], 200);
    }
}