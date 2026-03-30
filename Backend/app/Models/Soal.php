<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Soal extends Model
{
    protected $table = 'soal';

    protected $fillable = [
        'bank_soal_id',
        'mata_kuliah_id',
        'bab_id',
        'ai_generate_log_id',
        'deskripsi',
        'tingkat_kesulitan',
        'ai_generated',
    ];

    protected $casts = [
        'ai_generated' => 'boolean',
    ];

    public function bankSoal()
    {
        return $this->belongsTo(BankSoal::class);
    }

    public function mataKuliah()
    {
        return $this->belongsTo(MataKuliah::class);
    }

    public function bab()
    {
        return $this->belongsTo(Bab::class);
    }

    public function aiGenerateLog()
    {
        return $this->belongsTo(AiGenerateLog::class);
    }

    public function jenisSoal()
    {
        return $this->hasMany(JenisSoal::class);
    }

    public function mediaSoal()
    {
        return $this->hasMany(MediaSoal::class);
    }

    public function rubrikEssay()
    {
        return $this->hasMany(RubrikEssay::class);
    }

    public function ujianSoal()
    {
        return $this->hasMany(UjianSoal::class);
    }
}