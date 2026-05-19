<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Obat;
use App\Models\Resep;
use App\Models\StokObatLog;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class ResepController extends Controller
{
    public function index(Request $request)
    {
        $query = Resep::with(['obat', 'rekamMedis.appointment.pasien']);

        if ($request->filled('rekam_id')) {
            $query->where('rekam_id', $request->rekam_id);
        }

        if ($request->filled('status_ambil')) {
            $query->where('status_ambil', $request->status_ambil);
        }

        return response()->json([
            'status' => 'success',
            'data'   => $query->get(),
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'rekam_id'        => 'required|exists:rekam_medis,rekam_id',
            'obat_id'         => 'nullable|exists:obat,obat_id',
            'nama_obat_manual'=> 'nullable|string|max:200',
            'dosis'           => 'required',
            'durasi'          => 'nullable|string|max:50',
            'aturan_pakai'    => 'required',
            'jumlah'          => 'required|integer|min:1',
            'catatan_resep'   => 'nullable',
        ]);

        $validated['status_ambil'] = 'BELUM_DIAMBIL';

        $resep = Resep::create($validated);

        return response()->json([
            'status' => 'success',
            'data'   => $resep->load('obat'),
        ], 201);
    }

    public function show(int $id)
    {
        $resep = Resep::with(['obat', 'rekamMedis'])->findOrFail($id);

        return response()->json([
            'status' => 'success',
            'data'   => $resep,
        ]);
    }

    public function update(Request $request, int $id)
    {
        $resep = Resep::with('obat')->findOrFail($id);

        $validated = $request->validate([
            'status_ambil' => 'sometimes|in:BELUM_DIAMBIL,SUDAH_DIAMBIL,BATAL',
            'dosis'        => 'sometimes',
            'durasi'       => 'nullable|string|max:50',
            'aturan_pakai' => 'sometimes',
            'jumlah'       => 'sometimes|integer|min:1',
            'catatan_resep'=> 'nullable',
        ]);

        DB::transaction(function () use ($resep, $validated) {
            $statusLama = $resep->status_ambil;
            $statusBaru = $validated['status_ambil'] ?? $statusLama;

            $resep->update($validated);

            // Kurangi stok saat SUDAH_DIAMBIL
            if ($statusLama !== 'SUDAH_DIAMBIL' && $statusBaru === 'SUDAH_DIAMBIL') {
                if ($resep->obat_id) {
                    $obat = Obat::findOrFail($resep->obat_id);
                    $obat->decrement('stok_tersedia', $resep->jumlah);

                    StokObatLog::create([
                        'obat_id'    => $obat->obat_id,
                        'tipe'       => 'KELUAR',
                        'jumlah'     => $resep->jumlah,
                        'keterangan' => 'Resep diambil #' . $resep->resep_id,
                        'created_by' => auth()->id(),
                    ]);
                }
            }

            // Kembalikan stok saat BATAL (setelah sebelumnya SUDAH_DIAMBIL)
            if ($statusLama === 'SUDAH_DIAMBIL' && $statusBaru === 'BATAL') {
                if ($resep->obat_id) {
                    $obat = Obat::findOrFail($resep->obat_id);
                    $obat->increment('stok_tersedia', $resep->jumlah);

                    StokObatLog::create([
                        'obat_id'    => $obat->obat_id,
                        'tipe'       => 'MASUK',
                        'jumlah'     => $resep->jumlah,
                        'keterangan' => 'Resep dibatalkan #' . $resep->resep_id,
                        'created_by' => auth()->id(),
                    ]);
                }
            }
        });

        return response()->json([
            'status' => 'success',
            'data'   => $resep->fresh('obat'),
        ]);
    }

    public function destroy(int $id)
    {
        $resep = Resep::findOrFail($id);

        if ($resep->status_ambil === 'SUDAH_DIAMBIL') {
            return response()->json([
                'status'  => 'error',
                'message' => 'Resep yang sudah diambil tidak dapat dihapus.',
            ], 422);
        }

        $resep->delete();

        return response()->json([
            'status'  => 'success',
            'message' => 'Resep berhasil dihapus.',
        ]);
    }
}
