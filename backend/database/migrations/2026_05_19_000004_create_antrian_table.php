<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('antrian', function (Blueprint $table) {
            $table->id('antrian_id');
            $table->foreignId('pasien_id')->constrained('pasien', 'pasien_id');
            $table->foreignId('dokter_id')->constrained('dokter', 'dokter_id');
            $table->foreignId('appointment_id')->nullable()->constrained('appointment', 'appointment_id')->nullOnDelete();
            $table->unsignedSmallInteger('nomor_antrian');
            $table->date('tanggal')->useCurrent();
            $table->enum('status', ['MENUNGGU', 'DIPANGGIL', 'SELESAI', 'BATAL'])->default('MENUNGGU');
            $table->enum('jenis', ['WALKIN', 'BOOKING'])->default('WALKIN');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('antrian');
    }
};
