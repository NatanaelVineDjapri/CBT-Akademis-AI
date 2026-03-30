<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class RubrikEssay extends Model
{
    protected $table = 'rubrik_essay';

    protected $fillable = [
        'soal_id',
        'kriteria',
        'skor_max',
    ];

    protected $casts = [
        'skor_max' => 'float',
    ];

    public function soal()
    {
        return $this->belongsTo(Soal::class);
    }
}