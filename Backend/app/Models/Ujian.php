<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Ujian extends Model
{
    protected $table = 'ujian';

    protected $fillable = [
        'created_by',
        'mata_kuliah_id',
        'nama_ujian',
        'jenis_ujian',
        'start_date',
        'end_date',
        'durasi_menit',
        'kode_akses',
        'is_kode_aktif',
    ];

    protected $casts = [
        'start_date'    => 'datetime',
        'end_date'      => 'datetime',
        'durasi_menit'  => 'integer',
        'is_kode_aktif' => 'boolean',
    ];


    public function creator()
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function mataKuliah()
    {
        return $this->belongsTo(MataKuliah::class);
    }

    public function ujianSetting()
    {
        return $this->hasOne(UjianSetting::class);
    }

    public function section()
    {
        return $this->hasMany(Section::class);
    }

    public function ujianSoal()
    {
        return $this->hasMany(UjianSoal::class);
    }

    public function pesertaUjian()
    {
        return $this->hasMany(PesertaUjian::class);
    }

    public function gradeSetting()
    {
        return $this->hasMany(GradeSetting::class);
    }

    public function pengumuman()
    {
        return $this->hasMany(Pengumuman::class);
    }
}