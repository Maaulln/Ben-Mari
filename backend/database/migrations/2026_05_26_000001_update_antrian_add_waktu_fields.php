<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('antrian', function (Blueprint $table) {
            $table->timestamp('waktu_dipanggil')->nullable();
            $table->timestamp('waktu_selesai')->nullable();
        });
    }

    public function down(): void
    {
        Schema::table('antrian', function (Blueprint $table) {
            $table->dropColumn(['waktu_dipanggil', 'waktu_selesai']);
        });
    }
};
