<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class UserMataKuliah extends Model
{
    protected $table = 'user_mata_kuliah';

    protected $fillable = [
        'user_id',
        'mata_kuliah_id',
        'tahun_ajaran',
        'is_aktif',
    ];

    protected $casts = [
        'is_aktif' => 'boolean',
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