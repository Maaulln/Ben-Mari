<?php

namespace App\Console\Commands;

use App\Models\Appointment;
use Carbon\Carbon;
use Illuminate\Console\Command;

class ExpireAppointments extends Command
{
    protected $signature   = 'appointment:expire';
    protected $description = 'Tandai appointment MENUNGGU/DIKONFIRMASI yang sudah melewati tanggalnya menjadi ABSEN';

    public function handle(): int
    {
        $today = Carbon::today()->toDateString();

        $expired = Appointment::whereIn('status', ['MENUNGGU', 'DIKONFIRMASI'])
            ->whereDate('tgl_appointment', '<', $today)
            ->get();

        if ($expired->isEmpty()) {
            $this->info('Tidak ada appointment yang perlu di-expire.');
            return self::SUCCESS;
        }

        foreach ($expired as $apt) {
            $apt->update([
                'status'          => 'ABSEN',
                'status_kehadiran'=> 'BELUM_CHECKIN',
            ]);
        }

        $this->info("Berhasil expire {$expired->count()} appointment.");
        return self::SUCCESS;
    }
}
