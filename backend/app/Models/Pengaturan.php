<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Pengaturan extends Model
{
    protected $table = 'pengaturan';

    protected $fillable = [
        'nama_klinik',
        'alamat',
        'no_telepon',
        'email',
        'jam_operasional',
        'deskripsi',
    ];
}
