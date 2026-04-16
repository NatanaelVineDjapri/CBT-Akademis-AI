<?php

namespace App\Imports;

use App\Mail\AkunTerbuatMail;
use App\Models\Prodi;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Str;
use Maatwebsite\Excel\Concerns\ToModel;
use Maatwebsite\Excel\Concerns\WithHeadingRow;
use Maatwebsite\Excel\Concerns\WithValidation;
use Maatwebsite\Excel\Concerns\SkipsOnFailure;
use Maatwebsite\Excel\Concerns\SkipsFailures;

class UsersImport implements ToModel, WithHeadingRow, WithValidation, SkipsOnFailure
{
    use SkipsFailures;

    private $fotoMap;
    private $universitasId;

    public function __construct(array $fotoMap = [], $universitasId = null)
    {
        $this->fotoMap = $fotoMap;
        $this->universitasId = $universitasId;
    }

    public function model(array $row)
    {
        $password    = Str::random(10);
        $isTemporary = $row['role'] === 'peserta_mahasiswa_baru';
        $expiredAt   = $isTemporary ? now()->addMonths(6) : null;
        $prodi       = Prodi::where('kode', $row['kode_prodi'] ?? null)->first();

        Mail::to($row['email'])->queue(new AkunTerbuatMail(
            $row['nama'],
            $row['email'],
            $password
        ));

        return new User([
            'nama'         => $row['nama'],
            'email'        => $row['email'],
            'password'     => Hash::make($password),
            'role'         => $row['role'],
            'nim'          => $row['nim'] ?? null,
            'nidn'         => $row['nidn'] ?? null,
            'no_telp'      => $row['no_telp'] ?? null,
            'alamat'       => $row['alamat'] ?? null,
            'tahun_masuk'  => $row['tahun_masuk'] ?? null,
            'universitas_id' => $this->universitasId,
            'prodi_id'     => $prodi?->id,
            'foto'         => $this->fotoMap[$row['nim']] ?? null,
            'is_temporary' => $isTemporary,
            'expired_at'   => $expiredAt,
        ]);
    }

    public function rules(): array
    {
        return [
            'nama'       => 'required|string',
            'email'      => 'required|email|unique:users,email',
            'role'       => 'required|in:admin_akademis_ai,admin_universitas,dosen,mahasiswa,peserta_mahasiswa_baru',
            'kode_prodi' => 'nullable|exists:prodi,kode',
        ];
    }

    public function customValidationMessages()
    {
        return [
            'nama.required'   => 'Nama wajib diisi!',
            'email.required'  => 'Email wajib diisi!',
            'email.unique'    => 'Email sudah terdaftar!',
            'role.in'         => 'Role tidak valid! Role harus admin_akademis_ai, admin_universitas, dosen, mahasiswa, atau peserta_mahasiswa_baru',
            'kode_prodi.exists' => 'Kode prodi tidak ditemukan!',
        ];
    }
}