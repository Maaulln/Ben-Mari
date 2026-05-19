<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Dokter;
use App\Models\Appointment;
use App\Models\Pasien;
use App\Models\RekamMedis;
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
            'nama_dokter'       => 'required',
            'spesialisasi'      => 'required',
            'no_sip'            => 'required|unique:dokter,no_sip,' . $id . ',dokter_id',
            'no_telepon'        => 'required',
            'email'             => 'nullable|email|unique:dokter,email,' . $id . ',dokter_id',
            'jadwal_praktik'    => 'nullable',
            'biaya_konsultasi'  => 'required|numeric',
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

    // Slot jam dokter
    public function slotJam($dokterId, Request $request)
    {
        $tanggal = $request->query(
            'tanggal',
            now()->toDateString()
        );

        $jamTersedia = [
            '08:00',
            '09:00',
            '10:00',
            '11:00',
            '13:00',
            '14:00',
            '15:00',
            '16:00'
        ];

        $jamTerpakai = Appointment::where(
            'dokter_id',
            $dokterId
        )
            ->whereDate(
                'tgl_appointment',
                $tanggal
            )
            ->where(
                'status',
                '!=',
                'BATAL'
            )
            ->pluck('jam_appointment')
            ->toArray();

        $slots = array_map(
            function ($jam) use (
                $jamTerpakai
            ) {
                return [
                    'jam'       => $jam,
                    'tersedia'  => !in_array(
                        $jam,
                        $jamTerpakai
                    )
                ];
            },
            $jamTersedia
        );

        return response()->json($slots);
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