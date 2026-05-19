<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class RekamMedis extends Model
{
    protected $table = 'rekam_medis';
    protected $primaryKey = 'rekam_id';

    // TAMBAHKAN INI
    public $timestamps = false;

    protected $fillable = [
        'appointment_id',
        'dokter_id',
        'tgl_periksa',
        'keluhan',
        'diagnosis',
        'tindakan',
        'tekanan_darah',
        'berat_badan',
        'catatan_tambahan',
    ];

    protected $casts = [
        'tgl_periksa' => 'date',
        'berat_badan' => 'decimal:2',
    ];

    public function appointment(): BelongsTo
    {
        return $this->belongsTo(Appointment::class, 'appointment_id', 'appointment_id');
    }

    public function dokter(): BelongsTo
    {
        return $this->belongsTo(Dokter::class, 'dokter_id', 'dokter_id');
    }

    public function resep(): HasMany
    {
        return $this->hasMany(Resep::class, 'rekam_id', 'rekam_id');
    }
}