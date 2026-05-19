<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('jadwal_dokter', function (Blueprint $table) {
            $table->id('jadwal_id');
            $table->foreignId('dokter_id')->constrained('dokter', 'dokter_id')->onDelete('cascade');
            $table->enum('hari', ['SENIN', 'SELASA', 'RABU', 'KAMIS', 'JUMAT', 'SABTU', 'MINGGU']);
            $table->string('jam_mulai', 5);
            $table->string('jam_selesai', 5);
            $table->unsignedSmallInteger('kuota')->default(20);
            $table->tinyInteger('is_aktif')->default(1);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('jadwal_dokter');
    }
};
