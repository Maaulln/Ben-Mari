/*
 * ============================================================
 *  DEMO DATA — Klinik BenMari
 *  Oracle Database (FREEPDB1 / schema: KLINIK_ADMIN)
 *
 *  Prasyarat : migrations sudah dijalankan (php artisan migrate)
 *  Tanggal   : 2026-06-01 (hari ini = Senin)
 *
 *  Akun login (semua password: password)
 *    admin@klinikbenmari.com   — Admin
 *    dr.andi@klinikbenmari.com — Dokter Umum
 *    dr.siti@klinikbenmari.com — Dokter Anak
 *    drg.budi@klinikbenmari.com — Dokter Gigi
 * ============================================================
 */

SET DEFINE OFF
ALTER SESSION SET NLS_DATE_FORMAT      = 'YYYY-MM-DD';
ALTER SESSION SET NLS_TIMESTAMP_FORMAT = 'YYYY-MM-DD HH24:MI:SS';

-- ============================================================
-- 1. PENGATURAN
-- ============================================================
UPDATE pengaturan SET
    nama_klinik     = 'Klinik BenMari',
    alamat          = 'Jl. Kesehatan No. 123, Surabaya 60111',
    no_telepon      = '(031) 1234-5678',
    email           = 'info@klinikbenmari.com',
    jam_operasional = 'Senin-Jumat: 08:00-17:00 | Sabtu: 08:00-12:00',
    deskripsi       = 'Klinik BenMari hadir memberikan pelayanan kesehatan terpadu dan profesional untuk masyarakat Surabaya dan sekitarnya.',
    updated_at      = SYSTIMESTAMP
WHERE id = 1;

-- ============================================================
-- 2. DOKTER
-- ============================================================
INSERT INTO dokter (dokter_id, nama_dokter, spesialisasi, no_sip, no_telepon, email, jadwal_praktik, biaya_konsultasi, status_aktif, is_active, created_at, updated_at)
VALUES (1, 'dr. Andi Wijaya', 'Umum', 'SIP/2020/001', '08112233445', 'dr.andi@klinikbenmari.com', 'Senin-Jumat', 150000, 'Y', 1, SYSTIMESTAMP, SYSTIMESTAMP);

INSERT INTO dokter (dokter_id, nama_dokter, spesialisasi, no_sip, no_telepon, email, jadwal_praktik, biaya_konsultasi, status_aktif, is_active, created_at, updated_at)
VALUES (2, 'dr. Siti Rahayu, Sp.A', 'Anak', 'SIP/2019/002', '08223344556', 'dr.siti@klinikbenmari.com', 'Senin-Jumat', 200000, 'Y', 1, SYSTIMESTAMP, SYSTIMESTAMP);

INSERT INTO dokter (dokter_id, nama_dokter, spesialisasi, no_sip, no_telepon, email, jadwal_praktik, biaya_konsultasi, status_aktif, is_active, created_at, updated_at)
VALUES (3, 'drg. Budi Santoso', 'Gigi', 'SIP/2021/003', '08334455667', 'drg.budi@klinikbenmari.com', 'Senin-Sabtu', 175000, 'Y', 1, SYSTIMESTAMP, SYSTIMESTAMP);

-- ============================================================
-- 3. PASIEN
-- ============================================================
INSERT INTO pasien (pasien_id, nik, nama_lengkap, tanggal_lahir, jenis_kelamin, alamat, no_telepon, email, golongan_darah, status_aktif, created_at, updated_at)
VALUES (1, '3578011001850001', 'Ahmad Fauzi', TO_DATE('1985-01-10','YYYY-MM-DD'), 'L', 'Jl. Mawar No. 5, Surabaya', '08111222333', 'ahmad.fauzi@email.com', 'O', 'Y', SYSTIMESTAMP, SYSTIMESTAMP);

INSERT INTO pasien (pasien_id, nik, nama_lengkap, tanggal_lahir, jenis_kelamin, alamat, no_telepon, email, golongan_darah, status_aktif, created_at, updated_at)
VALUES (2, '3578014502900002', 'Sari Dewi', TO_DATE('1990-05-02','YYYY-MM-DD'), 'P', 'Jl. Melati No. 12, Surabaya', '08222333444', 'sari.dewi@email.com', 'A', 'Y', SYSTIMESTAMP, SYSTIMESTAMP);

INSERT INTO pasien (pasien_id, nik, nama_lengkap, tanggal_lahir, jenis_kelamin, alamat, no_telepon, email, golongan_darah, status_aktif, created_at, updated_at)
VALUES (3, '3578021503920003', 'Budi Pratama', TO_DATE('1992-03-15','YYYY-MM-DD'), 'L', 'Jl. Kenanga No. 8, Surabaya', '08333444555', 'budi.pratama@email.com', 'B', 'Y', SYSTIMESTAMP, SYSTIMESTAMP);

INSERT INTO pasien (pasien_id, nik, nama_lengkap, tanggal_lahir, jenis_kelamin, alamat, no_telepon, email, golongan_darah, status_aktif, created_at, updated_at)
VALUES (4, '3578022007950004', 'Rina Kusuma', TO_DATE('1995-07-20','YYYY-MM-DD'), 'P', 'Jl. Dahlia No. 3, Surabaya', '08444555666', 'rina.kusuma@email.com', 'AB', 'Y', SYSTIMESTAMP, SYSTIMESTAMP);

INSERT INTO pasien (pasien_id, nik, nama_lengkap, tanggal_lahir, jenis_kelamin, alamat, no_telepon, email, golongan_darah, status_aktif, created_at, updated_at)
VALUES (5, '3578031108880005', 'Hendra Saputra', TO_DATE('1988-08-11','YYYY-MM-DD'), 'L', 'Jl. Anggrek No. 17, Surabaya', '08555666777', 'hendra.saputra@email.com', 'O', 'Y', SYSTIMESTAMP, SYSTIMESTAMP);

INSERT INTO pasien (pasien_id, nik, nama_lengkap, tanggal_lahir, jenis_kelamin, alamat, no_telepon, email, golongan_darah, status_aktif, created_at, updated_at)
VALUES (6, '3578041203930006', 'Lestari Wulandari', TO_DATE('1993-03-12','YYYY-MM-DD'), 'P', 'Jl. Flamboyan No. 21, Surabaya', '08666777888', 'lestari.wulandari@email.com', 'A', 'Y', SYSTIMESTAMP, SYSTIMESTAMP);

INSERT INTO pasien (pasien_id, nik, nama_lengkap, tanggal_lahir, jenis_kelamin, alamat, no_telepon, email, golongan_darah, status_aktif, created_at, updated_at)
VALUES (7, '3578051505800007', 'Tono Susanto', TO_DATE('1980-05-15','YYYY-MM-DD'), 'L', 'Jl. Cempaka No. 9, Surabaya', '08777888999', 'tono.susanto@email.com', 'B', 'Y', SYSTIMESTAMP, SYSTIMESTAMP);

INSERT INTO pasien (pasien_id, nik, nama_lengkap, tanggal_lahir, jenis_kelamin, alamat, no_telepon, email, golongan_darah, status_aktif, created_at, updated_at)
VALUES (8, '3578062209970008', 'Nisa Permata', TO_DATE('1997-09-22','YYYY-MM-DD'), 'P', 'Jl. Bougenville No. 6, Surabaya', '08888999000', 'nisa.permata@email.com', 'A', 'Y', SYSTIMESTAMP, SYSTIMESTAMP);

-- ============================================================
-- 4. USERS  (password = "password", bcrypt cost=10)
-- ============================================================
INSERT INTO users (id, nama, email, password, role, reference_id, created_at, updated_at)
VALUES (1, 'Administrator', 'admin@klinikbenmari.com',
    '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Admin', NULL, SYSTIMESTAMP, SYSTIMESTAMP);

INSERT INTO users (id, nama, email, password, role, reference_id, created_at, updated_at)
VALUES (2, 'dr. Andi Wijaya', 'dr.andi@klinikbenmari.com',
    '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'dokter', 1, SYSTIMESTAMP, SYSTIMESTAMP);

INSERT INTO users (id, nama, email, password, role, reference_id, created_at, updated_at)
VALUES (3, 'dr. Siti Rahayu, Sp.A', 'dr.siti@klinikbenmari.com',
    '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'dokter', 2, SYSTIMESTAMP, SYSTIMESTAMP);

INSERT INTO users (id, nama, email, password, role, reference_id, created_at, updated_at)
VALUES (4, 'drg. Budi Santoso', 'drg.budi@klinikbenmari.com',
    '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'dokter', 3, SYSTIMESTAMP, SYSTIMESTAMP);

-- ============================================================
-- 5. OBAT
-- ============================================================
INSERT INTO obat (obat_id, nama_obat, kategori, satuan, stok_tersedia, stok_minimum, harga_satuan, tgl_kadaluarsa, deskripsi, status_aktif, created_at, updated_at)
VALUES (1, 'Paracetamol 500mg', 'Analgesik', 'tablet', 500, 50, 2000, TO_DATE('2027-12-31','YYYY-MM-DD'), 'Obat penurun demam dan pereda nyeri', 'Y', SYSTIMESTAMP, SYSTIMESTAMP);

INSERT INTO obat (obat_id, nama_obat, kategori, satuan, stok_tersedia, stok_minimum, harga_satuan, tgl_kadaluarsa, deskripsi, status_aktif, created_at, updated_at)
VALUES (2, 'Amoxicillin 500mg', 'Antibiotik', 'kapsul', 200, 30, 5000, TO_DATE('2027-06-30','YYYY-MM-DD'), 'Antibiotik golongan penisilin spektrum luas', 'Y', SYSTIMESTAMP, SYSTIMESTAMP);

INSERT INTO obat (obat_id, nama_obat, kategori, satuan, stok_tersedia, stok_minimum, harga_satuan, tgl_kadaluarsa, deskripsi, status_aktif, created_at, updated_at)
VALUES (3, 'Ibuprofen 400mg', 'Analgesik', 'tablet', 300, 40, 3000, TO_DATE('2027-09-30','YYYY-MM-DD'), 'Antiinflamasi nonsteroid, pereda nyeri dan demam', 'Y', SYSTIMESTAMP, SYSTIMESTAMP);

INSERT INTO obat (obat_id, nama_obat, kategori, satuan, stok_tersedia, stok_minimum, harga_satuan, tgl_kadaluarsa, deskripsi, status_aktif, created_at, updated_at)
VALUES (4, 'Antasida Tablet', 'Pencernaan', 'tablet', 150, 20, 4000, TO_DATE('2028-03-31','YYYY-MM-DD'), 'Menetralkan asam lambung', 'Y', SYSTIMESTAMP, SYSTIMESTAMP);

INSERT INTO obat (obat_id, nama_obat, kategori, satuan, stok_tersedia, stok_minimum, harga_satuan, tgl_kadaluarsa, deskripsi, status_aktif, created_at, updated_at)
VALUES (5, 'Cetirizine 10mg', 'Antihistamin', 'tablet', 200, 25, 3500, TO_DATE('2027-12-31','YYYY-MM-DD'), 'Antihistamin generasi kedua untuk alergi', 'Y', SYSTIMESTAMP, SYSTIMESTAMP);

INSERT INTO obat (obat_id, nama_obat, kategori, satuan, stok_tersedia, stok_minimum, harga_satuan, tgl_kadaluarsa, deskripsi, status_aktif, created_at, updated_at)
VALUES (6, 'Metformin 500mg', 'Diabetes', 'tablet', 100, 20, 6000, TO_DATE('2027-08-31','YYYY-MM-DD'), 'Antidiabetik oral golongan biguanid', 'Y', SYSTIMESTAMP, SYSTIMESTAMP);

INSERT INTO obat (obat_id, nama_obat, kategori, satuan, stok_tersedia, stok_minimum, harga_satuan, tgl_kadaluarsa, deskripsi, status_aktif, created_at, updated_at)
VALUES (7, 'Amlodipine 5mg', 'Hipertensi', 'tablet', 80, 15, 8000, TO_DATE('2028-06-30','YYYY-MM-DD'), 'Calcium channel blocker untuk hipertensi', 'Y', SYSTIMESTAMP, SYSTIMESTAMP);

INSERT INTO obat (obat_id, nama_obat, kategori, satuan, stok_tersedia, stok_minimum, harga_satuan, tgl_kadaluarsa, deskripsi, status_aktif, created_at, updated_at)
VALUES (8, 'Omeprazole 20mg', 'Pencernaan', 'kapsul', 120, 20, 5500, TO_DATE('2027-10-31','YYYY-MM-DD'), 'Proton pump inhibitor untuk tukak lambung', 'Y', SYSTIMESTAMP, SYSTIMESTAMP);

INSERT INTO obat (obat_id, nama_obat, kategori, satuan, stok_tersedia, stok_minimum, harga_satuan, tgl_kadaluarsa, deskripsi, status_aktif, created_at, updated_at)
VALUES (9, 'Vitamin C 500mg', 'Suplemen', 'tablet', 400, 50, 1500, TO_DATE('2028-12-31','YYYY-MM-DD'), 'Suplemen vitamin C untuk daya tahan tubuh', 'Y', SYSTIMESTAMP, SYSTIMESTAMP);

INSERT INTO obat (obat_id, nama_obat, kategori, satuan, stok_tersedia, stok_minimum, harga_satuan, tgl_kadaluarsa, deskripsi, status_aktif, created_at, updated_at)
VALUES (10, 'Salbutamol Inhaler', 'Asma', 'inhaler', 30, 5, 45000, TO_DATE('2027-07-31','YYYY-MM-DD'), 'Bronkodilator kerja cepat untuk asma', 'Y', SYSTIMESTAMP, SYSTIMESTAMP);

INSERT INTO obat (obat_id, nama_obat, kategori, satuan, stok_tersedia, stok_minimum, harga_satuan, tgl_kadaluarsa, deskripsi, status_aktif, created_at, updated_at)
VALUES (11, 'Dexamethasone 0.5mg', 'Kortikosteroid', 'tablet', 150, 20, 2500, TO_DATE('2027-11-30','YYYY-MM-DD'), 'Kortikosteroid untuk inflamasi dan alergi berat', 'Y', SYSTIMESTAMP, SYSTIMESTAMP);

INSERT INTO obat (obat_id, nama_obat, kategori, satuan, stok_tersedia, stok_minimum, harga_satuan, tgl_kadaluarsa, deskripsi, status_aktif, created_at, updated_at)
VALUES (12, 'OBH Sirup 100ml', 'Batuk', 'botol', 60, 10, 25000, TO_DATE('2027-04-30','YYYY-MM-DD'), 'Obat batuk hitam sirup ekspektoran', 'Y', SYSTIMESTAMP, SYSTIMESTAMP);

-- ============================================================
-- 6. JADWAL_DOKTER
-- ============================================================
-- Dokter 1 (Andi): Senin-Jumat PAGI + SIANG
INSERT INTO jadwal_dokter (jadwal_id, dokter_id, hari, jam_mulai, jam_selesai, kuota, is_aktif, created_at, updated_at) VALUES (1,  1, 'SENIN',  '08:00', '12:00', 8, 1, SYSTIMESTAMP, SYSTIMESTAMP);
INSERT INTO jadwal_dokter (jadwal_id, dokter_id, hari, jam_mulai, jam_selesai, kuota, is_aktif, created_at, updated_at) VALUES (2,  1, 'SENIN',  '13:00', '17:00', 8, 1, SYSTIMESTAMP, SYSTIMESTAMP);
INSERT INTO jadwal_dokter (jadwal_id, dokter_id, hari, jam_mulai, jam_selesai, kuota, is_aktif, created_at, updated_at) VALUES (3,  1, 'SELASA', '08:00', '12:00', 8, 1, SYSTIMESTAMP, SYSTIMESTAMP);
INSERT INTO jadwal_dokter (jadwal_id, dokter_id, hari, jam_mulai, jam_selesai, kuota, is_aktif, created_at, updated_at) VALUES (4,  1, 'SELASA', '13:00', '17:00', 8, 1, SYSTIMESTAMP, SYSTIMESTAMP);
INSERT INTO jadwal_dokter (jadwal_id, dokter_id, hari, jam_mulai, jam_selesai, kuota, is_aktif, created_at, updated_at) VALUES (5,  1, 'RABU',   '08:00', '12:00', 8, 1, SYSTIMESTAMP, SYSTIMESTAMP);
INSERT INTO jadwal_dokter (jadwal_id, dokter_id, hari, jam_mulai, jam_selesai, kuota, is_aktif, created_at, updated_at) VALUES (6,  1, 'RABU',   '13:00', '17:00', 8, 1, SYSTIMESTAMP, SYSTIMESTAMP);
INSERT INTO jadwal_dokter (jadwal_id, dokter_id, hari, jam_mulai, jam_selesai, kuota, is_aktif, created_at, updated_at) VALUES (7,  1, 'KAMIS',  '08:00', '12:00', 8, 1, SYSTIMESTAMP, SYSTIMESTAMP);
INSERT INTO jadwal_dokter (jadwal_id, dokter_id, hari, jam_mulai, jam_selesai, kuota, is_aktif, created_at, updated_at) VALUES (8,  1, 'KAMIS',  '13:00', '17:00', 8, 1, SYSTIMESTAMP, SYSTIMESTAMP);
INSERT INTO jadwal_dokter (jadwal_id, dokter_id, hari, jam_mulai, jam_selesai, kuota, is_aktif, created_at, updated_at) VALUES (9,  1, 'JUMAT',  '08:00', '12:00', 8, 1, SYSTIMESTAMP, SYSTIMESTAMP);
INSERT INTO jadwal_dokter (jadwal_id, dokter_id, hari, jam_mulai, jam_selesai, kuota, is_aktif, created_at, updated_at) VALUES (10, 1, 'JUMAT',  '13:00', '17:00', 8, 1, SYSTIMESTAMP, SYSTIMESTAMP);

-- Dokter 2 (Siti): Senin-Jumat PAGI + SIANG
INSERT INTO jadwal_dokter (jadwal_id, dokter_id, hari, jam_mulai, jam_selesai, kuota, is_aktif, created_at, updated_at) VALUES (11, 2, 'SENIN',  '08:00', '12:00', 8, 1, SYSTIMESTAMP, SYSTIMESTAMP);
INSERT INTO jadwal_dokter (jadwal_id, dokter_id, hari, jam_mulai, jam_selesai, kuota, is_aktif, created_at, updated_at) VALUES (12, 2, 'SENIN',  '13:00', '17:00', 8, 1, SYSTIMESTAMP, SYSTIMESTAMP);
INSERT INTO jadwal_dokter (jadwal_id, dokter_id, hari, jam_mulai, jam_selesai, kuota, is_aktif, created_at, updated_at) VALUES (13, 2, 'SELASA', '08:00', '12:00', 8, 1, SYSTIMESTAMP, SYSTIMESTAMP);
INSERT INTO jadwal_dokter (jadwal_id, dokter_id, hari, jam_mulai, jam_selesai, kuota, is_aktif, created_at, updated_at) VALUES (14, 2, 'SELASA', '13:00', '17:00', 8, 1, SYSTIMESTAMP, SYSTIMESTAMP);
INSERT INTO jadwal_dokter (jadwal_id, dokter_id, hari, jam_mulai, jam_selesai, kuota, is_aktif, created_at, updated_at) VALUES (15, 2, 'RABU',   '08:00', '12:00', 8, 1, SYSTIMESTAMP, SYSTIMESTAMP);
INSERT INTO jadwal_dokter (jadwal_id, dokter_id, hari, jam_mulai, jam_selesai, kuota, is_aktif, created_at, updated_at) VALUES (16, 2, 'RABU',   '13:00', '17:00', 8, 1, SYSTIMESTAMP, SYSTIMESTAMP);
INSERT INTO jadwal_dokter (jadwal_id, dokter_id, hari, jam_mulai, jam_selesai, kuota, is_aktif, created_at, updated_at) VALUES (17, 2, 'KAMIS',  '08:00', '12:00', 8, 1, SYSTIMESTAMP, SYSTIMESTAMP);
INSERT INTO jadwal_dokter (jadwal_id, dokter_id, hari, jam_mulai, jam_selesai, kuota, is_aktif, created_at, updated_at) VALUES (18, 2, 'KAMIS',  '13:00', '17:00', 8, 1, SYSTIMESTAMP, SYSTIMESTAMP);
INSERT INTO jadwal_dokter (jadwal_id, dokter_id, hari, jam_mulai, jam_selesai, kuota, is_aktif, created_at, updated_at) VALUES (19, 2, 'JUMAT',  '08:00', '12:00', 8, 1, SYSTIMESTAMP, SYSTIMESTAMP);
INSERT INTO jadwal_dokter (jadwal_id, dokter_id, hari, jam_mulai, jam_selesai, kuota, is_aktif, created_at, updated_at) VALUES (20, 2, 'JUMAT',  '13:00', '17:00', 8, 1, SYSTIMESTAMP, SYSTIMESTAMP);

-- Dokter 3 (Budi): Senin-Jumat + Sabtu pagi
INSERT INTO jadwal_dokter (jadwal_id, dokter_id, hari, jam_mulai, jam_selesai, kuota, is_aktif, created_at, updated_at) VALUES (21, 3, 'SENIN',  '08:00', '12:00', 8, 1, SYSTIMESTAMP, SYSTIMESTAMP);
INSERT INTO jadwal_dokter (jadwal_id, dokter_id, hari, jam_mulai, jam_selesai, kuota, is_aktif, created_at, updated_at) VALUES (22, 3, 'SENIN',  '13:00', '17:00', 8, 1, SYSTIMESTAMP, SYSTIMESTAMP);
INSERT INTO jadwal_dokter (jadwal_id, dokter_id, hari, jam_mulai, jam_selesai, kuota, is_aktif, created_at, updated_at) VALUES (23, 3, 'SELASA', '08:00', '12:00', 8, 1, SYSTIMESTAMP, SYSTIMESTAMP);
INSERT INTO jadwal_dokter (jadwal_id, dokter_id, hari, jam_mulai, jam_selesai, kuota, is_aktif, created_at, updated_at) VALUES (24, 3, 'SELASA', '13:00', '17:00', 8, 1, SYSTIMESTAMP, SYSTIMESTAMP);
INSERT INTO jadwal_dokter (jadwal_id, dokter_id, hari, jam_mulai, jam_selesai, kuota, is_aktif, created_at, updated_at) VALUES (25, 3, 'RABU',   '08:00', '12:00', 8, 1, SYSTIMESTAMP, SYSTIMESTAMP);
INSERT INTO jadwal_dokter (jadwal_id, dokter_id, hari, jam_mulai, jam_selesai, kuota, is_aktif, created_at, updated_at) VALUES (26, 3, 'RABU',   '13:00', '17:00', 8, 1, SYSTIMESTAMP, SYSTIMESTAMP);
INSERT INTO jadwal_dokter (jadwal_id, dokter_id, hari, jam_mulai, jam_selesai, kuota, is_aktif, created_at, updated_at) VALUES (27, 3, 'KAMIS',  '08:00', '12:00', 8, 1, SYSTIMESTAMP, SYSTIMESTAMP);
INSERT INTO jadwal_dokter (jadwal_id, dokter_id, hari, jam_mulai, jam_selesai, kuota, is_aktif, created_at, updated_at) VALUES (28, 3, 'KAMIS',  '13:00', '17:00', 8, 1, SYSTIMESTAMP, SYSTIMESTAMP);
INSERT INTO jadwal_dokter (jadwal_id, dokter_id, hari, jam_mulai, jam_selesai, kuota, is_aktif, created_at, updated_at) VALUES (29, 3, 'JUMAT',  '08:00', '12:00', 8, 1, SYSTIMESTAMP, SYSTIMESTAMP);
INSERT INTO jadwal_dokter (jadwal_id, dokter_id, hari, jam_mulai, jam_selesai, kuota, is_aktif, created_at, updated_at) VALUES (30, 3, 'JUMAT',  '13:00', '17:00', 8, 1, SYSTIMESTAMP, SYSTIMESTAMP);
INSERT INTO jadwal_dokter (jadwal_id, dokter_id, hari, jam_mulai, jam_selesai, kuota, is_aktif, created_at, updated_at) VALUES (31, 3, 'SABTU',  '08:00', '12:00', 5, 1, SYSTIMESTAMP, SYSTIMESTAMP);

-- ============================================================
-- 7. SESI_PRAKTIK  (PL/SQL: Senin-Jumat + Sabtu dokter 3)
--    Range: 2026-05-25 s/d 2026-07-31
-- ============================================================
DECLARE
  v_date DATE;
  v_day  VARCHAR2(3);
BEGIN
  FOR i IN 0..67 LOOP
    v_date := TO_DATE('2026-05-25','YYYY-MM-DD') + i;
    v_day  := TO_CHAR(v_date, 'DY', 'NLS_DATE_LANGUAGE=AMERICAN');

    IF v_day NOT IN ('SAT','SUN') THEN
      -- Ketiga dokter: PAGI & SIANG
      FOR d IN 1..3 LOOP
        INSERT INTO sesi_praktik (dokter_id, tanggal, sesi, jam_mulai, jam_selesai, kuota, terisi, status, created_at, updated_at)
        VALUES (d, v_date, 'PAGI', '08:00', '12:00', 8, 0, 'BUKA', SYSTIMESTAMP, SYSTIMESTAMP);
        INSERT INTO sesi_praktik (dokter_id, tanggal, sesi, jam_mulai, jam_selesai, kuota, terisi, status, created_at, updated_at)
        VALUES (d, v_date, 'SIANG', '13:00', '17:00', 8, 0, 'BUKA', SYSTIMESTAMP, SYSTIMESTAMP);
      END LOOP;
    ELSIF v_day = 'SAT' THEN
      -- Dokter 3 saja pada Sabtu
      INSERT INTO sesi_praktik (dokter_id, tanggal, sesi, jam_mulai, jam_selesai, kuota, terisi, status, created_at, updated_at)
      VALUES (3, v_date, 'PAGI', '08:00', '12:00', 5, 0, 'BUKA', SYSTIMESTAMP, SYSTIMESTAMP);
    END IF;
  END LOOP;
  COMMIT;
END;
/

-- ============================================================
-- 8. APPOINTMENT
-- ============================================================
-- [MASA LALU — SELESAI] ----------------------------------------

-- App-1: Ahmad Fauzi, dr. Andi, 26 Mei PAGI
INSERT INTO appointment (pasien_id, dokter_id, sesi_id, tgl_appointment, jam_appointment, nomor_antrian, keluhan_awal, status, status_kehadiran, created_at, updated_at)
SELECT 1, 1, sp.sesi_id, TO_DATE('2026-05-26','YYYY-MM-DD'), '08:00', 1,
       'Demam tinggi dan batuk sejak 3 hari', 'SELESAI', 'SUDAH_CHECKIN', SYSTIMESTAMP, SYSTIMESTAMP
FROM sesi_praktik sp WHERE sp.dokter_id=1 AND sp.tanggal=TO_DATE('2026-05-26','YYYY-MM-DD') AND sp.sesi='PAGI';

-- App-2: Sari Dewi, dr. Siti, 26 Mei PAGI
INSERT INTO appointment (pasien_id, dokter_id, sesi_id, tgl_appointment, jam_appointment, nomor_antrian, keluhan_awal, status, status_kehadiran, created_at, updated_at)
SELECT 2, 2, sp.sesi_id, TO_DATE('2026-05-26','YYYY-MM-DD'), '08:00', 1,
       'Anak 3 tahun demam 2 hari, tidak mau makan', 'SELESAI', 'SUDAH_CHECKIN', SYSTIMESTAMP, SYSTIMESTAMP
FROM sesi_praktik sp WHERE sp.dokter_id=2 AND sp.tanggal=TO_DATE('2026-05-26','YYYY-MM-DD') AND sp.sesi='PAGI';

-- App-3: Budi Pratama, drg. Budi, 27 Mei PAGI
INSERT INTO appointment (pasien_id, dokter_id, sesi_id, tgl_appointment, jam_appointment, nomor_antrian, keluhan_awal, status, status_kehadiran, created_at, updated_at)
SELECT 3, 3, sp.sesi_id, TO_DATE('2026-05-27','YYYY-MM-DD'), '08:00', 1,
       'Sakit gigi geraham kiri bawah sudah 1 minggu', 'SELESAI', 'SUDAH_CHECKIN', SYSTIMESTAMP, SYSTIMESTAMP
FROM sesi_praktik sp WHERE sp.dokter_id=3 AND sp.tanggal=TO_DATE('2026-05-27','YYYY-MM-DD') AND sp.sesi='PAGI';

-- App-4: Rina Kusuma, dr. Andi, 28 Mei PAGI
INSERT INTO appointment (pasien_id, dokter_id, sesi_id, tgl_appointment, jam_appointment, nomor_antrian, keluhan_awal, status, status_kehadiran, created_at, updated_at)
SELECT 4, 1, sp.sesi_id, TO_DATE('2026-05-28','YYYY-MM-DD'), '08:00', 1,
       'Sakit kepala berulang, mudah lelah', 'SELESAI', 'SUDAH_CHECKIN', SYSTIMESTAMP, SYSTIMESTAMP
FROM sesi_praktik sp WHERE sp.dokter_id=1 AND sp.tanggal=TO_DATE('2026-05-28','YYYY-MM-DD') AND sp.sesi='PAGI';

-- App-5: Hendra Saputra, dr. Siti, 28 Mei SIANG
INSERT INTO appointment (pasien_id, dokter_id, sesi_id, tgl_appointment, jam_appointment, nomor_antrian, keluhan_awal, status, status_kehadiran, created_at, updated_at)
SELECT 5, 2, sp.sesi_id, TO_DATE('2026-05-28','YYYY-MM-DD'), '13:00', 1,
       'Batuk berdahak dan pilek sudah 5 hari', 'SELESAI', 'SUDAH_CHECKIN', SYSTIMESTAMP, SYSTIMESTAMP
FROM sesi_praktik sp WHERE sp.dokter_id=2 AND sp.tanggal=TO_DATE('2026-05-28','YYYY-MM-DD') AND sp.sesi='SIANG';

-- App-6: Lestari Wulandari, dr. Andi, 29 Mei PAGI
INSERT INTO appointment (pasien_id, dokter_id, sesi_id, tgl_appointment, jam_appointment, nomor_antrian, keluhan_awal, status, status_kehadiran, created_at, updated_at)
SELECT 6, 1, sp.sesi_id, TO_DATE('2026-05-29','YYYY-MM-DD'), '08:00', 1,
       'Mual, nyeri ulu hati, perut kembung', 'SELESAI', 'SUDAH_CHECKIN', SYSTIMESTAMP, SYSTIMESTAMP
FROM sesi_praktik sp WHERE sp.dokter_id=1 AND sp.tanggal=TO_DATE('2026-05-29','YYYY-MM-DD') AND sp.sesi='PAGI';

-- App-7: Tono Susanto, drg. Budi, 29 Mei PAGI
INSERT INTO appointment (pasien_id, dokter_id, sesi_id, tgl_appointment, jam_appointment, nomor_antrian, keluhan_awal, status, status_kehadiran, created_at, updated_at)
SELECT 7, 3, sp.sesi_id, TO_DATE('2026-05-29','YYYY-MM-DD'), '08:00', 2,
       'Gigi berlubang dan nyeri saat makan dingin', 'SELESAI', 'SUDAH_CHECKIN', SYSTIMESTAMP, SYSTIMESTAMP
FROM sesi_praktik sp WHERE sp.dokter_id=3 AND sp.tanggal=TO_DATE('2026-05-29','YYYY-MM-DD') AND sp.sesi='PAGI';

-- App-8: Nisa Permata, dr. Siti, 29 Mei SIANG
INSERT INTO appointment (pasien_id, dokter_id, sesi_id, tgl_appointment, jam_appointment, nomor_antrian, keluhan_awal, status, status_kehadiran, created_at, updated_at)
SELECT 8, 2, sp.sesi_id, TO_DATE('2026-05-29','YYYY-MM-DD'), '13:00', 1,
       'Gatal-gatal dan bentol di lengan setelah makan seafood', 'SELESAI', 'SUDAH_CHECKIN', SYSTIMESTAMP, SYSTIMESTAMP
FROM sesi_praktik sp WHERE sp.dokter_id=2 AND sp.tanggal=TO_DATE('2026-05-29','YYYY-MM-DD') AND sp.sesi='SIANG';

-- [HARI INI — 1 Juni 2026] -------------------------------------

-- App-9: Ahmad Fauzi, dr. Andi, 1 Juni PAGI (sudah checkin)
INSERT INTO appointment (pasien_id, dokter_id, sesi_id, tgl_appointment, jam_appointment, nomor_antrian, keluhan_awal, status, status_kehadiran, waktu_checkin,
                         batas_hadir, created_at, updated_at)
SELECT 1, 1, sp.sesi_id, TO_DATE('2026-06-01','YYYY-MM-DD'), '08:00', 1,
       'Kontrol tekanan darah rutin', 'MENUNGGU', 'SUDAH_CHECKIN',
       TO_TIMESTAMP('2026-06-01 07:50:00','YYYY-MM-DD HH24:MI:SS'),
       TO_TIMESTAMP('2026-06-01 10:00:00','YYYY-MM-DD HH24:MI:SS'),
       SYSTIMESTAMP, SYSTIMESTAMP
FROM sesi_praktik sp WHERE sp.dokter_id=1 AND sp.tanggal=TO_DATE('2026-06-01','YYYY-MM-DD') AND sp.sesi='PAGI';

-- App-10: Sari Dewi, dr. Siti, 1 Juni PAGI (belum checkin)
INSERT INTO appointment (pasien_id, dokter_id, sesi_id, tgl_appointment, jam_appointment, nomor_antrian, keluhan_awal, status, status_kehadiran,
                         batas_hadir, created_at, updated_at)
SELECT 2, 2, sp.sesi_id, TO_DATE('2026-06-01','YYYY-MM-DD'), '08:00', 2,
       'Demam pada anak dan sulit tidur', 'MENUNGGU', 'BELUM_CHECKIN',
       TO_TIMESTAMP('2026-06-01 10:00:00','YYYY-MM-DD HH24:MI:SS'),
       SYSTIMESTAMP, SYSTIMESTAMP
FROM sesi_praktik sp WHERE sp.dokter_id=2 AND sp.tanggal=TO_DATE('2026-06-01','YYYY-MM-DD') AND sp.sesi='PAGI';

-- App-11: Budi Pratama, drg. Budi, 1 Juni SIANG
INSERT INTO appointment (pasien_id, dokter_id, sesi_id, tgl_appointment, jam_appointment, nomor_antrian, keluhan_awal, status, status_kehadiran,
                         batas_hadir, created_at, updated_at)
SELECT 3, 3, sp.sesi_id, TO_DATE('2026-06-01','YYYY-MM-DD'), '13:00', 1,
       'Kontrol pasca tambal gigi', 'MENUNGGU', 'BELUM_CHECKIN',
       TO_TIMESTAMP('2026-06-01 15:00:00','YYYY-MM-DD HH24:MI:SS'),
       SYSTIMESTAMP, SYSTIMESTAMP
FROM sesi_praktik sp WHERE sp.dokter_id=3 AND sp.tanggal=TO_DATE('2026-06-01','YYYY-MM-DD') AND sp.sesi='SIANG';

-- [MENDATANG] --------------------------------------------------

-- App-12: Rina Kusuma, dr. Andi, 3 Juni PAGI
INSERT INTO appointment (pasien_id, dokter_id, sesi_id, tgl_appointment, jam_appointment, nomor_antrian, keluhan_awal, status, status_kehadiran, batas_hadir, created_at, updated_at)
SELECT 4, 1, sp.sesi_id, TO_DATE('2026-06-03','YYYY-MM-DD'), '08:00', 1,
       'Kontrol tekanan darah dan sakit kepala', 'MENUNGGU', 'BELUM_CHECKIN',
       TO_TIMESTAMP('2026-06-03 10:00:00','YYYY-MM-DD HH24:MI:SS'), SYSTIMESTAMP, SYSTIMESTAMP
FROM sesi_praktik sp WHERE sp.dokter_id=1 AND sp.tanggal=TO_DATE('2026-06-03','YYYY-MM-DD') AND sp.sesi='PAGI';

-- App-13: Hendra Saputra, dr. Siti, 4 Juni SIANG
INSERT INTO appointment (pasien_id, dokter_id, sesi_id, tgl_appointment, jam_appointment, nomor_antrian, keluhan_awal, status, status_kehadiran, batas_hadir, created_at, updated_at)
SELECT 5, 2, sp.sesi_id, TO_DATE('2026-06-04','YYYY-MM-DD'), '13:00', 1,
       'Sesak napas dan batuk kering', 'MENUNGGU', 'BELUM_CHECKIN',
       TO_TIMESTAMP('2026-06-04 15:00:00','YYYY-MM-DD HH24:MI:SS'), SYSTIMESTAMP, SYSTIMESTAMP
FROM sesi_praktik sp WHERE sp.dokter_id=2 AND sp.tanggal=TO_DATE('2026-06-04','YYYY-MM-DD') AND sp.sesi='SIANG';

-- App-14: Lestari Wulandari, drg. Budi, 5 Juni PAGI
INSERT INTO appointment (pasien_id, dokter_id, sesi_id, tgl_appointment, jam_appointment, nomor_antrian, keluhan_awal, status, status_kehadiran, batas_hadir, created_at, updated_at)
SELECT 6, 3, sp.sesi_id, TO_DATE('2026-06-05','YYYY-MM-DD'), '08:00', 1,
       'Scaling dan pembersihan karang gigi', 'MENUNGGU', 'BELUM_CHECKIN',
       TO_TIMESTAMP('2026-06-05 10:00:00','YYYY-MM-DD HH24:MI:SS'), SYSTIMESTAMP, SYSTIMESTAMP
FROM sesi_praktik sp WHERE sp.dokter_id=3 AND sp.tanggal=TO_DATE('2026-06-05','YYYY-MM-DD') AND sp.sesi='PAGI';

-- App-15: Tono Susanto, dr. Andi, 8 Juni PAGI
INSERT INTO appointment (pasien_id, dokter_id, sesi_id, tgl_appointment, jam_appointment, nomor_antrian, keluhan_awal, status, status_kehadiran, batas_hadir, created_at, updated_at)
SELECT 7, 1, sp.sesi_id, TO_DATE('2026-06-08','YYYY-MM-DD'), '08:00', 1,
       'Pemeriksaan rutin dan minta surat sehat', 'MENUNGGU', 'BELUM_CHECKIN',
       TO_TIMESTAMP('2026-06-08 10:00:00','YYYY-MM-DD HH24:MI:SS'), SYSTIMESTAMP, SYSTIMESTAMP
FROM sesi_praktik sp WHERE sp.dokter_id=1 AND sp.tanggal=TO_DATE('2026-06-08','YYYY-MM-DD') AND sp.sesi='PAGI';

-- App-16: Nisa Permata, dr. Siti, 10 Juni PAGI
INSERT INTO appointment (pasien_id, dokter_id, sesi_id, tgl_appointment, jam_appointment, nomor_antrian, keluhan_awal, status, status_kehadiran, batas_hadir, created_at, updated_at)
SELECT 8, 2, sp.sesi_id, TO_DATE('2026-06-10','YYYY-MM-DD'), '08:00', 1,
       'Kontrol alergi dan gatal berulang', 'MENUNGGU', 'BELUM_CHECKIN',
       TO_TIMESTAMP('2026-06-10 10:00:00','YYYY-MM-DD HH24:MI:SS'), SYSTIMESTAMP, SYSTIMESTAMP
FROM sesi_praktik sp WHERE sp.dokter_id=2 AND sp.tanggal=TO_DATE('2026-06-10','YYYY-MM-DD') AND sp.sesi='PAGI';

-- ============================================================
-- 9. ANTRIAN
-- ============================================================
-- Masa lalu (SELESAI)
INSERT INTO antrian (pasien_id, dokter_id, appointment_id, nomor_antrian, tanggal, status, jenis, waktu_dipanggil, waktu_selesai, created_at, updated_at)
SELECT 1, 1, a.appointment_id, 1, TO_DATE('2026-05-26','YYYY-MM-DD'), 'SELESAI', 'BOOKING',
    TO_TIMESTAMP('2026-05-26 08:15:00','YYYY-MM-DD HH24:MI:SS'), TO_TIMESTAMP('2026-05-26 08:50:00','YYYY-MM-DD HH24:MI:SS'), SYSTIMESTAMP, SYSTIMESTAMP
FROM appointment a WHERE a.pasien_id=1 AND a.tgl_appointment=TO_DATE('2026-05-26','YYYY-MM-DD') AND a.dokter_id=1;

INSERT INTO antrian (pasien_id, dokter_id, appointment_id, nomor_antrian, tanggal, status, jenis, waktu_dipanggil, waktu_selesai, created_at, updated_at)
SELECT 2, 2, a.appointment_id, 1, TO_DATE('2026-05-26','YYYY-MM-DD'), 'SELESAI', 'BOOKING',
    TO_TIMESTAMP('2026-05-26 08:20:00','YYYY-MM-DD HH24:MI:SS'), TO_TIMESTAMP('2026-05-26 08:55:00','YYYY-MM-DD HH24:MI:SS'), SYSTIMESTAMP, SYSTIMESTAMP
FROM appointment a WHERE a.pasien_id=2 AND a.tgl_appointment=TO_DATE('2026-05-26','YYYY-MM-DD') AND a.dokter_id=2;

INSERT INTO antrian (pasien_id, dokter_id, appointment_id, nomor_antrian, tanggal, status, jenis, waktu_dipanggil, waktu_selesai, created_at, updated_at)
SELECT 3, 3, a.appointment_id, 1, TO_DATE('2026-05-27','YYYY-MM-DD'), 'SELESAI', 'BOOKING',
    TO_TIMESTAMP('2026-05-27 08:30:00','YYYY-MM-DD HH24:MI:SS'), TO_TIMESTAMP('2026-05-27 09:10:00','YYYY-MM-DD HH24:MI:SS'), SYSTIMESTAMP, SYSTIMESTAMP
FROM appointment a WHERE a.pasien_id=3 AND a.tgl_appointment=TO_DATE('2026-05-27','YYYY-MM-DD') AND a.dokter_id=3;

INSERT INTO antrian (pasien_id, dokter_id, appointment_id, nomor_antrian, tanggal, status, jenis, waktu_dipanggil, waktu_selesai, created_at, updated_at)
SELECT 4, 1, a.appointment_id, 1, TO_DATE('2026-05-28','YYYY-MM-DD'), 'SELESAI', 'BOOKING',
    TO_TIMESTAMP('2026-05-28 08:10:00','YYYY-MM-DD HH24:MI:SS'), TO_TIMESTAMP('2026-05-28 08:45:00','YYYY-MM-DD HH24:MI:SS'), SYSTIMESTAMP, SYSTIMESTAMP
FROM appointment a WHERE a.pasien_id=4 AND a.tgl_appointment=TO_DATE('2026-05-28','YYYY-MM-DD') AND a.dokter_id=1;

INSERT INTO antrian (pasien_id, dokter_id, appointment_id, nomor_antrian, tanggal, status, jenis, waktu_dipanggil, waktu_selesai, created_at, updated_at)
SELECT 5, 2, a.appointment_id, 1, TO_DATE('2026-05-28','YYYY-MM-DD'), 'SELESAI', 'BOOKING',
    TO_TIMESTAMP('2026-05-28 13:15:00','YYYY-MM-DD HH24:MI:SS'), TO_TIMESTAMP('2026-05-28 13:55:00','YYYY-MM-DD HH24:MI:SS'), SYSTIMESTAMP, SYSTIMESTAMP
FROM appointment a WHERE a.pasien_id=5 AND a.tgl_appointment=TO_DATE('2026-05-28','YYYY-MM-DD') AND a.dokter_id=2;

INSERT INTO antrian (pasien_id, dokter_id, appointment_id, nomor_antrian, tanggal, status, jenis, waktu_dipanggil, waktu_selesai, created_at, updated_at)
SELECT 6, 1, a.appointment_id, 1, TO_DATE('2026-05-29','YYYY-MM-DD'), 'SELESAI', 'BOOKING',
    TO_TIMESTAMP('2026-05-29 08:20:00','YYYY-MM-DD HH24:MI:SS'), TO_TIMESTAMP('2026-05-29 09:00:00','YYYY-MM-DD HH24:MI:SS'), SYSTIMESTAMP, SYSTIMESTAMP
FROM appointment a WHERE a.pasien_id=6 AND a.tgl_appointment=TO_DATE('2026-05-29','YYYY-MM-DD') AND a.dokter_id=1;

INSERT INTO antrian (pasien_id, dokter_id, appointment_id, nomor_antrian, tanggal, status, jenis, waktu_dipanggil, waktu_selesai, created_at, updated_at)
SELECT 7, 3, a.appointment_id, 2, TO_DATE('2026-05-29','YYYY-MM-DD'), 'SELESAI', 'BOOKING',
    TO_TIMESTAMP('2026-05-29 08:40:00','YYYY-MM-DD HH24:MI:SS'), TO_TIMESTAMP('2026-05-29 09:20:00','YYYY-MM-DD HH24:MI:SS'), SYSTIMESTAMP, SYSTIMESTAMP
FROM appointment a WHERE a.pasien_id=7 AND a.tgl_appointment=TO_DATE('2026-05-29','YYYY-MM-DD') AND a.dokter_id=3;

INSERT INTO antrian (pasien_id, dokter_id, appointment_id, nomor_antrian, tanggal, status, jenis, waktu_dipanggil, waktu_selesai, created_at, updated_at)
SELECT 8, 2, a.appointment_id, 1, TO_DATE('2026-05-29','YYYY-MM-DD'), 'SELESAI', 'BOOKING',
    TO_TIMESTAMP('2026-05-29 13:10:00','YYYY-MM-DD HH24:MI:SS'), TO_TIMESTAMP('2026-05-29 13:45:00','YYYY-MM-DD HH24:MI:SS'), SYSTIMESTAMP, SYSTIMESTAMP
FROM appointment a WHERE a.pasien_id=8 AND a.tgl_appointment=TO_DATE('2026-05-29','YYYY-MM-DD') AND a.dokter_id=2;

-- Hari ini (1 Juni 2026)
INSERT INTO antrian (pasien_id, dokter_id, appointment_id, nomor_antrian, tanggal, status, jenis, waktu_dipanggil, waktu_selesai, created_at, updated_at)
SELECT 1, 1, a.appointment_id, 1, TO_DATE('2026-06-01','YYYY-MM-DD'), 'DIPANGGIL', 'BOOKING',
    TO_TIMESTAMP('2026-06-01 08:10:00','YYYY-MM-DD HH24:MI:SS'), NULL, SYSTIMESTAMP, SYSTIMESTAMP
FROM appointment a WHERE a.pasien_id=1 AND a.tgl_appointment=TO_DATE('2026-06-01','YYYY-MM-DD') AND a.dokter_id=1;

INSERT INTO antrian (pasien_id, dokter_id, appointment_id, nomor_antrian, tanggal, status, jenis, waktu_dipanggil, waktu_selesai, created_at, updated_at)
SELECT 2, 2, a.appointment_id, 2, TO_DATE('2026-06-01','YYYY-MM-DD'), 'MENUNGGU', 'BOOKING',
    NULL, NULL, SYSTIMESTAMP, SYSTIMESTAMP
FROM appointment a WHERE a.pasien_id=2 AND a.tgl_appointment=TO_DATE('2026-06-01','YYYY-MM-DD') AND a.dokter_id=2;

INSERT INTO antrian (pasien_id, dokter_id, appointment_id, nomor_antrian, tanggal, status, jenis, waktu_dipanggil, waktu_selesai, created_at, updated_at)
SELECT 3, 3, a.appointment_id, 1, TO_DATE('2026-06-01','YYYY-MM-DD'), 'MENUNGGU', 'BOOKING',
    NULL, NULL, SYSTIMESTAMP, SYSTIMESTAMP
FROM appointment a WHERE a.pasien_id=3 AND a.tgl_appointment=TO_DATE('2026-06-01','YYYY-MM-DD') AND a.dokter_id=3;

-- ============================================================
-- 10. VITAL SIGNS  (untuk semua appointment yang sudah selesai + hari ini yg sudah checkin)
-- ============================================================
-- Ahmad 26 Mei
INSERT INTO vital_signs (appointment_id, tekanan_darah, suhu_tubuh, berat_badan, tinggi_badan, saturasi_oksigen, catatan_perawat, created_at, updated_at)
SELECT a.appointment_id, '130/85', 37.8, 72.0, 170.0, 97, 'Pasien tampak lelah', SYSTIMESTAMP, SYSTIMESTAMP
FROM appointment a WHERE a.pasien_id=1 AND a.tgl_appointment=TO_DATE('2026-05-26','YYYY-MM-DD') AND a.dokter_id=1;

-- Sari 26 Mei
INSERT INTO vital_signs (appointment_id, tekanan_darah, suhu_tubuh, berat_badan, tinggi_badan, saturasi_oksigen, catatan_perawat, created_at, updated_at)
SELECT a.appointment_id, '100/70', 38.5, 15.0, 96.0, 99, 'Anak rewel, suhu tinggi', SYSTIMESTAMP, SYSTIMESTAMP
FROM appointment a WHERE a.pasien_id=2 AND a.tgl_appointment=TO_DATE('2026-05-26','YYYY-MM-DD') AND a.dokter_id=2;

-- Budi 27 Mei
INSERT INTO vital_signs (appointment_id, tekanan_darah, suhu_tubuh, berat_badan, tinggi_badan, saturasi_oksigen, catatan_perawat, created_at, updated_at)
SELECT a.appointment_id, '120/80', 36.8, 68.0, 168.0, 99, 'TD normal, keluhan nyeri gigi', SYSTIMESTAMP, SYSTIMESTAMP
FROM appointment a WHERE a.pasien_id=3 AND a.tgl_appointment=TO_DATE('2026-05-27','YYYY-MM-DD') AND a.dokter_id=3;

-- Rina 28 Mei
INSERT INTO vital_signs (appointment_id, tekanan_darah, suhu_tubuh, berat_badan, tinggi_badan, saturasi_oksigen, catatan_perawat, created_at, updated_at)
SELECT a.appointment_id, '150/95', 36.5, 58.0, 162.0, 98, 'TD tinggi, pasien tampak cemas', SYSTIMESTAMP, SYSTIMESTAMP
FROM appointment a WHERE a.pasien_id=4 AND a.tgl_appointment=TO_DATE('2026-05-28','YYYY-MM-DD') AND a.dokter_id=1;

-- Hendra 28 Mei
INSERT INTO vital_signs (appointment_id, tekanan_darah, suhu_tubuh, berat_badan, tinggi_badan, saturasi_oksigen, catatan_perawat, created_at, updated_at)
SELECT a.appointment_id, '118/78', 37.2, 75.0, 173.0, 96, 'SpO2 sedikit turun, perhatikan', SYSTIMESTAMP, SYSTIMESTAMP
FROM appointment a WHERE a.pasien_id=5 AND a.tgl_appointment=TO_DATE('2026-05-28','YYYY-MM-DD') AND a.dokter_id=2;

-- Lestari 29 Mei
INSERT INTO vital_signs (appointment_id, tekanan_darah, suhu_tubuh, berat_badan, tinggi_badan, saturasi_oksigen, catatan_perawat, created_at, updated_at)
SELECT a.appointment_id, '112/75', 36.9, 52.0, 158.0, 99, 'Pasien mengeluh perut kembung', SYSTIMESTAMP, SYSTIMESTAMP
FROM appointment a WHERE a.pasien_id=6 AND a.tgl_appointment=TO_DATE('2026-05-29','YYYY-MM-DD') AND a.dokter_id=1;

-- Tono 29 Mei
INSERT INTO vital_signs (appointment_id, tekanan_darah, suhu_tubuh, berat_badan, tinggi_badan, saturasi_oksigen, catatan_perawat, created_at, updated_at)
SELECT a.appointment_id, '125/82', 36.7, 80.0, 175.0, 99, 'Kondisi umum baik', SYSTIMESTAMP, SYSTIMESTAMP
FROM appointment a WHERE a.pasien_id=7 AND a.tgl_appointment=TO_DATE('2026-05-29','YYYY-MM-DD') AND a.dokter_id=3;

-- Nisa 29 Mei
INSERT INTO vital_signs (appointment_id, tekanan_darah, suhu_tubuh, berat_badan, tinggi_badan, saturasi_oksigen, catatan_perawat, created_at, updated_at)
SELECT a.appointment_id, '108/70', 36.4, 48.0, 160.0, 99, 'Tampak ruam kemerahan di lengan', SYSTIMESTAMP, SYSTIMESTAMP
FROM appointment a WHERE a.pasien_id=8 AND a.tgl_appointment=TO_DATE('2026-05-29','YYYY-MM-DD') AND a.dokter_id=2;

-- Ahmad 1 Juni (sudah checkin hari ini)
INSERT INTO vital_signs (appointment_id, tekanan_darah, suhu_tubuh, berat_badan, tinggi_badan, saturasi_oksigen, catatan_perawat, created_at, updated_at)
SELECT a.appointment_id, '135/88', 36.6, 72.5, 170.0, 98, 'Kontrol rutin hipertensi', SYSTIMESTAMP, SYSTIMESTAMP
FROM appointment a WHERE a.pasien_id=1 AND a.tgl_appointment=TO_DATE('2026-06-01','YYYY-MM-DD') AND a.dokter_id=1;

-- ============================================================
-- 11. REKAM MEDIS  (hanya untuk appointment SELESAI)
-- ============================================================
-- RM-1: Ahmad Fauzi — Influenza
INSERT INTO rekam_medis (appointment_id, dokter_id, tgl_periksa, keluhan, diagnosis, tindakan, tekanan_darah, berat_badan, catatan_tambahan, created_at, updated_at)
SELECT a.appointment_id, 1, TO_DATE('2026-05-26','YYYY-MM-DD'),
    'Demam tinggi dan batuk sejak 3 hari',
    'Influenza',
    'Pemeriksaan fisik, anjuran istirahat dan banyak minum',
    '130/85', 72.0,
    'Pasien disarankan kembali jika demam tidak turun dalam 3 hari',
    SYSTIMESTAMP, SYSTIMESTAMP
FROM appointment a WHERE a.pasien_id=1 AND a.tgl_appointment=TO_DATE('2026-05-26','YYYY-MM-DD') AND a.dokter_id=1;

-- RM-2: Sari Dewi — Faringitis Akut
INSERT INTO rekam_medis (appointment_id, dokter_id, tgl_periksa, keluhan, diagnosis, tindakan, tekanan_darah, berat_badan, catatan_tambahan, created_at, updated_at)
SELECT a.appointment_id, 2, TO_DATE('2026-05-26','YYYY-MM-DD'),
    'Anak 3 tahun demam 2 hari, tidak mau makan',
    'Faringitis Akut',
    'Pemeriksaan tenggorokan, konsultasi nutrisi anak',
    '100/70', 15.0,
    'Berikan cairan yang cukup, hindari minuman dingin',
    SYSTIMESTAMP, SYSTIMESTAMP
FROM appointment a WHERE a.pasien_id=2 AND a.tgl_appointment=TO_DATE('2026-05-26','YYYY-MM-DD') AND a.dokter_id=2;

-- RM-3: Budi Pratama — Karies Dentis
INSERT INTO rekam_medis (appointment_id, dokter_id, tgl_periksa, keluhan, diagnosis, tindakan, tekanan_darah, berat_badan, catatan_tambahan, created_at, updated_at)
SELECT a.appointment_id, 3, TO_DATE('2026-05-27','YYYY-MM-DD'),
    'Sakit gigi geraham kiri bawah sudah 1 minggu',
    'Karies Dentis Gigi 36',
    'Preparasi kavitas dan penambalan resin komposit',
    '120/80', 68.0,
    'Kontrol 1 minggu. Hindari makan keras dan makanan manis.',
    SYSTIMESTAMP, SYSTIMESTAMP
FROM appointment a WHERE a.pasien_id=3 AND a.tgl_appointment=TO_DATE('2026-05-27','YYYY-MM-DD') AND a.dokter_id=3;

-- RM-4: Rina Kusuma — Hipertensi Grade I
INSERT INTO rekam_medis (appointment_id, dokter_id, tgl_periksa, keluhan, diagnosis, tindakan, tekanan_darah, berat_badan, catatan_tambahan, created_at, updated_at)
SELECT a.appointment_id, 1, TO_DATE('2026-05-28','YYYY-MM-DD'),
    'Sakit kepala berulang, mudah lelah',
    'Hipertensi Grade I',
    'Pemeriksaan tekanan darah, konsultasi gaya hidup',
    '150/95', 58.0,
    'Diet rendah garam, olahraga teratur 30 menit/hari. Kontrol 2 minggu.',
    SYSTIMESTAMP, SYSTIMESTAMP
FROM appointment a WHERE a.pasien_id=4 AND a.tgl_appointment=TO_DATE('2026-05-28','YYYY-MM-DD') AND a.dokter_id=1;

-- RM-5: Hendra Saputra — ISPA
INSERT INTO rekam_medis (appointment_id, dokter_id, tgl_periksa, keluhan, diagnosis, tindakan, tekanan_darah, berat_badan, catatan_tambahan, created_at, updated_at)
SELECT a.appointment_id, 2, TO_DATE('2026-05-28','YYYY-MM-DD'),
    'Batuk berdahak dan pilek sudah 5 hari',
    'Infeksi Saluran Pernapasan Atas (ISPA)',
    'Pemeriksaan fisik paru, nebulisasi',
    '118/78', 75.0,
    'Istirahat cukup. Kembali jika sesak napas atau demam tinggi.',
    SYSTIMESTAMP, SYSTIMESTAMP
FROM appointment a WHERE a.pasien_id=5 AND a.tgl_appointment=TO_DATE('2026-05-28','YYYY-MM-DD') AND a.dokter_id=2;

-- RM-6: Lestari Wulandari — Gastritis
INSERT INTO rekam_medis (appointment_id, dokter_id, tgl_periksa, keluhan, diagnosis, tindakan, tekanan_darah, berat_badan, catatan_tambahan, created_at, updated_at)
SELECT a.appointment_id, 1, TO_DATE('2026-05-29','YYYY-MM-DD'),
    'Mual, nyeri ulu hati, perut kembung',
    'Gastritis',
    'Pemeriksaan abdomen, edukasi pola makan',
    '112/75', 52.0,
    'Makan teratur, hindari pedas dan asam. Kontrol jika tidak membaik.',
    SYSTIMESTAMP, SYSTIMESTAMP
FROM appointment a WHERE a.pasien_id=6 AND a.tgl_appointment=TO_DATE('2026-05-29','YYYY-MM-DD') AND a.dokter_id=1;

-- RM-7: Tono Susanto — Pulpitis
INSERT INTO rekam_medis (appointment_id, dokter_id, tgl_periksa, keluhan, diagnosis, tindakan, tekanan_darah, berat_badan, catatan_tambahan, created_at, updated_at)
SELECT a.appointment_id, 3, TO_DATE('2026-05-29','YYYY-MM-DD'),
    'Gigi berlubang dan nyeri saat makan dingin',
    'Pulpitis Reversibel Gigi 46',
    'Pembersihan kavitas, aplikasi dentin conditioner, penambalan sementara',
    '125/82', 80.0,
    'Penambalan permanen dilakukan setelah nyeri hilang. Kontrol 3 hari.',
    SYSTIMESTAMP, SYSTIMESTAMP
FROM appointment a WHERE a.pasien_id=7 AND a.tgl_appointment=TO_DATE('2026-05-29','YYYY-MM-DD') AND a.dokter_id=3;

-- RM-8: Nisa Permata — Dermatitis Alergi
INSERT INTO rekam_medis (appointment_id, dokter_id, tgl_periksa, keluhan, diagnosis, tindakan, tekanan_darah, berat_badan, catatan_tambahan, created_at, updated_at)
SELECT a.appointment_id, 2, TO_DATE('2026-05-29','YYYY-MM-DD'),
    'Gatal-gatal dan bentol di lengan setelah makan seafood',
    'Dermatitis Alergika',
    'Pemeriksaan kulit, edukasi hindari alergen',
    '108/70', 48.0,
    'Hindari seafood dan makanan yang dicurigai memicu alergi.',
    SYSTIMESTAMP, SYSTIMESTAMP
FROM appointment a WHERE a.pasien_id=8 AND a.tgl_appointment=TO_DATE('2026-05-29','YYYY-MM-DD') AND a.dokter_id=2;

-- ============================================================
-- 12. RESEP
-- ============================================================
-- RM-1 Ahmad (Influenza): Paracetamol + Amoxicillin
INSERT INTO resep (rekam_id, obat_id, dosis, durasi, aturan_pakai, jumlah, catatan_resep, status_ambil, created_at, updated_at)
SELECT rm.rekam_id, 1, '500mg', '5 hari', '3x sehari sesudah makan', 15, NULL, 'SUDAH_DIAMBIL', SYSTIMESTAMP, SYSTIMESTAMP
FROM rekam_medis rm JOIN appointment a ON rm.appointment_id=a.appointment_id
WHERE a.pasien_id=1 AND a.tgl_appointment=TO_DATE('2026-05-26','YYYY-MM-DD');

INSERT INTO resep (rekam_id, obat_id, dosis, durasi, aturan_pakai, jumlah, catatan_resep, status_ambil, created_at, updated_at)
SELECT rm.rekam_id, 2, '500mg', '5 hari', '3x sehari sesudah makan', 15, 'Habiskan antibiotik', 'SUDAH_DIAMBIL', SYSTIMESTAMP, SYSTIMESTAMP
FROM rekam_medis rm JOIN appointment a ON rm.appointment_id=a.appointment_id
WHERE a.pasien_id=1 AND a.tgl_appointment=TO_DATE('2026-05-26','YYYY-MM-DD');

-- RM-2 Sari (Faringitis): Paracetamol sirup + Vitamin C
INSERT INTO resep (rekam_id, obat_id, dosis, durasi, aturan_pakai, jumlah, catatan_resep, status_ambil, created_at, updated_at)
SELECT rm.rekam_id, 1, '250mg (1/2 tablet)', '3 hari', '3x sehari', 9, 'Dosis anak 3 tahun', 'SUDAH_DIAMBIL', SYSTIMESTAMP, SYSTIMESTAMP
FROM rekam_medis rm JOIN appointment a ON rm.appointment_id=a.appointment_id
WHERE a.pasien_id=2 AND a.tgl_appointment=TO_DATE('2026-05-26','YYYY-MM-DD');

INSERT INTO resep (rekam_id, obat_id, dosis, durasi, aturan_pakai, jumlah, catatan_resep, status_ambil, created_at, updated_at)
SELECT rm.rekam_id, 9, '500mg', '7 hari', '1x sehari', 7, NULL, 'SUDAH_DIAMBIL', SYSTIMESTAMP, SYSTIMESTAMP
FROM rekam_medis rm JOIN appointment a ON rm.appointment_id=a.appointment_id
WHERE a.pasien_id=2 AND a.tgl_appointment=TO_DATE('2026-05-26','YYYY-MM-DD');

-- RM-3 Budi (Karies): Ibuprofen + Amoxicillin
INSERT INTO resep (rekam_id, obat_id, dosis, durasi, aturan_pakai, jumlah, catatan_resep, status_ambil, created_at, updated_at)
SELECT rm.rekam_id, 3, '400mg', '3 hari', '3x sehari sesudah makan', 9, 'Minum setelah makan', 'SUDAH_DIAMBIL', SYSTIMESTAMP, SYSTIMESTAMP
FROM rekam_medis rm JOIN appointment a ON rm.appointment_id=a.appointment_id
WHERE a.pasien_id=3 AND a.tgl_appointment=TO_DATE('2026-05-27','YYYY-MM-DD');

INSERT INTO resep (rekam_id, obat_id, dosis, durasi, aturan_pakai, jumlah, catatan_resep, status_ambil, created_at, updated_at)
SELECT rm.rekam_id, 2, '500mg', '5 hari', '3x sehari', 15, 'Habiskan antibiotik', 'SUDAH_DIAMBIL', SYSTIMESTAMP, SYSTIMESTAMP
FROM rekam_medis rm JOIN appointment a ON rm.appointment_id=a.appointment_id
WHERE a.pasien_id=3 AND a.tgl_appointment=TO_DATE('2026-05-27','YYYY-MM-DD');

-- RM-4 Rina (Hipertensi): Amlodipine
INSERT INTO resep (rekam_id, obat_id, dosis, durasi, aturan_pakai, jumlah, catatan_resep, status_ambil, created_at, updated_at)
SELECT rm.rekam_id, 7, '5mg', '30 hari', '1x sehari pagi', 30, 'Jangan dihentikan tiba-tiba', 'SUDAH_DIAMBIL', SYSTIMESTAMP, SYSTIMESTAMP
FROM rekam_medis rm JOIN appointment a ON rm.appointment_id=a.appointment_id
WHERE a.pasien_id=4 AND a.tgl_appointment=TO_DATE('2026-05-28','YYYY-MM-DD');

-- RM-5 Hendra (ISPA): Amoxicillin + Paracetamol + OBH Sirup
INSERT INTO resep (rekam_id, obat_id, dosis, durasi, aturan_pakai, jumlah, catatan_resep, status_ambil, created_at, updated_at)
SELECT rm.rekam_id, 2, '500mg', '5 hari', '3x sehari', 15, 'Habiskan antibiotik', 'SUDAH_DIAMBIL', SYSTIMESTAMP, SYSTIMESTAMP
FROM rekam_medis rm JOIN appointment a ON rm.appointment_id=a.appointment_id
WHERE a.pasien_id=5 AND a.tgl_appointment=TO_DATE('2026-05-28','YYYY-MM-DD');

INSERT INTO resep (rekam_id, obat_id, dosis, durasi, aturan_pakai, jumlah, catatan_resep, status_ambil, created_at, updated_at)
SELECT rm.rekam_id, 12, '5ml', '5 hari', '3x sehari', 1, 'Kocok dahulu sebelum diminum', 'SUDAH_DIAMBIL', SYSTIMESTAMP, SYSTIMESTAMP
FROM rekam_medis rm JOIN appointment a ON rm.appointment_id=a.appointment_id
WHERE a.pasien_id=5 AND a.tgl_appointment=TO_DATE('2026-05-28','YYYY-MM-DD');

-- RM-6 Lestari (Gastritis): Antasida + Omeprazole
INSERT INTO resep (rekam_id, obat_id, dosis, durasi, aturan_pakai, jumlah, catatan_resep, status_ambil, created_at, updated_at)
SELECT rm.rekam_id, 4, '400mg', '7 hari', '3x sehari 1 jam sebelum makan', 21, NULL, 'SUDAH_DIAMBIL', SYSTIMESTAMP, SYSTIMESTAMP
FROM rekam_medis rm JOIN appointment a ON rm.appointment_id=a.appointment_id
WHERE a.pasien_id=6 AND a.tgl_appointment=TO_DATE('2026-05-29','YYYY-MM-DD');

INSERT INTO resep (rekam_id, obat_id, dosis, durasi, aturan_pakai, jumlah, catatan_resep, status_ambil, created_at, updated_at)
SELECT rm.rekam_id, 8, '20mg', '14 hari', '1x sehari sebelum makan pagi', 14, 'Minum 30 menit sebelum makan', 'SUDAH_DIAMBIL', SYSTIMESTAMP, SYSTIMESTAMP
FROM rekam_medis rm JOIN appointment a ON rm.appointment_id=a.appointment_id
WHERE a.pasien_id=6 AND a.tgl_appointment=TO_DATE('2026-05-29','YYYY-MM-DD');

-- RM-7 Tono (Pulpitis): Ibuprofen + Amoxicillin
INSERT INTO resep (rekam_id, obat_id, dosis, durasi, aturan_pakai, jumlah, catatan_resep, status_ambil, created_at, updated_at)
SELECT rm.rekam_id, 3, '400mg', '3 hari', '3x sehari sesudah makan', 9, NULL, 'SUDAH_DIAMBIL', SYSTIMESTAMP, SYSTIMESTAMP
FROM rekam_medis rm JOIN appointment a ON rm.appointment_id=a.appointment_id
WHERE a.pasien_id=7 AND a.tgl_appointment=TO_DATE('2026-05-29','YYYY-MM-DD');

INSERT INTO resep (rekam_id, obat_id, dosis, durasi, aturan_pakai, jumlah, catatan_resep, status_ambil, created_at, updated_at)
SELECT rm.rekam_id, 2, '500mg', '5 hari', '3x sehari', 15, 'Habiskan antibiotik', 'SUDAH_DIAMBIL', SYSTIMESTAMP, SYSTIMESTAMP
FROM rekam_medis rm JOIN appointment a ON rm.appointment_id=a.appointment_id
WHERE a.pasien_id=7 AND a.tgl_appointment=TO_DATE('2026-05-29','YYYY-MM-DD');

-- RM-8 Nisa (Dermatitis): Cetirizine + Dexamethasone
INSERT INTO resep (rekam_id, obat_id, dosis, durasi, aturan_pakai, jumlah, catatan_resep, status_ambil, created_at, updated_at)
SELECT rm.rekam_id, 5, '10mg', '7 hari', '1x sehari malam', 7, 'Hati-hati mengantuk', 'SUDAH_DIAMBIL', SYSTIMESTAMP, SYSTIMESTAMP
FROM rekam_medis rm JOIN appointment a ON rm.appointment_id=a.appointment_id
WHERE a.pasien_id=8 AND a.tgl_appointment=TO_DATE('2026-05-29','YYYY-MM-DD');

INSERT INTO resep (rekam_id, obat_id, dosis, durasi, aturan_pakai, jumlah, catatan_resep, status_ambil, created_at, updated_at)
SELECT rm.rekam_id, 11, '0.5mg', '3 hari', '2x sehari sesudah makan', 6, NULL, 'SUDAH_DIAMBIL', SYSTIMESTAMP, SYSTIMESTAMP
FROM rekam_medis rm JOIN appointment a ON rm.appointment_id=a.appointment_id
WHERE a.pasien_id=8 AND a.tgl_appointment=TO_DATE('2026-05-29','YYYY-MM-DD');

-- ============================================================
-- 13. TAGIHAN  (untuk 8 appointment masa lalu — semua LUNAS)
-- ============================================================
-- Tagihan-1: Ahmad Fauzi (konsul 150k + obat 70k = 220k)
INSERT INTO tagihan (pasien_id, appointment_id, tgl_tagihan, biaya_konsultasi, biaya_obat, total_biaya, metode_bayar, status_bayar, keterangan, created_at, updated_at)
SELECT 1, a.appointment_id, TO_DATE('2026-05-26','YYYY-MM-DD'), 150000, 70000, 220000, 'TUNAI', 'LUNAS', NULL, SYSTIMESTAMP, SYSTIMESTAMP
FROM appointment a WHERE a.pasien_id=1 AND a.tgl_appointment=TO_DATE('2026-05-26','YYYY-MM-DD') AND a.dokter_id=1;

-- Tagihan-2: Sari Dewi (konsul 200k + obat 31.5k = 231.5k)
INSERT INTO tagihan (pasien_id, appointment_id, tgl_tagihan, biaya_konsultasi, biaya_obat, total_biaya, metode_bayar, status_bayar, keterangan, created_at, updated_at)
SELECT 2, a.appointment_id, TO_DATE('2026-05-26','YYYY-MM-DD'), 200000, 31500, 231500, 'QRIS', 'LUNAS', NULL, SYSTIMESTAMP, SYSTIMESTAMP
FROM appointment a WHERE a.pasien_id=2 AND a.tgl_appointment=TO_DATE('2026-05-26','YYYY-MM-DD') AND a.dokter_id=2;

-- Tagihan-3: Budi Pratama (konsul 175k + obat 80k = 255k)
INSERT INTO tagihan (pasien_id, appointment_id, tgl_tagihan, biaya_konsultasi, biaya_obat, total_biaya, metode_bayar, status_bayar, keterangan, created_at, updated_at)
SELECT 3, a.appointment_id, TO_DATE('2026-05-27','YYYY-MM-DD'), 175000, 80000, 255000, 'TUNAI', 'LUNAS', NULL, SYSTIMESTAMP, SYSTIMESTAMP
FROM appointment a WHERE a.pasien_id=3 AND a.tgl_appointment=TO_DATE('2026-05-27','YYYY-MM-DD') AND a.dokter_id=3;

-- Tagihan-4: Rina Kusuma (konsul 150k + obat 240k = 390k)
INSERT INTO tagihan (pasien_id, appointment_id, tgl_tagihan, biaya_konsultasi, biaya_obat, total_biaya, metode_bayar, status_bayar, keterangan, created_at, updated_at)
SELECT 4, a.appointment_id, TO_DATE('2026-05-28','YYYY-MM-DD'), 150000, 240000, 390000, 'TRANSFER', 'LUNAS', NULL, SYSTIMESTAMP, SYSTIMESTAMP
FROM appointment a WHERE a.pasien_id=4 AND a.tgl_appointment=TO_DATE('2026-05-28','YYYY-MM-DD') AND a.dokter_id=1;

-- Tagihan-5: Hendra Saputra (konsul 200k + obat 95k = 295k)
INSERT INTO tagihan (pasien_id, appointment_id, tgl_tagihan, biaya_konsultasi, biaya_obat, total_biaya, metode_bayar, status_bayar, keterangan, created_at, updated_at)
SELECT 5, a.appointment_id, TO_DATE('2026-05-28','YYYY-MM-DD'), 200000, 95000, 295000, 'TUNAI', 'LUNAS', NULL, SYSTIMESTAMP, SYSTIMESTAMP
FROM appointment a WHERE a.pasien_id=5 AND a.tgl_appointment=TO_DATE('2026-05-28','YYYY-MM-DD') AND a.dokter_id=2;

-- Tagihan-6: Lestari Wulandari (konsul 150k + obat 161k = 311k)
INSERT INTO tagihan (pasien_id, appointment_id, tgl_tagihan, biaya_konsultasi, biaya_obat, total_biaya, metode_bayar, status_bayar, keterangan, created_at, updated_at)
SELECT 6, a.appointment_id, TO_DATE('2026-05-29','YYYY-MM-DD'), 150000, 161000, 311000, 'QRIS', 'LUNAS', NULL, SYSTIMESTAMP, SYSTIMESTAMP
FROM appointment a WHERE a.pasien_id=6 AND a.tgl_appointment=TO_DATE('2026-05-29','YYYY-MM-DD') AND a.dokter_id=1;

-- Tagihan-7: Tono Susanto (konsul 175k + obat 80k = 255k)
INSERT INTO tagihan (pasien_id, appointment_id, tgl_tagihan, biaya_konsultasi, biaya_obat, total_biaya, metode_bayar, status_bayar, keterangan, created_at, updated_at)
SELECT 7, a.appointment_id, TO_DATE('2026-05-29','YYYY-MM-DD'), 175000, 80000, 255000, 'TUNAI', 'LUNAS', NULL, SYSTIMESTAMP, SYSTIMESTAMP
FROM appointment a WHERE a.pasien_id=7 AND a.tgl_appointment=TO_DATE('2026-05-29','YYYY-MM-DD') AND a.dokter_id=3;

-- Tagihan-8: Nisa Permata (konsul 200k + obat 39.5k = 239.5k)
INSERT INTO tagihan (pasien_id, appointment_id, tgl_tagihan, biaya_konsultasi, biaya_obat, total_biaya, metode_bayar, status_bayar, keterangan, created_at, updated_at)
SELECT 8, a.appointment_id, TO_DATE('2026-05-29','YYYY-MM-DD'), 200000, 39500, 239500, 'TRANSFER', 'LUNAS', NULL, SYSTIMESTAMP, SYSTIMESTAMP
FROM appointment a WHERE a.pasien_id=8 AND a.tgl_appointment=TO_DATE('2026-05-29','YYYY-MM-DD') AND a.dokter_id=2;

-- ============================================================
-- 14. TAGIHAN DETAIL
-- ============================================================
-- Detail Tagihan-1 (Ahmad)
INSERT INTO tagihan_detail (tagihan_id, keterangan, jumlah, harga_satuan, created_at, updated_at)
SELECT t.tagihan_id, 'Konsultasi Dokter Umum', 1, 150000, SYSTIMESTAMP, SYSTIMESTAMP
FROM tagihan t WHERE t.appointment_id=(SELECT a.appointment_id FROM appointment a WHERE a.pasien_id=1 AND a.tgl_appointment=TO_DATE('2026-05-26','YYYY-MM-DD') AND a.dokter_id=1);

INSERT INTO tagihan_detail (tagihan_id, keterangan, jumlah, harga_satuan, created_at, updated_at)
SELECT t.tagihan_id, 'Obat-obatan', 1, 70000, SYSTIMESTAMP, SYSTIMESTAMP
FROM tagihan t WHERE t.appointment_id=(SELECT a.appointment_id FROM appointment a WHERE a.pasien_id=1 AND a.tgl_appointment=TO_DATE('2026-05-26','YYYY-MM-DD') AND a.dokter_id=1);

-- Detail Tagihan-2 (Sari)
INSERT INTO tagihan_detail (tagihan_id, keterangan, jumlah, harga_satuan, created_at, updated_at)
SELECT t.tagihan_id, 'Konsultasi Dokter Anak', 1, 200000, SYSTIMESTAMP, SYSTIMESTAMP
FROM tagihan t WHERE t.appointment_id=(SELECT a.appointment_id FROM appointment a WHERE a.pasien_id=2 AND a.tgl_appointment=TO_DATE('2026-05-26','YYYY-MM-DD') AND a.dokter_id=2);

INSERT INTO tagihan_detail (tagihan_id, keterangan, jumlah, harga_satuan, created_at, updated_at)
SELECT t.tagihan_id, 'Obat-obatan', 1, 31500, SYSTIMESTAMP, SYSTIMESTAMP
FROM tagihan t WHERE t.appointment_id=(SELECT a.appointment_id FROM appointment a WHERE a.pasien_id=2 AND a.tgl_appointment=TO_DATE('2026-05-26','YYYY-MM-DD') AND a.dokter_id=2);

-- Detail Tagihan-3 (Budi)
INSERT INTO tagihan_detail (tagihan_id, keterangan, jumlah, harga_satuan, created_at, updated_at)
SELECT t.tagihan_id, 'Konsultasi Dokter Gigi', 1, 175000, SYSTIMESTAMP, SYSTIMESTAMP
FROM tagihan t WHERE t.appointment_id=(SELECT a.appointment_id FROM appointment a WHERE a.pasien_id=3 AND a.tgl_appointment=TO_DATE('2026-05-27','YYYY-MM-DD') AND a.dokter_id=3);

INSERT INTO tagihan_detail (tagihan_id, keterangan, jumlah, harga_satuan, created_at, updated_at)
SELECT t.tagihan_id, 'Tindakan Tambal Gigi + Obat', 1, 80000, SYSTIMESTAMP, SYSTIMESTAMP
FROM tagihan t WHERE t.appointment_id=(SELECT a.appointment_id FROM appointment a WHERE a.pasien_id=3 AND a.tgl_appointment=TO_DATE('2026-05-27','YYYY-MM-DD') AND a.dokter_id=3);

-- Detail Tagihan-4 (Rina)
INSERT INTO tagihan_detail (tagihan_id, keterangan, jumlah, harga_satuan, created_at, updated_at)
SELECT t.tagihan_id, 'Konsultasi Dokter Umum', 1, 150000, SYSTIMESTAMP, SYSTIMESTAMP
FROM tagihan t WHERE t.appointment_id=(SELECT a.appointment_id FROM appointment a WHERE a.pasien_id=4 AND a.tgl_appointment=TO_DATE('2026-05-28','YYYY-MM-DD') AND a.dokter_id=1);

INSERT INTO tagihan_detail (tagihan_id, keterangan, jumlah, harga_satuan, created_at, updated_at)
SELECT t.tagihan_id, 'Amlodipine 5mg (30 tablet)', 30, 8000, SYSTIMESTAMP, SYSTIMESTAMP
FROM tagihan t WHERE t.appointment_id=(SELECT a.appointment_id FROM appointment a WHERE a.pasien_id=4 AND a.tgl_appointment=TO_DATE('2026-05-28','YYYY-MM-DD') AND a.dokter_id=1);

-- Detail Tagihan-5 (Hendra)
INSERT INTO tagihan_detail (tagihan_id, keterangan, jumlah, harga_satuan, created_at, updated_at)
SELECT t.tagihan_id, 'Konsultasi Dokter Anak', 1, 200000, SYSTIMESTAMP, SYSTIMESTAMP
FROM tagihan t WHERE t.appointment_id=(SELECT a.appointment_id FROM appointment a WHERE a.pasien_id=5 AND a.tgl_appointment=TO_DATE('2026-05-28','YYYY-MM-DD') AND a.dokter_id=2);

INSERT INTO tagihan_detail (tagihan_id, keterangan, jumlah, harga_satuan, created_at, updated_at)
SELECT t.tagihan_id, 'Obat-obatan + Sirup Batuk', 1, 95000, SYSTIMESTAMP, SYSTIMESTAMP
FROM tagihan t WHERE t.appointment_id=(SELECT a.appointment_id FROM appointment a WHERE a.pasien_id=5 AND a.tgl_appointment=TO_DATE('2026-05-28','YYYY-MM-DD') AND a.dokter_id=2);

-- Detail Tagihan-6 (Lestari)
INSERT INTO tagihan_detail (tagihan_id, keterangan, jumlah, harga_satuan, created_at, updated_at)
SELECT t.tagihan_id, 'Konsultasi Dokter Umum', 1, 150000, SYSTIMESTAMP, SYSTIMESTAMP
FROM tagihan t WHERE t.appointment_id=(SELECT a.appointment_id FROM appointment a WHERE a.pasien_id=6 AND a.tgl_appointment=TO_DATE('2026-05-29','YYYY-MM-DD') AND a.dokter_id=1);

INSERT INTO tagihan_detail (tagihan_id, keterangan, jumlah, harga_satuan, created_at, updated_at)
SELECT t.tagihan_id, 'Antasida + Omeprazole', 1, 161000, SYSTIMESTAMP, SYSTIMESTAMP
FROM tagihan t WHERE t.appointment_id=(SELECT a.appointment_id FROM appointment a WHERE a.pasien_id=6 AND a.tgl_appointment=TO_DATE('2026-05-29','YYYY-MM-DD') AND a.dokter_id=1);

-- Detail Tagihan-7 (Tono)
INSERT INTO tagihan_detail (tagihan_id, keterangan, jumlah, harga_satuan, created_at, updated_at)
SELECT t.tagihan_id, 'Konsultasi Dokter Gigi', 1, 175000, SYSTIMESTAMP, SYSTIMESTAMP
FROM tagihan t WHERE t.appointment_id=(SELECT a.appointment_id FROM appointment a WHERE a.pasien_id=7 AND a.tgl_appointment=TO_DATE('2026-05-29','YYYY-MM-DD') AND a.dokter_id=3);

INSERT INTO tagihan_detail (tagihan_id, keterangan, jumlah, harga_satuan, created_at, updated_at)
SELECT t.tagihan_id, 'Penambalan Sementara + Obat', 1, 80000, SYSTIMESTAMP, SYSTIMESTAMP
FROM tagihan t WHERE t.appointment_id=(SELECT a.appointment_id FROM appointment a WHERE a.pasien_id=7 AND a.tgl_appointment=TO_DATE('2026-05-29','YYYY-MM-DD') AND a.dokter_id=3);

-- Detail Tagihan-8 (Nisa)
INSERT INTO tagihan_detail (tagihan_id, keterangan, jumlah, harga_satuan, created_at, updated_at)
SELECT t.tagihan_id, 'Konsultasi Dokter Anak', 1, 200000, SYSTIMESTAMP, SYSTIMESTAMP
FROM tagihan t WHERE t.appointment_id=(SELECT a.appointment_id FROM appointment a WHERE a.pasien_id=8 AND a.tgl_appointment=TO_DATE('2026-05-29','YYYY-MM-DD') AND a.dokter_id=2);

INSERT INTO tagihan_detail (tagihan_id, keterangan, jumlah, harga_satuan, created_at, updated_at)
SELECT t.tagihan_id, 'Cetirizine + Dexamethasone', 1, 39500, SYSTIMESTAMP, SYSTIMESTAMP
FROM tagihan t WHERE t.appointment_id=(SELECT a.appointment_id FROM appointment a WHERE a.pasien_id=8 AND a.tgl_appointment=TO_DATE('2026-05-29','YYYY-MM-DD') AND a.dokter_id=2);

-- ============================================================
-- 15. STOK OBAT LOG  (stok awal MASUK)
-- ============================================================
INSERT INTO stok_obat_log (obat_id, tipe, jumlah, keterangan, created_by, created_at, updated_at) VALUES (1,  'MASUK', 500, 'Stok awal — Paracetamol 500mg',        1, SYSTIMESTAMP, SYSTIMESTAMP);
INSERT INTO stok_obat_log (obat_id, tipe, jumlah, keterangan, created_by, created_at, updated_at) VALUES (2,  'MASUK', 200, 'Stok awal — Amoxicillin 500mg',          1, SYSTIMESTAMP, SYSTIMESTAMP);
INSERT INTO stok_obat_log (obat_id, tipe, jumlah, keterangan, created_by, created_at, updated_at) VALUES (3,  'MASUK', 300, 'Stok awal — Ibuprofen 400mg',            1, SYSTIMESTAMP, SYSTIMESTAMP);
INSERT INTO stok_obat_log (obat_id, tipe, jumlah, keterangan, created_by, created_at, updated_at) VALUES (4,  'MASUK', 150, 'Stok awal — Antasida Tablet',            1, SYSTIMESTAMP, SYSTIMESTAMP);
INSERT INTO stok_obat_log (obat_id, tipe, jumlah, keterangan, created_by, created_at, updated_at) VALUES (5,  'MASUK', 200, 'Stok awal — Cetirizine 10mg',            1, SYSTIMESTAMP, SYSTIMESTAMP);
INSERT INTO stok_obat_log (obat_id, tipe, jumlah, keterangan, created_by, created_at, updated_at) VALUES (6,  'MASUK', 100, 'Stok awal — Metformin 500mg',            1, SYSTIMESTAMP, SYSTIMESTAMP);
INSERT INTO stok_obat_log (obat_id, tipe, jumlah, keterangan, created_by, created_at, updated_at) VALUES (7,  'MASUK', 80,  'Stok awal — Amlodipine 5mg',             1, SYSTIMESTAMP, SYSTIMESTAMP);
INSERT INTO stok_obat_log (obat_id, tipe, jumlah, keterangan, created_by, created_at, updated_at) VALUES (8,  'MASUK', 120, 'Stok awal — Omeprazole 20mg',            1, SYSTIMESTAMP, SYSTIMESTAMP);
INSERT INTO stok_obat_log (obat_id, tipe, jumlah, keterangan, created_by, created_at, updated_at) VALUES (9,  'MASUK', 400, 'Stok awal — Vitamin C 500mg',            1, SYSTIMESTAMP, SYSTIMESTAMP);
INSERT INTO stok_obat_log (obat_id, tipe, jumlah, keterangan, created_by, created_at, updated_at) VALUES (10, 'MASUK', 30,  'Stok awal — Salbutamol Inhaler',         1, SYSTIMESTAMP, SYSTIMESTAMP);
INSERT INTO stok_obat_log (obat_id, tipe, jumlah, keterangan, created_by, created_at, updated_at) VALUES (11, 'MASUK', 150, 'Stok awal — Dexamethasone 0.5mg',        1, SYSTIMESTAMP, SYSTIMESTAMP);
INSERT INTO stok_obat_log (obat_id, tipe, jumlah, keterangan, created_by, created_at, updated_at) VALUES (12, 'MASUK', 60,  'Stok awal — OBH Sirup 100ml',            1, SYSTIMESTAMP, SYSTIMESTAMP);

-- ============================================================
-- 16. UPDATE sesi_praktik.terisi sesuai jumlah appointment
-- ============================================================
UPDATE sesi_praktik sp SET terisi = (
    SELECT COUNT(*) FROM appointment a
    WHERE a.sesi_id = sp.sesi_id
)
WHERE EXISTS (
    SELECT 1 FROM appointment a WHERE a.sesi_id = sp.sesi_id
);

-- ============================================================
-- 17. RESET IDENTITY SEQUENCES (agar app tidak konflik)
-- ============================================================
ALTER TABLE users          MODIFY id          GENERATED BY DEFAULT ON NULL AS IDENTITY (START WITH LIMIT VALUE);
ALTER TABLE pasien         MODIFY pasien_id    GENERATED BY DEFAULT ON NULL AS IDENTITY (START WITH LIMIT VALUE);
ALTER TABLE dokter         MODIFY dokter_id    GENERATED BY DEFAULT ON NULL AS IDENTITY (START WITH LIMIT VALUE);
ALTER TABLE obat           MODIFY obat_id      GENERATED BY DEFAULT ON NULL AS IDENTITY (START WITH LIMIT VALUE);
ALTER TABLE jadwal_dokter  MODIFY jadwal_id    GENERATED BY DEFAULT ON NULL AS IDENTITY (START WITH LIMIT VALUE);
ALTER TABLE sesi_praktik   MODIFY sesi_id      GENERATED BY DEFAULT ON NULL AS IDENTITY (START WITH LIMIT VALUE);
ALTER TABLE appointment    MODIFY appointment_id GENERATED BY DEFAULT ON NULL AS IDENTITY (START WITH LIMIT VALUE);
ALTER TABLE antrian        MODIFY antrian_id   GENERATED BY DEFAULT ON NULL AS IDENTITY (START WITH LIMIT VALUE);
ALTER TABLE vital_signs    MODIFY vs_id        GENERATED BY DEFAULT ON NULL AS IDENTITY (START WITH LIMIT VALUE);
ALTER TABLE rekam_medis    MODIFY rekam_id     GENERATED BY DEFAULT ON NULL AS IDENTITY (START WITH LIMIT VALUE);
ALTER TABLE resep          MODIFY resep_id     GENERATED BY DEFAULT ON NULL AS IDENTITY (START WITH LIMIT VALUE);
ALTER TABLE tagihan        MODIFY tagihan_id   GENERATED BY DEFAULT ON NULL AS IDENTITY (START WITH LIMIT VALUE);
ALTER TABLE tagihan_detail MODIFY detail_id    GENERATED BY DEFAULT ON NULL AS IDENTITY (START WITH LIMIT VALUE);
ALTER TABLE stok_obat_log  MODIFY log_id       GENERATED BY DEFAULT ON NULL AS IDENTITY (START WITH LIMIT VALUE);

COMMIT;
