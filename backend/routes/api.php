<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\PasienController;
use App\Http\Controllers\Api\DokterController;
use App\Http\Controllers\Api\AppointmentController;
use App\Http\Controllers\Api\AntrianController;
use App\Http\Controllers\Api\VitalSignsController;
use App\Http\Controllers\Api\JadwalDokterController;
use App\Http\Controllers\Api\ObatController;
use App\Http\Controllers\Api\RekamMedisController;
use App\Http\Controllers\Api\ResepController;
use App\Http\Controllers\Api\TagihanController;
use App\Http\Controllers\Api\LaporanController;
use App\Http\Controllers\Api\SesiPraktikController;
use Illuminate\Support\Facades\Route;


/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
*/

// Public routes
Route::post('/auth/register', [AuthController::class, 'register']);
Route::post('/auth/login',    [AuthController::class, 'login']);

Route::middleware('auth:sanctum')->group(function () {

    // ──────── AUTH ────────
    Route::post('/auth/logout', [AuthController::class, 'logout']);
    Route::get('/auth/me',      [AuthController::class, 'me']);

    // ──────── PASIEN ────────
    Route::apiResource('pasien', PasienController::class);
    Route::get('/pasien/{pasien}/appointment/terdekat', [AppointmentController::class, 'terdekat']);

    // ──────── DOKTER ────────
    Route::apiResource('dokter', DokterController::class);
    Route::get('/dokter/{dokter}/jadwal',         [DokterController::class, 'jadwal']);
    Route::get('/dokter/{dokter}/slot-jam',        [DokterController::class, 'slotJam']);
    Route::get('/dokter/{dokter}/dashboard/stats', [DokterController::class, 'dashboardStats']);
    Route::get('/dokter/{dokter}/pasien',          [DokterController::class, 'pasienList']);

    // ──────── JADWAL DOKTER (template mingguan) ────────
    Route::apiResource('jadwal-dokter', JadwalDokterController::class);

    // ──────── SESI PRAKTIK (jadwal per tanggal) ────────
    Route::apiResource('sesi-praktik', SesiPraktikController::class);

    // ──────── APPOINTMENT ────────
    Route::apiResource('appointment', AppointmentController::class);
    Route::post('/appointment/{appointment}/checkin', [AppointmentController::class, 'checkin']);

    // ──────── ANTRIAN ────────
    Route::get('/antrian',           [AntrianController::class, 'index']);
    Route::post('/antrian',          [AntrianController::class, 'store']);
    Route::get('/antrian/{antrian}', [AntrianController::class, 'show']);
    Route::put('/antrian/{antrian}/status', [AntrianController::class, 'updateStatus']);
    Route::delete('/antrian/{antrian}',    [AntrianController::class, 'destroy']);

    // ──────── VITAL SIGNS ────────
    Route::post('/vital-signs',                              [VitalSignsController::class, 'store']);
    Route::get('/vital-signs/{appointment_id}',              [VitalSignsController::class, 'showByAppointment']);
    Route::put('/vital-signs/{vs}',                          [VitalSignsController::class, 'update']);

    // ──────── REKAM MEDIS ────────
    Route::apiResource('rekam-medis', RekamMedisController::class);

    // ──────── OBAT ────────
    // Rute statis HARUS sebelum apiResource agar tidak di-capture sebagai {obat} ID
    Route::get('/obat/alert-stok',         [ObatController::class, 'alertStok']);
    Route::post('/obat/{obat}/stok-masuk', [ObatController::class, 'stokMasuk']);
    Route::apiResource('obat', ObatController::class);

    // ──────── RESEP ────────
    Route::get('/resep',          [ResepController::class, 'index']);
    Route::post('/resep',         [ResepController::class, 'store']);
    Route::get('/resep/{resep}',  [ResepController::class, 'show']);
    Route::put('/resep/{resep}',  [ResepController::class, 'update']);
    Route::delete('/resep/{resep}', [ResepController::class, 'destroy']);

    // ──────── TAGIHAN ────────
    Route::apiResource('tagihan', TagihanController::class);

    // ──────── LAPORAN ────────
    Route::get('/laporan/kunjungan',  [LaporanController::class, 'kunjungan']);
    Route::get('/laporan/pendapatan', [LaporanController::class, 'pendapatan']);
});
