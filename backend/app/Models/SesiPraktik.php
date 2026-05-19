<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class SesiPraktik extends Model
{
    protected $table = 'sesi_praktik';
    protected $primaryKey = 'sesi_id';

    protected $fillable = [
        'dokter_id',
        'tanggal',
        'sesi',
        'jam_mulai',
        'jam_selesai',
        'kuota',
        'terisi',
        'status',
        'catatan',
    ];

    protected $casts = [
        'tanggal'  => 'date',
        'kuota'    => 'integer',
        'terisi'   => 'integer',
    ];

    protected $appends = ['sisa_kuota'];

    public function getSisaKuotaAttribute(): int
    {
        return max(0, $this->kuota - $this->terisi);
    }

    public function dokter(): BelongsTo
    {
        return $this->belongsTo(Dokter::class, 'dokter_id', 'dokter_id');
    }

    public function appointments(): HasMany
    {
        return $this->hasMany(Appointment::class, 'sesi_id', 'sesi_id');
    }

    public function isBukaDanAdaSisa(): bool
    {
        return $this->status === 'BUKA' && $this->terisi < $this->kuota;
    }
}
