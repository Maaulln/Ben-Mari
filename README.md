# Klinik BenMari — Sistem Informasi Klinik Terintegrasi

Aplikasi web full-stack untuk manajemen klinik yang komprehensif dengan fitur appointment, antrian, rekam medis, manajemen obat, farmasi, dan billing terintegrasi.

---

## Daftar Isi

- [Status Implementasi](#status-implementasi)
- [Fitur Utama](#fitur-utama)
- [Tech Stack](#tech-stack)
- [Koneksi Laravel ke Oracle](#koneksi-laravel-ke-oracle-yajralaravel-oci8)
- [Prerequisites](#prerequisites)
- [Instalasi & Setup](#instalasi--setup)
- [Menjalankan Aplikasi](#menjalankan-aplikasi)
- [Struktur Project](#struktur-project)
- [Database](#database)
- [API Documentation](#api-documentation)
- [User Roles & Flow](#user-roles--flow)
- [Business Logic](#business-logic)
- [Troubleshooting](#troubleshooting)

---

## Status Implementasi

Berikut adalah daftar halaman/fitur yang telah selesai dibangun:

### Admin Panel

| Halaman | Status | Keterangan |
|---|---|---|
| Dashboard | Selesai | Statistik klinik, grafik appointment 7 hari, distribusi status |
| Pasien | Selesai | CRUD data pasien lengkap |
| Dokter | Selesai | CRUD data dokter + manajemen jadwal praktik |
| Appointment | Selesai | Lihat & kelola janji temu, konfirmasi, batal |
| Antrian | Selesai | Antrian harian (walk-in + booking), filter tanggal & dokter, Panggil/Selesai/Batal |
| Farmasi / Resep | Selesai | Daftar resep, filter status, Serahkan obat (kurangi stok) / Batal |
| Rekam Medis | Selesai | Lihat rekam medis semua pasien |
| Obat | Selesai | CRUD obat, stok masuk, alert stok menipis |
| Tagihan | Selesai | Daftar tagihan, modal detail rincian biaya, tandai lunas + metode bayar, cetak struk |
| Laporan | Selesai | Laporan kunjungan & pendapatan harian/bulanan dengan fungsi print |
| Pengaturan | Selesai | Pengaturan profil klinik (nama, alamat, telepon, email, jam operasional) |

### Dokter Portal

| Halaman | Status | Keterangan |
|---|---|---|
| Dashboard Dokter | Selesai | Statistik pasien hari ini, appointment pending |
| Jadwal & Pasien | Selesai | Daftar pasien hari ini per dokter |
| Input Rekam Medis | Selesai | Diagnosis, tindakan, tekanan darah, berat badan |
| Resep | Selesai | Pembuatan resep obat per pasien |
| Vital Signs | Selesai | Lihat vital signs yang diisi perawat/admin |

### Pasien Portal

| Halaman | Status | Keterangan |
|---|---|---|
| Register | Selesai | Registrasi mandiri dengan validasi NIK, email, password |
| Login | Selesai | Login dengan email + password |
| Dashboard Pasien | Selesai | Appointment terdekat, ringkasan status |
| Booking Appointment | Selesai | Pilih dokter, tanggal, sesi jam, input keluhan |
| Riwayat Appointment | Selesai | Daftar appointment dengan status real-time, batalkan |
| Check-in | Selesai | Self check-in saat tiba di klinik |
| Rekam Medis | Selesai | Riwayat rekam medis pribadi |
| Tagihan | Selesai | Daftar tagihan dan status pembayaran |
| Profil | Selesai | Edit profil + ganti password |

### Backend & Infrastruktur

| Komponen | Status | Keterangan |
|---|---|---|
| Auth (Sanctum) | Selesai | Login, register, logout, token bearer |
| Role Middleware | Selesai | `CheckRole` middleware per-route untuk Admin, Dokter, Pasien |
| Oracle Database | Selesai | Koneksi ke Oracle 21c via Docker + yajra/oci8 |
| Database Seeder | Selesai | 70–100+ record per tabel (76 pasien, 79 obat, 85 appointment, dst.) |
| Laporan API | Selesai | `/laporan/kunjungan` dan `/laporan/pendapatan` harian/bulanan |
| Pengaturan API | Selesai | `GET/PUT /pengaturan` untuk konfigurasi profil klinik |

---

## Fitur Utama

### Admin Dashboard

- Dashboard statistik klinik (total pasien, appointment hari ini, tagihan pending, stok menipis)
- Grafik bar appointment 7 hari terakhir + pie distribusi status
- Manajemen data pasien (CRUD lengkap)
- Manajemen data dokter, spesialisasi, dan jadwal praktik per hari
- Manajemen appointment dengan filter status
- **Manajemen antrian harian**: filter tanggal & dokter, Panggil → Selesai → Batal, tambah pasien walk-in
- **Farmasi**: daftar resep, serahkan obat (stok otomatis berkurang), batalkan resep
- Manajemen rekam medis pasien
- Manajemen obat, inventori, stok masuk, alert stok menipis
- **Tagihan**: modal rincian biaya per komponen, pilih metode pembayaran, cetak struk
- **Laporan**: kunjungan & pendapatan harian/bulanan dengan fitur cetak laporan
- **Pengaturan klinik**: nama, alamat, telepon, email, jam operasional

### Dokter Portal

- Dashboard statistik dokter (pasien hari ini, appointment pending)
- Lihat jadwal dan daftar pasien pribadi
- Input rekam medis (diagnosis, tindakan, tekanan darah, berat badan, catatan)
- Pembuatan resep obat per pasien
- Lihat riwayat treatment pasien

### Pasien Portal

- Registrasi mandiri dengan validasi NIK (16 digit), telepon, email, password
- Login dan manajemen sesi
- Booking appointment (pilih dokter, tanggal, sesi/jam, keluhan)
- Lihat status appointment secara real-time
- Self check-in saat tiba di klinik (dengan batas waktu & status keterlambatan)
- Akses rekam medis pribadi
- Lihat tagihan dan status pembayaran
- Edit profil dan ganti password

### Fitur Umum

- Sistem autentikasi berbasis token (Laravel Sanctum)
- Role-based access control per-route (Admin, Dokter, Pasien)
- Sistem antrian hybrid (walk-in + booking), urutan booking diprioritaskan
- Manajemen keterlambatan pasien dengan grace period
- Alert stok obat menipis
- Responsive UI, sidebar dapat di-collapse
- Input validation frontend + backend

---

## Tech Stack

### Frontend

- **Framework**: React 18 + TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **HTTP Client**: Axios
- **Icons**: Lucide React

### Backend

- **Framework**: Laravel 10
- **Language**: PHP 8.1+
- **Authentication**: Laravel Sanctum (token bearer)
- **ORM**: Eloquent
- **Database**: Oracle 21c (via Docker)
- **Driver Oracle**: yajra/laravel-oci8
- **PHP Extension**: php-oci8 + Oracle Instant Client

### Infrastructure

- **Containerization**: Docker & Docker Compose
- **Package Manager Frontend**: npm / pnpm

---

## Koneksi Laravel ke Oracle (yajra/laravel-oci8)

Laravel tidak memiliki driver Oracle bawaan. Koneksi ke Oracle membutuhkan dua komponen wajib:

```
PHP Extension (php-oci8)       →  agar PHP bisa bicara ke Oracle
Laravel Package (yajra/oci8)   →  agar Eloquent & Migration jalan normal
Oracle Instant Client          →  library Oracle yang dibutuhkan php-oci8
```

### 1. Install Package Laravel

```bash
composer require yajra/laravel-oci8
```

Daftarkan service provider di `config/app.php`:

```php
'providers' => [
    Yajra\Oci8\Oci8ServiceProvider::class,
],
```

Publish konfigurasi:

```bash
php artisan vendor:publish --tag=oracle
```

### 2. Install PHP Extension (via Docker — Disarankan)

Tambahkan ke `backend/Dockerfile`:

```dockerfile
FROM php:8.1-fpm

RUN apt-get update && apt-get install -y libaio1 unzip curl

RUN mkdir -p /opt/oracle && cd /opt/oracle \
 && curl -o instantclient.zip \
    https://download.oracle.com/otn_software/linux/instantclient/instantclient-basiclite-linuxx64.zip \
 && unzip instantclient.zip && rm instantclient.zip \
 && echo /opt/oracle/instantclient* > /etc/ld.so.conf.d/oracle.conf \
 && ldconfig

RUN docker-php-ext-configure oci8 \
    --with-oci8=instantclient,/opt/oracle/instantclient_21_1 \
 && docker-php-ext-install oci8 pdo_oci

RUN docker-php-ext-install pdo pdo_sqlite
```

### 3. Konfigurasi `.env`

```env
DB_CONNECTION=oracle
DB_HOST=localhost
DB_PORT=1521
DB_DATABASE=FREE
DB_USERNAME=C##KLINIK_ADMIN
DB_PASSWORD=klinik123
DB_CHARSET=AL32UTF8
```

### 4. Konfigurasi `config/database.php`

```php
'oracle' => [
    'driver'         => 'oracle',
    'tns'            => env('DB_TNS', ''),
    'host'           => env('DB_HOST', 'localhost'),
    'port'           => env('DB_PORT', '1521'),
    'database'       => env('DB_DATABASE', 'FREE'),
    'username'       => env('DB_USERNAME', ''),
    'password'       => env('DB_PASSWORD', ''),
    'charset'        => env('DB_CHARSET', 'AL32UTF8'),
    'prefix'         => '',
    'prefix_schema'  => env('DB_SCHEMA_PREFIX', ''),
],
```

### 5. Penyesuaian Migration untuk Oracle

Oracle berbeda dari MySQL — beberapa tipe kolom perlu disesuaikan:

```php
// Tidak kompatibel Oracle
$table->text('catatan');
$table->boolean('is_aktif');

// Kompatibel Oracle (yajra/oci8)
$table->id();                               // NUMBER + SEQUENCE otomatis
$table->string('catatan', 4000);            // VARCHAR2(4000)
$table->integer('is_aktif')->default(1);    // NUMBER(1)
$table->timestamp('created_at');            // TIMESTAMP
```

### Troubleshooting Oracle Connection

**Error: `oci8` extension not found:**

```bash
php -m | grep oci
# Pastikan php.ini sudah ada: extension=oci8.so
```

**Error: `ORA-12541: TNS: no listener`:**

```bash
docker-compose ps
telnet localhost 1521
```

**Error: `ORA-01017: invalid username/password`:**

```bash
# Oracle 21c pakai prefix C## untuk common user
DB_USERNAME=C##KLINIK_ADMIN
```

---

## Prerequisites

- Node.js >= 18.x
- PHP >= 8.1 (dengan extension oci8 & pdo_oci)
- Composer >= 2.0
- Docker & Docker Compose
- Oracle Database 21c (via Docker)

---

## Instalasi & Setup

### 1. Clone Repository

```bash
git clone <repository-url>
cd Ben-Mari
```

### 2. Setup Frontend

```bash
npm install
```

### 3. Setup Backend

```bash
cd backend
composer install
cp .env.example .env
php artisan key:generate
```

### 4. Jalankan Docker (Oracle + Backend)

```bash
# Dari root project
docker-compose up -d
```

### 5. Inisialisasi Database

```bash
# Dari root project (via npm scripts)
npm run db:init

# Atau manual:
cd backend
php artisan migrate
php artisan db:seed
```

### 6. Environment Configuration

**Backend** (`.env`):

```env
APP_NAME=KlinikBenMari
APP_ENV=local
APP_DEBUG=true
APP_URL=http://localhost:8000

DB_CONNECTION=oracle
DB_HOST=oracle-db
DB_PORT=1521
DB_DATABASE=FREE
DB_USERNAME=C##KLINIK_ADMIN
DB_PASSWORD=klinik123

SANCTUM_STATEFUL_DOMAINS=localhost:5173,127.0.0.1:5173
```

---

## Menjalankan Aplikasi

**Terminal 1 — Frontend:**

```bash
npm run dev
# Akses: http://localhost:5173
```

**Terminal 2 — Backend (jika tidak menggunakan Docker untuk backend):**

```bash
cd backend
php artisan serve
# Akses: http://localhost:8000
```

**Atau jalankan backend via Docker:**

```bash
docker-compose up -d
```

### Demo Credentials

| Role   | Email            | Password   |
|--------|------------------|------------|
| Admin  | admin@klinik.com | admin123   |
| Dokter | maria@klinik.com | dokter123  |
| Pasien | budi@email.com   | pasien123  |

---

## Struktur Project

```
Ben-Mari/
├── src/
│   ├── app/
│   │   ├── App.tsx                   # Root router, auth state, role guard
│   │   ├── components/
│   │   │   ├── Sidebar.tsx           # Navigasi sidebar (collapse-able)
│   │   │   ├── Badge.tsx             # Status badge (appointment/payment/antrian/stok)
│   │   │   ├── StatCard.tsx          # Kartu statistik dashboard
│   │   │   └── Modal.tsx
│   │   ├── pages/                    # Halaman Admin
│   │   │   ├── Dashboard.tsx         # Statistik + grafik klinik
│   │   │   ├── Pasien.tsx            # CRUD pasien
│   │   │   ├── Dokter.tsx            # CRUD dokter + jadwal
│   │   │   ├── Appointment.tsx       # Manajemen janji temu
│   │   │   ├── Antrian.tsx           # Antrian harian + walk-in
│   │   │   ├── RekamMedis.tsx        # Rekam medis pasien
│   │   │   ├── Obat.tsx              # Inventori obat + stok masuk
│   │   │   ├── Resep.tsx             # Farmasi: serahkan/batalkan resep
│   │   │   ├── Tagihan.tsx           # Tagihan + modal detail + cetak struk
│   │   │   ├── Laporan.tsx           # Laporan kunjungan & pendapatan + print
│   │   │   └── Pengaturan.tsx        # Profil & pengaturan klinik
│   │   ├── doctor/
│   │   │   └── DoctorApp.tsx         # Portal dokter (self-contained)
│   │   └── patient/
│   │       ├── PatientApp.tsx        # Portal pasien (self-contained)
│   │       └── PatientRegister.tsx   # Form registrasi pasien baru
│   ├── services/
│   │   ├── api.ts                    # Axios instance + interceptor token
│   │   ├── adminService.ts           # Semua service admin (pasien, dokter, obat, laporan, dll.)
│   │   ├── doctorService.ts          # Service khusus portal dokter
│   │   └── patientService.ts         # Service khusus portal pasien
│   └── utils/
│       ├── formatters.ts             # formatRupiah, formatDate, dll.
│       └── validators.ts             # validateNIK, validatePhone, validateEmail
│
├── backend/
│   └── app/
│       ├── Http/
│       │   ├── Controllers/Api/
│       │   │   ├── AuthController.php          # Login, register, logout
│       │   │   ├── PasienController.php
│       │   │   ├── DokterController.php
│       │   │   ├── AppointmentController.php
│       │   │   ├── AntrianController.php        # Antrian + updateStatus
│       │   │   ├── RekamMedisController.php
│       │   │   ├── VitalSignsController.php
│       │   │   ├── ObatController.php           # + stok-masuk, alert-stok
│       │   │   ├── ResepController.php          # + update status_ambil
│       │   │   ├── TagihanController.php        # + detail breakdown
│       │   │   ├── LaporanController.php        # Laporan kunjungan & pendapatan
│       │   │   └── PengaturanController.php     # Profil klinik
│       │   └── Middleware/
│       │       └── CheckRole.php               # Role-based access (Admin/Dokter/Pasien)
│       └── Models/
│           ├── User.php, Pasien.php, Dokter.php
│           ├── Appointment.php, Antrian.php
│           ├── RekamMedis.php, VitalSigns.php
│           ├── Obat.php, StokObatLog.php
│           ├── Resep.php
│           ├── Tagihan.php, TagihanDetail.php
│           └── Pengaturan.php
│   ├── database/
│   │   ├── migrations/               # Schema Oracle-compatible
│   │   └── seeders/
│   │       └── DatabaseSeeder.php    # 70–100+ record per tabel
│   └── routes/
│       └── api.php                   # Route dengan role middleware groups
│
├── docker-compose.yml                # Oracle DB + Backend container
├── package.json
└── README.md
```

---

## Database

### Tabel Utama

| Tabel | Deskripsi |
|---|---|
| USERS | Akun user (admin, dokter, pasien) |
| PASIEN | Data pasien klinik |
| DOKTER | Data dokter dan spesialisasi |
| JADWAL_DOKTER | Jadwal praktik harian per dokter |
| SESI_PRAKTIK | Slot jam per jadwal dokter |
| APPOINTMENT | Janji temu pasien dengan dokter |
| ANTRIAN | Antrian aktif harian (walk-in + booking) |
| VITAL_SIGNS | Tanda vital pasien |
| REKAM_MEDIS | Rekam medis dan history treatment |
| OBAT | Master data obat |
| STOK_OBAT_LOG | Log keluar masuk stok obat |
| RESEP | Resep obat untuk pasien |
| TAGIHAN | Tagihan pasien |
| TAGIHAN_DETAIL | Rincian komponen biaya tagihan |
| PENGATURAN | Konfigurasi profil klinik (single-row) |

### Data Seed (Development)

Seeder menghasilkan data realistis untuk pengujian:

| Tabel | Jumlah Record |
|---|---|
| Users | 82 (1 admin + 5 dokter + 76 pasien) |
| Pasien | 76 |
| Dokter | 5 |
| Sesi Praktik | 105 (21 hari × 5 dokter) |
| Appointment | 85 |
| Antrian | 85 |
| Vital Signs | 72 |
| Obat | 79 |
| Stok Obat Log | 127 |
| Rekam Medis | 72 |
| Resep | 108 |
| Tagihan | 72 |
| Tagihan Detail | 144 |

---

## API Documentation

### Base URL

```
http://localhost:8000/api
```

### Authentication

| Method | Endpoint | Deskripsi |
|---|---|---|
| POST | /auth/register | Register akun pasien baru |
| POST | /auth/login | Login user (semua role) |
| POST | /auth/logout | Logout user |
| GET | /auth/me | Get current user info |

### Resource Endpoints (Protected — Bearer Token)

| Resource | Endpoints |
|---|---|
| Pasien | GET/POST /pasien, GET/PUT/DELETE /pasien/{id} |
| Dokter | GET/POST /dokter, GET/PUT/DELETE /dokter/{id} |
| Appointment | GET/POST /appointment, GET/PUT/DELETE /appointment/{id} |
| Antrian | GET/POST /antrian, PUT /antrian/{id}/status |
| Vital Signs | POST /vital-signs, GET /vital-signs/{appointment_id} |
| Rekam Medis | GET/POST /rekam-medis, GET/PUT /rekam-medis/{id} |
| Obat | GET/POST /obat, GET/PUT/DELETE /obat/{id} |
| Resep | GET/POST /resep, GET/PUT /resep/{id} |
| Tagihan | GET /tagihan, GET/PUT /tagihan/{id} |
| Pengaturan | GET /pengaturan, PUT /pengaturan |
| Laporan | GET /laporan/kunjungan, GET /laporan/pendapatan |

### Special Endpoints

| Method | Endpoint | Deskripsi |
|---|---|---|
| POST | /appointment/{id}/checkin | Self check-in pasien |
| GET | /dokter/{id}/slot-jam | Slot jam tersedia untuk booking |
| GET | /dokter/{id}/jadwal | Template jadwal praktik dokter |
| GET | /pasien/{id}/appointment/terdekat | Appointment terdekat pasien |
| POST | /obat/{id}/stok-masuk | Tambah stok obat masuk |
| GET | /obat/alert-stok | Daftar obat dengan stok menipis |
| GET | /laporan/kunjungan | Laporan kunjungan harian/bulanan |
| GET | /laporan/pendapatan | Laporan pendapatan per periode |

### Query Parameters Laporan

```
GET /laporan/kunjungan?periode=harian&tanggal=2026-05-20
GET /laporan/kunjungan?periode=bulanan&bulan=5&tahun=2026
GET /laporan/pendapatan?periode=bulanan&bulan=5&tahun=2026
```

### Role Middleware

Endpoint write (POST/PUT/DELETE) dilindungi middleware `role`:

- **Admin only**: CRUD pasien, dokter, obat, laporan, pengaturan
- **Admin + Dokter**: jadwal, rekam medis, resep, vital signs
- **Semua role**: GET (read) endpoint

### Response Format

```json
// Success (list)
{
  "status": "success",
  "data": [ ]
}

// Success (single)
{
  "status": "success",
  "data": { }
}

// Validation Error
{
  "message": "The given data was invalid.",
  "errors": { "field": ["pesan error"] }
}
```

---

## User Roles & Flow

### Admin

```
Login → Dashboard → Kelola Pasien / Dokter / Jadwal
                 → Kelola Appointment (konfirmasi, batal)
                 → Kelola Antrian Harian (panggil, walk-in)
                 → Farmasi (serahkan resep, kurangi stok)
                 → Kelola Obat & Stok Masuk
                 → Tagihan & Pembayaran (tandai lunas, cetak struk)
                 → Laporan Kunjungan & Pendapatan
                 → Pengaturan Profil Klinik
```

### Dokter

```
Login → Dashboard → Lihat Jadwal Hari Ini
                 → Pilih Pasien → Cek Vital Signs
                 → Input Rekam Medis (diagnosis, tindakan)
                 → Buat Resep Obat
                 → Selesai
```

### Pasien

```
Register / Login → Dashboard → Booking Appointment
                            → Lihat Status Appointment
                            → Check-in saat tiba di klinik
                            → Lihat Rekam Medis
                            → Lihat Tagihan
                            → Edit Profil
```

---

## Business Logic

### Alur Appointment

```
MENUNGGU → DIKONFIRMASI → HADIR → SELESAI
               │               │
               ▼               ▼
             BATAL           ABSEN
```

- Appointment SELESAI secara otomatis menghasilkan Rekam Medis + Tagihan
- Pasien ABSEN tetap dikenakan biaya administrasi

### Alur Check-in & Keterlambatan

- Datang sebelum batas hadir (slot + 15 menit): `ON_TIME`, masuk antrian normal
- Datang 15–30 menit terlambat: `TERLAMBAT`, digeser ke belakang antrian
- Tidak check-in > 30 menit dari slot: status `ABSEN`

### Antrian Hybrid

- **Booking**: sudah punya slot → diprioritaskan di depan walk-in
- **Walk-in**: daftar di loket → mengisi slot kosong
- Nomor antrian di-generate otomatis: `count(dokter+tanggal) + 1`
- Flow status: `MENUNGGU → DIPANGGIL → SELESAI` (atau `BATAL`)

### Stok Obat

- Stok berkurang saat resep berstatus `SUDAH_DIAMBIL` (bukan saat dibuat)
- Resep dibatalkan → stok dikembalikan otomatis
- Semua perubahan stok dicatat di `STOK_OBAT_LOG`
- Alert jika stok di bawah nilai minimum

### Tagihan

- Tagihan dibuat otomatis setelah rekam medis diinput
- Komponen: biaya konsultasi + biaya obat (+ rincian per item di `TAGIHAN_DETAIL`)
- Status: `BELUM_BAYAR → SEBAGIAN → LUNAS`
- Tagihan `LUNAS` bersifat immutable (tidak dapat diubah kembali)
- Metode bayar: Tunai, Transfer, QRIS, Kartu Kredit/Debit, BPJS

---

## Troubleshooting

**Backend tidak bisa diakses (port 8000):**

```bash
docker-compose ps
docker logs klinik-backend
```

**401 Unauthorized:**

```bash
# Hapus token di browser console
localStorage.clear()
# Login ulang
```

**422 Unprocessable Entity saat register:**

Pastikan field yang dikirim sesuai — backend menerima nama field UPPERCASE:
`NIK`, `NAMA_LENGKAP`, `TANGGAL_LAHIR`, `JENIS_KELAMIN`, `GOLONGAN_DARAH`, `ALAMAT`, `NO_TELEPON`, `EMAIL`, `password`

**CORS Error:**

```bash
# Cek config/cors.php di backend
# Pastikan http://localhost:5173 di-allow
```

**Port sudah digunakan:**

```bash
lsof -ti:5173 | xargs kill -9   # Frontend
lsof -ti:8000 | xargs kill -9   # Backend
```

**Oracle tidak connect:**

```bash
docker-compose ps oracle-db
telnet localhost 1521
# Pastikan DB_HOST di .env container backend = oracle-db (nama service Docker)
```

**Migration Oracle gagal karena nama tabel terlalu panjang:**

Oracle max 30 karakter (versi < 18c). Persingkat nama tabel atau kolom jika melebihi batas.

---

**Version**: 1.2.0
**Last Updated**: Mei 2026
**Database**: Oracle 21c (via Docker)
**Frontend**: http://localhost:5173
**Backend API**: http://localhost:8000/api
