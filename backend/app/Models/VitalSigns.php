<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class VitalSigns extends Model
{
    protected $table = 'vital_signs';
    protected $primaryKey = 'vs_id';

    protected $fillable = [
        'appointment_id',
        'tekanan_darah',
        'suhu_tubuh',
        'berat_badan',
        'tinggi_badan',
        'saturasi_oksigen',
        'catatan_perawat',
    ];

    protected $casts = [
        'suhu_tubuh'       => 'decimal:1',
        'berat_badan'      => 'decimal:2',
        'tinggi_badan'     => 'decimal:2',
        'saturasi_oksigen' => 'integer',
    ];

    public function appointment(): BelongsTo
    {
        return $this->belongsTo(Appointment::class, 'appointment_id', 'appointment_id');
    }
}
