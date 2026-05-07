<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('obat', function (Blueprint $table) {
            $table->id('obat_id');
            $table->string('nama_obat', 100);
            $table->string('kategori', 50);
            $table->string('satuan', 20);
            $table->integer('stok_tersedia')->default(0);
            $table->decimal('harga_satuan', 12, 2);
            $table->date('tgl_kadaluarsa')->nullable();
            $table->string('deskripsi', 255)->nullable();
            $table->char('status_aktif', 1)->default('Y');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('obat');
    }
};
