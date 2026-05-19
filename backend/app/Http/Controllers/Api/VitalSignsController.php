<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\VitalSigns;
use Illuminate\Http\Request;

class VitalSignsController extends Controller
{
    public function store(Request $request)
    {
        $validated = $request->validate([
            'appointment_id'   => 'required|exists:appointment,appointment_id',
            'tekanan_darah'    => 'nullable|string|max:20',
            'suhu_tubuh'       => 'nullable|numeric|between:30,45',
            'berat_badan'      => 'nullable|numeric|between:1,300',
            'tinggi_badan'     => 'nullable|numeric|between:30,250',
            'saturasi_oksigen' => 'nullable|integer|between:50,100',
            'catatan_perawat'  => 'nullable|string|max:500',
        ]);

        $vs = VitalSigns::updateOrCreate(
            ['appointment_id' => $validated['appointment_id']],
            $validated
        );

        return response()->json([
            'status' => 'success',
            'data'   => $vs,
        ], 201);
    }

    public function showByAppointment($appointmentId)
    {
        $vs = VitalSigns::where('appointment_id', $appointmentId)->first();

        return response()->json([
            'status' => 'success',
            'data'   => $vs,
        ]);
    }

    public function update(Request $request, $id)
    {
        $vs = VitalSigns::findOrFail($id);

        $validated = $request->validate([
            'tekanan_darah'    => 'nullable|string|max:20',
            'suhu_tubuh'       => 'nullable|numeric|between:30,45',
            'berat_badan'      => 'nullable|numeric|between:1,300',
            'tinggi_badan'     => 'nullable|numeric|between:30,250',
            'saturasi_oksigen' => 'nullable|integer|between:50,100',
            'catatan_perawat'  => 'nullable|string|max:500',
        ]);

        $vs->update($validated);

        return response()->json([
            'status' => 'success',
            'data'   => $vs,
        ]);
    }
}
