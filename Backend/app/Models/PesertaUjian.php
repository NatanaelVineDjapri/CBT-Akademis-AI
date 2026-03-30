<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PesertaUjian extends Model
{
    protected $table = 'peserta_ujian';

    protected $fillable = [
        'ujian_id',
        'user_id',
        'attempt_ke',
        'status',
        'mulai_at',
        'selesai_at',
    ];

    protected $casts = [
        'attempt_ke' => 'integer',
        'mulai_at'   => 'datetime',
        'selesai_at' => 'datetime',
    ];

    public function ujian()
    {
        return $this->belongsTo(Ujian::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function jawabanPeserta()
    {
        return $this->hasMany(JawabanPeserta::class);
    }

    public function proctoringLog()
    {
        return $this->hasMany(ProctoringLog::class);
    }

    public function nilaiAkhir()
    {
        return $this->hasOne(NilaiAkhir::class);
    }
}