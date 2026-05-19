<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('resep', function (Blueprint $table) {
            $table->string('durasi', 50)->nullable()->after('dosis');
            $table->enum('status_ambil', ['BELUM_DIAMBIL', 'SUDAH_DIAMBIL', 'BATAL'])
                  ->default('BELUM_DIAMBIL')
                  ->after('catatan_resep');
        });
    }

    public function down(): void
    {
        Schema::table('resep', function (Blueprint $table) {
            $table->dropColumn(['durasi', 'status_ambil']);
        });
    }
};
