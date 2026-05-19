<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        // Rename existing values: CICIL -> SEBAGIAN, BELUM -> BELUM_BAYAR
        DB::statement("UPDATE tagihan SET status_bayar = 'SEBAGIAN' WHERE status_bayar = 'CICIL'");
        DB::statement("UPDATE tagihan SET status_bayar = 'BELUM_BAYAR' WHERE status_bayar = 'BELUM'");

        // Oracle: drop ENUM check constraint before modifying column type
        if (DB::getDriverName() !== 'sqlite') {
            DB::statement("
                BEGIN
                    FOR c IN (
                        SELECT constraint_name
                        FROM all_constraints
                        WHERE table_name = 'TAGIHAN'
                          AND constraint_type = 'C'
                          AND UPPER(search_condition_vc) LIKE '%STATUS_BAYAR%'
                    ) LOOP
                        EXECUTE IMMEDIATE 'ALTER TABLE tagihan DROP CONSTRAINT ' || c.constraint_name;
                    END LOOP;
                END;
            ");
            DB::statement("ALTER TABLE tagihan MODIFY status_bayar VARCHAR2(20) DEFAULT 'BELUM_BAYAR'");
        }

        Schema::table('tagihan', function (Blueprint $table) {
            $table->string('keterangan', 500)->nullable()->after('status_bayar');
        });
    }

    public function down(): void
    {
        DB::statement("UPDATE tagihan SET status_bayar = 'CICIL' WHERE status_bayar = 'SEBAGIAN'");
        DB::statement("UPDATE tagihan SET status_bayar = 'BELUM' WHERE status_bayar = 'BELUM_BAYAR'");

        if (DB::getDriverName() !== 'sqlite') {
            DB::statement("ALTER TABLE tagihan MODIFY status_bayar ENUM('BELUM','LUNAS','CICIL') DEFAULT 'BELUM'");
        }

        Schema::table('tagihan', function (Blueprint $table) {
            $table->dropColumn('keterangan');
        });
    }
};
