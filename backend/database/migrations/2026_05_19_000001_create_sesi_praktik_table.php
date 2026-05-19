<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('sesi_praktik', function (Blueprint $table) {
            $table->id('sesi_id');
            $table->foreignId('dokter_id')->constrained('dokter', 'dokter_id')->onDelete('cascade');
            $table->date('tanggal');
            $table->enum('sesi', ['PAGI', 'SIANG', 'SORE', 'MALAM']);
            $table->string('jam_mulai', 5);
            $table->string('jam_selesai', 5);
            $table->unsignedSmallInteger('kuota');
            $table->unsignedSmallInteger('terisi')->default(0);
            $table->enum('status', ['BUKA', 'PENUH', 'TUTUP', 'LIBUR'])->default('BUKA');
            $table->string('catatan', 255)->nullable();
            $table->timestamps();

            $table->unique(['dokter_id', 'tanggal', 'sesi']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('sesi_praktik');
    }
};
