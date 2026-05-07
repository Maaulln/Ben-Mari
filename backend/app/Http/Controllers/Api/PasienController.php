<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Pasien;
use Illuminate\Http\Request;

class PasienController extends Controller
{
    public function index()
    {
        return response()->json(Pasien::all());
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'nik' => 'required|unique:pasien,nik',
            'nama_lengkap' => 'required',
            'tanggal_lahir' => 'required|date',
            'jenis_kelamin' => 'required|in:L,P',
            'alamat' => 'nullable',
            'no_telepon' => 'required',
            'email' => 'nullable|email|unique:pasien,email',
            'golongan_darah' => 'nullable',
            'status_aktif' => 'nullable|in:Y,N',
        ]);

        $pasien = Pasien::create($validated);
        return response()->json($pasien, 201);
    }

    public function show($id)
    {
        $pasien = Pasien::findOrFail($id);
        return response()->json($pasien);
    }

    public function update(Request $request, $id)
    {
        $pasien = Pasien::findOrFail($id);
        $validated = $request->validate([
            'nik' => 'required|unique:pasien,nik,' . $id . ',pasien_id',
            'nama_lengkap' => 'required',
            'tanggal_lahir' => 'required|date',
            'jenis_kelamin' => 'required|in:L,P',
            'alamat' => 'nullable',
            'no_telepon' => 'required',
            'email' => 'nullable|email|unique:pasien,email,' . $id . ',pasien_id',
            'golongan_darah' => 'nullable',
            'status_aktif' => 'nullable|in:Y,N',
        ]);

        $pasien->update($validated);
        return response()->json($pasien);
    }

    public function destroy($id)
    {
        $pasien = Pasien::findOrFail($id);
        $pasien->delete();
        return response()->json(['message' => 'Pasien deleted successfully']);
    }
}
