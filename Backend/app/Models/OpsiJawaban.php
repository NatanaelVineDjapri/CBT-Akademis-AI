<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class OpsiJawaban extends Model
{
    protected $table = 'opsi_jawaban';

    protected $fillable = [
        'jenis_soal_id',
        'opsi',
        'teks',
        'is_correct',
    ];

    protected $casts = [
        'is_correct' => 'boolean',
    ];

    // Relasi
    public function jenisSoal()
    {
        return $this->belongsTo(JenisSoal::class);
    }
}