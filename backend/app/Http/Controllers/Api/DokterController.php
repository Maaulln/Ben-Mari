<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Antrian;
use App\Models\Dokter;
use App\Models\Appointment;
use App\Models\JadwalDokter;
use App\Models\Pasien;
use App\Models\RekamMedis;
use App\Models\SesiPraktik;
use Carbon\Carbon;
use Illuminate\Http\Request;

class DokterController extends Controller
{
    public function index()
    {
        return response()->json(Dokter::all());
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'nama_dokter'       => 'required',
            'spesialisasi'      => 'required',
            'no_sip'            => 'required|unique:dokter,no_sip',
            'no_telepon'        => 'required',
            'email'             => 'nullable|email|unique:dokter,email',
            'jadwal_praktik'    => 'nullable',
            'biaya_konsultasi'  => 'required|numeric',
            'status_aktif'      => 'nullable|in:Y,N',
            'password'          => 'required|min:8',
        ]);

        $dokter = Dokter::create(
            collect($validated)
                ->except('password')
                ->toArray()
        );

        // Buat user untuk login
        \App\Models\User::create([
            'nama'         => $validated['nama_dokter'],
            'email'        => $validated['email'],
            'password'     => \Illuminate\Support\Facades\Hash::make(
                $validated['password']
            ),
            'role'         => 'dokter',
            'reference_id' => $dokter->dokter_id,
        ]);

        return response()->json($dokter, 201);
    }

    public function show($id)
    {
        $dokter = Dokter::findOrFail($id);

        return response()->json($dokter);
    }

    public function update(Request $request, $id)
    {
        $dokter = Dokter::findOrFail($id);

        $validated = $request->validate([
            'nama_dokter'       => 'sometimes|required',
            'spesialisasi'      => 'sometimes|required',
            'no_sip'            => 'sometimes|required|unique:dokter,no_sip,' . $id . ',dokter_id',
            'no_telepon'        => 'sometimes|required',
            'email'             => 'sometimes|nullable|email|unique:dokter,email,' . $id . ',dokter_id',
            'jadwal_praktik'    => 'nullable',
            'biaya_konsultasi'  => 'sometimes|required|numeric',
            'status_aktif'      => 'nullable|in:Y,N',
        ]);

        $dokter->update($validated);

        return response()->json($dokter);
    }

    public function destroy($id)
    {
        $dokter = Dokter::findOrFail($id);

        $dokter->delete();

        return response()->json([
            'message' => 'Dokter deleted successfully'
        ]);
    }

    // Slot jam dokter — generate dari jam sesi_praktik yang admin set
    public function slotJam($dokterId, Request $request)
    {
        $tanggal = $request->query('tanggal', now()->toDateString());

        $sesiList = SesiPraktik::where('dokter_id', $dokterId)
            ->whereDate('tanggal', $tanggal)
            ->whereIn('status', ['BUKA', 'PENUH'])
            ->orderBy('jam_mulai')
            ->get();

        if ($sesiList->isEmpty()) {
            return response()->json([]);
        }

        $slots = [];

        foreach ($sesiList as $sesi) {
            $mulai    = Carbon::parse($sesi->jam_mulai);
            $selesai  = Carbon::parse($sesi->jam_selesai);
            $tersedia = $sesi->status === 'BUKA' && $sesi->terisi < $sesi->kuota;

            $current = $mulai->copy();
            while ($current < $selesai) {
                $slots[] = [
                    'sesi_id'  => $sesi->sesi_id,
                    'sesi'     => $sesi->sesi,
                    'jam'      => $current->format('H:i'),
                    'tersedia' => $tersedia,
                ];
                $current->addHour();
            }
        }

        return response()->json($slots);
    }

    // Estimasi jam masuk ruangan untuk nomor antrian tertentu
    public function estimasiMasuk(int $dokterId, Request $request)
    {
        $validated = $request->validate([
            'tanggal' => 'nullable|date',
            'nomor_antrian' => 'required|integer|min:1',
        ]);

        $tanggal = $validated['tanggal'] ?? now()->toDateString();
        $nomorTarget = (int) $validated['nomor_antrian'];

        $now = Carbon::now();
        $isToday = $tanggal === $now->toDateString();

        $baseQuery = Antrian::where('dokter_id', $dokterId)
            ->whereDate('tanggal', $tanggal)
            ->where('status', '!=', 'BATAL');

        // Ambil rata-rata durasi per pasien dari antrian yang sudah selesai
        $durations = (clone $baseQuery)
            ->where('status', 'SELESAI')
            ->whereNotNull('waktu_dipanggil')
            ->whereNotNull('waktu_selesai')
            ->orderBy('waktu_selesai', 'desc')
            ->limit(5)
            ->get()
            ->map(function ($row) {
                return Carbon::parse($row->waktu_dipanggil)->diffInMinutes(Carbon::parse($row->waktu_selesai));
            });

        $defaultMenit = 20;
        $avgMenit = (int) round($durations->avg() ?: $defaultMenit);
        // Minimal 20 menit (atau lebih jika histori pemeriksaan lebih lama)
        $avgMenit = max($defaultMenit, min(60, $avgMenit));

        $current = (clone $baseQuery)
            ->where('status', 'DIPANGGIL')
            ->orderBy('waktu_dipanggil', 'desc')
            ->orderBy('updated_at', 'desc')
            ->first();

        $anchorNomor = 0;
        $anchorType = 'JADWAL';
        $anchorTime = null;

        if ($current) {
            $anchorNomor = (int) $current->nomor_antrian;
            $start = $current->waktu_dipanggil
                ? Carbon::parse($current->waktu_dipanggil)
                : Carbon::parse($current->updated_at);

            $finishEst = $start->copy()->addMinutes($avgMenit);
            if ($isToday && $now->gt($finishEst)) {
                $finishEst = $now;
            }

            $anchorType = 'DIPANGGIL';
            $anchorTime = $finishEst;
        } else {
            $lastDone = (clone $baseQuery)
                ->where('status', 'SELESAI')
                ->orderBy('waktu_selesai', 'desc')
                ->orderBy('updated_at', 'desc')
                ->first();

            if ($lastDone) {
                $anchorNomor = (int) $lastDone->nomor_antrian;
                $doneTime = $lastDone->waktu_selesai
                    ? Carbon::parse($lastDone->waktu_selesai)
                    : Carbon::parse($lastDone->updated_at);

                $anchorType = 'SELESAI';
                $anchorTime = $doneTime;
                if ($isToday && $now->gt($anchorTime)) {
                    $anchorTime = $now;
                }
            }
        }

        if (!$anchorTime) {
            $jamMulai = SesiPraktik::where('dokter_id', $dokterId)
                ->whereDate('tanggal', $tanggal)
                ->whereIn('status', ['BUKA', 'PENUH'])
                ->orderBy('jam_mulai')
                ->value('jam_mulai');

            $jamMulai = $jamMulai ?: '08:00';
            $anchorTime = Carbon::parse($tanggal . ' ' . $jamMulai);
            if ($isToday && $now->gt($anchorTime)) {
                $anchorTime = $now;
            }
        }

        $hasTarget = Antrian::where('dokter_id', $dokterId)
            ->whereDate('tanggal', $tanggal)
            ->where('nomor_antrian', $nomorTarget)
            ->exists();

        if ($nomorTarget <= $anchorNomor) {
            $estimasi = $isToday ? $now : $anchorTime;
        } else {
            if ($hasTarget) {
                $remainingCount = (clone $baseQuery)
                    ->whereIn('status', ['MENUNGGU', 'DIPANGGIL'])
                    ->where('nomor_antrian', '>', $anchorNomor)
                    ->where('nomor_antrian', '<', $nomorTarget)
                    ->count();
            } else {
                // Fallback: jika nomor target belum ada di tabel antrian, pakai selisih nomor
                $remainingCount = max(0, $nomorTarget - $anchorNomor - 1);
            }

            $estimasi = $anchorTime->copy()->addMinutes($remainingCount * $avgMenit);
            if ($isToday && $now->gt($estimasi)) {
                $estimasi = $now;
            }
        }

        $menungguMenit = $estimasi->gt($now) ? $now->diffInMinutes($estimasi) : 0;

        return response()->json([
            'status' => 'success',
            'data' => [
                'dokter_id' => (int) $dokterId,
                'tanggal' => $tanggal,
                'nomor_antrian' => $nomorTarget,
                'avg_durasi_menit' => $avgMenit,
                'estimasi_masuk' => $estimasi->toIso8601String(),
                'jam_estimasi_masuk' => $estimasi->format('H:i'),
                'estimasi_menunggu_menit' => $menungguMenit,
                'anchor' => [
                    'type' => $anchorType,
                    'nomor_antrian' => $anchorNomor ?: null,
                    'waktu' => $anchorTime->toIso8601String(),
                ],
            ],
        ]);
    }

    // Dashboard statistik dokter
    public function dashboardStats($dokterId)
    {
        $today = now()->toDateString();

        // Appointment hari ini
        $appointmentHariIni = Appointment::where(
            'dokter_id',
            $dokterId
        )
            ->whereDate(
                'tgl_appointment',
                $today
            )
            ->count();

        // Jumlah pasien bulan ini
        $pasienBulanIni = Appointment::where(
            'dokter_id',
            $dokterId
        )
            ->whereMonth(
                'tgl_appointment',
                now()->month
            )
            ->whereYear(
                'tgl_appointment',
                now()->year
            )
            ->distinct('pasien_id')
            ->count('pasien_id');

        // Rekam medis bulan ini
        $rekamMedisDibuat = RekamMedis::where(
            'dokter_id',
            $dokterId
        )
            ->whereMonth(
                'tgl_periksa',
                now()->month
            )
            ->whereYear(
                'tgl_periksa',
                now()->year
            )
            ->count();

        // Appointment menunggu
        $appointmentMenunggu = Appointment::where(
            'dokter_id',
            $dokterId
        )
            ->where(
                'status',
                'MENUNGGU'
            )
            ->count();

        return response()->json([
            'appointmentHariIni' =>
                $appointmentHariIni,

            'pasienBulanIni' =>
                $pasienBulanIni,

            'rekamMedisDibuat' =>
                $rekamMedisDibuat,

            'appointmentMenunggu' =>
                $appointmentMenunggu,
        ]);
    }

    // Jadwal mingguan dokter (JadwalDokter)
    public function jadwal(int $dokterId)
    {
        $jadwal = JadwalDokter::where('dokter_id', $dokterId)
            ->where('is_aktif', 1)
            ->orderByRaw("FIELD(hari,'SENIN','SELASA','RABU','KAMIS','JUMAT','SABTU','MINGGU')")
            ->get();

        return response()->json([
            'status' => 'success',
            'data'   => $jadwal,
        ]);
    }

    // List pasien dokter
    public function pasienList($dokterId)
    {
        $pasien = Pasien::whereIn(
            'pasien_id',
            Appointment::where(
                'dokter_id',
                $dokterId
            )->pluck('pasien_id')
        )->get();

        return response()->json($pasien);
    }
}