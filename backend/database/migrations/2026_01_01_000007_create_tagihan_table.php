<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('tagihan', function (Blueprint $table) {
            $table->id('tagihan_id');
            $table->foreignId('pasien_id')->constrained('pasien', 'pasien_id');
            $table->foreignId('appointment_id')->unique()->constrained('appointment', 'appointment_id');
            $table->date('tgl_tagihan');
            $table->decimal('biaya_konsultasi', 12, 2)->default(0);
            $table->decimal('biaya_obat', 12, 2)->default(0);
            $table->decimal('total_biaya', 12, 2);
            $table->string('metode_bayar', 20)->nullable();
            $table->enum('status_bayar', ['BELUM', 'LUNAS', 'CICIL'])->default('BELUM');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('tagihan');
    }
};
