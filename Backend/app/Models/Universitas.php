<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Universitas extends Model
{
    protected $table = 'universitas';

    protected $fillable = [
        'nama',
        'kode',
        'logo',
        'alamat',
    ];

    public function fakultas()
    {
        return $this->hasMany(Fakultas::class);
    }

    public function users()
    {
        return $this->hasMany(User::class);
    }
}