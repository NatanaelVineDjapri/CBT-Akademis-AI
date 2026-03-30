<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Bab extends Model
{
    protected $table = 'bab';

    protected $fillable = [
        'mata_kuliah_id',
        'nama_bab',
        'urutan',
    ];

    protected $casts = [
        'urutan' => 'integer',
    ];

    public function mataKuliah()
    {
        return $this->belongsTo(MataKuliah::class);
    }

    public function soal()
    {
        return $this->hasMany(Soal::class);
    }
}