<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class AiGenerateLog extends Model
{
    protected $table = 'ai_generate_log';

    protected $fillable = [
        'bank_soal_id',
        'user_id',
        'tipe_soal',
        'jumlah',
        'prompt',
        'status',
    ];

    protected $casts = [
        'jumlah' => 'integer',
    ];

    public function bankSoal()
    {
        return $this->belongsTo(BankSoal::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function soal()
    {
        return $this->hasMany(Soal::class);
    }
}