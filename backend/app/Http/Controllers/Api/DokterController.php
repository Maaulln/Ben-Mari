<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Dokter;
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
            'nama_dokter' => 'required',
            'spesialisasi' => 'required',
            'no_sip' => 'required|unique:dokter,no_sip',
            'no_telepon' => 'required',
            'email' => 'nullable|email|unique:dokter,email',
            'jadwal_praktik' => 'nullable',
            'biaya_konsultasi' => 'required|numeric',
            'status_aktif' => 'nullable|in:Y,N',
        ]);

        $dokter = Dokter::create($validated);
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
            'nama_dokter' => 'required',
            'spesialisasi' => 'required',
            'no_sip' => 'required|unique:dokter,no_sip,' . $id . ',dokter_id',
            'no_telepon' => 'required',
            'email' => 'nullable|email|unique:dokter,email,' . $id . ',dokter_id',
            'jadwal_praktik' => 'nullable',
            'biaya_konsultasi' => 'required|numeric',
            'status_aktif' => 'nullable|in:Y,N',
        ]);

        $dokter->update($validated);
        return response()->json($dokter);
    }

    public function destroy($id)
    {
        $dokter = Dokter::findOrFail($id);
        $dokter->delete();
        return response()->json(['message' => 'Dokter deleted successfully']);
    }
}
