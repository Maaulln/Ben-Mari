<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Obat;
use Illuminate\Http\Request;

class ObatController extends Controller
{
    public function index()
    {
        return response()->json(Obat::all());
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'nama_obat' => 'required',
            'kategori' => 'required',
            'satuan' => 'required',
            'stok_tersedia' => 'required|integer',
            'harga_satuan' => 'required|numeric',
            'tgl_kadaluarsa' => 'nullable|date',
            'deskripsi' => 'nullable',
            'status_aktif' => 'nullable|in:Y,N',
        ]);

        $obat = Obat::create($validated);
        return response()->json($obat, 201);
    }

    public function show($id)
    {
        $obat = Obat::findOrFail($id);
        return response()->json($obat);
    }

    public function update(Request $request, $id)
    {
        $obat = Obat::findOrFail($id);
        $validated = $request->validate([
            'nama_obat' => 'required',
            'kategori' => 'required',
            'satuan' => 'required',
            'stok_tersedia' => 'required|integer',
            'harga_satuan' => 'required|numeric',
            'tgl_kadaluarsa' => 'nullable|date',
            'deskripsi' => 'nullable',
            'status_aktif' => 'nullable|in:Y,N',
        ]);

        $obat->update($validated);
        return response()->json($obat);
    }

    public function destroy($id)
    {
        $obat = Obat::findOrFail($id);
        $obat->delete();
        return response()->json(['message' => 'Obat deleted successfully']);
    }
}
