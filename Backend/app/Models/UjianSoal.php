<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class UjianSoal extends Model
{
    protected $table = 'ujian_soal';

    protected $fillable = [
        'ujian_id',
        'soal_id',
        'section_id',
        'time_per_question',
        'bobot',
        'urutan',
    ];

    protected $casts = [
        'time_per_question' => 'integer',
        'bobot'             => 'float',
        'urutan'            => 'integer',
    ];

    public function ujian()
    {
        return $this->belongsTo(Ujian::class);
    }

    public function soal()
    {
        return $this->belongsTo(Soal::class);
    }

    public function section()
    {
        return $this->belongsTo(Section::class);
    }

    public function jawabanPeserta()
    {
        return $this->hasMany(JawabanPeserta::class);
    }
}