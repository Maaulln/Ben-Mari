<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('tagihan_detail', function (Blueprint $table) {
            $table->id('detail_id');
            $table->foreignId('tagihan_id')->constrained('tagihan', 'tagihan_id')->onDelete('cascade');
            $table->string('keterangan', 200);
            $table->unsignedInteger('jumlah');
            $table->decimal('harga_satuan', 12, 2);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('tagihan_detail');
    }
};
