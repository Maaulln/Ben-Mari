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
        
        if ($request->has('status')) {
            $query->where('status', $request->status);
        }
        
        if ($request->has('dokter_id')) {
            $query->where('dokter_id', $request->dokter_id);
        }

        if ($request->has('pasien_id')) {
            $query->where('pasien_id', $request->pasien_id);
        }

        return response()->json($query->get());
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'pasien_id' => 'required|exists:pasien,pasien_id',
            'dokter_id' => 'required|exists:dokter,dokter_id',
            'tgl_appointment' => 'required|date',
            'jam_appointment' => 'required',
            'nomor_antrian' => 'required|integer',
            'keluhan_awal' => 'nullable',
            'status' => 'nullable|in:MENUNGGU,SELESAI,BATAL',
        ]);

        $appointment = Appointment::create($validated);
        return response()->json($appointment, 201);
    }

    public function show($id)
    {
        $appointment = Appointment::with(['pasien', 'dokter'])->findOrFail($id);
        return response()->json($appointment);
    }

    public function update(Request $request, $id)
    {
        $appointment = Appointment::findOrFail($id);
        $validated = $request->validate([
            'status' => 'nullable|in:MENUNGGU,SELESAI,BATAL',
            'catatan' => 'nullable',
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
        return response()->json(['message' => 'Appointment deleted successfully']);
    }
}
