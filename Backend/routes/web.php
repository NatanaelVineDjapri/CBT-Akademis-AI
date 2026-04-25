<?php

use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "web" middleware group. Make something great!
|
*/

Route::get('/', function () {
    return view('welcome');
});

Route::get('/test-pusher', function () {
    broadcast(new \App\Events\JawabanMasuk([
        'nama'    => 'Test User',
        'ujian_id' => 1,
        'jawaban' => 'A',
        'waktu'   => now()->format('H:i:s'),
    ]));
    return 'Event terkirim!';
});

Route::get('/test-pusher2', function () {
    $pusher = new \Pusher\Pusher(
        env('PUSHER_APP_KEY'),
        env('PUSHER_APP_SECRET'),
        env('PUSHER_APP_ID'),
        ['cluster' => env('PUSHER_APP_CLUSTER'), 'useTLS' => true]
    );

    $pusher->trigger('ujian-channel', 'jawaban-masuk', ['nama' => 'Test']);

    return 'Sent!';
});