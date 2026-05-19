<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Tagihan extends Model
{
    protected $table = 'tagihan';
    protected $primaryKey = 'tagihan_id';
    public $timestamps = false;

    // status_bayar: BELUM_BAYAR → SEBAGIAN → LUNAS (tidak bisa kembali ke sebelumnya)
    protected $fillable = [
        'pasien_id',
        'appointment_id',
        'tgl_tagihan',
        'biaya_konsultasi',
        'biaya_obat',
        'total_biaya',
        'metode_bayar',
        'status_bayar',
        'keterangan',
    ];

    protected $casts = [
        'tgl_tagihan'      => 'date',
        'biaya_konsultasi' => 'decimal:2',
        'biaya_obat'       => 'decimal:2',
        'total_biaya'      => 'decimal:2',
    ];

    public function pasien(): BelongsTo
    {
        return $this->belongsTo(Pasien::class, 'pasien_id', 'pasien_id');
    }

    public function appointment(): BelongsTo
    {
        return $this->belongsTo(Appointment::class, 'appointment_id', 'appointment_id');
    }

    public function details(): HasMany
    {
        return $this->hasMany(TagihanDetail::class, 'tagihan_id', 'tagihan_id');
    }
}
