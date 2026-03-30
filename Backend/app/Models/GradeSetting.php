<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class GradeSetting extends Model
{
    protected $table = 'grade_setting';

    protected $fillable = [
        'ujian_id',
        'grade',
        'nilai_min',
        'nilai_max',
    ];

    protected $casts = [
        'nilai_min' => 'float',
        'nilai_max' => 'float',
    ];

    // Relasi
    public function ujian()
    {
        return $this->belongsTo(Ujian::class);
    }
}