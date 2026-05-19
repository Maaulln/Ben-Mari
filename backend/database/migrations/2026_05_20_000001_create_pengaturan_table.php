<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('pengaturan', function (Blueprint $table) {
            $table->id();
            $table->string('nama_klinik', 100)->default('Klinik BenMari');
            $table->string('alamat', 255)->default('Jl. Kesehatan No. 123, Surabaya');
            $table->string('no_telepon', 20)->default('(031) 1234567');
            $table->string('email', 100)->default('info@klinikbenmari.com');
            $table->string('jam_operasional', 100)->default('Senin–Jumat: 08:00–17:00');
            $table->text('deskripsi')->nullable();
            $table->timestamps();
        });

        // Insert satu baris default
        DB::table('pengaturan')->insert([
            'nama_klinik'     => 'Klinik BenMari',
            'alamat'          => 'Jl. Kesehatan No. 123, Surabaya',
            'no_telepon'      => '(031) 1234567',
            'email'           => 'info@klinikbenmari.com',
            'jam_operasional' => 'Senin–Jumat: 08:00–17:00',
            'deskripsi'       => 'Klinik BenMari memberikan pelayanan kesehatan terpadu dengan tenaga medis berpengalaman.',
            'created_at'      => now(),
            'updated_at'      => now(),
        ]);
    }

    public function down(): void
    {
        Schema::dropIfExists('pengaturan');
    }
};
