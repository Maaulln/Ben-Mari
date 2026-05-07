<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Tagihan;
use Illuminate\Http\Request;

class TagihanController extends Controller
{
    public function index()
    {
        return response()->json(Tagihan::with(['pasien', 'appointment'])->get());
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'pasien_id' => 'required|exists:pasien,pasien_id',
            'appointment_id' => 'required|exists:appointment,appointment_id|unique:tagihan,appointment_id',
            'tgl_tagihan' => 'required|date',
            'biaya_konsultasi' => 'required|numeric',
            'biaya_obat' => 'required|numeric',
            'total_biaya' => 'required|numeric',
            'status_bayar' => 'nullable|in:BELUM,LUNAS,CICIL',
        ]);

        $tagihan = Tagihan::create($validated);
        return response()->json($tagihan, 201);
    }

    public function show($id)
    {
        $tagihan = Tagihan::with(['pasien', 'appointment'])->findOrFail($id);
        return response()->json($tagihan);
    }

    public function update(Request $request, $id)
    {
        $tagihan = Tagihan::findOrFail($id);
        $validated = $request->validate([
            'status_bayar' => 'nullable|in:BELUM,LUNAS,CICIL',
            'metode_bayar' => 'nullable',
        ]);

        $tagihan->update($validated);
        return response()->json($tagihan);
    }

    public function destroy($id)
    {
        $tagihan = Tagihan::findOrFail($id);
        $tagihan->delete();
        return response()->json(['message' => 'Tagihan deleted successfully']);
    }
}
