<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Obat;
use App\Models\StokObatLog;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class ObatController extends Controller
{
    public function index(Request $request)
    {
        $query = Obat::query();

        if ($request->filled('status_aktif')) {
            $query->where('status_aktif', $request->status_aktif);
        }

        if ($request->filled('kategori')) {
            $query->where('kategori', $request->kategori);
        }

        return response()->json($query->get());
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'nama_obat'      => 'required|string|max:100',
            'kategori'       => 'required|string|max:50',
            'satuan'         => 'required|string|max:20',
            'stok_tersedia'  => 'required|integer|min:0',
            'stok_minimum'   => 'nullable|integer|min:0',
            'harga_satuan'   => 'required|numeric|min:0',
            'tgl_kadaluarsa' => 'nullable|date',
            'deskripsi'      => 'nullable|string|max:255',
            'status_aktif'   => 'nullable|in:Y,N',
        ]);

        return DB::transaction(function () use ($validated) {
            $stokAwal = $validated['stok_tersedia'];
            $obat     = Obat::create($validated);

            // Catat stok awal sebagai log MASUK
            if ($stokAwal > 0) {
                StokObatLog::create([
                    'obat_id'    => $obat->obat_id,
                    'tipe'       => 'MASUK',
                    'jumlah'     => $stokAwal,
                    'keterangan' => 'Stok awal',
                    'created_by' => auth()->id(),
                ]);
            }

            return response()->json($obat, 201);
        });
    }

    public function show(int $id)
    {
        $obat = Obat::with('stokLogs')->findOrFail($id);

        return response()->json($obat);
    }

    public function update(Request $request, int $id)
    {
        $obat = Obat::findOrFail($id);

        $validated = $request->validate([
            'nama_obat'      => 'sometimes|required|string|max:100',
            'kategori'       => 'sometimes|required|string|max:50',
            'satuan'         => 'sometimes|required|string|max:20',
            'stok_tersedia'  => 'sometimes|integer|min:0',
            'stok_minimum'   => 'nullable|integer|min:0',
            'harga_satuan'   => 'sometimes|numeric|min:0',
            'tgl_kadaluarsa' => 'nullable|date',
            'deskripsi'      => 'nullable|string|max:255',
            'status_aktif'   => 'nullable|in:Y,N',
        ]);

        $obat->update($validated);

        return response()->json($obat);
    }

    public function destroy(int $id)
    {
        $obat = Obat::findOrFail($id);
        $obat->delete();

        return response()->json(['message' => 'Obat berhasil dihapus.']);
    }

    // Obat dengan stok di bawah minimum — digunakan untuk alert Admin
    public function alertStok()
    {
        $obatMenipis = Obat::where('status_aktif', 'Y')
            ->whereColumn('stok_tersedia', '<=', 'stok_minimum')
            ->get();

        return response()->json([
            'status' => 'success',
            'data'   => $obatMenipis,
            'total'  => $obatMenipis->count(),
        ]);
    }

    // Tambah stok masuk (hanya Admin)
    public function stokMasuk(Request $request, int $id)
    {
        $obat = Obat::findOrFail($id);

        $validated = $request->validate([
            'jumlah'     => 'required|integer|min:1',
            'keterangan' => 'nullable|string|max:200',
        ]);

        return DB::transaction(function () use ($obat, $validated) {
            $obat->increment('stok_tersedia', $validated['jumlah']);

            StokObatLog::create([
                'obat_id'    => $obat->obat_id,
                'tipe'       => 'MASUK',
                'jumlah'     => $validated['jumlah'],
                'keterangan' => $validated['keterangan'] ?? 'Penambahan stok',
                'created_by' => auth()->id(),
            ]);

            return response()->json([
                'status'      => 'success',
                'stok_baru'   => $obat->fresh()->stok_tersedia,
            ]);
        });
    }
}
