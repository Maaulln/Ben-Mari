<?php

namespace Database\Seeders;

use App\Models\Appointment;
use App\Models\Dokter;
use App\Models\JadwalDokter;
use App\Models\Obat;
use App\Models\Pasien;
use App\Models\RekamMedis;
use App\Models\Resep;
use App\Models\SesiPraktik;
use App\Models\Tagihan;
use App\Models\TagihanDetail;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        DB::statement("ALTER SESSION SET NLS_DATE_FORMAT='YYYY-MM-DD HH24:MI:SS'");
        DB::statement("ALTER SESSION SET NLS_TIMESTAMP_FORMAT='YYYY-MM-DD HH24:MI:SS'");

        $today = Carbon::today();

        // ─── Admin ───
        User::create([
            'nama'     => 'Admin Klinik',
            'email'    => 'admin@klinik.com',
            'password' => Hash::make('admin123'),
            'role'     => 'Admin',
        ]);

        // ─── Dokter (5) ───
        $dokterData = [
            ['Dr. Maria Ulfa',   'Spesialis Anak',  'SIP/001/2026', '08123456701', 'maria@klinik.com',    150000],
            ['Dr. Budi Hartono', 'Dokter Umum',     'SIP/002/2026', '08123456702', 'budi.dr@klinik.com',  100000],
            ['Dr. Siti Rahayu',  'Spesialis Gigi',  'SIP/003/2026', '08123456703', 'siti@klinik.com',     200000],
            ['Dr. Ahmad Fauzi',  'Spesialis Kulit', 'SIP/004/2026', '08123456704', 'ahmad@klinik.com',    175000],
            ['Dr. Nina Kusuma',  'Spesialis Mata',  'SIP/005/2026', '08123456705', 'nina@klinik.com',     160000],
        ];

        $dokters = [];
        foreach ($dokterData as [$nama, $spesialis, $sip, $telp, $email, $biaya]) {
            $d = Dokter::create([
                'nama_dokter'      => $nama,
                'spesialisasi'     => $spesialis,
                'no_sip'           => $sip,
                'no_telepon'       => $telp,
                'email'            => $email,
                'biaya_konsultasi' => $biaya,
                'status_aktif'     => 'Y',
            ]);
            User::create([
                'nama'         => $nama,
                'email'        => $email,
                'password'     => Hash::make('dokter123'),
                'role'         => 'dokter',
                'reference_id' => $d->dokter_id,
            ]);
            $dokters[] = $d;

            foreach (['SENIN', 'SELASA', 'RABU', 'KAMIS', 'JUMAT'] as $hari) {
                JadwalDokter::create([
                    'dokter_id'   => $d->dokter_id,
                    'hari'        => $hari,
                    'jam_mulai'   => '08:00',
                    'jam_selesai' => '14:00',
                    'kuota'       => 20,
                    'is_aktif'    => 1,
                ]);
            }
        }

        // Sesi praktik untuk 8 hari (hari ini + 7 hari ke belakang)
        for ($i = 7; $i >= 0; $i--) {
            $tgl = $today->copy()->subDays($i)->toDateString();
            foreach ($dokters as $d) {
                SesiPraktik::create([
                    'dokter_id'   => $d->dokter_id,
                    'tanggal'     => $tgl,
                    'sesi'        => 'PAGI',
                    'jam_mulai'   => '08:00',
                    'jam_selesai' => '14:00',
                    'kuota'       => 20,
                    'terisi'      => 0,
                    'status'      => $i === 0 ? 'BUKA' : 'TUTUP',
                ]);
            }
        }

        // ─── Pasien (20) ───
        $pasienData = [
            ['3201010101010001', 'Budi Santoso',     '1990-05-15', 'L', 'Jl. Merdeka No. 10',   '087712345601', 'budi@email.com',    'A',  true],
            ['3201010101010002', 'Sari Dewi',         '1988-03-20', 'P', 'Jl. Sudirman No. 5',   '087712345602', 'sari@email.com',    'B',  false],
            ['3201010101010003', 'Ahmad Ridho',       '1995-07-10', 'L', 'Jl. Gatot Subroto 3',  '087712345603', 'ahmad@email.com',   'O',  false],
            ['3201010101010004', 'Nur Aisyah',        '2000-01-25', 'P', 'Jl. Diponegoro No. 8', '087712345604', 'nur@email.com',     'AB', false],
            ['3201010101010005', 'Rizki Pratama',     '1985-11-30', 'L', 'Jl. Veteran No. 12',   '087712345605', 'rizki@email.com',   'A',  false],
            ['3201010101010006', 'Fitri Handayani',   '1993-06-14', 'P', 'Jl. Imam Bonjol 7',    '087712345606', 'fitri@email.com',   'O',  false],
            ['3201010101010007', 'Deni Kurniawan',    '1978-09-05', 'L', 'Jl. Cendana No. 3',    '087712345607', 'deni@email.com',    'B',  false],
            ['3201010101010008', 'Ratna Sari',        '2003-04-22', 'P', 'Jl. Mangga No. 15',    '087712345608', 'ratna@email.com',   'AB', false],
            ['3201010101010009', 'Hendra Wijaya',     '1970-12-08', 'L', 'Jl. Nangka No. 9',     '087712345609', 'hendra@email.com',  'O',  false],
            ['3201010101010010', 'Maya Putri',        '1998-08-17', 'P', 'Jl. Pisang No. 21',    '087712345610', 'maya@email.com',    'A',  false],
            ['3201010101010011', 'Eko Prasetyo',      '1982-02-28', 'L', 'Jl. Kelapa No. 6',     '087712345611', 'eko@email.com',     'B',  false],
            ['3201010101010012', 'Lestari Wulandari', '1996-10-03', 'P', 'Jl. Rambutan No. 14',  '087712345612', 'lestari@email.com', 'O',  false],
            ['3201010101010013', 'Agus Setiawan',     '1975-07-19', 'L', 'Jl. Jeruk No. 4',      '087712345613', 'agus@email.com',    'A',  false],
            ['3201010101010014', 'Dewi Rahayu',       '2001-05-06', 'P', 'Jl. Salak No. 11',     '087712345614', 'dewi@email.com',    'AB', false],
            ['3201010101010015', 'Faisal Hakim',      '1989-03-13', 'L', 'Jl. Anggur No. 18',    '087712345615', 'faisal@email.com',  'O',  false],
            ['3201010101010016', 'Indah Permata',     '1994-11-25', 'P', 'Jl. Durian No. 2',     '087712345616', 'indah@email.com',   'A',  false],
            ['3201010101010017', 'Bima Sakti',        '1987-08-30', 'L', 'Jl. Manggis No. 7',    '087712345617', 'bima@email.com',    'B',  false],
            ['3201010101010018', 'Citra Lestari',     '2002-01-16', 'P', 'Jl. Pepaya No. 13',    '087712345618', 'citra@email.com',   'O',  false],
            ['3201010101010019', 'Rendi Saputra',     '1991-06-22', 'L', 'Jl. Sirsak No. 5',     '087712345619', 'rendi@email.com',   'AB', false],
            ['3201010101010020', 'Yunita Sari',       '1997-04-09', 'P', 'Jl. Jambu No. 16',     '087712345620', 'yunita@email.com',  'A',  false],
        ];

        $pasiens = [];
        foreach ($pasienData as [$nik, $nama, $lahir, $jk, $alamat, $telp, $email, $goldar, $buatUser]) {
            $p = Pasien::create([
                'nik'            => $nik,
                'nama_lengkap'   => $nama,
                'tanggal_lahir'  => $lahir,
                'jenis_kelamin'  => $jk,
                'alamat'         => $alamat,
                'no_telepon'     => $telp,
                'email'          => $email,
                'golongan_darah' => $goldar,
                'status_aktif'   => 'Y',
            ]);
            if ($buatUser) {
                User::create([
                    'nama'         => $nama,
                    'email'        => $email,
                    'password'     => Hash::make('pasien123'),
                    'role'         => 'pasien',
                    'reference_id' => $p->pasien_id,
                ]);
            }
            $pasiens[] = $p;
        }

        // ─── Obat (10) ───
        $obatData = [
            ['Paracetamol 500mg',   'Analgetik',      'Tablet',  200, 20,  2500,  '2027-12-31'],
            ['Amoxicillin 500mg',   'Antibiotik',     'Kapsul',  150, 15,  8000,  '2027-06-30'],
            ['Vitamin C 500mg',     'Vitamin',        'Tablet',  8,   20,  3000,  '2027-12-31'],
            ['Ibuprofen 400mg',     'Analgetik',      'Tablet',  180, 20,  4000,  '2027-09-30'],
            ['Antasida',            'Antasida',       'Tablet',  300, 30,  1500,  '2027-12-31'],
            ['Cetirizine 10mg',     'Antihistamin',   'Tablet',  120, 15,  5000,  '2027-08-31'],
            ['Metformin 500mg',     'Antidiabetik',   'Tablet',  10,  25,  6000,  '2027-11-30'],
            ['Omeprazole 20mg',     'Antasida',       'Kapsul',  90,  20,  7500,  '2027-10-31'],
            ['Salbutamol Inhaler',  'Bronkodilator',  'Inhaler', 12,  10,  45000, '2027-07-31'],
            ['Dexamethasone 0.5mg', 'Kortikosteroid', 'Tablet',  6,   20,  3500,  '2027-12-31'],
        ];

        $obats = [];
        foreach ($obatData as [$nama, $kat, $sat, $stok, $min, $harga, $exp]) {
            $obats[] = Obat::create([
                'nama_obat'      => $nama,
                'kategori'       => $kat,
                'satuan'         => $sat,
                'stok_tersedia'  => $stok,
                'stok_minimum'   => $min,
                'harga_satuan'   => $harga,
                'tgl_kadaluarsa' => $exp,
                'status_aktif'   => 'Y',
            ]);
        }

        // ─── Appointments 7 hari terakhir + hari ini ───
        $keluhanList = [
            'Demam tinggi sejak 2 hari',
            'Batuk berdahak dan pilek',
            'Sakit kepala berulang',
            'Mual dan muntah',
            'Nyeri sendi lutut',
            'Gatal-gatal di kulit',
            'Sesak napas ringan',
            'Sakit gigi geraham',
            'Mata merah dan berair',
            'Diare sudah 3 hari',
            'Lemas dan tidak nafsu makan',
            'Tekanan darah tinggi',
        ];

        $diagnosisList = [
            'ISPA (Infeksi Saluran Pernapasan Atas)',
            'Faringitis akut',
            'Migren',
            'Gastroenteritis akut',
            'Artritis ringan',
            'Dermatitis atopik',
            'Asma bronkial',
            'Karies gigi stadium 2',
            'Konjungtivitis bakterial',
            'Diare infeksi',
            'Anemia defisiensi besi',
            'Hipertensi grade 1',
        ];

        $tindakanList = [
            'Pemberian antipiretik dan antiinflamasi',
            'Terapi antibiotik 5 hari',
            'Analgetik dan istirahat cukup',
            'Rehidrasi dan antiemetik',
            'Fisioterapi dan analgetik oral',
            'Krim kortikosteroid topikal',
            'Bronkodilator dan steroid inhaler',
            'Pencabutan gigi dan antibiotik',
            'Tetes mata antibiotik',
            'Oralit dan probiotik',
            'Suplemen zat besi dan vitamin C',
            'Antihipertensi dan edukasi diet',
        ];

        $nomorAntrian = [];

        for ($dayOffset = 6; $dayOffset >= 0; $dayOffset--) {
            $tanggal = $today->copy()->subDays($dayOffset);
            $dateStr = $tanggal->toDateString();
            $isPast = ($dayOffset > 0);

            // Jumlah appointment bervariasi per hari
            $dayOfWeek = $tanggal->dayOfWeek; // 0=Sun, 1=Mon...6=Sat
            $jumlah = match(true) {
                in_array($dayOfWeek, [1, 2, 3, 4]) => rand(10, 14),
                $dayOfWeek === 5                   => rand(7, 10),
                default                            => rand(3, 5),
            };

            if (!isset($nomorAntrian[$dateStr])) {
                $nomorAntrian[$dateStr] = 0;
            }

            for ($j = 0; $j < $jumlah; $j++) {
                $pasien  = $pasiens[$j % count($pasiens)];
                $dokter  = $dokters[$j % count($dokters)];
                $idx     = $j % count($keluhanList);
                $keluhan = $keluhanList[$idx];

                // Jam 08:00 - 13:30 per slot 30 menit
                $slotMenit = ($j % 12) * 30;
                $jam = sprintf('%02d:%02d', 8 + intdiv($slotMenit, 60), $slotMenit % 60);

                $nomorAntrian[$dateStr]++;

                if ($isPast) {
                    $statusPool = ['SELESAI', 'SELESAI', 'SELESAI', 'SELESAI', 'BATAL', 'ABSEN'];
                    $status = $statusPool[$j % count($statusPool)];
                } else {
                    $statusPool = ['MENUNGGU', 'MENUNGGU', 'MENUNGGU', 'DIKONFIRMASI', 'HADIR'];
                    $status = $statusPool[$j % count($statusPool)];
                }

                $batasHadir = Carbon::parse($dateStr . ' ' . $jam)->addMinutes(15);

                $apt = Appointment::create([
                    'pasien_id'       => $pasien->pasien_id,
                    'dokter_id'       => $dokter->dokter_id,
                    'tgl_appointment' => $dateStr,
                    'jam_appointment' => $jam,
                    'nomor_antrian'   => $nomorAntrian[$dateStr],
                    'keluhan_awal'    => $keluhan,
                    'status'          => $status,
                    'batas_hadir'     => $batasHadir->toDateTimeString(),
                ]);

                if ($status !== 'SELESAI') {
                    continue;
                }

                // ── RekamMedis ──
                $rekam = RekamMedis::create([
                    'appointment_id'   => $apt->appointment_id,
                    'dokter_id'        => $dokter->dokter_id,
                    'tgl_periksa'      => $dateStr,
                    'keluhan'          => $keluhan,
                    'diagnosis'        => $diagnosisList[$idx],
                    'tindakan'         => $tindakanList[$idx],
                    'tekanan_darah'    => rand(110, 145) . '/' . rand(70, 95),
                    'berat_badan'      => rand(45, 92) + round(rand(0, 9) / 10, 1),
                    'catatan_tambahan' => 'Kontrol ulang 1 minggu lagi jika tidak membaik.',
                ]);

                // ── Resep (1-2 obat per rekam medis) ──
                $obatIdx1 = $idx % count($obats);
                $obatIdx2 = ($idx + 1) % count($obats);

                Resep::create([
                    'rekam_id'     => $rekam->rekam_id,
                    'obat_id'      => $obats[$obatIdx1]->obat_id,
                    'dosis'        => '1 tablet',
                    'durasi'       => '5 hari',
                    'aturan_pakai' => '3x sehari sesudah makan',
                    'jumlah'       => 15,
                    'status_ambil' => ($j % 3 === 0) ? 'BELUM_DIAMBIL' : 'SUDAH_DIAMBIL',
                ]);

                if ($j % 2 === 0) {
                    Resep::create([
                        'rekam_id'     => $rekam->rekam_id,
                        'obat_id'      => $obats[$obatIdx2]->obat_id,
                        'dosis'        => '2 tablet',
                        'durasi'       => '3 hari',
                        'aturan_pakai' => '2x sehari sesudah makan',
                        'jumlah'       => 6,
                        'status_ambil' => 'BELUM_DIAMBIL',
                    ]);
                }

                // ── Tagihan ──
                $biayaKonsultasi = $dokter->biaya_konsultasi;
                $biayaObat       = (($idx % 5) + 1) * 15000;
                $totalBiaya      = $biayaKonsultasi + $biayaObat;

                $statusBayarPool = ['LUNAS', 'LUNAS', 'LUNAS', 'BELUM_BAYAR', 'SEBAGIAN'];
                $statusBayar     = $statusBayarPool[$j % count($statusBayarPool)];
                $metodeBayar     = ($statusBayar === 'LUNAS')
                    ? (($j % 2 === 0) ? 'TUNAI' : 'TRANSFER')
                    : null;

                $tagihan = Tagihan::create([
                    'pasien_id'        => $pasien->pasien_id,
                    'appointment_id'   => $apt->appointment_id,
                    'tgl_tagihan'      => $dateStr,
                    'biaya_konsultasi' => $biayaKonsultasi,
                    'biaya_obat'       => $biayaObat,
                    'total_biaya'      => $totalBiaya,
                    'metode_bayar'     => $metodeBayar,
                    'status_bayar'     => $statusBayar,
                ]);

                TagihanDetail::create([
                    'tagihan_id'   => $tagihan->tagihan_id,
                    'keterangan'   => 'Jasa Dokter - ' . $dokter->spesialisasi,
                    'jumlah'       => 1,
                    'harga_satuan' => $biayaKonsultasi,
                ]);

                TagihanDetail::create([
                    'tagihan_id'   => $tagihan->tagihan_id,
                    'keterangan'   => 'Biaya Obat',
                    'jumlah'       => 1,
                    'harga_satuan' => $biayaObat,
                ]);
            }
        }
    }
}
