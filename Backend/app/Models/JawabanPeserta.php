<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class JawabanPeserta extends Model
{
    protected $table = 'jawaban_peserta';

    protected $fillable = [
        'peserta_ujian_id',
        'ujian_soal_id',
        'jawaban',
        'nilai',
        'is_manual_graded',
        'ai_skor',
        'ai_feedback',
        'final_nilai',
    ];

    protected $casts = [
        'nilai'            => 'float',
        'is_manual_graded' => 'boolean',
        'ai_skor'          => 'float',
        'final_nilai'      => 'float',
    ];

    public function pesertaUjian()
    {
        return $this->belongsTo(PesertaUjian::class);
    }

    public function ujianSoal()
    {
        return $this->belongsTo(UjianSoal::class);
    }
}