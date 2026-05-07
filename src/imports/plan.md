# 🏥 PLAN PENGEMBANGAN — SISTEM MANAJEMEN KLINIK BENMARI
> Dibuat berdasarkan Proposal Kelompok 6 — Workshop Administrasi Basis Data, PENS 2026

---

## 📋 RINGKASAN PROYEK

| Item | Detail |
|------|--------|
| **Nama Sistem** | Sistem Manajemen Klinik BenMari |
| **Stack Frontend** | React.js + Tailwind CSS |
| **Stack Backend** | Node.js + Express.js |
| **Database** | Oracle Database 19c / 21c |
| **ORM/Driver** | oracledb (npm) |
| **Auth** | JWT (JSON Web Token) |
| **Web Server** | Nginx (Reverse Proxy) |
| **OS Server** | Oracle Linux / Ubuntu 22.04 |

---

## 🤖 MASTER PROMPT (untuk Claude / AI Code Generator)

Gunakan prompt berikut saat meminta AI membangun fitur:

```
Kamu adalah senior fullstack developer yang membangun sistem manajemen klinik medis bernama
"Klinik BenMari". Stack teknologi yang digunakan:

- Frontend: React.js dengan Tailwind CSS
- Backend: Node.js + Express.js (REST API)
- Database: Oracle Database 19c dengan driver oracledb (npm)
- Auth: JWT Bearer Token (disimpan di localStorage)
- Arsitektur: MVC — Model/View/Controller yang terpisah jelas

SKEMA DATABASE (7 tabel utama):
1. PASIEN (PASIEN_ID, NIK, NAMA_LENGKAP, TANGGAL_LAHIR, JENIS_KELAMIN, ALAMAT, NO_TELEPON, EMAIL, GOLONGAN_DARAH, STATUS_AKTIF)
2. DOKTER (DOKTER_ID, NAMA_DOKTER, SPESIALISASI, NO_SIP, NO_TELEPON, EMAIL, JADWAL_PRAKTIK, BIAYA_KONSULTASI, STATUS_AKTIF)
3. APPOINTMENT (APPOINTMENT_ID, PASIEN_ID[FK], DOKTER_ID[FK], TGL_APPOINTMENT, JAM_APPOINTMENT, NOMOR_ANTRIAN, KELUHAN_AWAL, STATUS[MENUNGGU/SELESAI/BATAL], CATATAN)
4. REKAM_MEDIS (REKAM_ID, APPOINTMENT_ID[FK,UNIQUE], DOKTER_ID[FK], TGL_PERIKSA, KELUHAN, DIAGNOSIS, TINDAKAN, TEKANAN_DARAH, BERAT_BADAN, CATATAN_TAMBAHAN)
5. OBAT (OBAT_ID, NAMA_OBAT, KATEGORI, SATUAN, STOK_TERSEDIA, HARGA_SATUAN, TGL_KADALUARSA, DESKRIPSI, STATUS_AKTIF)
6. RESEP (RESEP_ID, REKAM_ID[FK], OBAT_ID[FK], DOSIS, ATURAN_PAKAI, JUMLAH, CATATAN_RESEP)
7. TAGIHAN (TAGIHAN_ID, PASIEN_ID[FK], APPOINTMENT_ID[FK,UNIQUE], TGL_TAGIHAN, BIAYA_KONSULTASI, BIAYA_OBAT, TOTAL_BIAYA, METODE_BAYAR, STATUS_BAYAR[BELUM/LUNAS/CICIL])

ATURAN BISNIS:
- 1 Appointment → 1 Rekam Medis (one-to-one)
- 1 Appointment → 1 Tagihan (one-to-one)
- 1 Rekam Medis → banyak Resep
- Rekam Medis tidak boleh dihapus (audit trail)
- Soft delete untuk Pasien dan Obat (STATUS_AKTIF = 'N')
- JWT wajib ada di setiap request (kecuali login)

GAYA UI:
- Sidebar navigasi collapsible di kiri
- Konten utama dengan header, kartu statistik, dan tabel data
- Color scheme: biru teal (#0F766E primary) + putih bersih
- Font: Geist atau DM Sans
- Badge berwarna untuk status (hijau=aktif/lunas, kuning=menunggu, merah=batal/belum)
- Progress bar visual untuk stok obat

Buatlah [NAMA FITUR] dengan memperhatikan semua aturan di atas.
```

---

## 🗂️ DAFTAR FITUR LENGKAP

### FITUR 1 — AUTENTIKASI (Auth)
**Endpoint:** `POST /api/auth/login`, `POST /api/auth/logout`, `GET /api/auth/profile`, `POST /api/auth/refresh`

**Yang perlu dibuat:**
- Halaman login dengan form email + password
- Validasi input client-side (email format, password minimal 8 karakter)
- Kirim POST ke `/api/auth/login`, terima JWT token
- Simpan JWT di `localStorage`
- Proteksi semua route dengan middleware `verifyToken`
- Auto-redirect ke login jika token expired atau tidak ada
- Tombol logout yang menghapus token dan redirect ke login

**Backend:**
```
POST /api/auth/login
Body: { email, password }
Response: { token, user: { id, nama, role } }

Middleware: verifyToken(req, res, next) → decode JWT dari header Authorization: Bearer <token>
```

---

### FITUR 2 — DASHBOARD
**Endpoint:** `GET /api/dashboard/stats`, `GET /api/dashboard/appointment-chart`, `GET /api/dashboard/recent-appointments`

**Yang perlu dibuat:**
- 4 kartu statistik (Summary Cards):
  - Total Pasien Terdaftar → `SELECT COUNT(*) FROM PASIEN WHERE STATUS_AKTIF='Y'`
  - Appointment Hari Ini → `SELECT COUNT(*) FROM APPOINTMENT WHERE TGL_APPOINTMENT = TRUNC(SYSDATE)`
  - Tagihan Pending → `SELECT COUNT(*) FROM TAGIHAN WHERE STATUS_BAYAR='BELUM'`
  - Stok Obat Menipis → `SELECT COUNT(*) FROM OBAT WHERE STOK_TERSEDIA < 20 AND STATUS_AKTIF='Y'`
- Bar chart appointment per hari (7 hari terakhir)
- Pie chart status appointment (Menunggu/Selesai/Batal)
- Tabel 5 appointment terbaru
- Daftar dokter aktif hari ini

**Library:** `recharts` atau `chart.js` untuk grafik

---

### FITUR 3 — MANAJEMEN PASIEN
**Endpoint base:** `/api/pasien`

| Method | Endpoint | Fungsi |
|--------|----------|--------|
| GET | `/api/pasien` | List semua pasien (dengan pagination & search) |
| GET | `/api/pasien/:id` | Detail satu pasien |
| POST | `/api/pasien` | Tambah pasien baru |
| PUT | `/api/pasien/:id` | Update data pasien |
| DELETE | `/api/pasien/:id` | Soft delete (ubah STATUS_AKTIF='N') |

**UI yang perlu dibuat:**
- Search bar (debounce 300ms) by nama atau NIK
- Tabel data: Nama | NIK | Tgl Lahir | Telepon | Gol. Darah | Status | Aksi
- Pagination (10 baris per halaman)
- Badge AKTIF (hijau) / NONAKTIF (abu)
- Modal form tambah/edit dengan field:
  - NIK (16 digit, validasi unik)
  - Nama Lengkap (min 3 karakter)
  - Tanggal Lahir (tidak boleh masa depan)
  - Jenis Kelamin (radio L/P)
  - Golongan Darah (dropdown A/B/AB/O)
  - Alamat (textarea)
  - No. Telepon (format Indonesia 08xx)
  - Email (opsional, format valid)
- Konfirmasi dialog sebelum hapus

**Validasi Backend:**
```
NIK: tepat 16 digit angka, UNIQUE di DB
Nama: minimal 3 karakter
Tanggal Lahir: tidak boleh > SYSDATE
No. Telepon: 10-15 digit, dimulai 08
```

---

### FITUR 4 — MANAJEMEN DOKTER
**Endpoint base:** `/api/dokter`

| Method | Endpoint | Fungsi |
|--------|----------|--------|
| GET | `/api/dokter` | List dokter (filter by spesialisasi) |
| GET | `/api/dokter/:id` | Detail dokter |
| POST | `/api/dokter` | Tambah dokter baru |
| PUT | `/api/dokter/:id` | Update data dokter |
| DELETE | `/api/dokter/:id` | Soft delete |

**UI yang perlu dibuat:**
- Dropdown filter by spesialisasi
- Tampilan card grid (bukan tabel) — setiap kartu menampilkan:
  - Avatar/Inisial nama dokter
  - Nama lengkap + spesialisasi
  - No. SIP
  - Jadwal praktik
  - Tarif konsultasi (format Rupiah)
  - Badge status AKTIF/NONAKTIF
  - Tombol edit (ikon ✏)
- Modal form tambah/edit dengan field:
  - Nama Dokter
  - Spesialisasi
  - No. SIP (unik)
  - No. Telepon
  - Email
  - Jadwal Praktik (textarea, contoh: "Senin-Jumat 08:00-14:00")
  - Biaya Konsultasi (number, format Rupiah)

---

### FITUR 5 — MANAJEMEN APPOINTMENT
**Endpoint base:** `/api/appointment`

| Method | Endpoint | Fungsi |
|--------|----------|--------|
| GET | `/api/appointment` | List appointment (filter tanggal & status) |
| GET | `/api/appointment/:id` | Detail appointment |
| POST | `/api/appointment` | Buat appointment baru |
| PUT | `/api/appointment/:id` | Update status/data |
| DELETE | `/api/appointment/:id` | Batalkan appointment |

**UI yang perlu dibuat:**
- Toggle view: Tabel ↔ Kalender
- Date picker filter
- Tabel: Pasien | Dokter | Tanggal | Jam | No. Antrian | Status | Aksi
- Badge status: MENUNGGU (kuning) | SELESAI (hijau) | BATAL (merah)
- Inline tombol aksi: "Selesai" dan "Batal" di kolom Aksi
- Modal form buat appointment:
  - Dropdown pilih pasien (search-able)
  - Dropdown pilih dokter (tampilkan jadwal & biaya)
  - Date picker tanggal
  - Time picker jam
  - Textarea keluhan awal
  - Auto-generate nomor antrian berdasarkan tanggal + dokter

**Logic nomor antrian:**
```sql
SELECT NVL(MAX(NOMOR_ANTRIAN), 0) + 1 
FROM APPOINTMENT 
WHERE TGL_APPOINTMENT = :tgl AND DOKTER_ID = :dokter_id
```

---

### FITUR 6 — REKAM MEDIS
**Endpoint base:** `/api/rekam-medis`

| Method | Endpoint | Fungsi |
|--------|----------|--------|
| GET | `/api/rekam-medis` | List rekam medis |
| GET | `/api/rekam-medis/:id` | Detail + resep terkait |
| POST | `/api/rekam-medis` | Tambah rekam medis baru |
| PUT | `/api/rekam-medis/:id` | Update rekam medis |
| ~~DELETE~~ | — | **TIDAK ADA** (audit trail) |

**UI yang perlu dibuat:**
- Tabel: No. Rekam | Pasien | Dokter | Tgl. Periksa | Diagnosis | Aksi (detail →)
- Format ID rekam: `RM-001/2026`, `RM-002/2026`, dst.
- Halaman detail rekam medis (full page):
  - Info pasien + dokter
  - Semua field medis (keluhan, diagnosis, tindakan, tekanan darah, berat badan)
  - Catatan tambahan
  - Tabel resep yang diterbitkan dari rekam medis ini
- Modal form tambah rekam medis:
  - Dropdown pilih appointment (hanya yang STATUS='MENUNGGU')
  - Field: Keluhan detail, Diagnosis, Tindakan, Tekanan Darah, Berat Badan, Catatan
- Tidak ada tombol Delete sama sekali

---

### FITUR 7 — MANAJEMEN OBAT
**Endpoint base:** `/api/obat`

| Method | Endpoint | Fungsi |
|--------|----------|--------|
| GET | `/api/obat` | List obat (search + filter kategori) |
| GET | `/api/obat/:id` | Detail obat |
| POST | `/api/obat` | Tambah obat baru |
| PUT | `/api/obat/:id` | Update data + stok |
| DELETE | `/api/obat/:id` | Soft delete (STATUS_AKTIF='N') |

**UI yang perlu dibuat:**
- Search bar (nama obat) + dropdown filter kategori
- Tabel: Nama | Kategori | Satuan | Stok (progress bar) | Harga/Satuan | Kadaluarsa | Status | Aksi
- **Progress bar stok visual:**
  - > 50%: Hijau
  - 20–50%: Kuning
  - < 20%: Merah (dengan peringatan)
- Badge TERSEDIA (hijau) / MENIPIS (kuning) / HABIS (merah)
- Peringatan kadaluarsa jika tanggal < 30 hari dari sekarang
- Modal form tambah/edit:
  - Nama Obat
  - Kategori (dropdown: Antibiotik, Analgesik, Antihistamin, Vitamin, dll.)
  - Satuan (Tablet/Kapsul/Ml/Botol/Sachet)
  - Stok Tersedia (number ≥ 0)
  - Harga Satuan (format Rupiah)
  - Tanggal Kadaluarsa (date picker)
  - Deskripsi (textarea)

---

### FITUR 8 — MANAJEMEN RESEP
**Endpoint base:** `/api/resep`

| Method | Endpoint | Fungsi |
|--------|----------|--------|
| GET | `/api/resep` | List resep |
| GET | `/api/resep/:rekam_id` | Resep berdasarkan rekam medis |
| POST | `/api/resep` | Terbitkan resep baru |
| PUT | `/api/resep/:id` | Update resep |
| DELETE | `/api/resep/:id` | Hapus resep |

**UI yang perlu dibuat:**
- Resep ditampilkan sebagai sub-section dari halaman detail Rekam Medis
- Form tambah resep (inline di halaman detail rekam medis):
  - Dropdown pilih obat (dengan info stok & harga)
  - Input dosis (contoh: "500mg")
  - Input aturan pakai (contoh: "3x1 sesudah makan")
  - Input jumlah (number)
  - Textarea catatan
- Auto-update stok obat saat resep diterbitkan:
  ```sql
  UPDATE OBAT SET STOK_TERSEDIA = STOK_TERSEDIA - :jumlah WHERE OBAT_ID = :id
  ```

---

### FITUR 9 — TAGIHAN & PEMBAYARAN
**Endpoint base:** `/api/tagihan`

| Method | Endpoint | Fungsi |
|--------|----------|--------|
| GET | `/api/tagihan` | List tagihan (filter bulan & status) |
| GET | `/api/tagihan/:id` | Detail tagihan |
| POST | `/api/tagihan` | Generate tagihan dari appointment |
| PUT | `/api/tagihan/:id` | Update status pembayaran |

**UI yang perlu dibuat:**
- 3 kartu ringkasan keuangan:
  - Total Pendapatan Bulan Ini (biru)
  - Total Belum Dibayar (merah)
  - Rata-rata Tagihan (hijau)
- Filter bulan (date picker)
- Tabel: Pasien | Tgl. Tagihan | Biaya Konsultasi | Biaya Obat | Total | Metode Bayar | Status | Aksi
- Badge: LUNAS (hijau) | BELUM (merah) | CICIL (oranye)
- Tombol "Tandai Lunas" untuk tagihan BELUM
- Auto-generate tagihan saat appointment SELESAI:
  ```
  BIAYA_KONSULTASI = DOKTER.BIAYA_KONSULTASI
  BIAYA_OBAT = SUM(RESEP.JUMLAH * OBAT.HARGA_SATUAN)
  TOTAL_BIAYA = BIAYA_KONSULTASI + BIAYA_OBAT
  ```
- Pilihan metode bayar: Tunai / Transfer / Debit / BPJS

---

### FITUR 10 — SIDEBAR NAVIGASI
**Komponen global (hadir di semua halaman setelah login)**

**Yang perlu dibuat:**
- Logo "K" + teks "Klinik Ben Mari" di header sidebar
- Tombol collapse (✕ / ☰) untuk menyembunyikan sidebar
- Menu items dengan ikon:
  - 🏠 Dashboard
  - 👤 Pasien
  - 👨‍⚕️ Dokter
  - 📅 Appointment
  - 📋 Rekam Medis
  - 💊 Obat
  - 🧾 Tagihan
  - ⚙️ Pengaturan
- Active state: highlight biru pada menu aktif
- User card di bagian bawah: Avatar | Nama | Role | Tombol Logout (merah)

---

## 🎨 STYLE GUIDE

### Color Palette
```css
:root {
  --color-primary:     #0F766E;  /* Teal utama */
  --color-primary-light: #14B8A6; /* Teal terang hover */
  --color-primary-dark:  #0D6B64; /* Teal gelap aktif */
  
  --color-sidebar-bg:  #0F172A;  /* Biru navy gelap */
  --color-sidebar-text:#CBD5E1;  /* Abu terang */
  --color-sidebar-active-bg: rgba(15,118,110,0.2);
  
  --color-bg:          #F8FAFC;  /* Background utama abu sangat muda */
  --color-surface:     #FFFFFF;  /* Card/panel putih */
  --color-border:      #E2E8F0;  /* Border abu muda */
  
  --color-text-primary:#0F172A;  /* Teks utama */
  --color-text-secondary:#64748B;/* Teks sekunder */
  --color-text-muted:  #94A3B8;  /* Teks placeholder */
  
  /* Status colors */
  --color-success:     #059669;  /* Hijau — AKTIF, LUNAS, SELESAI */
  --color-warning:     #D97706;  /* Kuning — MENUNGGU, MENIPIS, CICIL */
  --color-danger:      #DC2626;  /* Merah — NONAKTIF, BATAL, BELUM */
  --color-info:        #2563EB;  /* Biru info */
}
```

### Typography
```css
/* Import di index.html atau App.jsx */
@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=DM+Mono:wght@400;500&display=swap');

body {
  font-family: 'DM Sans', sans-serif;
  font-size: 14px;
}

h1 { font-size: 24px; font-weight: 700; }
h2 { font-size: 20px; font-weight: 600; }
h3 { font-size: 16px; font-weight: 600; }

/* Monospace untuk ID, nomor, kode */
.mono { font-family: 'DM Mono', monospace; }
```

### Komponen Desain

#### Badge / Chip Status
```jsx
// Status Appointment
<span className="px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-700">
  MENUNGGU
</span>
<span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
  SELESAI
</span>
<span className="px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-700">
  BATAL
</span>

// Status Bayar
<span className="...bg-red-100 text-red-700">BELUM</span>
<span className="...bg-green-100 text-green-700">LUNAS</span>
<span className="...bg-orange-100 text-orange-700">CICIL</span>
```

#### Progress Bar Stok Obat
```jsx
function StokBar({ stok, stokMax = 100 }) {
  const pct = Math.min((stok / stokMax) * 100, 100);
  const color = pct > 50 ? 'bg-green-500' : pct > 20 ? 'bg-yellow-500' : 'bg-red-500';
  return (
    <div className="flex items-center gap-2">
      <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
        <div className={`h-full ${color} rounded-full`} style={{ width: `${pct}%` }} />
      </div>
      <span className="text-xs text-gray-600">{stok}</span>
    </div>
  );
}
```

#### Kartu Statistik (Summary Card)
```jsx
function StatCard({ title, value, icon, color, subtitle }) {
  return (
    <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-gray-500 font-medium">{title}</p>
          <p className="text-3xl font-bold text-gray-900 mt-1">{value}</p>
          {subtitle && <p className="text-xs text-gray-400 mt-1">{subtitle}</p>}
        </div>
        <div className={`p-3 rounded-lg ${color}`}>{icon}</div>
      </div>
    </div>
  );
}
```

#### Tabel Data
```jsx
// Pola tabel standar
<div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
  <div className="p-4 border-b border-gray-100 flex justify-between items-center">
    <h3 className="font-semibold text-gray-800">Judul Tabel</h3>
    <button className="bg-teal-700 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-teal-800">
      + Tambah
    </button>
  </div>
  <table className="w-full">
    <thead className="bg-gray-50 text-xs font-medium text-gray-500 uppercase tracking-wider">
      <tr>
        <th className="px-4 py-3 text-left">Kolom</th>
      </tr>
    </thead>
    <tbody className="divide-y divide-gray-100">
      <tr className="hover:bg-gray-50 transition-colors">
        <td className="px-4 py-3 text-sm text-gray-700">Data</td>
      </tr>
    </tbody>
  </table>
  {/* Pagination di sini */}
</div>
```

---

## 🏗️ STRUKTUR FOLDER PROJECT

```
klinik-benmari/
├── frontend/                    # React.js
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── components/          # Komponen reusable
│   │   │   ├── Sidebar.jsx
│   │   │   ├── StatCard.jsx
│   │   │   ├── DataTable.jsx
│   │   │   ├── Modal.jsx
│   │   │   ├── Badge.jsx
│   │   │   ├── StokBar.jsx
│   │   │   └── ConfirmDialog.jsx
│   │   ├── pages/               # Halaman utama
│   │   │   ├── Login.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Pasien.jsx
│   │   │   ├── Dokter.jsx
│   │   │   ├── Appointment.jsx
│   │   │   ├── RekamMedis.jsx
│   │   │   ├── RekamMedisDetail.jsx
│   │   │   ├── Obat.jsx
│   │   │   ├── Tagihan.jsx
│   │   │   └── Pengaturan.jsx
│   │   ├── hooks/               # Custom hooks
│   │   │   ├── useAuth.js
│   │   │   └── useFetch.js
│   │   ├── services/            # API calls
│   │   │   ├── api.js           # Axios instance + interceptor JWT
│   │   │   ├── authService.js
│   │   │   ├── pasienService.js
│   │   │   ├── dokterService.js
│   │   │   ├── appointmentService.js
│   │   │   ├── rekamMedisService.js
│   │   │   ├── obatService.js
│   │   │   ├── resepService.js
│   │   │   └── tagihanService.js
│   │   ├── utils/
│   │   │   ├── formatRupiah.js
│   │   │   ├── formatDate.js
│   │   │   └── validators.js
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── tailwind.config.js
│   └── package.json
│
├── backend/                     # Node.js + Express
│   ├── config/
│   │   └── db.js                # Oracle connection pool
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── pasienController.js
│   │   ├── dokterController.js
│   │   ├── appointmentController.js
│   │   ├── rekamMedisController.js
│   │   ├── obatController.js
│   │   ├── resepController.js
│   │   └── tagihanController.js
│   ├── middleware/
│   │   ├── verifyToken.js       # JWT middleware
│   │   └── errorHandler.js
│   ├── models/
│   │   ├── pasienModel.js       # SQL queries
│   │   ├── dokterModel.js
│   │   └── ...
│   ├── routes/
│   │   ├── auth.js
│   │   ├── pasien.js
│   │   ├── dokter.js
│   │   ├── appointment.js
│   │   ├── rekamMedis.js
│   │   ├── obat.js
│   │   ├── resep.js
│   │   └── tagihan.js
│   ├── .env
│   ├── app.js
│   └── package.json
│
└── database/
    ├── 01_create_tablespace.sql
    ├── 02_create_users.sql
    ├── 03_ddl_tables.sql
    ├── 04_indexes.sql
    └── 05_seed_data.sql
```

---

## 📅 RENCANA PENGEMBANGAN (8 Fase)

### FASE 1 — Setup Environment (Minggu 1)
- [ ] Install Oracle Database 19c / 21c
- [ ] Jalankan `01_create_tablespace.sql` → buat tablespace KLINIK_DATA, KLINIK_INDEX
- [ ] Jalankan `02_create_users.sql` → buat user KLINIK_APP, KLINIK_ADMIN, KLINIK_REPORT
- [ ] Jalankan `03_ddl_tables.sql` → buat 7 tabel sesuai PDM
- [ ] Jalankan `04_indexes.sql` → buat semua index
- [ ] Test koneksi Oracle Listener (port 1521)
- [ ] Setup Node.js project + install oracledb, express, jsonwebtoken, bcrypt, cors, dotenv
- [ ] Test connection pool dari Node.js ke Oracle
- [ ] Setup React project + install Tailwind CSS, axios, react-router-dom, recharts

**Output:** Database siap, koneksi OK, project skeleton berjalan

---

### FASE 2 — Seed Data & Auth Backend (Minggu 1-2)
- [ ] Jalankan `05_seed_data.sql` → insert data dummy (5 dokter, 20 pasien, dst.)
- [ ] Buat tabel USER untuk login (atau gunakan tabel DOKTER dengan field password)
- [ ] Implement `POST /api/auth/login` → validasi credential, return JWT
- [ ] Implement `GET /api/auth/profile` → return data user dari JWT
- [ ] Buat middleware `verifyToken.js`
- [ ] Test endpoint dengan Postman/Thunder Client

**Output:** Auth backend berjalan, JWT bekerja

---

### FASE 3 — Frontend Auth + Layout (Minggu 2)
- [ ] Buat halaman Login (React) dengan form email + password
- [ ] Setup Axios instance dengan interceptor JWT di `services/api.js`
- [ ] Buat komponen `Sidebar.jsx` dengan semua menu items
- [ ] Buat `PrivateRoute` untuk proteksi halaman
- [ ] Buat layout utama (Sidebar + Content Area)
- [ ] Implementasi logout (hapus token, redirect ke login)

**Output:** Login berfungsi, sidebar tampil, routing bekerja

---

### FASE 4 — Dashboard (Minggu 2)
- [ ] Buat endpoint `GET /api/dashboard/stats`
- [ ] Buat endpoint `GET /api/dashboard/chart-data`
- [ ] Buat endpoint `GET /api/dashboard/recent-appointments`
- [ ] Implementasi halaman `Dashboard.jsx` dengan 4 StatCard
- [ ] Tambahkan Bar Chart appointment (recharts)
- [ ] Tambahkan Pie Chart status appointment
- [ ] Tabel 5 appointment terbaru

**Output:** Dashboard menampilkan data real dari Oracle

---

### FASE 5 — CRUD Pasien & Dokter (Minggu 3)
- [ ] Backend: semua endpoint `/api/pasien` (GET list, GET detail, POST, PUT, DELETE soft)
- [ ] Backend: semua endpoint `/api/dokter` (GET list, GET detail, POST, PUT, DELETE soft)
- [ ] Frontend: halaman `Pasien.jsx` (tabel, search, pagination, modal form)
- [ ] Frontend: halaman `Dokter.jsx` (card grid, filter spesialisasi, modal form)
- [ ] Validasi input frontend + backend

**Output:** CRUD Pasien dan Dokter lengkap

---

### FASE 6 — Appointment & Rekam Medis (Minggu 4)
- [ ] Backend: semua endpoint `/api/appointment`
- [ ] Backend: semua endpoint `/api/rekam-medis`
- [ ] Frontend: halaman `Appointment.jsx` (tabel + view kalender, form buat appointment)
- [ ] Auto-generate nomor antrian
- [ ] Frontend: halaman `RekamMedis.jsx` (tabel, no delete)
- [ ] Frontend: halaman `RekamMedisDetail.jsx` (detail + sub-tabel resep)
- [ ] Logic: saat appointment SELESAI → trigger buat tagihan otomatis

**Output:** Alur utama klinik (appointment → rekam medis) berjalan

---

### FASE 7 — Obat, Resep & Tagihan (Minggu 5)
- [ ] Backend: semua endpoint `/api/obat`
- [ ] Backend: semua endpoint `/api/resep` (+ update stok obat)
- [ ] Backend: semua endpoint `/api/tagihan`
- [ ] Frontend: halaman `Obat.jsx` (tabel dengan progress bar stok, peringatan kadaluarsa)
- [ ] Frontend: form resep di halaman detail rekam medis
- [ ] Frontend: halaman `Tagihan.jsx` (kartu keuangan, tabel, tandai lunas)
- [ ] Auto-kalkulasi total tagihan dari biaya konsultasi + biaya obat

**Output:** Alur farmasi dan billing lengkap

---

### FASE 8 — Testing, Optimasi & Deploy (Minggu 6)
- [ ] Testing semua endpoint dengan data edge case
- [ ] Security audit: validasi JWT, SQL injection prevention (gunakan bind parameters Oracle)
- [ ] Optimasi query: pastikan semua index dipakai
- [ ] Responsive design testing (mobile, tablet, desktop)
- [ ] Setup environment variables produksi (ganti semua placeholder password!)
- [ ] Configure Nginx reverse proxy
- [ ] Enable Oracle RMAN backup schedule
- [ ] Dokumentasi API (Swagger/Postman Collection)

**Output:** Aplikasi siap deploy ke produksi

---

## ⚠️ CATATAN PENTING

### Keamanan
- **JANGAN** commit file `.env` ke Git — tambahkan ke `.gitignore`
- Ganti semua placeholder password (`P@ss!word123`, `R3p0rt!Pass`) sebelum deploy
- Gunakan **bind parameters** Oracle untuk semua query (cegah SQL injection):
  ```javascript
  // ✅ BENAR — bind parameter
  await conn.execute('SELECT * FROM PASIEN WHERE NIK = :nik', { nik: req.body.nik });
  
  // ❌ SALAH — string concatenation (vulnerable SQL injection)
  await conn.execute(`SELECT * FROM PASIEN WHERE NIK = '${req.body.nik}'`);
  ```
- Hash password user dengan `bcrypt` (salt rounds ≥ 12)

### Oracle-Specific
- Gunakan `GENERATED ALWAYS AS IDENTITY` untuk auto-increment (bukan sequence manual)
- Format tanggal Oracle: `TO_DATE('2026-01-15', 'YYYY-MM-DD')`
- Untuk CLOB (CATATAN_TAMBAHAN), gunakan `oracledb.CLOB` type saat fetch
- Selalu tutup koneksi setelah query (`await conn.close()` di finally block)

### Rekam Medis — Audit Trail
- **TIDAK ADA** endpoint DELETE untuk `/api/rekam-medis`
- **TIDAK ADA** tombol hapus di UI rekam medis
- Ini adalah persyaratan bisnis — rekam medis medis adalah dokumen legal

### Auto-generate Tagihan
Saat PUT `/api/appointment/:id` dengan `STATUS = 'SELESAI'`, backend harus otomatis:
1. Ambil `BIAYA_KONSULTASI` dari tabel DOKTER
2. Hitung `BIAYA_OBAT` dari SUM resep terkait rekam medis appointment ini
3. INSERT ke tabel TAGIHAN dengan status `BELUM`