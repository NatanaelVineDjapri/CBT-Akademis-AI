<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class BankSoal extends Model
{
    protected $table = 'bank_soal';

    protected $fillable = [
        'created_by',
        'mata_kuliah_id',
        'nama',
        'deskripsi',
        'permission',
    ];

    public function creator()
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function mataKuliah()
    {
        return $this->belongsTo(MataKuliah::class);
    }

    public function soal()
    {
        return $this->hasMany(Soal::class);
    }

    public function aiGenerateLog()
    {
        return $this->hasMany(AiGenerateLog::class);
    }

    public function sharedUsers()
    {
        return $this->hasMany(BankSoalShared::class);
    }
}