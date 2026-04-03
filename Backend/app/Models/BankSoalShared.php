<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class BankSoalShared extends Model
{
    protected $table = 'bank_soal_shared';

    protected $fillable = [
        'bank_soal_id',
        'user_id',
        'token',
        'expired_at',
    ];

    protected $casts = [
        'expired_at' => 'datetime',
    ];

    public function bankSoal()
    {
        return $this->belongsTo(BankSoal::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
