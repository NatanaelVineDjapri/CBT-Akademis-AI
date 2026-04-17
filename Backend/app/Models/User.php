<?php

namespace App\Models;

use Illuminate\Foundation\Auth\User as Authenticatable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens;
    protected $table = 'users';

    protected $fillable = [
        'nama',
        'email',
        'password',
        'role',
        'nim',
        'nidn',
        'no_telp',
        'alamat',
        'tahun_masuk',
        'prodi_id',
        'universitas_id',
        'is_temporary',
        'foto',
        'expired_at',
        // 2FA 
        'google2fa_secret',   
        'google2fa_enabled',
    ];
     protected $hidden = [
        'password',
        'google2fa_secret',
    ];

    protected $casts = [
        'is_temporary' => 'boolean',
        'expired_at' => 'datetime',
        'tahun_masuk' => 'integer',
    ];

    public function universitas()
    {
        return $this->belongsTo(Universitas::class);
    }
    
    public function prodi()
    {
        return $this->belongsTo(Prodi::class);
    }

    public function mataKuliah()
    {
        return $this->hasMany(UserMataKuliah::class);
    }

    public function dosenMatkul()
    {
        return $this->hasMany(DosenMatkul::class);
    }

    public function bankSoal()
    {
        return $this->hasMany(BankSoal::class, 'created_by');
    }

    public function ujian()
    {
        return $this->hasMany(Ujian::class, 'created_by');
    }

    public function pesertaUjian()
    {
        return $this->hasMany(PesertaUjian::class);
    }

    public function pengumuman()
    {
        return $this->hasMany(Pengumuman::class, 'created_by');
    }

    public function aiGenerateLog()
    {
        return $this->hasMany(AiGenerateLog::class);
    }

    public function deleteCloudinaryFoto(): void
    {
        if (!$this->foto) return;
        preg_match('/upload\/(?:v\d+\/)?(.+)\.[a-z]+$/i', $this->foto, $matches);
        if (!empty($matches[1])) {
            cloudinary()->destroy($matches[1]);
        }
    }
}