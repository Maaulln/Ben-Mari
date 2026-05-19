<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\JadwalDokter;
use Illuminate\Http\Request;

class JadwalDokterController extends Controller
{
    public function index(Request $request)
    {
        $query = JadwalDokter::with('dokter');

        if ($request->filled('dokter_id')) {
            $query->where('dokter_id', $request->dokter_id);
        }

        if ($request->filled('hari')) {
            $query->where('hari', strtoupper($request->hari));
        }

        if ($request->has('is_aktif')) {
            $query->where('is_aktif', $request->boolean('is_aktif') ? 1 : 0);
        }

        return response()->json([
            'status' => 'success',
            'data'   => $query->get(),
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'dokter_id'   => 'required|exists:dokter,dokter_id',
            'hari'        => 'required|in:SENIN,SELASA,RABU,KAMIS,JUMAT,SABTU,MINGGU',
            'jam_mulai'   => 'required|date_format:H:i',
            'jam_selesai' => 'required|date_format:H:i|after:jam_mulai',
            'kuota'       => 'nullable|integer|min:1|max:200',
            'is_aktif'    => 'nullable|integer|in:0,1',
        ]);

        $jadwal = JadwalDokter::create($validated);

        return response()->json([
            'status' => 'success',
            'data'   => $jadwal->load('dokter'),
        ], 201);
    }

    public function show($id)
    {
        $jadwal = JadwalDokter::with('dokter')->findOrFail($id);

        return response()->json([
            'status' => 'success',
            'data'   => $jadwal,
        ]);
    }

    public function update(Request $request, $id)
    {
        $jadwal = JadwalDokter::findOrFail($id);

        $validated = $request->validate([
            'hari'        => 'sometimes|in:SENIN,SELASA,RABU,KAMIS,JUMAT,SABTU,MINGGU',
            'jam_mulai'   => 'sometimes|date_format:H:i',
            'jam_selesai' => 'sometimes|date_format:H:i',
            'kuota'       => 'nullable|integer|min:1|max:200',
            'is_aktif'    => 'nullable|integer|in:0,1',
        ]);

        $jadwal->update($validated);

        return response()->json([
            'status' => 'success',
            'data'   => $jadwal,
        ]);
    }

    public function destroy($id)
    {
        $jadwal = JadwalDokter::findOrFail($id);
        $jadwal->delete();

        return response()->json([
            'status'  => 'success',
            'message' => 'Jadwal berhasil dihapus.',
        ]);
    }
}
