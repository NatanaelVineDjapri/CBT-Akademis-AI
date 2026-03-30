<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class DosenMatkul extends Model
{
    protected $table = 'dosen_matkul';

    protected $fillable = [
        'user_id',
        'mata_kuliah_id',
        'tahun_ajaran',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function mataKuliah()
    {
        return $this->belongsTo(MataKuliah::class);
    }
}