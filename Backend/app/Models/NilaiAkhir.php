<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use OwenIt\Auditing\Contracts\Auditable;

class NilaiAkhir extends Model implements Auditable
{
    use \OwenIt\Auditing\Auditable;

    protected $table = 'nilai_akhir';

    protected $fillable = [
        'peserta_ujian_id',
        'nilai_total',
        'lulus',
        'grade',
        'graded_at',
    ];

    protected $casts = [
        'nilai_total' => 'float',
        'lulus'       => 'boolean',
        'graded_at'   => 'datetime',
    ];

    public function pesertaUjian()
    {
        return $this->belongsTo(PesertaUjian::class);
    }

    /**
     * Ambil 1 nilai terbaik (nilai_total tertinggi) per ujian untuk user tertentu.
     * Jika nilai sama, ambil yang paling baru (graded_at desc).
     * Hasil sudah di-eager load ujian & mataKuliah.
     *
     * @return \Illuminate\Support\Collection<static>
     */
    public static function bestPerUjian(int $userId): \Illuminate\Support\Collection
    {
        return static::with(['pesertaUjian.ujian.mataKuliah'])
            ->whereHas('pesertaUjian', fn($q) => $q->where('user_id', $userId))
            ->orderByDesc('nilai_total')
            ->orderByDesc('graded_at')
            ->get()
            ->unique(fn($n) => $n->pesertaUjian?->ujian_id)
            ->values();
    }
}