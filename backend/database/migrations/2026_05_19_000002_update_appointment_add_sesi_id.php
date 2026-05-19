<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('appointment', function (Blueprint $table) {
            $table->unsignedBigInteger('sesi_id')->nullable()->after('dokter_id');
            $table->foreign('sesi_id')->references('sesi_id')->on('sesi_praktik')->nullOnDelete();
        });

        // Oracle: make jam_appointment nullable via raw SQL (avoids doctrine/dbal)
        DB::statement("ALTER TABLE appointment MODIFY jam_appointment NULL");
    }

    public function down(): void
    {
        Schema::table('appointment', function (Blueprint $table) {
            $table->dropForeign(['sesi_id']);
            $table->dropColumn('sesi_id');
        });

        DB::statement("ALTER TABLE appointment MODIFY jam_appointment VARCHAR2(5) NOT NULL");
    }
};
