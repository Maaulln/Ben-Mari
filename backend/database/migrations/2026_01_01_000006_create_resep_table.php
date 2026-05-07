<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('resep', function (Blueprint $table) {
            $table->id('resep_id');
            $table->foreignId('rekam_id')->constrained('rekam_medis', 'rekam_id')->onDelete('cascade');
            $table->foreignId('obat_id')->nullable()->constrained('obat', 'obat_id')->onDelete('set null');
            $table->string('nama_obat_manual', 200)->nullable();
            $table->string('dosis', 50)->nullable();
            $table->string('aturan_pakai', 100)->nullable();
            $table->integer('jumlah')->nullable();
            $table->string('catatan_resep', 255)->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('resep');
    }
};
