<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\SesiPraktik;
use Illuminate\Http\Request;

class SesiPraktikController extends Controller
{
    public function index(Request $request)
    {
        $query = SesiPraktik::with('dokter');

        if ($request->filled('dokter_id')) {
            $query->where('dokter_id', $request->dokter_id);
        }

        if ($request->filled('tanggal')) {
            $query->whereDate('tanggal', $request->tanggal);
        }

        if ($request->filled('tanggal_dari')) {
            $query->whereDate('tanggal', '>=', $request->tanggal_dari);
        }

        if ($request->filled('tanggal_sampai')) {
            $query->whereDate('tanggal', '<=', $request->tanggal_sampai);
        }

        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        // Hanya sesi yang masih bisa dibook
        if ($request->boolean('tersedia')) {
            $query->where('status', 'BUKA')
                  ->whereColumn('terisi', '<', 'kuota');
        }

        $query->orderBy('tanggal')->orderBy('jam_mulai');

        return response()->json($query->get());
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'dokter_id'   => 'required|exists:dokter,dokter_id',
            'tanggal'     => 'required|date|after_or_equal:today',
            'sesi'        => 'required|in:PAGI,SIANG,SORE,MALAM',
            'jam_mulai'   => 'required|date_format:H:i',
            'jam_selesai' => 'required|date_format:H:i|after:jam_mulai',
            'kuota'       => 'required|integer|min:1|max:100',
            'status'      => 'nullable|in:BUKA,TUTUP,LIBUR',
            'catatan'     => 'nullable|string|max:255',
        ]);

        $validated['status'] = $validated['status'] ?? 'BUKA';
        $validated['terisi'] = 0;

        $sesi = SesiPraktik::create($validated);

        return response()->json($sesi->load('dokter'), 201);
    }

    public function show($id)
    {
        $sesi = SesiPraktik::with(['dokter', 'appointments.pasien'])
            ->findOrFail($id);

        return response()->json($sesi);
    }

    public function update(Request $request, $id)
    {
        $sesi = SesiPraktik::findOrFail($id);

        $validated = $request->validate([
            'tanggal'     => 'sometimes|date',
            'sesi'        => 'sometimes|in:PAGI,SIANG,SORE,MALAM',
            'jam_mulai'   => 'sometimes|date_format:H:i',
            'jam_selesai' => 'sometimes|date_format:H:i',
            'kuota'       => 'sometimes|integer|min:1|max:100',
            'status'      => 'sometimes|in:BUKA,PENUH,TUTUP,LIBUR',
            'catatan'     => 'nullable|string|max:255',
        ]);

        // Kuota tidak boleh lebih kecil dari yang sudah terisi
        if (isset($validated['kuota']) && $validated['kuota'] < $sesi->terisi) {
            return response()->json([
                'message' => "Kuota tidak boleh lebih kecil dari jumlah pasien yang sudah terdaftar ({$sesi->terisi}).",
            ], 422);
        }

        $sesi->update($validated);

        // Sinkronkan status PENUH otomatis setelah update kuota
        if (isset($validated['kuota'])) {
            if ($sesi->terisi >= $sesi->kuota) {
                $sesi->update(['status' => 'PENUH']);
            } elseif ($sesi->status === 'PENUH') {
                $sesi->update(['status' => 'BUKA']);
            }
        }

        return response()->json($sesi->fresh('dokter'));
    }

    public function destroy($id)
    {
        $sesi = SesiPraktik::withCount('appointments')->findOrFail($id);

        if ($sesi->appointments_count > 0) {
            return response()->json([
                'message' => 'Sesi tidak dapat dihapus karena sudah memiliki appointment terdaftar.',
            ], 422);
        }

        $sesi->delete();

        return response()->json(['message' => 'Sesi berhasil dihapus.']);
    }
}
