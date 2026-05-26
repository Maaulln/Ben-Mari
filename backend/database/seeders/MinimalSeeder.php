<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class MinimalSeeder extends Seeder
{
    public function run(): void
    {
        User::firstOrCreate(
            ['email' => 'admin@klinik.com'],
            [
                'nama' => 'Admin Klinik',
                'password' => Hash::make('admin123'),
                'role' => 'Admin',
            ]
        );
    }
}
