<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class MediaSoal extends Model
{
    protected $table = 'media_soal';

    protected $fillable = [
        'soal_id',
        'tipe_media',
        'url',
    ];

    // Relasi
    public function soal()
    {
        return $this->belongsTo(Soal::class);
    }
}