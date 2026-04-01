<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Fakultas extends Model
{
    protected $table = 'fakultas';

    protected $fillable = [
        'universitas_id',
        'nama',
        'kode',
    ];

    // Relasi
    public function universitas()
    {
        return $this->belongsTo(Universitas::class);
    }

    public function prodi()
    {
        return $this->hasMany(Prodi::class);
    }

    public function users()
    {
        return $this->hasManyThrough(User::class, Prodi::class);
    }
}