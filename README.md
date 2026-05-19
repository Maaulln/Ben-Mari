# Klinik BenMari — Sistem Informasi Klinik Terintegrasi

Aplikasi web full-stack untuk manajemen klinik yang komprehensif dengan fitur appointment, antrian, rekam medis, manajemen obat, dan billing terintegrasi.

---

## Daftar Isi

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

## Fitur Utama

### Admin Dashboard

- Dashboard statistik klinik (pasien, dokter, pendapatan)
- Manajemen data pasien (CRUD)
- Manajemen data dokter dan spesialisasi
- Manajemen jadwal dokter (per hari, per sesi)
- Manajemen appointment dan konfirmasi
- Manajemen antrian (walk-in & booking)
- Manajemen rekam medis pasien
- Manajemen obat, inventori, dan stok masuk/keluar
- Manajemen resep
- Manajemen tagihan dan pembayaran (termasuk partial payment)
- Laporan harian/bulanan (kunjungan, pendapatan, stok)

### Dokter Portal

- Dashboard statistik dokter (pasien hari ini, appointment pending)
- Lihat jadwal dan daftar pasien pribadi
- Manajemen appointment dengan pasien
- Cek vital signs pasien (diisi perawat)
- Input rekam medis (diagnosis, tindakan, catatan)
- Pembuatan resep obat
- Lihat riwayat treatment pasien

### Pasien Portal

- Registrasi dan login
- Booking appointment (pilih dokter, spesialisasi, tanggal, jam, keluhan)
- Lihat status appointment secara real-time
- Self check-in saat tiba di klinik
- Akses rekam medis pribadi
- Lihat resep yang diberikan
- Lihat tagihan dan status pembayaran

### Fitur Umum

- Sistem autentikasi JWT (Laravel Sanctum)
- Role-based access control (Admin, Dokter, Pasien)
- Sistem antrian hybrid (walk-in + booking)
- Manajemen keterlambatan pasien dengan grace period
- Alert stok obat menipis
- Responsive UI design
- Input validation & error handling

---

## Tech Stack

### Frontend

- **Framework**: React 18 + TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui, Radix UI
- **HTTP Client**: Axios
- **Date Handling**: date-fns
- **Icons**: Lucide React

### Backend

- **Framework**: Laravel 10
- **Language**: PHP 8.1+
- **Authentication**: Laravel Sanctum (JWT)
- **ORM**: Eloquent
- **Database**: Oracle 21c (Production), SQLite (Development)
- **Driver Oracle**: yajra/laravel-oci8
- **PHP Extension**: php-oci8 + Oracle Instant Client

### Infrastructure

- **Containerization**: Docker & Docker Compose
- **Package Manager Frontend**: pnpm
- **Package Manager Backend**: Composer

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

# Install dependency sistem
RUN apt-get update && apt-get install -y libaio1 unzip curl

# Download & setup Oracle Instant Client
RUN mkdir -p /opt/oracle && cd /opt/oracle \
 && curl -o instantclient.zip \
    https://download.oracle.com/otn_software/linux/instantclient/instantclient-basiclite-linuxx64.zip \
 && unzip instantclient.zip && rm instantclient.zip \
 && echo /opt/oracle/instantclient* > /etc/ld.so.conf.d/oracle.conf \
 && ldconfig

# Install php-oci8 dan pdo_oci
RUN docker-php-ext-configure oci8 \
    --with-oci8=instantclient,/opt/oracle/instantclient_21_1 \
 && docker-php-ext-install oci8 pdo_oci

# Install ekstensi PHP lainnya
RUN docker-php-ext-install pdo pdo_sqlite
```

### 3. Konfigurasi `.env`

```env
# Gunakan oracle sebagai driver
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
// ❌ Tidak kompatibel Oracle
$table->bigIncrements('id');
$table->text('catatan');
$table->boolean('is_aktif');
$table->dateTime('created_at');

// ✅ Kompatibel Oracle (yajra/oci8)
$table->id();                               // NUMBER + SEQUENCE otomatis
$table->string('catatan', 4000);            // VARCHAR2(4000)
$table->integer('is_aktif')->default(1);    // NUMBER(1)
$table->timestamp('created_at');            // TIMESTAMP
```

Contoh migration Oracle-compatible:

```php
Schema::create('appointment', function (Blueprint $table) {
    $table->id();                                        // NUMBER IDENTITY
    $table->unsignedBigInteger('pasien_id');
    $table->unsignedBigInteger('dokter_id');
    $table->timestamp('tanggal_jam');
    $table->string('keluhan', 1000);
    $table->string('status', 20)->default('MENUNGGU');
    $table->timestamp('batas_hadir')->nullable();
    $table->timestamp('waktu_checkin')->nullable();
    $table->string('status_kehadiran', 20)->default('BELUM_CHECKIN');
    $table->timestamps();

    $table->foreign('pasien_id')->references('id')->on('pasien');
    $table->foreign('dokter_id')->references('id')->on('dokter');
});
```

### Troubleshooting Oracle Connection

**Error: `oci8` extension not found:**

```bash
# Cek extension aktif
php -m | grep oci

# Pastikan php.ini sudah ada:
# extension=oci8.so
```

**Error: `ORA-12541: TNS: no listener`:**

```bash
# Pastikan Oracle service jalan
docker-compose ps
# Cek port 1521 terbuka
telnet localhost 1521
```

**Error: `ORA-01017: invalid username/password`:**

```bash
# Untuk Oracle 21c, username pakai prefix C## untuk common user
DB_USERNAME=C##KLINIK_ADMIN
```

**Error: migration gagal karena nama tabel terlalu panjang:**

```bash
# Oracle max 30 karakter (versi < 18c) atau 128 karakter (18c+)
# Pastikan nama tabel tidak melebihi batas tersebut
```

---

## Prerequisites

- Node.js >= 18.x
- PHP >= 8.1 (dengan extension oci8 & pdo_oci)
- Composer >= 2.0
- Docker & Docker Compose
- Oracle Database 21c (production)
- Oracle Instant Client (untuk php-oci8)
- Git

---

## Instalasi & Setup

### 1. Clone Repository

```bash
git clone <repository-url>
cd Ben-Mari
```

### 2. Setup Frontend

```bash
pnpm install
# Inisialisasi database backend dijelaskan di bagian Backend (gunakan `pnpm db:init` yang menjalankan artisan migrate)
pnpm db:init
```

### 3. Setup Backend

```bash
cd backend
composer install
cp .env.example .env
php artisan key:generate
docker-compose up -d
php artisan migrate
php artisan db:seed
```

### 4. Environment Configuration

**Backend** (`.env`):

```env
APP_NAME=KlinikBenMari
APP_ENV=local
APP_DEBUG=true
APP_URL=http://localhost:8000

# Oracle (Production)
DB_CONNECTION=oracle
DB_HOST=localhost
DB_PORT=1521
DB_DATABASE=FREE
DB_USERNAME=C##KLINIK_ADMIN
DB_PASSWORD=klinik123

# SQLite (Development)
# DB_CONNECTION=sqlite
# DB_DATABASE=storage/database.sqlite

SANCTUM_STATEFUL_DOMAINS=localhost:5173,127.0.0.1:5173
```

---

## Menjalankan Aplikasi

**Terminal 1 — Frontend:**

```bash
pnpm dev
# Akses: http://localhost:5173
```

**Terminal 2 — Backend:**

```bash
cd backend
php artisan serve
# Akses: http://localhost:8000
```

## Scripts

Berikut beberapa perintah yang berguna (tersedia di `package.json`):

```bash
# Jalankan dev server frontend
pnpm dev

# Jalankan backend (artisan serve)
pnpm run dev:backend

# Inisialisasi database (migrate + seed) — menjalankan perintah artisan di folder backend
pnpm db:init

# Reset database (migrate:fresh --seed)
pnpm db:reset
```

### Demo Credentials

| Role   | Email            | Password  |
| ------ | ---------------- | --------- |
| Admin  | admin@klinik.com | admin123  |
| Dokter | maria@klinik.com | dokter123 |
| Pasien | budi@email.com   | pasien123 |

---

## Struktur Project

```
Ben-Mari/
├── src/
│   ├── app/
│   │   ├── App.tsx
│   │   ├── components/
│   │   ├── doctor/
│   │   ├── patient/
│   │   └── pages/
│   ├── services/
│   │   ├── api.ts
│   │   ├── authService.ts
│   │   ├── adminService.ts
│   │   ├── doctorService.ts
│   │   └── patientService.ts
│   ├── styles/
│   ├── utils/
│   ├── data/
│   ├── db/
│   └── main.tsx
│
├── backend/
# Setup database (jika menggunakan Oracle dengan Docker)
# Jalankan `docker-compose` dari root project (bukan dari folder `backend`):
#
# cd .. && docker-compose up -d   # jika Anda saat ini di dalam folder backend
# atau jalankan dari root:
# docker-compose up -d
docker-compose up -d
│   │   ├── Http/
│   │   │   ├── Controllers/Api/
│   │   │   │   ├── AuthController.php
│   │   │   │   ├── PasienController.php
│   │   │   │   ├── DokterController.php
│   │   │   │   ├── AppointmentController.php
│   │   │   │   ├── AntrianController.php
│   │   │   │   ├── RekamMedisController.php
│   │   │   │   ├── VitalSignsController.php
│   │   │   │   ├── ObatController.php
│   │   │   │   ├── ResepController.php
│   │   │   │   └── TagihanController.php
│   │   │   └── Middleware/
│   │   └── Models/
│   │       ├── User.php
│   │       ├── Pasien.php
│   │       ├── Dokter.php
│   │       ├── Appointment.php
│   │       ├── Antrian.php
│   │       ├── RekamMedis.php
│   │       ├── VitalSigns.php
│   │       ├── Obat.php
│   │       ├── StokObatLog.php
│   │       ├── Resep.php
│   │       ├── Tagihan.php
│   │       └── TagihanDetail.php
│   ├── database/
│   │   ├── migrations/
│   │   └── seeders/
│   └── routes/
│       └── api.php
│
├── docker-compose.yml
├── package.json
├── README.md
└── ARCHITECTURE.md
```

---

## Database

### Tabel Utama

| Tabel          | Deskripsi                              |
| -------------- | -------------------------------------- |
| USERS          | Akun user (admin, dokter, pasien)      |
| PASIEN         | Data pasien klinik                     |
| DOKTER         | Data dokter dan spesialisasi           |
| JADWAL_DOKTER  | Jadwal praktek harian per dokter       |
| APPOINTMENT    | Janji temu pasien dengan dokter        |
| ANTRIAN        | Antrian aktif harian (walk-in+booking) |
| VITAL_SIGNS    | Tanda vital pasien (diisi perawat)     |
| REKAM_MEDIS    | Rekam medis dan history treatment      |
| OBAT           | Master data obat                       |
| STOK_OBAT_LOG  | Log keluar masuk stok obat             |
| RESEP          | Resep obat untuk pasien                |
| TAGIHAN        | Tagihan pasien                         |
| TAGIHAN_DETAIL | Rincian komponen biaya tagihan         |

---

## API Documentation

### Base URL

```
http://localhost:8000/api
```

### Authentication

| Method | Endpoint       | Deskripsi          |
| ------ | -------------- | ------------------ |
| POST   | /auth/register | Register akun baru |
| POST   | /auth/login    | Login user         |
| POST   | /auth/logout   | Logout user        |
| GET    | /auth/me       | Get current user   |

### Resource Endpoints (Protected)

| Resource    | Endpoints                                               |
| ----------- | ------------------------------------------------------- |
| Pasien      | GET/POST /pasien, GET/PUT/DELETE /pasien/{id}           |
| Dokter      | GET/POST /dokter, GET/PUT/DELETE /dokter/{id}           |
| Appointment | GET/POST /appointment, GET/PUT/DELETE /appointment/{id} |
| Antrian     | GET/POST /antrian, PUT /antrian/{id}/status             |
| Vital Signs | POST /vital-signs, GET /vital-signs/{appointment_id}    |
| Rekam Medis | GET/POST /rekam-medis, GET/PUT /rekam-medis/{id}        |
| Obat        | GET/POST /obat, GET/PUT/DELETE /obat/{id}               |
| Resep       | GET/POST /resep, GET/PUT/DELETE /resep/{id}             |
| Tagihan     | GET/POST /tagihan, GET/PUT /tagihan/{id}                |

### Special Endpoints

| Method | Endpoint                          | Deskripsi                        |
| ------ | --------------------------------- | -------------------------------- |
| POST   | /appointment/{id}/checkin         | Check-in pasien                  |
| GET    | /dokter/{id}/slot-jam             | Slot jam tersedia                |
| GET    | /dokter/{id}/jadwal               | Jadwal praktek dokter            |
| GET    | /dokter/{id}/dashboard/stats      | Statistik dashboard dokter       |
| GET    | /pasien/{id}/appointment/terdekat | Appointment terdekat pasien      |
| GET    | /obat/alert-stok                  | Obat dengan stok menipis         |
| GET    | /laporan/kunjungan                | Laporan kunjungan harian/bulanan |
| GET    | /laporan/pendapatan               | Laporan pendapatan per periode   |

### Response Format

```json
// Success
{
  "status": "success",
  "data": { }
}

// Error
{
  "status": "error",
  "message": "Pesan error",
  "errors": { }
}
```

---

## User Roles & Flow

### Admin

```
Login → Dashboard → Kelola Pasien/Dokter/Appointment
                 → Kelola Antrian Harian
                 → Kelola Obat & Stok
                 → Kelola Tagihan & Pembayaran
                 → Lihat Laporan
```

### Dokter

```
Login → Dashboard → Lihat Jadwal Hari Ini
                 → Pilih Pasien → Cek Vital Signs
                 → Input Rekam Medis
                 → Buat Resep → Selesai
```

### Pasien

```
Register/Login → Dashboard → Booking Appointment
                          → Check-in saat tiba
                          → Lihat Rekam Medis
                          → Lihat Tagihan & Resep
```

---

## Business Logic

### Manajemen Appointment & Keterlambatan

Sistem menggunakan **slot waktu tetap** dengan **grace period 15 menit**.

```
Status Appointment:
MENUNGGU → DIKONFIRMASI → HADIR → SELESAI
               │              │
               ▼              ▼
             BATAL          ABSEN
```

Aturan keterlambatan:

- Datang sebelum batas hadir (slot + 15 menit): status ON_TIME, masuk antrian normal
- Datang 15–30 menit terlambat: status TERLAMBAT, digeser ke belakang antrian
- Tidak check-in > 30 menit dari slot: status ABSEN, slot dibebaskan untuk walk-in
- Pasien ABSEN dapat reschedule ke hari lain, appointment tidak dihapus

### Manajemen Antrian Hybrid

Klinik menerima dua jenis pasien:

- **Booking**: sudah punya slot, prioritas di depan walk-in
- **Walk-in**: daftar di loket, mengisi slot kosong yang tersedia

### Manajemen Stok Obat

- Stok berkurang saat resep **diambil** di apotek (bukan saat dibuat)
- Jika resep dibatalkan, stok dikembalikan secara otomatis
- Semua perubahan stok dicatat di tabel STOK_OBAT_LOG
- Alert otomatis jika stok obat di bawah nilai minimum

### Manajemen Tagihan

- Tagihan dibuat otomatis setelah rekam medis selesai diinput dokter
- Komponen biaya terpisah: jasa dokter + biaya obat + biaya tindakan
- Mendukung partial payment (bayar sebagian)
- Status: BELUM_BAYAR → SEBAGIAN → LUNAS
- Pasien ABSEN tetap dikenakan biaya administrasi

### Rekam Medis

- Rekam medis tidak dapat dihapus (hanya bisa dikoreksi dengan audit trail)
- Hanya dokter yang memeriksa yang dapat menginput rekam medis
- Seluruh dokter dapat melihat riwayat rekam medis pasien (read-only)

---

## Troubleshooting

**Backend tidak bisa diakses (localhost:8000):**

```bash
cd backend && php artisan serve
```

**Database error / SQLite tidak connect:**

```bash
pnpm db:reset && pnpm db:init
# atau
cd backend && php artisan migrate:fresh --seed
```

**401 Unauthorized:**

```bash
# Clear localStorage di browser console
localStorage.clear()
# Logout dan login ulang
```

**CORS Error:**

- Cek `config/cors.php` di backend
- Pastikan `http://localhost:5173` di-allow

**Port sudah digunakan:**

```bash
lsof -ti:5173 | xargs kill -9  # Frontend
lsof -ti:8000 | xargs kill -9  # Backend
```

---

**Last Updated**: Mei 2026
**Version**: 1.1.0
**Database**: SQLite (Development) / Oracle (Production)
