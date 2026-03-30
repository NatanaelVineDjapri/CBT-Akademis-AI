<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ProctoringLog extends Model
{
    protected $table = 'proctoring_log';

    protected $fillable = [
        'peserta_ujian_id',
        'tipe_pelanggaran',
        'risk_score',
        'waktu',
    ];

    protected $casts = [
        'risk_score' => 'float',
        'waktu'      => 'datetime',
    ];

    public function pesertaUjian()
    {
        return $this->belongsTo(PesertaUjian::class);
    }
}