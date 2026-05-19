<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Resep extends Model
{
    protected $table = 'resep';

    protected $primaryKey = 'resep_id';

    // FIX ORACLE TIMESTAMP
    public $timestamps = false;

    // status_ambil: BELUM_DIAMBIL → SUDAH_DIAMBIL (trigger stok berkurang) | BATAL
    protected $fillable = [
        'rekam_id',
        'obat_id',
        'nama_obat_manual',
        'dosis',
        'durasi',
        'aturan_pakai',
        'jumlah',
        'catatan_resep',
        'status_ambil',
    ];

    public function rekamMedis(): BelongsTo
    {
        return $this->belongsTo(
            RekamMedis::class,
            'rekam_id',
            'rekam_id'
        );
    }

    public function obat(): BelongsTo
    {
        return $this->belongsTo(
            Obat::class,
            'obat_id',
            'obat_id'
        );
    }
}