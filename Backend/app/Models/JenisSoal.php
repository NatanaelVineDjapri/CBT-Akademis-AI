<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class JenisSoal extends Model
{
    protected $table = 'jenis_soal';

    protected $fillable = [
        'soal_id',
        'jenis_soal',
    ];

    public function soal()
    {
        return $this->belongsTo(Soal::class);
    }

    public function opsiJawaban()
    {
        return $this->hasMany(OpsiJawaban::class);
    }
}