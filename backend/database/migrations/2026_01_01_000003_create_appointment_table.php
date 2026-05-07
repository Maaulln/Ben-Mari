<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('appointment', function (Blueprint $table) {
            $table->id('appointment_id');
            $table->foreignId('pasien_id')->constrained('pasien', 'pasien_id')->onDelete('cascade');
            $table->foreignId('dokter_id')->constrained('dokter', 'dokter_id')->onDelete('cascade');
            $table->date('tgl_appointment');
            $table->string('jam_appointment', 5);
            $table->smallInteger('nomor_antrian');
            $table->string('keluhan_awal', 500)->nullable();
            $table->enum('status', ['MENUNGGU', 'SELESAI', 'BATAL'])->default('MENUNGGU');
            $table->string('catatan', 255)->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('appointment');
    }
};
