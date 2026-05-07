<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Dokter extends Model
{
    protected $table = 'dokter';
    protected $primaryKey = 'dokter_id';

    protected $fillable = [
        'nama_dokter',
        'spesialisasi',
        'no_sip',
        'no_telepon',
        'email',
        'jadwal_praktik',
        'biaya_konsultasi',
        'status_aktif',
        'is_active',
    ];

    protected $casts = [
        'is_active' => 'boolean',
        'biaya_konsultasi' => 'decimal:2',
    ];

    public function appointments(): HasMany
    {
        return $this->hasMany(Appointment::class, 'dokter_id', 'dokter_id');
    }

    public function rekamMedis(): HasMany
    {
        return $this->hasMany(RekamMedis::class, 'dokter_id', 'dokter_id');
    }
}
