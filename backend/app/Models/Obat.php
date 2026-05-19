<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

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
        'harga_satuan',
        'tgl_kadaluarsa',
        'deskripsi',
        'status_aktif',
    ];

    protected $casts = [
        'tgl_kadaluarsa' => 'date',
        'harga_satuan' => 'decimal:2',
    ];
}
