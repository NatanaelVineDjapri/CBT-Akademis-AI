<?php

use Illuminate\Support\Facades\Broadcast;

Broadcast::channel('App.Models.User.{id}', function ($user, $id) {
    return (int) $user->id === (int) $id;
});

// Dosen yang buat ujian bisa subscribe pelanggaran channel
Broadcast::channel('ujian.{ujianId}', function ($user, $ujianId) {
    return $user->role === 'dosen' &&
        \App\Models\Ujian::where('id', $ujianId)
            ->where('created_by', $user->id)
            ->exists();
});

// Mahasiswa peserta ATAU dosen yang buat ujian bisa akses WebRTC signal channel
Broadcast::channel('proctoring-signal.{pesertaUjianId}', function ($user, $pesertaUjianId) {
    $peserta = \App\Models\PesertaUjian::with('ujian:id,created_by')
        ->select('id', 'user_id', 'ujian_id')
        ->find($pesertaUjianId);
    if (!$peserta) return false;
    return $user->id === $peserta->user_id ||
        ($user->role === 'dosen' && $peserta->ujian?->created_by === $user->id);
});
