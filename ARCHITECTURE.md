# Arsitektur Sistem Klinik BenMari

Dokumen ini menjelaskan arsitektur, design pattern, struktur teknis, dan business logic aplikasi Klinik BenMari.

---

## Arsitektur Keseluruhan

```
┌─────────────────────────────────────────────────────────────────┐
│                         CLIENT LAYER                            │
│                      (React + TypeScript)                       │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐          │
│  │ Admin Portal │  │Doctor Portal │  │Patient Portal│          │
│  └──────────────┘  └──────────────┘  └──────────────┘          │
└──────────────────────────┬──────────────────────────────────────┘
                           │ HTTP/REST (Axios)
                           │ JWT Token Authentication
┌──────────────────────────┴──────────────────────────────────────┐
│                      API GATEWAY LAYER                          │
│                      (Laravel Routes)                           │
│  /api/auth/  /api/pasien/  /api/dokter/  /api/appointment/      │
│  /api/antrian/  /api/rekam-medis/  /api/obat/  /api/tagihan/    │
└──────────────────────────┬──────────────────────────────────────┘
                           │ Middleware (Auth, CORS, Throttle)
┌──────────────────────────┴──────────────────────────────────────┐
│                   APPLICATION LAYER                             │
│                  (Laravel Controllers)                          │
│  AuthController      PasienController    DokterController       │
│  AppointmentController  AntrianController  VitalSignsController │
│  RekamMedisController   ObatController   TagihanController      │
└──────────────────────────┬──────────────────────────────────────┘
                           │ Business Logic & Validation
┌──────────────────────────┴──────────────────────────────────────┐
│                    MODEL LAYER                                  │
│                (Eloquent ORM Models)                            │
│  User  Pasien  Dokter  JadwalDokter  Appointment  Antrian       │
│  VitalSigns  RekamMedis  Obat  StokObatLog  Resep               │
│  Tagihan  TagihanDetail                                         │
└──────────────────────────┬──────────────────────────────────────┘
                           │ Oracle Query Builder
┌──────────────────────────┴──────────────────────────────────────┐
│                   PERSISTENCE LAYER                             │
│              Oracle Database (Production)                       │
│              SQLite (Development)                               │
└─────────────────────────────────────────────────────────────────┘
```

---

## Database Architecture

### Entity Relationship Diagram (ERD)

```
┌─────────────┐
│    USERS    │
│─────────────│
│ user_id  PK │
│ email       │
│ password    │
│ role        │──────────────────────────────────┐
└─────────────┘                                  │
      │                                          │
      ├────────────────────┐                     │
      │                    │                     │
      ▼                    ▼                     │
┌───────────┐        ┌───────────┐               │
│  PASIEN   │        │  DOKTER   │               │
│───────────│        │───────────│               │
│ pasien_id │        │ dokter_id │               │
│ nik       │        │ nik       │               │
│ nama      │        │ nama      │               │
│ ttl       │        │ spesialis │               │
│ alamat    │        │ no_license│               │
│ telepon   │        │ alamat    │               │
│ email     │        │ telepon   │               │
│ user_id FK│        │ user_id FK│               │
└─────┬─────┘        └─────┬─────┘               │
      │                    │                     │
      │                    ▼                     │
      │          ┌──────────────────┐            │
      │          │  JADWAL_DOKTER   │            │
      │          │──────────────────│            │
      │          │ jadwal_id     PK │            │
      │          │ dokter_id     FK │            │
      │          │ hari             │            │
      │          │ jam_mulai        │            │
      │          │ jam_selesai      │            │
      │          │ kuota            │            │
      │          │ is_aktif         │            │
      │          └──────────────────┘            │
      │                                          │
      └──────────────┐      ┌────────────────────┘
                     │      │
                     ▼      ▼
            ┌─────────────────────┐
            │    APPOINTMENT      │
            │─────────────────────│
            │ appointment_id   PK │
            │ pasien_id        FK │
            │ dokter_id        FK │
            │ tanggal_jam         │
            │ keluhan             │
            │ status              │──── MENUNGGU
            │ batas_hadir         │    DIKONFIRMASI
            │ waktu_checkin       │    HADIR
            │ status_kehadiran    │    SELESAI
            └──────────┬──────────┘    BATAL
                       │               ABSEN
                       │
              ┌────────┴────────┐
              │                 │
              ▼                 ▼
   ┌──────────────────┐  ┌─────────────────┐
   │   VITAL_SIGNS    │  │    ANTRIAN      │
   │──────────────────│  │─────────────────│
   │ vs_id         PK │  │ antrian_id   PK │
   │ appointment_id FK│  │ pasien_id    FK │
   │ tekanan_darah    │  │ dokter_id    FK │
   │ suhu_tubuh       │  │ nomor_antrian   │
   │ berat_badan      │  │ tanggal         │
   │ tinggi_badan     │  │ status          │
   │ saturasi_oksigen │  │ jenis           │
   │ catatan_perawat  │  └─────────────────┘
   └──────────────────┘
              │
              ▼
   ┌──────────────────────┐
   │     REKAM_MEDIS      │
   │──────────────────────│
   │ rekam_medis_id    PK │
   │ appointment_id    FK │
   │ diagnosis            │
   │ tindakan             │
   │ catatan              │
   │ created_at           │
   └──────────┬───────────┘
              │
              ▼
   ┌──────────────────────┐
   │        RESEP         │
   │──────────────────────│
   │ resep_id          PK │
   │ rekam_medis_id    FK │
   │ obat_id           FK │
   │ dosis                │
   │ durasi               │
   │ status_ambil         │──── BELUM_DIAMBIL
   └──────────────────────┘     SUDAH_DIAMBIL
              │                 BATAL
              │
┌─────────────┴──────────┐
│          OBAT          │
│────────────────────────│
│ obat_id             PK │
│ nama                   │
│ harga                  │
│ stok                   │
│ stok_minimum           │
│ satuan                 │
│ expired_date           │
│ kategori               │
└──────────┬─────────────┘
           │
           ▼
┌──────────────────────┐
│    STOK_OBAT_LOG     │
│──────────────────────│
│ log_id            PK │
│ obat_id           FK │
│ tipe                 │──── MASUK / KELUAR
│ jumlah               │
│ keterangan           │
│ created_at           │
│ created_by        FK │
└──────────────────────┘

TAGIHAN:
┌──────────────────────┐
│       TAGIHAN        │
│──────────────────────│
│ tagihan_id        PK │
│ pasien_id         FK │
│ appointment_id    FK │
│ total_biaya          │
│ status_bayar         │──── BELUM_BAYAR / SEBAGIAN / LUNAS
│ tanggal              │
│ keterangan           │
└──────────┬───────────┘
           │
           ▼
┌──────────────────────┐
│    TAGIHAN_DETAIL    │
│──────────────────────│
│ detail_id         PK │
│ tagihan_id        FK │
│ keterangan           │──── Jasa Dokter / Biaya Obat / Tindakan
│ jumlah               │
│ harga_satuan         │
│ subtotal    VIRTUAL  │
└──────────────────────┘
```

### Relationships

```
User        1:N  Pasien
User        1:N  Dokter
Dokter      1:N  JadwalDokter
Pasien      1:N  Appointment
Dokter      1:N  Appointment
Appointment 1:1  VitalSigns
Appointment 1:1  RekamMedis
Appointment 1:1  Antrian
RekamMedis  1:N  Resep
Obat        1:N  Resep
Obat        1:N  StokObatLog
Pasien      1:N  Tagihan
Tagihan     1:N  TagihanDetail
```

---

## Oracle DDL

```sql
-- Tabel ANTRIAN
CREATE TABLE ANTRIAN (
  antrian_id      NUMBER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  pasien_id       NUMBER NOT NULL REFERENCES PASIEN(pasien_id),
  dokter_id       NUMBER NOT NULL REFERENCES DOKTER(dokter_id),
  appointment_id  NUMBER REFERENCES APPOINTMENT(appointment_id),
  nomor_antrian   NUMBER NOT NULL,
  tanggal         DATE DEFAULT SYSDATE,
  status          VARCHAR2(20) DEFAULT 'MENUNGGU',
  jenis           VARCHAR2(20) DEFAULT 'WALKIN',
  created_at      TIMESTAMP DEFAULT SYSTIMESTAMP,
  CONSTRAINT chk_antrian_status CHECK (status IN ('MENUNGGU','DIPANGGIL','SELESAI','BATAL')),
  CONSTRAINT chk_antrian_jenis  CHECK (jenis IN ('WALKIN','BOOKING'))
);

-- Tabel VITAL_SIGNS
CREATE TABLE VITAL_SIGNS (
  vs_id             NUMBER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  appointment_id    NUMBER NOT NULL REFERENCES APPOINTMENT(appointment_id),
  tekanan_darah     VARCHAR2(20),
  suhu_tubuh        NUMBER(4,1),
  berat_badan       NUMBER(5,2),
  tinggi_badan      NUMBER(5,2),
  saturasi_oksigen  NUMBER(3),
  catatan_perawat   VARCHAR2(500),
  created_at        TIMESTAMP DEFAULT SYSTIMESTAMP
);

-- Tabel STOK_OBAT_LOG
CREATE TABLE STOK_OBAT_LOG (
  log_id      NUMBER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  obat_id     NUMBER NOT NULL REFERENCES OBAT(obat_id),
  tipe        VARCHAR2(10) NOT NULL,
  jumlah      NUMBER NOT NULL,
  keterangan  VARCHAR2(200),
  created_at  TIMESTAMP DEFAULT SYSTIMESTAMP,
  created_by  NUMBER REFERENCES USERS(user_id),
  CONSTRAINT chk_stok_tipe CHECK (tipe IN ('MASUK','KELUAR'))
);

-- Tabel JADWAL_DOKTER
CREATE TABLE JADWAL_DOKTER (
  jadwal_id   NUMBER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  dokter_id   NUMBER NOT NULL REFERENCES DOKTER(dokter_id),
  hari        VARCHAR2(10) NOT NULL,
  jam_mulai   VARCHAR2(5) NOT NULL,
  jam_selesai VARCHAR2(5) NOT NULL,
  kuota       NUMBER DEFAULT 20,
  is_aktif    NUMBER(1) DEFAULT 1,
  CONSTRAINT chk_hari CHECK (hari IN ('SENIN','SELASA','RABU','KAMIS','JUMAT','SABTU','MINGGU'))
);

-- Tabel TAGIHAN_DETAIL
CREATE TABLE TAGIHAN_DETAIL (
  detail_id    NUMBER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  tagihan_id   NUMBER NOT NULL REFERENCES TAGIHAN(tagihan_id),
  keterangan   VARCHAR2(200) NOT NULL,
  jumlah       NUMBER NOT NULL,
  harga_satuan NUMBER NOT NULL,
  subtotal     NUMBER GENERATED ALWAYS AS (jumlah * harga_satuan) VIRTUAL
);

-- Kolom tambahan di APPOINTMENT
ALTER TABLE APPOINTMENT ADD batas_hadir      TIMESTAMP;
ALTER TABLE APPOINTMENT ADD waktu_checkin    TIMESTAMP;
ALTER TABLE APPOINTMENT ADD status_kehadiran VARCHAR2(20) DEFAULT 'BELUM_CHECKIN';

-- Index penting (Oracle tidak auto-index FK)
CREATE INDEX idx_appointment_pasien   ON APPOINTMENT(pasien_id);
CREATE INDEX idx_appointment_dokter   ON APPOINTMENT(dokter_id);
CREATE INDEX idx_appointment_tanggal  ON APPOINTMENT(tanggal_jam);
CREATE INDEX idx_rekam_medis_appt     ON REKAM_MEDIS(appointment_id);
CREATE INDEX idx_resep_rekam          ON RESEP(rekam_medis_id);
CREATE INDEX idx_tagihan_pasien       ON TAGIHAN(pasien_id);
CREATE INDEX idx_antrian_tanggal      ON ANTRIAN(tanggal);
CREATE INDEX idx_stok_log_obat        ON STOK_OBAT_LOG(obat_id);
```

---

## Business Logic

### 1. Logic Appointment & Keterlambatan

```
ATURAN SLOT WAKTU:
  Durasi per pasien  = 30 menit (default)
  Grace period       = 15 menit
  Batas hadir        = waktu_slot + 15 menit

STATUS KEHADIRAN:
  waktu_checkin <= batas_hadir              → ON_TIME
  waktu_checkin >  batas_hadir              → TERLAMBAT
  waktu IS NULL AND NOW > batas_hadir+30m   → ABSEN

KONSEKUENSI:
  ON_TIME    → masuk antrian sesuai urutan
  TERLAMBAT  → digeser ke belakang antrian aktif
  ABSEN      → slot dibebaskan, dapat reschedule

FLOW STATUS APPOINTMENT:
  MENUNGGU → DIKONFIRMASI → HADIR → SELESAI
                 │              │
                 ▼              ▼
               BATAL          ABSEN
```

### 2. Logic Antrian Hybrid

```
JENIS PASIEN:
  BOOKING  → punya slot waktu, check-in via app/loket
  WALKIN   → daftar langsung di loket, isi slot kosong

PRIORITAS ANTRIAN:
  1. Pasien BOOKING yang ON_TIME
  2. Pasien BOOKING yang TERLAMBAT (digeser)
  3. Pasien WALKIN (urut waktu daftar)

STATUS ANTRIAN:
  MENUNGGU → DIPANGGIL → SELESAI
      │
      ▼
    BATAL
```

### 3. Logic Stok Obat

```
KAPAN STOK BERKURANG:
  Resep status BELUM_DIAMBIL → tidak kurangi stok
  Resep diambil (SUDAH_DIAMBIL) → stok berkurang
  Resep BATAL setelah diambil → stok bertambah kembali

ALERT STOK:
  IF obat.stok <= obat.stok_minimum → tampil alert admin

AUDIT:
  Setiap perubahan stok → catat di STOK_OBAT_LOG
  (tipe: MASUK atau KELUAR, beserta created_by)
```

### 4. Logic Tagihan & Billing

```
PEMBUATAN TAGIHAN:
  Otomatis dibuat setelah dokter simpan rekam medis

KOMPONEN BIAYA (TAGIHAN_DETAIL):
  - Jasa Dokter   (flat per kunjungan)
  - Biaya Obat    (harga obat × jumlah di resep)
  - Biaya Tindakan (jika ada prosedur tambahan)

STATUS BAYAR:
  BELUM_BAYAR → SEBAGIAN → LUNAS
  (mendukung partial payment)

PASIEN ABSEN:
  Tetap dikenakan biaya administrasi

ATURAN EDIT TAGIHAN:
  Hanya Admin yang bisa mengubah tagihan
  Status LUNAS tidak bisa diubah kembali
```

### 5. Logic Rekam Medis

```
SIAPA YANG INPUT:
  Dokter yang melakukan pemeriksaan (berdasarkan appointment)

SIAPA YANG BISA LIHAT:
  Dokter pemeriksa  → read + write
  Dokter lain       → read only (riwayat pasien)
  Admin             → read only
  Pasien            → read only (rekam medis sendiri)

EDIT REKAM MEDIS:
  Tidak bisa dihapus (data medis permanen)
  Koreksi dilakukan dengan catatan audit trail
  Setiap perubahan menyimpan versi sebelumnya
```

---

## Data Flow

### Scenario: Pasien Booking Appointment

```
Frontend (Patient Portal)
    │
    ├── 1. GET /api/dokter              → load daftar dokter
    ├── 2. GET /api/dokter/{id}/jadwal  → load jadwal praktek
    ├── 3. GET /api/dokter/{id}/slot-jam → slot yang tersedia
    ├── 4. POST /api/appointment         → kirim booking
    │         {
    │           dokter_id, pasien_id,
    │           tanggal_jam, keluhan
    │         }
    │
Backend (AppointmentController@store)
    │
    ├── 5. Validasi data & slot tidak bentrok
    ├── 6. Hitung batas_hadir = tanggal_jam + 15 menit
    ├── 7. Create APPOINTMENT (status: MENUNGGU)
    └── 8. Return response + nomor appointment
```

### Scenario: Pasien Check-in & Masuk Antrian

```
Pasien tiba di klinik
    │
    ├── 1. POST /api/appointment/{id}/checkin
    │         { waktu_checkin: NOW() }
    │
Backend (AppointmentController@checkin)
    │
    ├── 2. Cek: waktu_checkin <= batas_hadir?
    │         YA  → status_kehadiran = ON_TIME
    │         TIDAK → status_kehadiran = TERLAMBAT
    │
    ├── 3. Update status APPOINTMENT → HADIR
    │
    ├── 4. Create ANTRIAN
    │         ON_TIME    → posisi normal
    │         TERLAMBAT  → posisi setelah semua ON_TIME
    │
    └── 5. Return nomor antrian
```

### Scenario: Dokter Input Rekam Medis & Resep

```
Frontend (Doctor Portal)
    │
    ├── 1. GET /api/vital-signs/{appointment_id}
    ├── 2. Dokter periksa pasien
    ├── 3. POST /api/rekam-medis
    │         { appointment_id, diagnosis, tindakan, catatan }
    │
    ├── 4. POST /api/resep (per obat)
    │         { rekam_medis_id, obat_id, dosis, durasi }
    │         → stok BELUM berkurang di sini
    │
    ├── 5. PUT /api/appointment/{id} (status: SELESAI)
    │
Backend (TagihanController)
    │
    └── 6. Auto-create TAGIHAN + TAGIHAN_DETAIL
              - Jasa dokter
              - Biaya obat (dari resep)
```

### Scenario: Ambil Obat di Apotek

```
Admin/Apoteker
    │
    ├── 1. PUT /api/resep/{id}
    │         { status_ambil: SUDAH_DIAMBIL }
    │
Backend (ResepController@update)
    │
    ├── 2. Update status resep
    ├── 3. Kurangi stok obat (obat.stok -= jumlah)
    ├── 4. Create STOK_OBAT_LOG (tipe: KELUAR)
    └── 5. Cek: stok <= stok_minimum → trigger alert
```

---

## Authentication & Authorization

### JWT Flow (Laravel Sanctum)

```
1. POST /api/auth/login  { email, password }
2. Backend verify → generate token
3. Return { token, user: { id, name, role } }
4. Frontend: simpan token di localStorage
5. Axios interceptor: tambah Authorization: Bearer {token}
6. Backend middleware: validasi token setiap request
7. Token expired → 401 → redirect ke login
```

### Authorization Rules

```
Admin:
  Akses penuh ke semua resource
  Satu-satunya yang bisa: ubah tagihan, input stok masuk

Dokter:
  Baca pasien milik sendiri
  Input rekam medis (appointment milik sendiri)
  Buat resep (dari rekam medis milik sendiri)
  Baca riwayat rekam medis semua pasien (read-only)

Pasien:
  Baca & update profil sendiri
  Buat & lihat appointment sendiri
  Lihat rekam medis sendiri
  Lihat tagihan & resep sendiri
```

---

## Deployment Architecture

### Development

```
Local Machine
├── Frontend : Vite Dev Server  → http://localhost:5173
├── Backend  : Laravel Artisan  → http://localhost:8000
└── Database : SQLite local file
```

### Production (Docker)

```
Docker Compose
├── Service 1: Laravel Backend
│   ├── Port: 8000 (exposed)
│   └── Network: klinik-net
│
├── Service 2: Oracle Database
│   ├── Port: 1521 (internal only)
│   └── Volume: persistent data
│
└── Network: klinik-net (bridge)

Frontend:
├── Static build (pnpm build)
├── Served by Nginx
└── Port: 80
```

---

## Koneksi Laravel ke Oracle

### Stack Koneksi

```
Laravel App
    │
    ├── yajra/laravel-oci8   (Laravel package)
    │       │
    │       └── php-oci8     (PHP extension)
    │               │
    │               └── Oracle Instant Client  (library Oracle)
    │                           │
    │                           └── Oracle Database 21c
```

### Komponen Wajib

```
KOMPONEN              FUNGSI
─────────────────────────────────────────────────────
yajra/laravel-oci8  → Eloquent, Migration, Seeder
                      bisa jalan normal di Oracle
php-oci8            → PHP bisa terhubung ke Oracle
pdo_oci             → PDO driver untuk Oracle
Oracle Instant      → Library C dari Oracle yang
Client              → dibutuhkan php-oci8
```

### Setup via Docker

Tambahkan ke `backend/Dockerfile`:

```dockerfile
FROM php:8.1-fpm

RUN apt-get update && apt-get install -y libaio1 unzip curl

# Oracle Instant Client
RUN mkdir -p /opt/oracle && cd /opt/oracle \
 && curl -o instantclient.zip \
    https://download.oracle.com/otn_software/linux/instantclient/instantclient-basiclite-linuxx64.zip \
 && unzip instantclient.zip && rm instantclient.zip \
 && echo /opt/oracle/instantclient* > /etc/ld.so.conf.d/oracle.conf \
 && ldconfig

# php-oci8 & pdo_oci
RUN docker-php-ext-configure oci8 \
    --with-oci8=instantclient,/opt/oracle/instantclient_21_1 \
 && docker-php-ext-install oci8 pdo_oci pdo pdo_sqlite
```

### Penyesuaian Tipe Data Migration

Oracle berbeda dari MySQL — kolom perlu disesuaikan:

```
MySQL/SQLite         →   Oracle (yajra)
─────────────────────────────────────────
bigIncrements        →   id()  (NUMBER + SEQUENCE)
text / longText      →   string('col', 4000)  atau CLOB
boolean              →   integer()->default(0/1)
dateTime             →   timestamp()
VARCHAR tanpa limit  →   string('col', 200)  (selalu beri limit)
```

Contoh migration Oracle-compatible:

```php
Schema::create('appointment', function (Blueprint $table) {
    $table->id();
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

### Hal Penting Oracle vs MySQL

```
ASPEK               ORACLE                    MySQL
──────────────────────────────────────────────────────────
Nama tabel          UPPERCASE (konvensi)      lowercase
Max nama kolom      30 char (< 18c)           64 char
                    128 char (>= 18c)
Auto increment      SEQUENCE + TRIGGER        AUTO_INCREMENT
Boolean             NUMBER(1) → 0 atau 1      TINYINT(1)
String tanpa limit  WAJIB beri limit          boleh tanpa limit
FK index            TIDAK otomatis, wajib     otomatis
                    buat manual
NULL handling       NULL != '' (strict)       NULL == '' (loose)
Pagination          ROWNUM / FETCH NEXT       LIMIT ... OFFSET
```

---



### Oracle Indexes

```sql
-- Semua FK wajib di-index manual di Oracle
idx_appointment_pasien   → query pasien punya appointment apa
idx_appointment_dokter   → query dokter punya jadwal siapa
idx_appointment_tanggal  → query slot jam per tanggal
idx_rekam_medis_appt     → join appointment ke rekam medis
idx_resep_rekam          → join rekam medis ke resep
idx_tagihan_pasien       → tagihan per pasien
idx_antrian_tanggal      → antrian hari ini
idx_stok_log_obat        → riwayat stok per obat
```

### Security Measures

```
Authentication  : bcrypt password + JWT Sanctum
Authorization   : Middleware + Policy per role
Input           : Validation di frontend + backend
Protection      : CORS, CSRF, SQL injection (Eloquent ORM)
Rate Limiting   : Middleware throttle per endpoint
Audit Trail     : Semua perubahan rekam medis & stok dicatat
```

---

## Design Principles

```
DRY             : Service layer untuk logic yang dipakai ulang
Single Resp.    : Satu controller = satu resource
Separation      : Controller (route) / Model (data) / Service (logic)
Data Integrity  : Rekam medis & stok tidak boleh dihapus, hanya diaudit
Immutability    : Tagihan LUNAS tidak bisa diubah kembali
```

---

**Document Version**: 1.1
**Last Updated**: Mei 2026
**Database**: SQLite (Development) / Oracle (Production)