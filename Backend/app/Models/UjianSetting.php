<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class UjianSetting extends Model
{
    protected $table = 'ujian_setting';

    protected $fillable = [
        'ujian_id',
        'randomize_soal',
        'max_attempt',
        'passing_grade',
        'proctoring_aktif',
        'pembagian_durasi',
    ];

    protected $casts = [
        'randomize_soal'   => 'boolean',
        'max_attempt'      => 'integer',
        'passing_grade'    => 'float',
        'proctoring_aktif' => 'boolean',
    ];

    // Relasi
    public function ujian()
    {
        return $this->belongsTo(Ujian::class);
    }
}