<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('stok_obat_log', function (Blueprint $table) {
            $table->id('log_id');
            $table->foreignId('obat_id')->constrained('obat', 'obat_id');
            $table->enum('tipe', ['MASUK', 'KELUAR']);
            $table->unsignedInteger('jumlah');
            $table->string('keterangan', 200)->nullable();
            $table->foreignId('created_by')->nullable()->constrained('users', 'id')->nullOnDelete();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('stok_obat_log');
    }
};
