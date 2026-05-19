<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Pengaturan;
use Illuminate\Http\Request;

class PengaturanController extends Controller
{
    public function show()
    {
        $pengaturan = Pengaturan::first();
        return response()->json(['status' => 'success', 'data' => $pengaturan]);
    }

    public function update(Request $request)
    {
        $validated = $request->validate([
            'nama_klinik'     => 'required|string|max:100',
            'alamat'          => 'required|string|max:255',
            'no_telepon'      => 'required|string|max:20',
            'email'           => 'required|email|max:100',
            'jam_operasional' => 'required|string|max:100',
            'deskripsi'       => 'nullable|string',
        ]);

        $pengaturan = Pengaturan::firstOrCreate([]);
        $pengaturan->update($validated);

        return response()->json(['status' => 'success', 'data' => $pengaturan, 'message' => 'Pengaturan berhasil disimpan.']);
    }
}
