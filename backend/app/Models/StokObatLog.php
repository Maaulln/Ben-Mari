<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class StokObatLog extends Model
{
    protected $table = 'stok_obat_log';
    protected $primaryKey = 'log_id';

    protected $fillable = [
        'obat_id',
        'tipe',
        'jumlah',
        'keterangan',
        'created_by',
    ];

    protected $casts = [
        'jumlah' => 'integer',
    ];

    public function obat(): BelongsTo
    {
        return $this->belongsTo(Obat::class, 'obat_id', 'obat_id');
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by', 'id');
    }
}
