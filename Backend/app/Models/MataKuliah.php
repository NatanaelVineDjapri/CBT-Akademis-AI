<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class MataKuliah extends Model
{
    protected $table = 'mata_kuliah';

    protected $fillable = [
        'nama',
        'kode',
        'prodi_id',
    ];

    public function prodi()
    {
        return $this->belongsTo(Prodi::class);
    }

    public function bab()
    {
        return $this->hasMany(Bab::class);
    }

    public function bankSoal()
    {
        return $this->hasMany(BankSoal::class);
    }

    public function soal()
    {
        return $this->hasMany(Soal::class);
    }

    public function ujian()
    {
        return $this->hasMany(Ujian::class);
    }

    public function userMataKuliah()
    {
        return $this->hasMany(UserMataKuliah::class);
    }

    public function dosenMatkul()
    {
        return $this->hasMany(DosenMatkul::class);
    }
}