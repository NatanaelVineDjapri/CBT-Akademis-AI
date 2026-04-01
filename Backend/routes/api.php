<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\UserController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/
// Route public 
Route::prefix('auth')->group(function () {
    Route::post('/login', [AuthController::class, 'login']);
    Route::post('/register', [AuthController::class, 'register']);
    Route::post('/forgot-password', [AuthController::class, 'forgotPassword']);
    Route::post('/reset-password', [AuthController::class, 'resetPassword']);
});

//Protected Routes
Route::middleware('auth:sanctum')->group(function () {

    // Auth
    Route::prefix('auth')->group(function () {
        Route::post('/logout', [AuthController::class, 'logout']);
        Route::get('/me', [AuthController::class, 'me']);
    });

    // Profile - Semua Role
    Route::prefix('profile')->group(function () {
        Route::put('/', [UserController::class, 'updateProfile']);
        Route::put('/password', [UserController::class, 'updatePassword']);
    });

    // Admin Akademis AI only
    Route::middleware('role:admin_akademis_ai')->prefix('admin')->group(function () {
        // nanti universitas, fakultas, prodi
    });

    // Admin Universitas only
    Route::middleware('role:admin_universitas')->prefix('admin')->group(function () {
        Route::get('/users', [UserController::class, 'index']);
        Route::post('/users', [UserController::class, 'store']);
        Route::get('/users/{id}', [UserController::class, 'show']);
        Route::put('/users/{id}', [UserController::class, 'updateByAdmin']);
        Route::delete('/users/{id}', [UserController::class, 'destroy']);
        Route::post('/users/import', [UserController::class, 'importBulk']);
    });

    // Admin Akademis AI & Admin Universitas
    Route::middleware('role:admin_akademis_ai,admin_universitas')->prefix('admin')->group(function () {
        
    });
});