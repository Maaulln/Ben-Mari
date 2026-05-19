<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Pasien extends Model
{
    protected $table = 'pasien';
    public $timestamps = false;
    protected $primaryKey = 'pasien_id';

    protected $fillable = [
        'nik',
        'nama_lengkap',
        'tanggal_lahir',
        'jenis_kelamin',
        'alamat',
        'no_telepon',
        'email',
        'golongan_darah',
        'status_aktif',
    ];

    protected $casts = [
        'tanggal_lahir' => 'date',
    ];

    public function appointments(): HasMany
    {
        return $this->hasMany(Appointment::class, 'pasien_id', 'pasien_id');
    }

    public function tagihan(): HasMany
    {
        return $this->hasMany(Tagihan::class, 'pasien_id', 'pasien_id');
    }
}
