<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Pasien;
use App\Models\Dokter;
use App\Models\Obat;
use App\Models\Appointment;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // Admin
        User::create([
            'nama' => 'Admin Klinik',
            'email' => 'admin@klinik.com',
            'password' => Hash::make('admin123'),
            'role' => 'Admin',
        ]);

        // Dokter
        $dokter = Dokter::create([
            'nama_dokter' => 'Dr. Maria Ulfa',
            'spesialisasi' => 'Spesialis Anak',
            'no_sip' => 'SIP/123/2026',
            'no_telepon' => '08123456789',
            'email' => 'maria@klinik.com',
            'biaya_konsultasi' => 150000,
        ]);

        User::create([
            'nama' => $dokter->nama_dokter,
            'email' => $dokter->email,
            'password' => Hash::make('dokter123'),
            'role' => 'dokter',
            'reference_id' => $dokter->dokter_id,
        ]);

        // Pasien
        $pasien = Pasien::create([
            'nik' => '3201010101010001',
            'nama_lengkap' => 'Budi Santoso',
            'tanggal_lahir' => '1990-05-15',
            'jenis_kelamin' => 'L',
            'alamat' => 'Jl. Merdeka No. 10',
            'no_telepon' => '087712345678',
            'email' => 'budi@email.com',
        ]);

        User::create([
            'nama' => $pasien->nama_lengkap,
            'email' => $pasien->email,
            'password' => Hash::make('pasien123'),
            'role' => 'pasien',
            'reference_id' => $pasien->pasien_id,
        ]);

        // Obat
        Obat::create([
            'nama_obat' => 'Paracetamol',
            'kategori' => 'Analgetik',
            'satuan' => 'Tablet',
            'stok_tersedia' => 100,
            'harga_satuan' => 5000,
            'tgl_kadaluarsa' => '2027-12-31',
        ]);

        // Appointment
        Appointment::create([
            'pasien_id' => $pasien->pasien_id,
            'dokter_id' => $dokter->dokter_id,
            'tgl_appointment' => date('Y-m-d'),
            'jam_appointment' => '09:00',
            'nomor_antrian' => 1,
            'keluhan_awal' => 'Demam dan pusing',
            'status' => 'MENUNGGU',
        ]);
    }
}
