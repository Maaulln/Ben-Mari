<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasOne;

class Appointment extends Model
{
    protected $table = 'appointment';
    public $timestamps = false;
    protected $primaryKey = 'appointment_id';

    // Status: MENUNGGU → DIKONFIRMASI → HADIR → SELESAI | BATAL | ABSEN
    protected $fillable = [
        'pasien_id',
        'dokter_id',
        'sesi_id',
        'tgl_appointment',
        'jam_appointment',
        'nomor_antrian',
        'keluhan_awal',
        'status',
        'catatan',
        'batas_hadir',
        'waktu_checkin',
        'status_kehadiran',
    ];

    protected $casts = [
        'tgl_appointment' => 'date',
        'batas_hadir'     => 'datetime',
        'waktu_checkin'   => 'datetime',
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

    public function vitalSigns(): HasOne
    {
        return $this->hasOne(VitalSigns::class, 'appointment_id', 'appointment_id');
    }

    public function antrian(): HasOne
    {
        return $this->hasOne(Antrian::class, 'appointment_id', 'appointment_id');
    }
}
