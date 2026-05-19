<?php
namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Resep;
use Illuminate\Http\Request;

class ResepController extends Controller
{
    public function store(Request $request)
    {
        $validated = $request->validate([
            'rekam_id'   => 'required|exists:rekam_medis,rekam_id',
            'obat_id'    => 'nullable|exists:obat,obat_id',
            'dosis'      => 'required',
            'aturan_pakai' => 'required',
            'jumlah'     => 'required|integer',
            'catatan_resep' => 'nullable',
        ]);

        $resep = Resep::create($validated);
        return response()->json($resep->load('obat'), 201);
    }
}