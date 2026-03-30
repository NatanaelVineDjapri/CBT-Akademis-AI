<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Section extends Model
{
    protected $table = 'section';

    protected $fillable = [
        'ujian_id',
        'nama_section',
        'time_per_section',
        'jenis_soal',
        'urutan',
        'bobot',
    ];

    protected $casts = [
        'time_per_section' => 'integer',
        'urutan'           => 'integer',
        'bobot'            => 'float',
    ];

    // Relasi
    public function ujian()
    {
        return $this->belongsTo(Ujian::class);
    }

    public function ujianSoal()
    {
        return $this->hasMany(UjianSoal::class);
    }
}