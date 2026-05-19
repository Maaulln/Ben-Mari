<?php

namespace Database\Seeders;

use App\Models\Antrian;
use App\Models\Appointment;
use App\Models\Dokter;
use App\Models\JadwalDokter;
use App\Models\Obat;
use App\Models\Pasien;
use App\Models\RekamMedis;
use App\Models\Resep;
use App\Models\SesiPraktik;
use App\Models\StokObatLog;
use App\Models\Tagihan;
use App\Models\TagihanDetail;
use App\Models\User;
use App\Models\VitalSigns;
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

        // ─── Admin ───────────────────────────────────────────────────────────
        $adminUser = User::create([
            'nama'     => 'Admin Klinik',
            'email'    => 'admin@klinik.com',
            'password' => Hash::make('admin123'),
            'role'     => 'Admin',
        ]);

        // ─── Dokter (5) + JadwalDokter (25) ──────────────────────────────────
        $dokterData = [
            ['Dr. Maria Ulfa',   'Spesialis Anak',  'SIP/001/2026', '08123456701', 'maria@klinik.com',   150000],
            ['Dr. Budi Hartono', 'Dokter Umum',     'SIP/002/2026', '08123456702', 'budi.dr@klinik.com', 100000],
            ['Dr. Siti Rahayu',  'Spesialis Gigi',  'SIP/003/2026', '08123456703', 'siti@klinik.com',    200000],
            ['Dr. Ahmad Fauzi',  'Spesialis Kulit', 'SIP/004/2026', '08123456704', 'ahmad@klinik.com',   175000],
            ['Dr. Nina Kusuma',  'Spesialis Mata',  'SIP/005/2026', '08123456705', 'nina@klinik.com',    160000],
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
        // users: 6, dokter: 5, jadwal_dokter: 25

        // ─── SesiPraktik: 21 hari (20 hari lalu + hari ini) ──────────────────
        // 21 × 5 = 105 record
        for ($i = 20; $i >= 0; $i--) {
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

        // ─── Pasien (76) + User pasien ───────────────────────────────────────
        $pasienRawData = [
            ['3201010101010001', 'Budi Santoso',       '1990-05-15', 'L', 'Jl. Merdeka No. 10',      '087712345601', 'budi@email.com',       'A'],
            ['3201010101010002', 'Sari Dewi',           '1988-03-20', 'P', 'Jl. Sudirman No. 5',      '087712345602', 'sari@email.com',       'B'],
            ['3201010101010003', 'Ahmad Ridho',         '1995-07-10', 'L', 'Jl. Gatot Subroto 3',     '087712345603', 'ahmad.r@email.com',    'O'],
            ['3201010101010004', 'Nur Aisyah',          '2000-01-25', 'P', 'Jl. Diponegoro No. 8',    '087712345604', 'nur@email.com',        'AB'],
            ['3201010101010005', 'Rizki Pratama',       '1985-11-30', 'L', 'Jl. Veteran No. 12',      '087712345605', 'rizki@email.com',      'A'],
            ['3201010101010006', 'Fitri Handayani',     '1993-06-14', 'P', 'Jl. Imam Bonjol 7',       '087712345606', 'fitri@email.com',      'O'],
            ['3201010101010007', 'Deni Kurniawan',      '1978-09-05', 'L', 'Jl. Cendana No. 3',       '087712345607', 'deni@email.com',       'B'],
            ['3201010101010008', 'Ratna Sari',          '2003-04-22', 'P', 'Jl. Mangga No. 15',       '087712345608', 'ratna@email.com',      'AB'],
            ['3201010101010009', 'Hendra Wijaya',       '1970-12-08', 'L', 'Jl. Nangka No. 9',        '087712345609', 'hendra@email.com',     'O'],
            ['3201010101010010', 'Maya Putri',          '1998-08-17', 'P', 'Jl. Pisang No. 21',       '087712345610', 'maya@email.com',       'A'],
            ['3201010101010011', 'Eko Prasetyo',        '1982-02-28', 'L', 'Jl. Kelapa No. 6',        '087712345611', 'eko@email.com',        'B'],
            ['3201010101010012', 'Lestari Wulandari',   '1996-10-03', 'P', 'Jl. Rambutan No. 14',     '087712345612', 'lestari@email.com',    'O'],
            ['3201010101010013', 'Agus Setiawan',       '1975-07-19', 'L', 'Jl. Jeruk No. 4',         '087712345613', 'agus@email.com',       'A'],
            ['3201010101010014', 'Dewi Rahayu',         '2001-05-06', 'P', 'Jl. Salak No. 11',        '087712345614', 'dewi@email.com',       'AB'],
            ['3201010101010015', 'Faisal Hakim',        '1989-03-13', 'L', 'Jl. Anggur No. 18',       '087712345615', 'faisal@email.com',     'O'],
            ['3201010101010016', 'Indah Permata',       '1994-11-25', 'P', 'Jl. Durian No. 2',        '087712345616', 'indah@email.com',      'A'],
            ['3201010101010017', 'Bima Sakti',          '1987-08-30', 'L', 'Jl. Manggis No. 7',       '087712345617', 'bima@email.com',       'B'],
            ['3201010101010018', 'Citra Lestari',       '2002-01-16', 'P', 'Jl. Pepaya No. 13',       '087712345618', 'citra@email.com',      'O'],
            ['3201010101010019', 'Rendi Saputra',       '1991-06-22', 'L', 'Jl. Sirsak No. 5',        '087712345619', 'rendi@email.com',      'AB'],
            ['3201010101010020', 'Yunita Sari',         '1997-04-09', 'P', 'Jl. Jambu No. 16',        '087712345620', 'yunita@email.com',     'A'],
            ['3201010101010021', 'Wahyu Hidayat',       '1983-09-11', 'L', 'Jl. Kenanga No. 8',       '087712345621', 'wahyu@email.com',      'B'],
            ['3201010101010022', 'Putri Amalia',        '1999-07-23', 'P', 'Jl. Melati No. 3',        '087712345622', 'putri.a@email.com',    'O'],
            ['3201010101010023', 'Fajar Nugroho',       '1986-12-04', 'L', 'Jl. Mawar No. 17',        '087712345623', 'fajar@email.com',      'A'],
            ['3201010101010024', 'Siska Amelia',        '2004-02-18', 'P', 'Jl. Dahlia No. 6',        '087712345624', 'siska@email.com',      'AB'],
            ['3201010101010025', 'Iwan Setiawan',       '1976-05-29', 'L', 'Jl. Teratai No. 12',      '087712345625', 'iwan@email.com',       'O'],
            ['3201010101010026', 'Rosmawati',           '1992-08-07', 'P', 'Jl. Anyelir No. 9',       '087712345626', 'rosmawati@email.com',  'A'],
            ['3201010101010027', 'Hendri Purnama',      '1980-03-16', 'L', 'Jl. Flamboyan No. 4',     '087712345627', 'hendri@email.com',     'B'],
            ['3201010101010028', 'Novita Sari',         '2000-11-02', 'P', 'Jl. Bougenville No. 20',  '087712345628', 'novita@email.com',     'O'],
            ['3201010101010029', 'Andi Wijaya',         '1973-06-25', 'L', 'Jl. Kamboja No. 1',       '087712345629', 'andi.w@email.com',     'A'],
            ['3201010101010030', 'Dian Puspita',        '1995-09-14', 'P', 'Jl. Seruni No. 15',       '087712345630', 'dian@email.com',       'AB'],
            ['3201010101010031', 'Sukmawati',           '1988-04-28', 'P', 'Jl. Kacapiring No. 7',    '087712345631', 'sukma@email.com',      'B'],
            ['3201010101010032', 'Teguh Priyanto',      '1979-01-09', 'L', 'Jl. Cemara No. 11',       '087712345632', 'teguh@email.com',      'O'],
            ['3201010101010033', 'Wulandari',           '1997-07-17', 'P', 'Jl. Pinus No. 3',         '087712345633', 'wulan@email.com',      'A'],
            ['3201010101010034', 'Ramlan Hakim',        '1984-10-06', 'L', 'Jl. Cemara No. 8',        '087712345634', 'ramlan@email.com',     'AB'],
            ['3201010101010035', 'Suci Ramadhani',      '2001-03-21', 'P', 'Jl. Akasia No. 14',       '087712345635', 'suci@email.com',       'O'],
            ['3201010101010036', 'Bambang Suryanto',    '1969-08-13', 'L', 'Jl. Meranti No. 6',       '087712345636', 'bambang@email.com',    'A'],
            ['3201010101010037', 'Elisa Permata',       '1993-12-01', 'P', 'Jl. Jati No. 19',         '087712345637', 'elisa@email.com',      'B'],
            ['3201010101010038', 'Galih Prasetyo',      '1990-05-26', 'L', 'Jl. Ulin No. 2',          '087712345638', 'galih@email.com',      'O'],
            ['3201010101010039', 'Hasna Maulidia',      '2003-09-08', 'P', 'Jl. Sonokeling No. 10',   '087712345639', 'hasna@email.com',      'A'],
            ['3201010101010040', 'Irwan Syahputra',     '1977-02-15', 'L', 'Jl. Merbau No. 5',        '087712345640', 'irwan@email.com',      'AB'],
            ['3201010101010041', 'Jasmani',             '1985-06-30', 'P', 'Jl. Randu No. 16',        '087712345641', 'jasmani@email.com',    'O'],
            ['3201010101010042', 'Kurniadi',            '1994-11-19', 'L', 'Jl. Bungur No. 4',        '087712345642', 'kurniadi@email.com',   'A'],
            ['3201010101010043', 'Lina Octavia',        '1999-04-07', 'P', 'Jl. Johar No. 13',        '087712345643', 'lina@email.com',       'B'],
            ['3201010101010044', 'Muhamad Iqbal',       '1987-01-24', 'L', 'Jl. Keluwih No. 7',       '087712345644', 'iqbal@email.com',      'O'],
            ['3201010101010045', 'Nanda Safitri',       '2002-08-11', 'P', 'Jl. Pelem No. 18',        '087712345645', 'nanda@email.com',      'A'],
            ['3201010101010046', 'Oky Firmansyah',      '1981-05-02', 'L', 'Jl. Kepuh No. 9',         '087712345646', 'oky@email.com',        'AB'],
            ['3201010101010047', 'Priska Melani',       '1996-10-27', 'P', 'Jl. Krandan No. 1',       '087712345647', 'priska@email.com',     'O'],
            ['3201010101010048', 'Qodir Maulana',       '1974-07-18', 'L', 'Jl. Bambu No. 12',        '087712345648', 'qodir@email.com',      'A'],
            ['3201010101010049', 'Rina Apriani',        '1991-02-09', 'P', 'Jl. Rotan No. 6',         '087712345649', 'rina@email.com',       'B'],
            ['3201010101010050', 'Sahrul Gunawan',      '1983-09-22', 'L', 'Jl. Enau No. 15',         '087712345650', 'sahrul@email.com',     'O'],
            ['3201010101010051', 'Taufik Hidayat',      '1998-04-14', 'L', 'Jl. Aren No. 3',          '087712345651', 'taufik@email.com',     'A'],
            ['3201010101010052', 'Ulfah Azizah',        '2000-01-05', 'P', 'Jl. Sagu No. 11',         '087712345652', 'ulfah@email.com',      'AB'],
            ['3201010101010053', 'Vino Ramadhan',       '1989-07-28', 'L', 'Jl. Nipah No. 8',         '087712345653', 'vino@email.com',       'O'],
            ['3201010101010054', 'Widya Ningrum',       '1995-12-16', 'P', 'Jl. Pinang No. 20',       '087712345654', 'widya@email.com',      'A'],
            ['3201010101010055', 'Xaverius Hadi',       '1978-03-09', 'L', 'Jl. Lontar No. 4',        '087712345655', 'xaverius@email.com',   'B'],
            ['3201010101010056', 'Yeni Susanti',        '1992-10-23', 'P', 'Jl. Gebang No. 17',       '087712345656', 'yeni@email.com',       'O'],
            ['3201010101010057', 'Zulkifli',            '1986-06-04', 'L', 'Jl. Gebang No. 2',        '087712345657', 'zulkifli@email.com',   'A'],
            ['3201010101010058', 'Alfiani Putri',       '2001-09-19', 'P', 'Jl. Pangkas No. 13',      '087712345658', 'alfiani@email.com',    'AB'],
            ['3201010101010059', 'Bagas Riyadi',        '1984-04-08', 'L', 'Jl. Tebu No. 7',          '087712345659', 'bagas@email.com',      'O'],
            ['3201010101010060', 'Cantika Putri',       '1997-11-27', 'P', 'Jl. Jagung No. 5',        '087712345660', 'cantika@email.com',    'A'],
            ['3201010101010061', 'Darmawan',            '1975-02-11', 'L', 'Jl. Padi No. 9',          '087712345661', 'darmawan@email.com',   'B'],
            ['3201010101010062', 'Erlina Sari',         '1993-08-06', 'P', 'Jl. Kedelai No. 14',      '087712345662', 'erlina@email.com',     'O'],
            ['3201010101010063', 'Firdaus Azhar',       '1988-05-24', 'L', 'Jl. Kacang No. 1',        '087712345663', 'firdaus@email.com',    'A'],
            ['3201010101010064', 'Gita Safira',         '2003-12-13', 'P', 'Jl. Kacang No. 18',       '087712345664', 'gita@email.com',       'AB'],
            ['3201010101010065', 'Hamid Fathoni',       '1971-07-02', 'L', 'Jl. Ubi No. 6',           '087712345665', 'hamid@email.com',      'O'],
            ['3201010101010066', 'Ika Rahmawati',       '1996-02-21', 'P', 'Jl. Singkong No. 10',     '087712345666', 'ika@email.com',        'A'],
            ['3201010101010067', 'Joko Susilo',         '1980-09-15', 'L', 'Jl. Talas No. 3',         '087712345667', 'joko@email.com',       'B'],
            ['3201010101010068', 'Kartini Dewi',        '1999-06-07', 'P', 'Jl. Garut No. 16',        '087712345668', 'kartini@email.com',    'O'],
            ['3201010101010069', 'Lukman Hakim',        '1987-01-30', 'L', 'Jl. Lumbu No. 4',         '087712345669', 'lukman@email.com',     'A'],
            ['3201010101010070', 'Maisyarah',           '1994-08-19', 'P', 'Jl. Wortel No. 12',       '087712345670', 'maisyarah@email.com',  'AB'],
            ['3201010101010071', 'Nasrul Hadi',         '1982-03-28', 'L', 'Jl. Bayam No. 8',         '087712345671', 'nasrul@email.com',     'O'],
            ['3201010101010072', 'Olga Febriani',       '2000-10-17', 'P', 'Jl. Kangkung No. 19',     '087712345672', 'olga@email.com',       'A'],
            ['3201010101010073', 'Prasetyo Adi',        '1976-05-06', 'L', 'Jl. Sawi No. 2',          '087712345673', 'prasetyo@email.com',   'B'],
            ['3201010101010074', 'Qurrotul Aini',       '1991-12-25', 'P', 'Jl. Tomat No. 11',        '087712345674', 'qurrotul@email.com',   'O'],
            ['3201010101010075', 'Raharjo Wibowo',      '1967-08-14', 'L', 'Jl. Terong No. 7',        '087712345675', 'raharjo@email.com',    'A'],
            ['3201010101010076', 'Septiana Dewi',       '1998-03-03', 'P', 'Jl. Mentimun No. 15',     '087712345676', 'septiana@email.com',   'AB'],
        ];

        $pasiens = [];
        foreach ($pasienRawData as [$nik, $nama, $lahir, $jk, $alamat, $telp, $email, $goldar]) {
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
            User::create([
                'nama'         => $nama,
                'email'        => $email,
                'password'     => Hash::make('pasien123'),
                'role'         => 'pasien',
                'reference_id' => $p->pasien_id,
            ]);
            $pasiens[] = $p;
        }
        // users total: 1 admin + 5 dokter + 76 pasien = 82

        // ─── Obat (80) ───────────────────────────────────────────────────────
        $obatData = [
            // [nama, kategori, satuan, stok, stok_min, harga, kadaluarsa]
            ['Paracetamol 500mg',         'Analgetik',       'Tablet',   200, 20,  2500,   '2027-12-31'],
            ['Amoxicillin 500mg',         'Antibiotik',      'Kapsul',   150, 15,  8000,   '2027-06-30'],
            ['Vitamin C 500mg',           'Vitamin',         'Tablet',   250, 20,  3000,   '2027-12-31'],
            ['Ibuprofen 400mg',           'Analgetik',       'Tablet',   180, 20,  4000,   '2027-09-30'],
            ['Antasida',                  'Antasida',        'Tablet',   300, 30,  1500,   '2027-12-31'],
            ['Cetirizine 10mg',           'Antihistamin',    'Tablet',   120, 15,  5000,   '2027-08-31'],
            ['Metformin 500mg',           'Antidiabetik',    'Tablet',   180, 25,  6000,   '2027-11-30'],
            ['Omeprazole 20mg',           'Antasida',        'Kapsul',   90,  20,  7500,   '2027-10-31'],
            ['Salbutamol Inhaler',        'Bronkodilator',   'Inhaler',  50,  10,  45000,  '2027-07-31'],
            ['Dexamethasone 0.5mg',       'Kortikosteroid',  'Tablet',   100, 20,  3500,   '2027-12-31'],
            ['Amlodipine 5mg',            'Antihipertensi',  'Tablet',   150, 20,  5500,   '2027-11-30'],
            ['Simvastatin 20mg',          'Antilipid',       'Tablet',   120, 15,  6000,   '2027-10-31'],
            ['Ciprofloxacin 500mg',       'Antibiotik',      'Tablet',   100, 15,  9000,   '2027-09-30'],
            ['Loratadine 10mg',           'Antihistamin',    'Tablet',   130, 15,  4500,   '2027-12-31'],
            ['Ranitidin 150mg',           'Antasida',        'Tablet',   160, 20,  3500,   '2027-11-30'],
            ['Tramadol 50mg',             'Analgetik',       'Kapsul',   80,  10,  8500,   '2027-08-31'],
            ['Klindamisin 300mg',         'Antibiotik',      'Kapsul',   90,  12,  11000,  '2027-07-31'],
            ['Metronidazole 500mg',       'Antibiotik',      'Tablet',   110, 15,  5500,   '2027-10-31'],
            ['Salep Hidrokortison',       'Kortikosteroid',  'Tube',     60,  8,   12000,  '2027-06-30'],
            ['Betahistine 16mg',          'Antivertigo',     'Tablet',   70,  10,  7000,   '2027-09-30'],
            ['Captopril 25mg',            'Antihipertensi',  'Tablet',   140, 20,  4500,   '2027-12-31'],
            ['Glibenclamide 5mg',         'Antidiabetik',    'Tablet',   100, 15,  5000,   '2027-11-30'],
            ['Vitamin B Kompleks',        'Vitamin',         'Tablet',   200, 25,  3000,   '2027-12-31'],
            ['Vitamin D 1000IU',          'Vitamin',         'Kapsul',   150, 20,  8000,   '2027-10-31'],
            ['Zinc Sulfat 20mg',          'Vitamin',         'Tablet',   100, 15,  4000,   '2027-12-31'],
            ['Natrium Diklofenak 50mg',   'Analgetik',       'Tablet',   120, 15,  5500,   '2027-09-30'],
            ['Meloxicam 15mg',            'Analgetik',       'Tablet',   100, 12,  7000,   '2027-08-31'],
            ['Piroxicam 20mg',            'Analgetik',       'Kapsul',   80,  10,  6500,   '2027-07-31'],
            ['Asam Mefenamat 500mg',      'Analgetik',       'Kapsul',   150, 20,  4500,   '2027-11-30'],
            ['Codein 10mg',               'Analgetik',       'Tablet',   50,  8,   9000,   '2027-10-31'],
            ['Domperidon 10mg',           'Antiemetik',      'Tablet',   100, 15,  4000,   '2027-12-31'],
            ['Ondansetron 4mg',           'Antiemetik',      'Tablet',   80,  10,  8500,   '2027-09-30'],
            ['Metoklopramid 10mg',        'Antiemetik',      'Tablet',   90,  12,  3500,   '2027-11-30'],
            ['Furosemid 40mg',            'Diuretik',        'Tablet',   80,  10,  3000,   '2027-12-31'],
            ['Spironolakton 25mg',        'Diuretik',        'Tablet',   70,  10,  5500,   '2027-10-31'],
            ['Digoksin 0.25mg',           'Kardiologi',      'Tablet',   60,  8,   4500,   '2027-08-31'],
            ['Bisoprolol 5mg',            'Kardiologi',      'Tablet',   90,  12,  7500,   '2027-09-30'],
            ['Lisinopril 10mg',           'Antihipertensi',  'Tablet',   100, 15,  6000,   '2027-11-30'],
            ['Valsartan 80mg',            'Antihipertensi',  'Kapsul',   80,  10,  9000,   '2027-10-31'],
            ['Atorvastatin 20mg',         'Antilipid',       'Tablet',   110, 15,  7000,   '2027-12-31'],
            ['Fenofibrat 300mg',          'Antilipid',       'Kapsul',   70,  10,  8500,   '2027-09-30'],
            ['Allopurinol 100mg',         'Antiasam Urat',   'Tablet',   120, 15,  3500,   '2027-12-31'],
            ['Colchicine 0.5mg',          'Antiasam Urat',   'Tablet',   80,  10,  6000,   '2027-08-31'],
            ['Insulin Reguler',           'Antidiabetik',    'Vial',     30,  5,   65000,  '2027-06-30'],
            ['Insulin Analog',            'Antidiabetik',    'Pen',      25,  5,   120000, '2027-07-31'],
            ['Salep Eritromisin',         'Antibiotik',      'Tube',     50,  8,   15000,  '2027-11-30'],
            ['Tetes Mata Kloramfenikol',  'Antibiotik',      'Botol',    40,  6,   18000,  '2027-10-31'],
            ['Tetes Telinga Ofloxacin',   'Antibiotik',      'Botol',    35,  5,   20000,  '2027-09-30'],
            ['Fluconazole 150mg',         'Antijamur',       'Kapsul',   60,  8,   12000,  '2027-12-31'],
            ['Ketoconazole Krim',         'Antijamur',       'Tube',     50,  6,   14000,  '2027-11-30'],
            ['Acyclovir 400mg',           'Antivirus',       'Tablet',   70,  10,  10000,  '2027-10-31'],
            ['Albendazole 400mg',         'Antiparasit',     'Tablet',   80,  10,  7500,   '2027-12-31'],
            ['Mebendazole 100mg',         'Antiparasit',     'Tablet',   70,  8,   5000,   '2027-11-30'],
            ['ORS Oralit',                'Rehidrasi',       'Sachet',   200, 30,  2000,   '2027-12-31'],
            ['Ringer Laktat',             'Cairan Infus',    'Botol',    50,  10,  15000,  '2027-12-31'],
            ['NaCl 0.9%',                 'Cairan Infus',    'Botol',    50,  10,  12000,  '2027-12-31'],
            ['Dextrose 5%',               'Cairan Infus',    'Botol',    40,  8,   13000,  '2027-12-31'],
            ['Asam Folat 0.4mg',          'Vitamin',         'Tablet',   150, 20,  2500,   '2027-12-31'],
            ['Ferrous Sulfat 300mg',      'Vitamin',         'Tablet',   120, 15,  3000,   '2027-11-30'],
            ['Kalsium Karbonat 500mg',    'Suplemen',        'Tablet',   100, 15,  4000,   '2027-12-31'],
            ['Magnesium B6',              'Suplemen',        'Tablet',   80,  10,  5500,   '2027-10-31'],
            ['Propranolol 40mg',          'Kardiologi',      'Tablet',   90,  12,  4500,   '2027-12-31'],
            ['Nifedipine 10mg',           'Antihipertensi',  'Tablet',   80,  10,  5000,   '2027-11-30'],
            ['Isosorbide Dinitrat',       'Kardiologi',      'Tablet',   60,  8,   6000,   '2027-09-30'],
            ['Warfarin 5mg',              'Antikoagulan',    'Tablet',   40,  6,   9000,   '2027-08-31'],
            ['Clopidogrel 75mg',          'Antiplatelet',    'Tablet',   80,  10,  15000,  '2027-12-31'],
            ['Asam Asetilsalisilat 80mg', 'Antiplatelet',    'Tablet',   150, 20,  2000,   '2027-12-31'],
            ['Theophylline 200mg',        'Bronkodilator',   'Tablet',   70,  10,  5500,   '2027-10-31'],
            ['Ipratropium Inhaler',       'Bronkodilator',   'Inhaler',  30,  5,   55000,  '2027-09-30'],
            ['Budesonide Inhaler',        'Kortikosteroid',  'Inhaler',  25,  5,   85000,  '2027-08-31'],
            ['Dimenhidrinat 50mg',        'Antivertigo',     'Tablet',   90,  12,  4000,   '2027-12-31'],
            ['Phenobarbital 30mg',        'Antikonvulsan',   'Tablet',   60,  8,   5500,   '2027-11-30'],
            ['Carbamazepine 200mg',       'Antikonvulsan',   'Tablet',   70,  10,  7000,   '2027-10-31'],
            ['Diazepam 5mg',              'Anxiolitik',      'Tablet',   50,  8,   6500,   '2027-09-30'],
            ['Alprazolam 0.25mg',         'Anxiolitik',      'Tablet',   40,  6,   8000,   '2027-08-31'],
            ['Amitriptyline 25mg',        'Antidepresan',    'Tablet',   50,  8,   7000,   '2027-11-30'],
            ['Fluoxetine 20mg',           'Antidepresan',    'Kapsul',   45,  6,   9500,   '2027-10-31'],
            ['Haloperidol 5mg',           'Antipsikotik',    'Tablet',   35,  5,   8000,   '2027-09-30'],
            ['Vitamin E 400IU',           'Vitamin',         'Kapsul',   100, 15,  6000,   '2027-12-31'],
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

        // ─── StokObatLog MASUK awal (80 log, satu per obat) ──────────────────
        foreach ($obats as $obat) {
            StokObatLog::create([
                'obat_id'    => $obat->obat_id,
                'tipe'       => 'MASUK',
                'jumlah'     => $obat->stok_tersedia,
                'keterangan' => 'Stok awal pengadaan',
                'created_by' => $adminUser->id,
            ]);
        }

        // ─── Appointments + data turunan ─────────────────────────────────────
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
            'Nyeri dada saat aktivitas',
            'Batuk lebih dari 2 minggu',
            'Pusing dan sempoyongan',
            'Ruam merah di wajah',
            'Kencing tidak lancar',
            'Susah tidur dan gelisah',
            'Perut kembung dan begah',
            'Nyeri punggung bawah',
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
            'Angina pektoris stabil',
            'Tuberkulosis paru tersangka',
            'Vertigo sentral',
            'Rosacea',
            'Infeksi saluran kemih',
            'Insomnia primer',
            'Gastritis kronis',
            'Lumbal spondilosis',
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
            'Nitrat kerja pendek dan rujuk kardiologi',
            'Sputum TCM dan foto toraks',
            'Betahistine dan observasi',
            'Sunscreen dan edukasi perawatan kulit',
            'Antibiotik dan hidrasi cukup',
            'Relaksasi dan edukasi sleep hygiene',
            'Antasida dan pola makan teratur',
            'Analgetik dan fisioterapi tulang belakang',
        ];

        $nomorAntrian  = [];
        $aptCounter    = 0; // counter semua appointment
        $selesaiCounter = 0; // counter hanya appointment SELESAI

        // 20 hari lalu + hari ini = 21 hari
        // Past: 20 hari × 4 appointment = 80 appointment
        // Hari ini: 5 appointment
        // Total: 85 appointment
        for ($dayOffset = 20; $dayOffset >= 0; $dayOffset--) {
            $tanggal = $today->copy()->subDays($dayOffset);
            $dateStr = $tanggal->toDateString();
            $isPast  = ($dayOffset > 0);
            $jumlah  = $isPast ? 4 : 5;

            if (!isset($nomorAntrian[$dateStr])) {
                $nomorAntrian[$dateStr] = 0;
            }

            for ($j = 0; $j < $jumlah; $j++) {
                $aptCounter++;
                $pasien = $pasiens[$aptCounter % count($pasiens)];
                $dokter = $dokters[$j % count($dokters)];
                $idx    = $aptCounter % count($keluhanList);

                $slotMenit = ($j % 12) * 30;
                $jam = sprintf('%02d:%02d', 8 + intdiv($slotMenit, 60), $slotMenit % 60);

                $nomorAntrian[$dateStr]++;

                // Status appointment
                if ($isPast) {
                    // Setiap kelipatan 10 → BATAL/ABSEN, sisanya SELESAI (~72 SELESAI dari 80 past)
                    if ($aptCounter % 10 === 0) {
                        $status = ($aptCounter % 20 === 0) ? 'ABSEN' : 'BATAL';
                    } else {
                        $status = 'SELESAI';
                    }
                } else {
                    $todayPool = ['MENUNGGU', 'MENUNGGU', 'DIKONFIRMASI', 'HADIR', 'MENUNGGU'];
                    $status = $todayPool[$j % count($todayPool)];
                }

                $batasHadir = Carbon::parse($dateStr . ' ' . $jam)->addMinutes(15);

                $apt = Appointment::create([
                    'pasien_id'       => $pasien->pasien_id,
                    'dokter_id'       => $dokter->dokter_id,
                    'tgl_appointment' => $dateStr,
                    'jam_appointment' => $jam,
                    'nomor_antrian'   => $nomorAntrian[$dateStr],
                    'keluhan_awal'    => $keluhanList[$idx],
                    'status'          => $status,
                    'batas_hadir'     => $batasHadir->toDateTimeString(),
                ]);

                // ── Antrian (satu per appointment = 85 total) ──
                $antrianStatus = match($status) {
                    'SELESAI'      => 'SELESAI',
                    'BATAL'        => 'BATAL',
                    'ABSEN'        => 'BATAL',
                    'HADIR'        => 'DIPANGGIL',
                    'DIKONFIRMASI' => 'MENUNGGU',
                    default        => 'MENUNGGU',
                };

                Antrian::create([
                    'pasien_id'      => $pasien->pasien_id,
                    'dokter_id'      => $dokter->dokter_id,
                    'appointment_id' => $apt->appointment_id,
                    'nomor_antrian'  => $nomorAntrian[$dateStr],
                    'tanggal'        => $dateStr,
                    'status'         => $antrianStatus,
                    'jenis'          => 'BOOKING',
                ]);

                if ($status !== 'SELESAI') {
                    continue;
                }

                $selesaiCounter++;

                // ── VitalSigns (satu per SELESAI ≈ 72 total) ──
                VitalSigns::create([
                    'appointment_id'   => $apt->appointment_id,
                    'tekanan_darah'    => rand(100, 150) . '/' . rand(60, 95),
                    'suhu_tubuh'       => round(rand(365, 385) / 10, 1),
                    'berat_badan'      => round(rand(450, 900) / 10, 1),
                    'tinggi_badan'     => rand(150, 180),
                    'saturasi_oksigen' => rand(94, 99),
                    'catatan_perawat'  => 'Pasien kooperatif, tanda vital dalam batas normal.',
                ]);

                // ── RekamMedis (satu per SELESAI ≈ 72 total) ──
                $rekam = RekamMedis::create([
                    'appointment_id'   => $apt->appointment_id,
                    'dokter_id'        => $dokter->dokter_id,
                    'tgl_periksa'      => $dateStr,
                    'keluhan'          => $keluhanList[$idx],
                    'diagnosis'        => $diagnosisList[$idx],
                    'tindakan'         => $tindakanList[$idx],
                    'tekanan_darah'    => rand(110, 145) . '/' . rand(70, 95),
                    'berat_badan'      => round(rand(450, 900) / 10, 1),
                    'catatan_tambahan' => 'Kontrol ulang 1 minggu jika tidak membaik.',
                ]);

                // ── Resep pertama (selalu ada, ≈ 72 total) ──
                $obatIdx1    = $idx % count($obats);
                $statusAmbil = ($selesaiCounter % 3 === 0) ? 'BELUM_DIAMBIL' : 'SUDAH_DIAMBIL';

                Resep::create([
                    'rekam_id'     => $rekam->rekam_id,
                    'obat_id'      => $obats[$obatIdx1]->obat_id,
                    'dosis'        => '1 tablet',
                    'durasi'       => '5 hari',
                    'aturan_pakai' => '3x sehari sesudah makan',
                    'jumlah'       => 15,
                    'status_ambil' => $statusAmbil,
                ]);

                if ($statusAmbil === 'SUDAH_DIAMBIL') {
                    StokObatLog::create([
                        'obat_id'    => $obats[$obatIdx1]->obat_id,
                        'tipe'       => 'KELUAR',
                        'jumlah'     => 15,
                        'keterangan' => 'Pengeluaran resep pasien',
                        'created_by' => $adminUser->id,
                    ]);
                }

                // ── Resep kedua (genap, ≈ 36 tambahan) ──
                if ($selesaiCounter % 2 === 0) {
                    $obatIdx2 = ($idx + 1) % count($obats);
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

                // ── Tagihan (satu per SELESAI ≈ 72 total) ──
                $biayaKonsultasi = $dokter->biaya_konsultasi;
                $biayaObat       = (($idx % 5) + 1) * 15000;
                $totalBiaya      = $biayaKonsultasi + $biayaObat;

                $statusBayarPool = ['LUNAS', 'LUNAS', 'LUNAS', 'BELUM_BAYAR', 'SEBAGIAN'];
                $statusBayar     = $statusBayarPool[$selesaiCounter % count($statusBayarPool)];
                $metodeBayar     = ($statusBayar === 'LUNAS')
                    ? (($selesaiCounter % 2 === 0) ? 'TUNAI' : 'TRANSFER')
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

                // ── TagihanDetail (2 per tagihan ≈ 144 total) ──
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
