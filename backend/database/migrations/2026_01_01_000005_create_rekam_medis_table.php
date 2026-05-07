<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('rekam_medis', function (Blueprint $table) {
            $table->id('rekam_id');
            $table->foreignId('appointment_id')->unique()->constrained('appointment', 'appointment_id')->onDelete('cascade');
            $table->foreignId('dokter_id')->constrained('dokter', 'dokter_id');
            $table->date('tgl_periksa');
            $table->string('keluhan', 500);
            $table->string('diagnosis', 500);
            $table->string('tindakan', 500)->nullable();
            $table->string('tekanan_darah', 10)->nullable();
            $table->decimal('berat_badan', 5, 2)->nullable();
            $table->text('catatan_tambahan')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('rekam_medis');
    }
};
