<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Appointment;
use Illuminate\Http\Request;

class AppointmentController extends Controller
{
    public function index(Request $request)
    {
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
            'nomor_antrian'   => 'nullable|integer',
            'keluhan_awal'    => 'nullable',
            'status'          => 'nullable|in:MENUNGGU,SELESAI,BATAL',
        ]);

        // Generate nomor antrian otomatis
        $validated['nomor_antrian'] = Appointment::whereDate(
                'tgl_appointment',
                $validated['tgl_appointment']
            )
            ->where('dokter_id', $validated['dokter_id'])
            ->count() + 1;

        // Default status
        $validated['status'] = $validated['status'] ?? 'MENUNGGU';

        $appointment = Appointment::create($validated);

        return response()->json($appointment, 201);
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
            'status'          => 'nullable|in:MENUNGGU,SELESAI,BATAL',
            'catatan'         => 'nullable',
            'jam_appointment' => 'nullable',
            'tgl_appointment' => 'nullable|date',
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

    // Appointment terdekat pasien
    public function terdekat($pasienId)
    {
        $appointment = Appointment::with(['dokter'])
            ->where('pasien_id', $pasienId)
            ->where('status', 'MENUNGGU')
            ->whereDate('tgl_appointment', '>=', now()->toDateString())
            ->orderBy('tgl_appointment', 'asc')
            ->orderBy('jam_appointment', 'asc')
            ->first();

        return response()->json($appointment);
    }
}
