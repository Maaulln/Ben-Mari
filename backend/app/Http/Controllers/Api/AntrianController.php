<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Antrian;
use Illuminate\Http\Request;

class AntrianController extends Controller
{
    public function index(Request $request)
    {
        $query = Antrian::with(['pasien', 'dokter', 'appointment']);

        if ($request->filled('dokter_id')) {
            $query->where('dokter_id', $request->dokter_id);
        }

        if ($request->filled('tanggal')) {
            $query->whereDate('tanggal', $request->tanggal);
        } else {
            $query->whereDate('tanggal', now()->toDateString());
        }

        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        $query->orderBy('jenis', 'asc')
              ->orderBy('nomor_antrian', 'asc');

        return response()->json([
            'status' => 'success',
            'data'   => $query->get(),
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'pasien_id'      => 'required|exists:pasien,pasien_id',
            'dokter_id'      => 'required|exists:dokter,dokter_id',
            'appointment_id' => 'nullable|exists:appointment,appointment_id',
            'tanggal'        => 'nullable|date',
            'jenis'          => 'nullable|in:WALKIN,BOOKING',
        ]);

        $tanggal = $validated['tanggal'] ?? now()->toDateString();
        $jenis   = $validated['jenis']   ?? 'WALKIN';

        // Nomor antrian: urutan berdasarkan jenis
        $nomorAntrian = Antrian::whereDate('tanggal', $tanggal)
            ->where('dokter_id', $validated['dokter_id'])
            ->count() + 1;

        $antrian = Antrian::create([
            'pasien_id'      => $validated['pasien_id'],
            'dokter_id'      => $validated['dokter_id'],
            'appointment_id' => $validated['appointment_id'] ?? null,
            'nomor_antrian'  => $nomorAntrian,
            'tanggal'        => $tanggal,
            'status'         => 'MENUNGGU',
            'jenis'          => $jenis,
        ]);

        return response()->json([
            'status' => 'success',
            'data'   => $antrian->load(['pasien', 'dokter']),
        ], 201);
    }

    public function show($id)
    {
        $antrian = Antrian::with(['pasien', 'dokter', 'appointment'])->findOrFail($id);

        return response()->json([
            'status' => 'success',
            'data'   => $antrian,
        ]);
    }

    public function updateStatus(Request $request, $id)
    {
        $antrian = Antrian::findOrFail($id);

        $validated = $request->validate([
            'status' => 'required|in:MENUNGGU,DIPANGGIL,SELESAI,BATAL',
        ]);

        $antrian->update($validated);

        return response()->json([
            'status' => 'success',
            'data'   => $antrian,
        ]);
    }

    public function destroy($id)
    {
        $antrian = Antrian::findOrFail($id);
        $antrian->delete();

        return response()->json([
            'status'  => 'success',
            'message' => 'Antrian berhasil dihapus.',
        ]);
    }
}
