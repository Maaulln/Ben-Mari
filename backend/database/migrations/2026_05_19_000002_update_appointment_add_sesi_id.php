<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('appointment', function (Blueprint $table) {
            $table->foreignId('sesi_id')
                ->nullable()
                ->after('dokter_id')
                ->constrained('sesi_praktik', 'sesi_id')
                ->nullOnDelete();

            // jam_appointment tetap ada untuk backward compat, tapi nullable
            $table->string('jam_appointment', 5)->nullable()->change();
        });
    }

    public function down(): void
    {
        Schema::table('appointment', function (Blueprint $table) {
            $table->dropForeign(['sesi_id']);
            $table->dropColumn('sesi_id');
            $table->string('jam_appointment', 5)->nullable(false)->change();
        });
    }
};
