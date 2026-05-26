<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\PasienController;
use App\Http\Controllers\Api\DokterController;
use App\Http\Controllers\Api\AppointmentController;
use App\Http\Controllers\Api\AntrianController;
use App\Http\Controllers\Api\VitalSignsController;
use App\Http\Controllers\Api\JadwalDokterController;
use App\Http\Controllers\Api\ObatController;
use App\Http\Controllers\Api\PengaturanController;
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

    // ──────── PASIEN (semua role bisa baca, admin/dokter bisa ubah) ────────
    Route::get('/pasien',    [PasienController::class, 'index']);
    Route::get('/pasien/{pasien}', [PasienController::class, 'show']);
    Route::get('/pasien/{pasien}/appointment/terdekat', [AppointmentController::class, 'terdekat']);

    Route::middleware('role:Admin')->group(function () {
        Route::post('/pasien',           [PasienController::class, 'store']);
        Route::put('/pasien/{pasien}',   [PasienController::class, 'update']);
        Route::delete('/pasien/{pasien}',[PasienController::class, 'destroy']);
    });

    // ──────── DOKTER (semua role bisa baca) ────────
    Route::get('/dokter',    [DokterController::class, 'index']);
    Route::get('/dokter/{dokter}', [DokterController::class, 'show']);
    Route::get('/dokter/{dokter}/jadwal',         [DokterController::class, 'jadwal']);
    Route::get('/dokter/{dokter}/slot-jam',        [DokterController::class, 'slotJam']);
    Route::get('/dokter/{dokter}/estimasi-masuk',  [DokterController::class, 'estimasiMasuk']);
    Route::get('/dokter/{dokter}/dashboard/stats', [DokterController::class, 'dashboardStats']);
    Route::get('/dokter/{dokter}/pasien',          [DokterController::class, 'pasienList']);

    Route::middleware('role:Admin')->group(function () {
        Route::post('/dokter',           [DokterController::class, 'store']);
        Route::put('/dokter/{dokter}',   [DokterController::class, 'update']);
        Route::delete('/dokter/{dokter}',[DokterController::class, 'destroy']);
    });

    // ──────── JADWAL DOKTER ────────
    Route::get('/jadwal-dokter', [JadwalDokterController::class, 'index']);
    Route::get('/jadwal-dokter/{jadwal_dokter}', [JadwalDokterController::class, 'show']);

    Route::middleware('role:Admin,dokter')->group(function () {
        Route::post('/jadwal-dokter',                   [JadwalDokterController::class, 'store']);
        Route::put('/jadwal-dokter/{jadwal_dokter}',    [JadwalDokterController::class, 'update']);
        Route::delete('/jadwal-dokter/{jadwal_dokter}', [JadwalDokterController::class, 'destroy']);
    });

    // ──────── SESI PRAKTIK ────────
    Route::get('/sesi-praktik', [SesiPraktikController::class, 'index']);
    Route::get('/sesi-praktik/{sesi_praktik}', [SesiPraktikController::class, 'show']);

    Route::middleware('role:Admin,dokter')->group(function () {
        Route::post('/sesi-praktik',                  [SesiPraktikController::class, 'store']);
        Route::put('/sesi-praktik/{sesi_praktik}',    [SesiPraktikController::class, 'update']);
        Route::delete('/sesi-praktik/{sesi_praktik}', [SesiPraktikController::class, 'destroy']);
    });

    // ──────── APPOINTMENT ────────
    Route::get('/appointment',             [AppointmentController::class, 'index']);
    Route::get('/appointment/{appointment}',[AppointmentController::class, 'show']);
    Route::post('/appointment',            [AppointmentController::class, 'store']);
    Route::post('/appointment/{appointment}/checkin', [AppointmentController::class, 'checkin']);

    Route::middleware('role:Admin,dokter')->group(function () {
        Route::put('/appointment/{appointment}',    [AppointmentController::class, 'update']);
        Route::delete('/appointment/{appointment}', [AppointmentController::class, 'destroy']);
    });

    // ──────── ANTRIAN ────────
    Route::get('/antrian',           [AntrianController::class, 'index']);
    Route::post('/antrian',          [AntrianController::class, 'store']);
    Route::get('/antrian/{antrian}', [AntrianController::class, 'show']);
    Route::put('/antrian/{antrian}/status', [AntrianController::class, 'updateStatus']);
    Route::delete('/antrian/{antrian}',    [AntrianController::class, 'destroy']);

    // ──────── VITAL SIGNS ────────
    Route::post('/vital-signs',                 [VitalSignsController::class, 'store']);
    Route::get('/vital-signs/{appointment_id}', [VitalSignsController::class, 'showByAppointment']);
    Route::put('/vital-signs/{vs}',             [VitalSignsController::class, 'update']);

    // ──────── REKAM MEDIS ────────
    Route::get('/rekam-medis',             [RekamMedisController::class, 'index']);
    Route::get('/rekam-medis/{rekam_medis}',[RekamMedisController::class, 'show']);

    Route::middleware('role:Admin,dokter')->group(function () {
        Route::post('/rekam-medis',              [RekamMedisController::class, 'store']);
        Route::put('/rekam-medis/{rekam_medis}', [RekamMedisController::class, 'update']);
        Route::delete('/rekam-medis/{rekam_medis}', [RekamMedisController::class, 'destroy']);
    });

    // ──────── OBAT ────────
    Route::get('/obat/alert-stok',         [ObatController::class, 'alertStok']);
    Route::get('/obat',                    [ObatController::class, 'index']);
    Route::get('/obat/{obat}',             [ObatController::class, 'show']);

    Route::middleware('role:Admin')->group(function () {
        Route::post('/obat',                     [ObatController::class, 'store']);
        Route::put('/obat/{obat}',               [ObatController::class, 'update']);
        Route::delete('/obat/{obat}',            [ObatController::class, 'destroy']);
        Route::post('/obat/{obat}/stok-masuk',   [ObatController::class, 'stokMasuk']);
    });

    // ──────── RESEP ────────
    Route::get('/resep',         [ResepController::class, 'index']);
    Route::get('/resep/{resep}', [ResepController::class, 'show']);

    Route::middleware('role:Admin,dokter')->group(function () {
        Route::post('/resep',          [ResepController::class, 'store']);
        Route::put('/resep/{resep}',   [ResepController::class, 'update']);
        Route::delete('/resep/{resep}',[ResepController::class, 'destroy']);
    });

    // ──────── TAGIHAN ────────
    Route::get('/tagihan',           [TagihanController::class, 'index']);
    Route::get('/tagihan/{tagihan}', [TagihanController::class, 'show']);

    Route::middleware('role:Admin')->group(function () {
        Route::post('/tagihan',            [TagihanController::class, 'store']);
        Route::put('/tagihan/{tagihan}',   [TagihanController::class, 'update']);
        Route::delete('/tagihan/{tagihan}',[TagihanController::class, 'destroy']);
    });

    // ──────── LAPORAN (Admin only) ────────
    Route::middleware('role:Admin')->group(function () {
        Route::get('/laporan/kunjungan',  [LaporanController::class, 'kunjungan']);
        Route::get('/laporan/pendapatan', [LaporanController::class, 'pendapatan']);
    });

    // ──────── PENGATURAN (Admin only) ────────
    Route::middleware('role:Admin')->group(function () {
        Route::get('/pengaturan',  [PengaturanController::class, 'show']);
        Route::put('/pengaturan',  [PengaturanController::class, 'update']);
    });
});
