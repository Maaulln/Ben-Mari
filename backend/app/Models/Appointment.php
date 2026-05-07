<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasOne;

class Appointment extends Model
{
    protected $table = 'appointment';
    protected $primaryKey = 'appointment_id';

    protected $fillable = [
        'pasien_id',
        'dokter_id',
        'tgl_appointment',
        'jam_appointment',
        'nomor_antrian',
        'keluhan_awal',
        'status',
        'catatan',
    ];

    protected $casts = [
        'tgl_appointment' => 'date',
    ];

    public function pasien(): BelongsTo
    {
        return $this->belongsTo(Pasien::class, 'pasien_id', 'pasien_id');
    }

    public function dokter(): BelongsTo
    {
        return $this->belongsTo(Dokter::class, 'dokter_id', 'dokter_id');
    }

    public function rekamMedis(): HasOne
    {
        return $this->hasOne(RekamMedis::class, 'appointment_id', 'appointment_id');
    }

    public function tagihan(): HasOne
    {
        return $this->hasOne(Tagihan::class, 'appointment_id', 'appointment_id');
    }
}
