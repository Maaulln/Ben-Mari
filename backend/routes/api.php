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

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/auth/logout', [AuthController::class, 'logout']);
    Route::get('/auth/me', [AuthController::class, 'me']);

    Route::apiResource('pasien', PasienController::class);
    Route::apiResource('dokter', DokterController::class);
    Route::apiResource('appointment', AppointmentController::class);
    Route::apiResource('obat', ObatController::class);
    Route::apiResource('rekam-medis', RekamMedisController::class);
    Route::apiResource('tagihan', TagihanController::class);
});
