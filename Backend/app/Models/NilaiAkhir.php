<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class NilaiAkhir extends Model
{
    protected $table = 'nilai_akhir';

    protected $fillable = [
        'peserta_ujian_id',
        'nilai_total',
        'lulus',
        'grade',
        'graded_at',
    ];

    protected $casts = [
        'nilai_total' => 'float',
        'lulus'       => 'boolean',
        'graded_at'   => 'datetime',
    ];

    public function pesertaUjian()
    {
        return $this->belongsTo(PesertaUjian::class);
    }
}