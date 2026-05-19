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
            $table->timestamp('batas_hadir')->nullable()->after('catatan');
            $table->timestamp('waktu_checkin')->nullable()->after('batas_hadir');
            $table->string('status_kehadiran', 20)->default('BELUM_CHECKIN')->after('waktu_checkin');
        });

        // Oracle: drop ENUM check constraint lalu ubah ke VARCHAR2
        if (DB::getDriverName() !== 'sqlite') {
            DB::statement("
                BEGIN
                    FOR c IN (
                        SELECT constraint_name
                        FROM all_constraints
                        WHERE table_name = 'APPOINTMENT'
                          AND constraint_type = 'C'
                          AND UPPER(search_condition_vc) LIKE '%STATUS%'
                          AND UPPER(search_condition_vc) NOT LIKE '%IS NOT NULL%'
                    ) LOOP
                        EXECUTE IMMEDIATE 'ALTER TABLE appointment DROP CONSTRAINT ' || c.constraint_name;
                    END LOOP;
                END;
            ");
            DB::statement("ALTER TABLE appointment MODIFY status VARCHAR2(20) DEFAULT 'MENUNGGU'");
        }
    }

    public function down(): void
    {
        Schema::table('appointment', function (Blueprint $table) {
            $table->dropColumn(['batas_hadir', 'waktu_checkin', 'status_kehadiran']);
        });
    }
};
