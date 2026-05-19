<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Obat extends Model
{
    protected $table = 'obat';
    public $timestamps = false;
    protected $primaryKey = 'obat_id';

    protected $fillable = [
        'nama_obat',
        'kategori',
        'satuan',
        'stok_tersedia',
        'stok_minimum',
        'harga_satuan',
        'tgl_kadaluarsa',
        'deskripsi',
        'status_aktif',
    ];

    protected $casts = [
        'tgl_kadaluarsa' => 'date',
        'harga_satuan'   => 'decimal:2',
        'stok_tersedia'  => 'integer',
        'stok_minimum'   => 'integer',
    ];

    public function stokLogs(): HasMany
    {
        return $this->hasMany(StokObatLog::class, 'obat_id', 'obat_id');
    }

    public function isStokMenipis(): bool
    {
        return $this->stok_tersedia <= $this->stok_minimum;
    }
}
