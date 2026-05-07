# Database Setup - Klinik BenMari

Aplikasi ini menggunakan **SQLite3** sebagai database lokal dengan library `sql.js` (pure JavaScript implementation).

## Struktur Database

Database SQLite tersimpan di file `klinik.db` di root project.

### Tables:
- **PASIEN** - Data pasien
- **DOKTER** - Data dokter
- **APPOINTMENT** - Data appointment/janji temu
- **REKAM_MEDIS** - Data rekam medis
- **OBAT** - Data obat
- **RESEP** - Data resep obat
- **TAGIHAN** - Data tagihan pembayaran
- **USERS** - Data user untuk login (admin, dokter, pasien)

## Cara Menggunakan

### 1. Inisialisasi Database Pertama Kali

Jalankan command berikut untuk membuat dan seed database:

```bash
pnpm db:init
```

Command ini akan:
- Membuat file `klinik.db` 
- Membuat semua tabel
- Mengisi data awal (seed data)

### 2. Reset Database

Jika ingin reset database (hapus dan buat ulang):

```bash
pnpm db:reset
```

## Konfigurasi Service Layer

Di file `src/services/patientService.ts`, terdapat konfigurasi `USE_SERVICE`:

```typescript
const USE_SERVICE: 'mock' | 'db' | 'api' = 'db';
```

**Pilihan:**
- `'mock'` - Menggunakan data mock (in-memory, tidak persisten)
- `'db'` - Menggunakan SQLite database (persisten, disimpan di klinik.db)
- `'api'` - Menggunakan backend API REST (http://localhost:3000/api)

**Default:** Saat ini diset ke `'db'` untuk menggunakan database SQLite.

## Demo Login Credentials

Setelah database di-seed, gunakan credentials berikut untuk login:

### Admin:
- Email: `admin@klinik.com`
- Password: `admin123`

### Dokter:
- Email: `maria@klinik.com`
- Password: `dokter123`

### Pasien:
- Email: `budi@email.com`
- Password: `pasien123`

## Migrasi ke Backend API

Ketika backend API sudah siap:

1. Update `USE_SERVICE` di `src/services/patientService.ts`:
   ```typescript
   const USE_SERVICE: 'mock' | 'db' | 'api' = 'api';
   ```

2. Pastikan backend API berjalan di `http://localhost:3000/api`

3. Semua request akan otomatis menggunakan backend API

## File Structure

```
src/
├── db/
│   ├── database.ts        # Database connection & utilities
│   ├── initDb.ts         # Database initialization script
│   └── schema.sql        # Database schema SQL
├── services/
│   ├── patientService.ts    # Main service (routing)
│   ├── patientServiceMock.ts # Mock implementation
│   └── patientServiceDb.ts   # SQLite implementation
```

## Notes

- Database file (`klinik.db`) tidak di-commit ke git (ada di .gitignore)
- Setiap kali aplikasi di-clone, perlu jalankan `pnpm db:init`
- Data di database bersifat lokal dan persisten
- Cocok untuk development dan testing frontend tanpa backend
