<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Appointment;
use App\Models\Tagihan;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class LaporanController extends Controller
{
    public function kunjungan(Request $request)
    {
        $periode = $request->query('periode', 'harian');
        $tanggal = $request->query('tanggal', now()->toDateString());
        $bulan   = $request->query('bulan', now()->month);
        $tahun   = $request->query('tahun', now()->year);

        $query = Appointment::with(['pasien', 'dokter'])
            ->whereIn('status', ['SELESAI', 'HADIR']);

        if ($periode === 'harian') {
            $query->whereDate('tgl_appointment', $tanggal);
        } else {
            $query->whereMonth('tgl_appointment', $bulan)
                  ->whereYear('tgl_appointment', $tahun);
        }

        $appointments = $query->get();

        return response()->json([
            'status' => 'success',
            'data'   => [
                'periode'     => $periode,
                'total'       => $appointments->count(),
                'kunjungan'   => $appointments,
            ],
        ]);
    }

    public function pendapatan(Request $request)
    {
        $periode = $request->query('periode', 'harian');
        $tanggal = $request->query('tanggal', now()->toDateString());
        $bulan   = $request->query('bulan', now()->month);
        $tahun   = $request->query('tahun', now()->year);

        $query = Tagihan::with(['pasien', 'appointment.dokter'])
            ->whereIn('status_bayar', ['SEBAGIAN', 'LUNAS']);

        if ($periode === 'harian') {
            $query->whereDate('tgl_tagihan', $tanggal);
        } else {
            $query->whereMonth('tgl_tagihan', $bulan)
                  ->whereYear('tgl_tagihan', $tahun);
        }

        $tagihans       = $query->get();
        $totalPendapatan = $tagihans->sum('total_biaya');

        return response()->json([
            'status' => 'success',
            'data'   => [
                'periode'          => $periode,
                'total_pendapatan' => $totalPendapatan,
                'jumlah_tagihan'   => $tagihans->count(),
                'tagihan'          => $tagihans,
            ],
        ]);
    }
}
