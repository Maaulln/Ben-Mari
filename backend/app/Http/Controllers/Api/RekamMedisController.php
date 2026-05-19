<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\RekamMedis;
use App\Models\Tagihan;
use App\Models\TagihanDetail;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class RekamMedisController extends Controller
{
    public function index(Request $request)
    {
        $query = RekamMedis::with([
            'appointment.pasien',
            'dokter',
            'resep.obat',
        ]);

        if ($request->filled('dokter_id')) {
            $query->where('dokter_id', $request->dokter_id);
        }

        if ($request->filled('pasien_id')) {
            $query->whereHas('appointment', fn($q) =>
                $q->where('pasien_id', $request->pasien_id)
            );
        }

        if ($request->filled('appointment_id')) {
            $query->where('appointment_id', $request->appointment_id);
        }

        return response()->json($query->orderBy('tgl_periksa', 'desc')->get());
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'appointment_id' =>
                'required|exists:appointment,appointment_id|unique:rekam_medis,appointment_id',

            'dokter_id' =>
                'required|exists:dokter,dokter_id',

            'tgl_periksa' =>
                'required|date',

            'keluhan' =>
                'required',

            'diagnosis' =>
                'required',

            'tindakan' =>
                'nullable',

            'tekanan_darah' =>
                'nullable',

            'berat_badan' =>
                'nullable|numeric',

            'catatan_tambahan' =>
                'nullable',

            'resep' =>
                'nullable|array',

            'resep.*.obat_id' =>
                'nullable|exists:obat,obat_id',

            'resep.*.nama_obat_manual' =>
                'nullable',

            'resep.*.dosis' =>
                'required',

            'resep.*.aturan_pakai' =>
                'required',

            'resep.*.jumlah' =>
                'required|integer',
        ]);

        // =========================
        // FIX TRANSACTION
        // =========================
        return DB::transaction(function () use ($validated) {

            $rekamData = collect($validated)
                ->except('resep')
                ->toArray();

            $rekamMedis = RekamMedis::create(
                $rekamData
            );

            // =========================
            // UPDATE STATUS APPOINTMENT
            // =========================
            \App\Models\Appointment::where(
                'appointment_id',
                $validated['appointment_id']
            )->update([
                'status' => 'SELESAI'
            ]);

            $appointment = \App\Models\Appointment::find($validated['appointment_id']);
            $dokter      = \App\Models\Dokter::find($validated['dokter_id']);
            $biayaKonsultasi = $dokter ? (float) $dokter->biaya_konsultasi : 0;

            // CREATE RESEP (status_ambil default: BELUM_DIAMBIL)
            if (isset($validated['resep'])) {
                foreach ($validated['resep'] as $r) {
                    $rekamMedis->resep()->create(array_merge($r, [
                        'status_ambil' => 'BELUM_DIAMBIL',
                    ]));
                }
            }

            // BUAT TAGIHAN OTOMATIS + DETAIL
            $tagihan = Tagihan::create([
                'pasien_id'        => $appointment->pasien_id,
                'appointment_id'   => $validated['appointment_id'],
                'tgl_tagihan'      => now()->toDateString(),
                'biaya_konsultasi' => $biayaKonsultasi,
                'biaya_obat'       => 0,
                'total_biaya'      => $biayaKonsultasi,
                'status_bayar'     => 'BELUM_BAYAR',
            ]);

            // Detail: Jasa Dokter
            TagihanDetail::create([
                'tagihan_id'   => $tagihan->tagihan_id,
                'keterangan'   => 'Jasa Dokter',
                'jumlah'       => 1,
                'harga_satuan' => $biayaKonsultasi,
            ]);

            return response()->json(
                $rekamMedis->load('resep'),
                201
            );
        });
    }

    public function show($id)
    {
        $rekamMedis = RekamMedis::with([
            'appointment.pasien',
            'dokter',
            'resep.obat'
        ])->findOrFail($id);

        return response()->json(
            $rekamMedis
        );
    }

    public function update(
        Request $request,
        $id
    ) {
        $rekamMedis =
            RekamMedis::findOrFail($id);

        $validated =
            $request->validate([
                'keluhan' =>
                    'nullable',

                'diagnosis' =>
                    'nullable',

                'tindakan' =>
                    'nullable',

                'tekanan_darah' =>
                    'nullable',

                'berat_badan' =>
                    'nullable|numeric',

                'catatan_tambahan' =>
                    'nullable',
            ]);

        $rekamMedis->update(
            $validated
        );

        return response()->json(
            $rekamMedis
        );
    }

    public function destroy($id)
    {
        // Rekam medis bersifat permanen — tidak boleh dihapus (business rule)
        return response()->json([
            'status'  => 'error',
            'message' => 'Rekam medis tidak dapat dihapus. Lakukan koreksi melalui update.',
        ], 403);
    }
}