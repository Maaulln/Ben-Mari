<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('pasien', function (Blueprint $table) {
            $table->id('pasien_id');
            $table->string('nik', 16)->unique();
            $table->string('nama_lengkap', 100);
            $table->date('tanggal_lahir');
            $table->enum('jenis_kelamin', ['L', 'P']);
            $table->string('alamat', 255)->nullable();
            $table->string('no_telepon', 15);
            $table->string('email', 100)->nullable()->unique();
            $table->string('golongan_darah', 3)->nullable();
            $table->char('status_aktif', 1)->default('Y');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('pasien');
    }
};
