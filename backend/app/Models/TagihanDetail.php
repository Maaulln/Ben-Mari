<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class TagihanDetail extends Model
{
    protected $table = 'tagihan_detail';
    protected $primaryKey = 'detail_id';

    protected $fillable = [
        'tagihan_id',
        'keterangan',
        'jumlah',
        'harga_satuan',
    ];

    protected $casts = [
        'jumlah'      => 'integer',
        'harga_satuan' => 'decimal:2',
    ];

    protected $appends = ['subtotal'];

    public function getSubtotalAttribute(): float
    {
        return (float) $this->jumlah * (float) $this->harga_satuan;
    }

    public function tagihan(): BelongsTo
    {
        return $this->belongsTo(Tagihan::class, 'tagihan_id', 'tagihan_id');
    }
}
