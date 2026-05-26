# Panduan Starter — Sistem Informasi Klinik BenMari

## Gambaran Umum

Aplikasi manajemen klinik berbasis web dengan tiga role pengguna:

| Role | Akses |
|---|---|
| **Admin** | Dashboard, Pasien, Dokter, Appointment, Rekam Medis, Obat, Tagihan |
| **Dokter** | Dashboard dokter, Jadwal, Pasien, Rekam Medis |
| **Pasien** | Beranda, Buat Appointment, Riwayat, Rekam Medis, Tagihan, Profil |

**Tech Stack:**
- Frontend: React 18 + TypeScript + Vite + Tailwind CSS v4
- Backend: Laravel (PHP 8.2) + Oracle Database Free
- Container: Docker Compose (Oracle DB + Laravel API)
- Auth: Laravel Sanctum (Bearer Token)

---

## Prasyarat

Pastikan sudah terinstall:
- [Docker Desktop](https://www.docker.com/products/docker-desktop/) (versi 4.x ke atas)
- [Node.js](https://nodejs.org/) versi 18 ke atas
- npm / pnpm

---

## Cara Menjalankan (Pertama Kali)

### 1. Clone & Install Frontend

```bash
git clone <repo-url>
cd Ben-Mari
npminstall 
```

### 2. Jalankan Docker (Backend + Database)

```bash
docker compose up -d
```

> Oracle DB membutuhkan waktu **2–3 menit** untuk siap (healthcheck).
> Pantau status: `docker compose ps`

### 3. Tunggu Backend Siap

```bash
# Cek apakah backend sudah berjalan
docker compose ps
# STATUS kolom backend harus "Up"
```

### 4. Inisialisasi Database (sekali saja)

```bash
docker exec klinik-backend php artisan migrate --seed
```

Perintah ini membuat semua tabel dan mengisi data awal (dokter, pasien, obat, appointment, dll).

### 5. Jalankan Frontend

```bash
npm run dev
```

Buka browser: **http://localhost:5173**

---

## Akun untuk Testing

### Admin
| Field | Value |
|---|---|
| Email | `admin@klinik.com` |
| Password | `admin123` |

### Dokter
| Nama | Email | Password |
|---|---|---|
| Dr. Maria Ulfa | `maria@klinik.com` | `dokter123` |
| Dr. Budi Hartono | `budi.dr@klinik.com` | `dokter123` |
| Dr. Siti Rahayu | `siti@klinik.com` | `dokter123` |
| Dr. Ahmad Fauzi | `ahmad@klinik.com` | `dokter123` |
| Dr. Nina Kusuma | `nina@klinik.com` | `dokter123` |

### Pasien
| Nama | Email | Password |
|---|---|---|
| Budi Santoso | `budi@email.com` | `pasien123` |

> Untuk membuat akun pasien baru, gunakan fitur **Daftar** di halaman login.

---

## Perintah Sehari-hari

### Frontend
```bash
npm run dev          # Jalankan frontend (port 5173)
npm run build        # Build untuk production
```

### Docker / Backend
```bash
docker compose up -d          # Jalankan semua service
docker compose down           # Hentikan semua service
docker compose ps             # Cek status container
docker compose logs backend   # Lihat log Laravel
```

### Database
```bash
# Reset database + isi ulang data awal
docker exec klinik-backend php artisan migrate:fresh --seed

# Jalankan hanya seeder (tanpa hapus tabel)
docker exec klinik-backend php artisan db:seed

# Isi sesi praktik dokter sampai 2030
docker exec klinik-backend php artisan db:seed --class=SesiPraktikSeeder

# Expire appointment yang sudah lewat tanggal
docker exec klinik-backend php artisan appointment:expire
```

### Artisan Lainnya
```bash
# Tinker (REPL interaktif ke database)
docker exec -it klinik-backend php artisan tinker

# Clear semua cache
docker exec klinik-backend php artisan config:clear
docker exec klinik-backend php artisan cache:clear
```

---

## Reset Total (jika database bermasalah)

```bash
# Hapus semua volume Docker (data Oracle terhapus permanen)
docker compose down -v

# Jalankan ulang
docker compose up -d

# Tunggu Oracle siap (~3 menit), lalu migrate + seed
docker exec klinik-backend php artisan migrate --seed
docker exec klinik-backend php artisan db:seed --class=SesiPraktikSeeder
```

---

## Struktur Folder Penting

```
Ben-Mari/
├── src/
│   ├── app/
│   │   ├── pages/          # Halaman admin (Dashboard, Pasien, Dokter, dll)
│   │   ├── doctor/         # Modul dokter (DoctorApp, DoctorDashboard, dll)
│   │   ├── patient/        # Modul pasien (PatientApp, PatientBeranda, dll)
│   │   └── components/     # Komponen bersama (Badge, Modal, Sidebar, dll)
│   ├── services/
│   │   ├── api.ts           # Axios instance + interceptor auth
│   │   ├── adminService.ts  # Service untuk halaman admin
│   │   ├── doctorService.ts # Service untuk modul dokter
│   │   └── patientService.ts# Service untuk modul pasien
│   └── utils/
│       ├── formatters.ts    # formatDate, formatRupiah, dll
│       └── validators.ts    # validateNIK, validatePhone, dll
│
└── backend/
    ├── app/
    │   ├── Http/Controllers/Api/  # Semua API controller
    │   ├── Models/                # Eloquent models
    │   └── Console/Commands/      # Artisan commands (ExpireAppointments)
    ├── database/
    │   ├── migrations/            # Skema tabel
    │   └── seeders/               # Data awal (DatabaseSeeder, SesiPraktikSeeder)
    └── routes/api.php             # Semua route API
```

---

## API Endpoint Utama

Base URL: `http://localhost:8000/api`

| Method | Endpoint | Keterangan |
|---|---|---|
| POST | `/auth/login` | Login semua role |
| POST | `/auth/register` | Daftar pasien baru |
| GET | `/pasien` | Daftar pasien |
| GET | `/dokter` | Daftar dokter |
| GET | `/dokter/{id}/slot-jam?tanggal=YYYY-MM-DD` | Slot jam tersedia |
| GET | `/appointment` | Daftar appointment |
| POST | `/appointment` | Buat appointment |
| POST | `/appointment/{id}/checkin` | Check-in pasien |
| GET | `/pasien/{id}/appointment/terdekat` | Appointment terdekat pasien |
| GET | `/rekam-medis` | Daftar rekam medis |
| GET | `/tagihan` | Daftar tagihan |
| GET | `/antrian` | Daftar antrian hari ini |

> Semua endpoint kecuali login & register membutuhkan header:
> `Authorization: Bearer {token}`

---

## Jadwal Otomatis (Scheduler)

Laravel scheduler berjalan di dalam container dan menjalankan:

| Waktu | Command | Fungsi |
|---|---|---|
| Setiap hari 00:05 | `appointment:expire` | Tandai appointment MENUNGGU/DIKONFIRMASI yang sudah lewat tanggalnya menjadi ABSEN |

---

## Setup macOS (tanpa Docker — opsional)

Jika ingin menjalankan backend langsung di macOS ARM64 tanpa Docker:

```bash
# 1. Install Oracle Instant Client (download dari Oracle)
#    Simpan zip di folder ini atau ~/Downloads, lalu:
cd backend/database
./setup-oracle-ext.sh

# 2. Install dependensi PHP
cd backend
composer install

# 3. Jalankan server
php artisan serve
```

> Tetap membutuhkan Oracle DB yang berjalan (bisa lewat Docker oracle-db saja).

---

## Troubleshooting

### Oracle container tidak mau sehat
```bash
docker compose logs oracle-db --tail=50
# Biasanya butuh waktu lebih lama. Tunggu hingga "DATABASE IS READY TO USE"
```

### Error "could not find driver" di Laravel
```bash
# OCI8 extension belum aktif di container
docker compose down && docker compose up -d --build
```

### Frontend tidak bisa akses API (CORS / network error)
- Pastikan Docker sudah jalan: `docker compose ps`
- Pastikan backend di port 8000: `curl http://localhost:8000/api/dokter`

### Appointment kemarin masih status MENUNGGU
```bash
docker exec klinik-backend php artisan appointment:expire
```

### Slot jam kosong saat buat appointment
```bash
# Isi ulang sesi praktik dokter
docker exec klinik-backend php artisan db:seed --class=SesiPraktikSeeder
```
