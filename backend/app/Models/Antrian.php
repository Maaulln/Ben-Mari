<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Antrian extends Model
{
    protected $table = 'antrian';
    protected $primaryKey = 'antrian_id';

    protected $fillable = [
        'pasien_id',
        'dokter_id',
        'appointment_id',
        'nomor_antrian',
        'tanggal',
        'status',
        'jenis',
        'waktu_dipanggil',
        'waktu_selesai',
    ];

    protected $casts = [
        'tanggal' => 'date',
        'waktu_dipanggil' => 'datetime',
        'waktu_selesai' => 'datetime',
    ];

    public function pasien(): BelongsTo
    {
        return $this->belongsTo(Pasien::class, 'pasien_id', 'pasien_id');
    }

    public function dokter(): BelongsTo
    {
        return $this->belongsTo(Dokter::class, 'dokter_id', 'dokter_id');
    }

    public function appointment(): BelongsTo
    {
        return $this->belongsTo(Appointment::class, 'appointment_id', 'appointment_id');
    }
}
