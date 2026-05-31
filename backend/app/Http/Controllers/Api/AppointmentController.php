<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Antrian;
use App\Models\Appointment;
use App\Models\SesiPraktik;
use Carbon\Carbon;
use Illuminate\Http\Request;

class AppointmentController extends Controller
{
    private function expirePastAppointments(): void
    {
        Appointment::whereIn('status', ['MENUNGGU', 'DIKONFIRMASI'])
            ->whereDate('tgl_appointment', '<', Carbon::today()->toDateString())
            ->update([
                'status'           => 'ABSEN',
                'status_kehadiran' => 'BELUM_CHECKIN',
            ]);
    }

    public function index(Request $request)
    {
        // Expire appointment yang sudah lewat sebelum query dijalankan
        $this->expirePastAppointments();

        $query = Appointment::with(['pasien', 'dokter']);

        // Filter status
        if ($request->has('status') && $request->status) {
            $query->where('status', $request->status);
        }

        // Filter dokter
        if ($request->has('dokter_id') && $request->dokter_id) {
            $query->where('dokter_id', $request->dokter_id);
        }

        // Filter pasien
        if ($request->has('pasien_id') && $request->pasien_id) {
            $query->where('pasien_id', $request->pasien_id);
        }

        // Filter tanggal
        if ($request->has('tanggal') && $request->tanggal) {
            $query->whereDate('tgl_appointment', $request->tanggal);
        }

        // Urutkan data
        $query->orderBy('tgl_appointment', 'asc')
              ->orderBy('jam_appointment', 'asc');

        return response()->json($query->get());
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'pasien_id'       => 'required|exists:pasien,pasien_id',
            'dokter_id'       => 'required|exists:dokter,dokter_id',
            'tgl_appointment' => 'required|date',
            'jam_appointment' => 'required',
            'sesi_id'         => 'nullable|exists:sesi_praktik,sesi_id',
            'nomor_antrian'   => 'nullable|integer',
            'keluhan_awal'    => 'nullable',
            'status'          => 'nullable|in:MENUNGGU,DIKONFIRMASI,HADIR,SELESAI,BATAL,ABSEN',
        ]);

        // Validasi konflik waktu — minimal jarak 30 menit dari appointment lain
        $jamTarget = Carbon::parse(
            $validated['tgl_appointment'] . ' ' . substr($validated['jam_appointment'], 0, 5)
        );

        $bookedJams = Appointment::where('dokter_id', $validated['dokter_id'])
            ->whereDate('tgl_appointment', $validated['tgl_appointment'])
            ->whereNotIn('status', ['BATAL', 'ABSEN'])
            ->pluck('jam_appointment')
            ->map(fn($j) => Carbon::parse(
                $validated['tgl_appointment'] . ' ' . substr($j, 0, 5)
            ));

        foreach ($bookedJams as $bookedTime) {
            if (abs($jamTarget->diffInMinutes($bookedTime)) < 30) {
                return response()->json([
                    'status'  => 'error',
                    'message' => 'Jam ini sudah dipesan atau terlalu dekat dengan appointment lain. Pilih jam lain (minimal jarak 30 menit).',
                ], 422);
            }
        }

        // Generate nomor antrian otomatis
        $validated['nomor_antrian'] = Appointment::whereDate(
                'tgl_appointment',
                $validated['tgl_appointment']
            )
            ->where('dokter_id', $validated['dokter_id'])
            ->count() + 1;

        // Default status
        $validated['status'] = $validated['status'] ?? 'MENUNGGU';

        // Hitung batas_hadir = tanggal_jam + 15 menit grace period
        $tanggalJam = Carbon::parse(
            $validated['tgl_appointment'] . ' ' . $validated['jam_appointment']
        );
        $validated['batas_hadir'] = $tanggalJam->addMinutes(15);

        $appointment = Appointment::create($validated);

        // Update jumlah terisi di sesi_praktik
        if (!empty($validated['sesi_id'])) {
            SesiPraktik::where('sesi_id', $validated['sesi_id'])->increment('terisi');
        }

        return response()->json([
            'status' => 'success',
            'data'   => $appointment,
        ], 201);
    }

    public function show($id)
    {
        $appointment = Appointment::with(['pasien', 'dokter'])
            ->findOrFail($id);

        return response()->json($appointment);
    }

    public function update(Request $request, $id)
    {
        $appointment = Appointment::findOrFail($id);

        $validated = $request->validate([
            'status'           => 'nullable|in:MENUNGGU,DIKONFIRMASI,HADIR,SELESAI,BATAL,ABSEN',
            'catatan'          => 'nullable',
            'jam_appointment'  => 'nullable',
            'tgl_appointment'  => 'nullable|date',
            'status_kehadiran' => 'nullable|in:BELUM_CHECKIN,ON_TIME,TERLAMBAT',
        ]);

        $appointment->update($validated);

        return response()->json($appointment);
    }

    public function destroy($id)
    {
        $appointment = Appointment::findOrFail($id);

        $appointment->delete();

        return response()->json([
            'message' => 'Appointment deleted successfully'
        ]);
    }

    // Check-in pasien ke klinik — menentukan ON_TIME/TERLAMBAT dan buat antrian
    public function checkin(Request $request, int $id)
    {
        $appointment = Appointment::with(['pasien', 'dokter'])->findOrFail($id);

        if (!in_array($appointment->status, ['MENUNGGU', 'DIKONFIRMASI'])) {
            return response()->json([
                'status'  => 'error',
                'message' => 'Appointment tidak dalam status yang dapat check-in.',
            ], 422);
        }

        $waktuCheckin = Carbon::now();
        $appointment->waktu_checkin = $waktuCheckin;
        $appointment->status        = 'HADIR';

        // Tentukan status kehadiran berdasarkan batas_hadir
        if ($appointment->batas_hadir && $waktuCheckin->gt($appointment->batas_hadir)) {
            $appointment->status_kehadiran = 'TERLAMBAT';
        } else {
            $appointment->status_kehadiran = 'ON_TIME';
        }

        $appointment->save();

        // Buat antrian — TERLAMBAT digeser ke belakang semua ON_TIME
        $tanggal = $appointment->tgl_appointment->toDateString();

        if ($appointment->status_kehadiran === 'ON_TIME') {
            // Nomor setelah semua ON_TIME yang sudah ada
            $lastOnTime = Antrian::whereDate('tanggal', $tanggal)
                ->where('dokter_id', $appointment->dokter_id)
                ->where('jenis', 'BOOKING')
                ->where('status', '!=', 'BATAL')
                ->count();
            $nomor = $lastOnTime + 1;
        } else {
            // Nomor paling belakang
            $nomor = Antrian::whereDate('tanggal', $tanggal)
                ->where('dokter_id', $appointment->dokter_id)
                ->where('status', '!=', 'BATAL')
                ->count() + 1;
        }

        $antrian = Antrian::create([
            'pasien_id'      => $appointment->pasien_id,
            'dokter_id'      => $appointment->dokter_id,
            'appointment_id' => $appointment->appointment_id,
            'nomor_antrian'  => $nomor,
            'tanggal'        => $tanggal,
            'status'         => 'MENUNGGU',
            'jenis'          => 'BOOKING',
        ]);

        return response()->json([
            'status'           => 'success',
            'status_kehadiran' => $appointment->status_kehadiran,
            'nomor_antrian'    => $antrian->nomor_antrian,
            'appointment'      => $appointment,
        ]);
    }

    // Appointment terdekat pasien
    public function terdekat($pasienId)
    {
        $this->expirePastAppointments();

        $appointment = Appointment::with(['dokter'])
            ->where('pasien_id', $pasienId)
            ->whereIn('status', ['MENUNGGU', 'DIKONFIRMASI'])
            ->whereDate('tgl_appointment', '>=', now()->toDateString())
            ->orderBy('tgl_appointment', 'asc')
            ->orderBy('jam_appointment', 'asc')
            ->first();

        return response()->json($appointment);
    }
}
