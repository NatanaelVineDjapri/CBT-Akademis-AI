<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PmbPenerimaan extends Model
{
    protected $table = 'pmb_penerimaan';

    protected $fillable = [
        'universitas_id',
        'tahun',
        'total_pendaftar',
        'total_diterima',
    ];

    protected $casts = [
        'tahun'           => 'integer',
        'total_pendaftar' => 'integer',
        'total_diterima'  => 'integer',
    ];
}
