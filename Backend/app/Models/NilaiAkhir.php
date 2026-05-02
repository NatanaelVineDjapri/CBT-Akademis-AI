<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use OwenIt\Auditing\Contracts\Auditable;

class NilaiAkhir extends Model implements Auditable
{
    use \OwenIt\Auditing\Auditable;

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