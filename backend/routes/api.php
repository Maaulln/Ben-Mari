<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\PasienController;
use App\Http\Controllers\Api\DokterController;
use App\Http\Controllers\Api\AppointmentController;
use App\Http\Controllers\Api\ObatController;
use App\Http\Controllers\Api\RekamMedisController;
use App\Http\Controllers\Api\TagihanController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
*/

Route::post('/auth/register', [AuthController::class, 'register']);
Route::post('/auth/login', [AuthController::class, 'login']);
Route::post('resep', [\App\Http\Controllers\Api\ResepController::class, 'store']);

Route::middleware('auth:sanctum')->group(function () {

    // Auth
    Route::post('/auth/logout', [AuthController::class, 'logout']);
    Route::get('/auth/me', [AuthController::class, 'me']);

    // Appointment
    Route::get(
        '/pasien/{pasien}/appointment/terdekat',
        [AppointmentController::class, 'terdekat']
    );

    // Dokter
    Route::get(
        '/dokter/{dokter}/slot-jam',
        [DokterController::class, 'slotJam']
    );

    // Tambahan Dashboard Dokter
    Route::get(
        '/dokter/{dokter}/dashboard/stats',
        [DokterController::class, 'dashboardStats']
    );

    Route::get(
        '/dokter/{dokter}/pasien',
        [DokterController::class, 'pasienList']
    );

    // Resource Routes
    Route::apiResource('pasien', PasienController::class);
    Route::apiResource('dokter', DokterController::class);
    Route::apiResource('appointment', AppointmentController::class);
    Route::apiResource('obat', ObatController::class);
    Route::apiResource('rekam-medis', RekamMedisController::class);
    Route::apiResource('tagihan', TagihanController::class);
});