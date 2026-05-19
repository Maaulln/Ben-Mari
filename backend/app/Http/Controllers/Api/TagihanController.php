<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Tagihan;
use App\Models\TagihanDetail;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class TagihanController extends Controller
{
    public function index(Request $request)
    {
        $query = Tagihan::with(['pasien', 'appointment.dokter', 'details']);

        if ($request->filled('pasien_id')) {
            $query->where('pasien_id', $request->pasien_id);
        }

        if ($request->filled('status_bayar')) {
            $query->where('status_bayar', $request->status_bayar);
        }

        if ($request->filled('tanggal')) {
            $query->whereDate('tgl_tagihan', $request->tanggal);
        }

        return response()->json([
            'status' => 'success',
            'data'   => $query->orderBy('tgl_tagihan', 'desc')->get(),
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'pasien_id'        => 'required|exists:pasien,pasien_id',
            'appointment_id'   => 'required|exists:appointment,appointment_id|unique:tagihan,appointment_id',
            'tgl_tagihan'      => 'nullable|date',
            'biaya_konsultasi' => 'required|numeric|min:0',
            'biaya_obat'       => 'nullable|numeric|min:0',
            'total_biaya'      => 'required|numeric|min:0',
            'metode_bayar'     => 'nullable|string|max:20',
            'status_bayar'     => 'nullable|in:BELUM_BAYAR,SEBAGIAN,LUNAS',
            'keterangan'       => 'nullable|string|max:500',
            'details'          => 'nullable|array',
            'details.*.keterangan'  => 'required_with:details|string|max:200',
            'details.*.jumlah'      => 'required_with:details|integer|min:1',
            'details.*.harga_satuan'=> 'required_with:details|numeric|min:0',
        ]);

        return DB::transaction(function () use ($validated) {
            $tagihan = Tagihan::create([
                'pasien_id'        => $validated['pasien_id'],
                'appointment_id'   => $validated['appointment_id'],
                'tgl_tagihan'      => $validated['tgl_tagihan'] ?? now()->toDateString(),
                'biaya_konsultasi' => $validated['biaya_konsultasi'],
                'biaya_obat'       => $validated['biaya_obat'] ?? 0,
                'total_biaya'      => $validated['total_biaya'],
                'metode_bayar'     => $validated['metode_bayar'] ?? null,
                'status_bayar'     => $validated['status_bayar'] ?? 'BELUM_BAYAR',
                'keterangan'       => $validated['keterangan'] ?? null,
            ]);

            // Buat detail tagihan otomatis
            if (!empty($validated['details'])) {
                foreach ($validated['details'] as $detail) {
                    TagihanDetail::create([
                        'tagihan_id'  => $tagihan->tagihan_id,
                        'keterangan'  => $detail['keterangan'],
                        'jumlah'      => $detail['jumlah'],
                        'harga_satuan'=> $detail['harga_satuan'],
                    ]);
                }
            } else {
                // Auto-create detail dari biaya_konsultasi
                TagihanDetail::create([
                    'tagihan_id'   => $tagihan->tagihan_id,
                    'keterangan'   => 'Jasa Dokter',
                    'jumlah'       => 1,
                    'harga_satuan' => $validated['biaya_konsultasi'],
                ]);

                if (($validated['biaya_obat'] ?? 0) > 0) {
                    TagihanDetail::create([
                        'tagihan_id'   => $tagihan->tagihan_id,
                        'keterangan'   => 'Biaya Obat',
                        'jumlah'       => 1,
                        'harga_satuan' => $validated['biaya_obat'],
                    ]);
                }
            }

            return response()->json([
                'status' => 'success',
                'data'   => $tagihan->load(['pasien', 'details']),
            ], 201);
        });
    }

    public function show(int $id)
    {
        $tagihan = Tagihan::with(['pasien', 'appointment.dokter', 'details'])->findOrFail($id);

        return response()->json([
            'status' => 'success',
            'data'   => $tagihan,
        ]);
    }

    public function update(Request $request, int $id)
    {
        $tagihan = Tagihan::findOrFail($id);

        // Tagihan LUNAS tidak bisa diubah kembali
        if ($tagihan->status_bayar === 'LUNAS') {
            return response()->json([
                'status'  => 'error',
                'message' => 'Tagihan dengan status LUNAS tidak dapat diubah.',
            ], 422);
        }

        $validated = $request->validate([
            'status_bayar' => 'nullable|in:BELUM_BAYAR,SEBAGIAN,LUNAS',
            'metode_bayar' => 'nullable|string|max:20',
            'keterangan'   => 'nullable|string|max:500',
            'total_biaya'  => 'nullable|numeric|min:0',
        ]);

        $tagihan->update($validated);

        return response()->json([
            'status' => 'success',
            'data'   => $tagihan->load('details'),
        ]);
    }

    public function destroy(int $id)
    {
        $tagihan = Tagihan::findOrFail($id);

        if ($tagihan->status_bayar === 'LUNAS') {
            return response()->json([
                'status'  => 'error',
                'message' => 'Tagihan LUNAS tidak dapat dihapus.',
            ], 422);
        }

        $tagihan->delete();

        return response()->json([
            'status'  => 'success',
            'message' => 'Tagihan berhasil dihapus.',
        ]);
    }
}
