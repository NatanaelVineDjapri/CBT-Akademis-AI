<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\UniversitasController;
use App\Http\Controllers\FakultasController;
use App\Http\Controllers\ProdiController;
use App\Http\Controllers\PengumumanController;
use App\Http\Controllers\BankSoalController;
use App\Http\Controllers\MataKuliahController;
use App\Http\Controllers\BabController;
use App\Http\Controllers\UjianController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\UploadController;
use App\Http\Controllers\TwoFactorController;
use App\Http\Controllers\PmbPenerimaanController;
use App\Http\Controllers\AuditController;
use App\Http\Controllers\SettingsController;

Route::prefix('auth')->group(function () {
    Route::post('/login', [AuthController::class, 'login']);
    Route::post('/login/2fa-verify', [AuthController::class, 'verifyLogin']);
    Route::post('/register', [AuthController::class, 'register']);
    Route::post('/forgot-password', [AuthController::class, 'forgotPassword']);
    Route::post('/reset-password', [AuthController::class, 'resetPassword']);
    Route::get('/verify-reset-token', [AuthController::class, 'verifyResetToken']);
});

Route::middleware(['auth:sanctum', 'maintenance'])->group(function () {

    Route::prefix('auth')->group(function () {
        Route::get('/me', [AuthController::class, 'me']);
        Route::post('/logout', [AuthController::class, 'logout']);

        Route::get('/2fa/setup', [TwoFactorController::class, 'setup']);
        Route::post('/2fa/enable', [TwoFactorController::class, 'enable']);
        Route::post('/2fa/disable', [TwoFactorController::class, 'disable']);
    });

    Route::prefix('profile')->group(function () {
        Route::put('/', [UserController::class, 'updateProfile']);
        Route::put('/password', [UserController::class, 'updatePassword']);
    });

    Route::post('/upload/signature', [UploadController::class, 'signature']);

    Route::get('/dashboard/mahasiswa', [DashboardController::class, 'mahasiswa']);
    Route::get('/pengumuman', [PengumumanController::class, 'index']);
    Route::get('/jadwal', [UjianController::class, 'jadwalMahasiswa']);
    Route::get('/mata-kuliah/my', [MataKuliahController::class, 'myMataKuliah']);
    Route::get('/mata-kuliah/my/{id}', [MataKuliahController::class, 'myMataKuliahDetail']);
    Route::get('/mata-kuliah/my/{matkulId}/bab/{babId}/soal', [MataKuliahController::class, 'myMataKuliahBabSoal']);
    // Tambah middleware role mahasiswa
    Route::middleware('role:mahasiswa')->group(function () {
        Route::get('/jadwal', [UjianController::class, 'jadwalMahasiswa']);
        Route::get('/nilai', [UjianController::class, 'nilaiMahasiswa']);
        Route::get('/nilai/{id}', [UjianController::class, 'nilaiDetail']);
        Route::get('/ujian/my', [UjianController::class, 'ujianMahasiswa']);
        Route::post('/ujian/submit-jawaban', [UjianController::class, 'submitJawaban']); 
    });
    Route::prefix('bank-soal')->group(function () {
        Route::get('/global', [BankSoalController::class, 'global']);
        Route::get('/global/{id}', [BankSoalController::class, 'showGlobal']);
        Route::get('/{id}/soal', [BankSoalController::class, 'soal']);
        Route::post('/join', [BankSoalController::class, 'joinByLink']);
    });

    Route::middleware('role:admin_akademis_ai')->group(function () {
        Route::get('/settings/maintenance',  [SettingsController::class, 'getMaintenanceStatus']);
        Route::post('/settings/maintenance', [SettingsController::class, 'toggleMaintenance']);

        Route::get('/dashboard/admin-akademis',                        [DashboardController::class, 'adminAkademis']);
        Route::get('/dashboard/admin-akademis/distribusi-pengguna',   [DashboardController::class, 'adminAkademisDistribusiPengguna']);
        Route::get('/dashboard/admin-akademis/aktivitas-ujian',       [DashboardController::class, 'adminAkademisAktivitasUjian']);
        Route::get('/dashboard/admin-akademis/kelulusan',             [DashboardController::class, 'adminAkademisKelulusan']);
        Route::get('/dashboard/admin-akademis/tren-nilai',            [DashboardController::class, 'adminAkademisTrenNilai']);

        Route::prefix('universitas')->group(function () {
            Route::post('/', [UniversitasController::class, 'store']);
            Route::put('/{id}', [UniversitasController::class, 'update']);
            Route::delete('/{id}', [UniversitasController::class, 'destroy']);
        });

        Route::get('/universitas/{id}', [UniversitasController::class, 'show']);

        Route::prefix('fakultas')->group(function () {
            Route::post('/', [FakultasController::class, 'store']);
            Route::put('/{id}', [FakultasController::class, 'update']);
            Route::delete('/{id}', [FakultasController::class, 'destroy']);
        });

        Route::prefix('prodi')->group(function () {
            Route::post('/', [ProdiController::class, 'store']);
            Route::put('/{id}', [ProdiController::class, 'update']);
            Route::delete('/{id}', [ProdiController::class, 'destroy']);
        });
    });

    Route::middleware('role:admin_akademis_ai,admin_universitas')->group(function () {
        Route::get('/universitas', [UniversitasController::class, 'index']);
        Route::get('/fakultas', [FakultasController::class, 'index']);
        Route::get('/prodi', [ProdiController::class, 'index']);
    });

    Route::middleware('role:admin_universitas')->group(function () {
        Route::get('/dashboard/admin-universitas', [DashboardController::class, 'adminUniversitas']);
        Route::get('/dashboard/admin-universitas/performa',   [DashboardController::class, 'adminUniversitasPerforma']);
        Route::get('/dashboard/admin-universitas/distribusi',        [DashboardController::class, 'adminUniversitasDistribusi']);
        Route::get('/dashboard/admin-universitas/performa-prodi',   [DashboardController::class, 'adminUniversitasPerformaProdi']);
        Route::get('/dashboard/admin-universitas/aktivitas-ujian',  [DashboardController::class, 'adminUniversitasAktivitasUjian']);
        Route::get('/dashboard/admin-universitas/kelulusan',        [DashboardController::class, 'adminUniversitasKelulusan']);
        Route::get('/dashboard/admin-universitas/tren-nilai',       [DashboardController::class, 'adminUniversitasTrenNilai']);

        Route::get('/audit',                    [AuditController::class, 'index']);
        Route::get('/audit/{model}/{id}',       [AuditController::class, 'show']);

        Route::prefix('users')->group(function () {
            Route::get('/', [UserController::class, 'index']);
            Route::post('/', [UserController::class, 'store']);
            Route::get('/{id}', [UserController::class, 'show']);
            Route::put('/{id}', [UserController::class, 'updateByAdmin']);
            Route::delete('/{id}', [UserController::class, 'destroy']);
            Route::post('/import', [UserController::class, 'importBulk']);
        });

        Route::prefix('pengumuman')->group(function () {
            Route::post('/', [PengumumanController::class, 'store']);
            Route::put('/{id}', [PengumumanController::class, 'update']);
            Route::delete('/{id}', [PengumumanController::class, 'destroy']);
        });

        Route::prefix('mata-kuliah')->group(function () {
            Route::get('/', [MataKuliahController::class, 'index']);
            Route::post('/', [MataKuliahController::class, 'store']);
            Route::put('/{id}', [MataKuliahController::class, 'update']);
            Route::delete('/{id}', [MataKuliahController::class, 'destroy']);
        });

        Route::prefix('pmb/penerimaan')->group(function () {
            Route::get('/statistik', [PmbPenerimaanController::class, 'statistik']);
            Route::get('/peserta',   [PmbPenerimaanController::class, 'index']);
            Route::post('/proses',   [PmbPenerimaanController::class, 'proses']);
        });

        Route::get('/ujian/admin-universitas/hasil', [UjianController::class, 'hasilUjianAdminUniversitas']);
        Route::get('/ujian/admin-universitas/hasil/{id}', [UjianController::class, 'detailUjianDosen']);
        Route::get('/ujian/admin-universitas/hasil/{ujianId}/peserta/{pesertaId}', [UjianController::class, 'detailPesertaUjianDosen']);
        Route::put('/ujian/admin-universitas/hasil/{ujianId}/peserta/{pesertaId}/periksa-essay', [UjianController::class, 'periksaEssay']);
        Route::put('/ujian/admin-universitas/hasil/{ujianId}/peserta/{pesertaId}/reset-essay', [UjianController::class, 'resetEssay']);
        Route::get('/ujian/admin-universitas/hasil/{id}/export-pdf', [UjianController::class, 'exportPDF']);
    });

    Route::middleware('role:dosen')->group(function () {
        Route::get('/dashboard/dosen', [DashboardController::class, 'dosen']);
        Route::get('/dashboard/dosen/performa', [DashboardController::class, 'dosenPerforma']);
        Route::get('/mata-kuliah/dosen', [MataKuliahController::class, 'dosenMataKuliah']);
        Route::get('/jadwal/dosen', [UjianController::class, 'jadwalDosen']);
        Route::get('/ujian/dosen/hasil', [UjianController::class, 'hasilUjianDosen']);
        Route::get('/ujian/dosen/hasil/{id}', [UjianController::class, 'detailUjianDosen']);
        Route::get('/ujian/dosen/hasil/{ujianId}/peserta/{pesertaId}', [UjianController::class, 'detailPesertaUjianDosen']);
        Route::put('/ujian/dosen/hasil/{ujianId}/peserta/{pesertaId}/periksa-essay', [UjianController::class, 'periksaEssay']);
        Route::put('/ujian/dosen/hasil/{ujianId}/peserta/{pesertaId}/reset-essay', [UjianController::class, 'resetEssay']);
        Route::get('/ujian/dosen/hasil/{id}/export-pdf', [UjianController::class, 'exportPDF']);
    });

    Route::middleware('role:admin_universitas,dosen')->group(function () {
        Route::prefix('bank-soal')->group(function () {
            Route::get('/', [BankSoalController::class, 'index']);
            Route::get('/search-users', [BankSoalController::class, 'searchUsers']);
            Route::post('/', [BankSoalController::class, 'store']);
            Route::put('/{id}', [BankSoalController::class, 'update']);
            Route::delete('/{id}', [BankSoalController::class, 'destroy']);
            Route::get('/{id}/shared-users', [BankSoalController::class, 'getSharedUsers']);
            Route::post('/{id}/share-email', [BankSoalController::class, 'shareByEmail']);
            Route::post('/{id}/generate-link', [BankSoalController::class, 'generateLink']);
            Route::delete('/{id}/remove-shared', [BankSoalController::class, 'removeShared']);
        });

        Route::post('/soal/generate-ai', [\App\Http\Controllers\GenerateSoalController::class, 'generate']);
        Route::post('/soal/bulk', [\App\Http\Controllers\SoalController::class, 'storeBulk']);
        Route::post('/soal', [\App\Http\Controllers\SoalController::class, 'store']);
        Route::put('/soal/{id}', [\App\Http\Controllers\SoalController::class, 'update']);
        Route::delete('/soal/{id}', [\App\Http\Controllers\SoalController::class, 'destroy']);

        Route::prefix('bab')->group(function () {
            Route::get('/', [BabController::class, 'index']);
            Route::post('/', [BabController::class, 'store']);
            Route::put('/{id}', [BabController::class, 'update']);
            Route::delete('/{id}', [BabController::class, 'destroy']);
        });
    });
});