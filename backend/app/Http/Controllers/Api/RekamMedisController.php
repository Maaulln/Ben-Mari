<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\RekamMedis;
use App\Models\Resep;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class RekamMedisController extends Controller
{
    public function index()
    {
        return response()->json(
            RekamMedis::with([
                'appointment.pasien',
                'dokter',
                'resep.obat'
            ])->get()
        );
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

            // =========================
            // BUAT TAGIHAN OTOMATIS
            // =========================
            $appointment = \App\Models\Appointment::find(
                $validated['appointment_id']
            );

            $dokter = \App\Models\Dokter::find(
                $validated['dokter_id']
            );

            $biayaKonsultasi = $dokter
                ? $dokter->biaya_konsultasi
                : 0;

            \App\Models\Tagihan::create([
                'pasien_id' =>
                    $appointment->pasien_id,

                'appointment_id' =>
                    $validated['appointment_id'],

                'tgl_tagihan' =>
                    now()->toDateString(),

                'biaya_konsultasi' =>
                    $biayaKonsultasi,

                'biaya_obat' =>
                    0,

                'total_biaya' =>
                    $biayaKonsultasi,

                'status_bayar' =>
                    'BELUM',
            ]);

            // =========================
            // CREATE RESEP
            // =========================
            if (isset($validated['resep'])) {

                foreach (
                    $validated['resep']
                    as $r
                ) {
                    $rekamMedis
                        ->resep()
                        ->create($r);
                }
            }

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
        $rekamMedis =
            RekamMedis::findOrFail($id);

        $rekamMedis->delete();

        return response()->json([
            'message' =>
                'Rekam Medis deleted successfully'
        ]);
    }
}