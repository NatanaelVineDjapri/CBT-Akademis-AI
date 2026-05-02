<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use OwenIt\Auditing\Contracts\Auditable;

class PmbPenerimaan extends Model implements Auditable
{
    use \OwenIt\Auditing\Auditable;

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
