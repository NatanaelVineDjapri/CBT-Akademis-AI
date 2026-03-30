<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Pengumuman extends Model
{
    protected $table = 'pengumuman';

    protected $fillable = [
        'created_by',
        'ujian_id',
        'judul',
        'isi',
        'expired_at',
    ];

    protected $casts = [
        'expired_at' => 'datetime',
    ];

    // Relasi
    public function creator()
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function ujian()
    {
        return $this->belongsTo(Ujian::class);
    }
}