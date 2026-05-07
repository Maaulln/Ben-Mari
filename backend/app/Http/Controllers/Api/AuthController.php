<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

use App\Models\Pasien;
use Illuminate\Support\Facades\DB;

class AuthController extends Controller
{
    public function register(Request $request)
    {
        $request->validate([
            'NIK' => 'required|string|size:16|unique:pasien,nik',
            'NAMA_LENGKAP' => 'required|string|max:100',
            'TANGGAL_LAHIR' => 'required|date',
            'JENIS_KELAMIN' => 'required|in:L,P',
            'GOLONGAN_DARAH' => 'required|string',
            'ALAMAT' => 'required|string',
            'NO_TELEPON' => 'required|string',
            'EMAIL' => 'required|email|unique:users,email',
            'password' => 'required|string|min:8',
        ]);

        try {
            return DB::transaction(function () use ($request) {
                // 1. Create Pasien
                $pasien = Pasien::create([
                    'nik' => $request->NIK,
                    'nama_lengkap' => $request->NAMA_LENGKAP,
                    'tanggal_lahir' => $request->TANGGAL_LAHIR,
                    'jenis_kelamin' => $request->JENIS_KELAMIN,
                    'alamat' => $request->ALAMAT,
                    'no_telepon' => $request->NO_TELEPON,
                    'email' => $request->EMAIL,
                    'golongan_darah' => $request->GOLONGAN_DARAH,
                    'status_aktif' => 'Y',
                ]);

                // 2. Create User
                User::create([
                    'nama' => $request->NAMA_LENGKAP,
                    'email' => $request->EMAIL,
                    'password' => Hash::make($request->password),
                    'role' => 'pasien',
                    'reference_id' => $pasien->pasien_id,
                ]);

                return response()->json([
                    'message' => 'Registrasi berhasil',
                    'pasien' => $pasien
                ], 201);
            });
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Terjadi kesalahan saat registrasi: ' . $e->getMessage()
            ], 500);
        }
    }

    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required',
        ]);

        $user = User::where('email', $request->email)->first();

        if (!$user || !Hash::check($request->password, $user->password)) {
            throw ValidationException::withMessages([
                'email' => ['Credentials yang Anda masukkan salah.'],
            ]);
        }

        $token = $user->createToken('klinik_token')->plainTextToken;

        return response()->json([
            'token' => $token,
            'user' => [
                'id' => $user->reference_id ?? $user->id,
                'nama' => $user->nama,
                'role' => $user->role,
            ],
        ]);
    }

    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json(['message' => 'Logged out successfully']);
    }

    public function me(Request $request)
    {
        return response()->json($request->user());
    }
}
