<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('dokter', function (Blueprint $table) {
            $table->id('dokter_id');
            $table->string('nama_dokter', 100);
            $table->string('spesialisasi', 100);
            $table->string('no_sip', 30)->unique();
            $table->string('no_telepon', 15);
            $table->string('email', 100)->nullable()->unique();
            $table->string('jadwal_praktik', 200)->nullable();
            $table->decimal('biaya_konsultasi', 12, 2);
            $table->char('status_aktif', 1)->default('Y');
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('dokter');
    }
};
