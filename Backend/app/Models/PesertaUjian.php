<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\DB;

class PesertaUjian extends Model
{
    protected $table = 'peserta_ujian';

    protected $fillable = [
        'ujian_id',
        'user_id',
        'attempt_ke',
        'status',
        'mulai_at',
        'selesai_at',
    ];

    protected $casts = [
        'attempt_ke' => 'integer',
        'mulai_at'   => 'datetime',
        'selesai_at' => 'datetime',
    ];

    public function ujian()
    {
        return $this->belongsTo(Ujian::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function jawabanPeserta()
    {
        return $this->hasMany(JawabanPeserta::class);
    }

    public function proctoringLog()
    {
        return $this->hasMany(ProctoringLog::class);
    }

    public function nilaiAkhir()
    {
        return $this->hasOne(NilaiAkhir::class);
    }

    /**
     * Auto-expire peserta ujian yang end_date-nya sudah lewat
     * tapi statusnya masih sedang_berlangsung.
     */
    public static function autoExpire(): void
    {
        DB::table('peserta_ujian')
            ->where('status', 'sedang_berlangsung')
            ->whereExists(function ($query) {
                $query->select(DB::raw(1))
                    ->from('ujian')
                    ->whereColumn('ujian.id', 'peserta_ujian.ujian_id')
                    ->where('ujian.end_date', '<', now());
            })
            ->update([
                'status'     => 'selesai',
                'selesai_at' => now(),
            ]);
    }
}