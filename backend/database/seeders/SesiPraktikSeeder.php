<?php

namespace Database\Seeders;

use App\Models\Dokter;
use App\Models\SesiPraktik;
use Carbon\Carbon;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class SesiPraktikSeeder extends Seeder
{
    public function run(): void
    {
        DB::statement("ALTER SESSION SET NLS_DATE_FORMAT='YYYY-MM-DD HH24:MI:SS'");
        DB::statement("ALTER SESSION SET NLS_TIMESTAMP_FORMAT='YYYY-MM-DD HH24:MI:SS'");

        $dokters = Dokter::where('status_aktif', 'Y')->get();

        if ($dokters->isEmpty()) {
            $this->command->warn('Tidak ada dokter aktif. Jalankan DatabaseSeeder terlebih dahulu.');
            return;
        }

        $start = Carbon::today();
        $end   = Carbon::create(2030, 12, 31);

        // Sesi yang akan di-generate per hari kerja
        $sesiConfig = [
            [
                'sesi'       => 'PAGI',
                'jam_mulai'  => '08:00',
                'jam_selesai'=> '12:00',
                'kuota'      => 8,
            ],
            [
                'sesi'       => 'SIANG',
                'jam_mulai'  => '13:00',
                'jam_selesai'=> '17:00',
                'kuota'      => 8,
            ],
        ];

        $inserted = 0;
        $skipped  = 0;

        $current = $start->copy();
        while ($current <= $end) {
            // Hanya hari kerja (Senin=1 ... Jumat=5)
            if ($current->isWeekday()) {
                foreach ($dokters as $dokter) {
                    foreach ($sesiConfig as $config) {
                        $exists = SesiPraktik::where('dokter_id', $dokter->dokter_id)
                            ->whereDate('tanggal', $current->toDateString())
                            ->where('sesi', $config['sesi'])
                            ->exists();

                        if ($exists) {
                            $skipped++;
                            continue;
                        }

                        SesiPraktik::create([
                            'dokter_id'    => $dokter->dokter_id,
                            'tanggal'      => $current->toDateString(),
                            'sesi'         => $config['sesi'],
                            'jam_mulai'    => $config['jam_mulai'],
                            'jam_selesai'  => $config['jam_selesai'],
                            'kuota'        => $config['kuota'],
                            'terisi'       => 0,
                            'status'       => 'BUKA',
                        ]);

                        $inserted++;
                    }
                }
            }

            $current->addDay();
        }

        $this->command->info("Sesi praktik berhasil dibuat: {$inserted} record.");
        if ($skipped > 0) {
            $this->command->warn("Dilewati (sudah ada): {$skipped} record.");
        }
    }
}
