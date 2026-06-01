/*
 * ============================================================
 *  DEMO DATA TAMBAHAN — Klinik BenMari
 *  Jalankan SETELAH demo_data.sql
 *  Koneksi: C##KLINIK_ADMIN/klinik123@localhost:1521/FREE
 *
 *  Tambahan:
 *  - 22 pasien baru (ID 9-30, termasuk anak-anak)
 *  - ~340 appointment historis (April 1 – Mei 24, 2026)
 *    dengan antrian, vital signs, rekam medis, resep, tagihan
 *  - Hari ini (1 Juni): antrian ramai per dokter + walk-in
 *  - Future (Juni 2 – Juli 31): booking tambahan
 * ============================================================
 */
SET DEFINE OFF
ALTER SESSION SET NLS_DATE_FORMAT      = 'YYYY-MM-DD';
ALTER SESSION SET NLS_TIMESTAMP_FORMAT = 'YYYY-MM-DD HH24:MI:SS';

-- ============================================================
-- 1. PASIEN TAMBAHAN (ID 9–30)
-- ============================================================
INSERT INTO pasien (pasien_id,nik,nama_lengkap,tanggal_lahir,jenis_kelamin,alamat,no_telepon,email,golongan_darah,status_aktif,created_at,updated_at) VALUES(9, '3578071901910009','Dewi Kusumawati',    TO_DATE('1991-01-19','YYYY-MM-DD'),'P','Jl. Semeru No.4, Surabaya',  '08991122334','dewi.kw@email.com',    'B','Y',SYSTIMESTAMP,SYSTIMESTAMP);
INSERT INTO pasien (pasien_id,nik,nama_lengkap,tanggal_lahir,jenis_kelamin,alamat,no_telepon,email,golongan_darah,status_aktif,created_at,updated_at) VALUES(10,'3578082203780010','Riko Handoyo',        TO_DATE('1978-03-22','YYYY-MM-DD'),'L','Jl. Kalimantan No.7, Surabaya','08112233450','riko.hy@email.com',    'O','Y',SYSTIMESTAMP,SYSTIMESTAMP);
INSERT INTO pasien (pasien_id,nik,nama_lengkap,tanggal_lahir,jenis_kelamin,alamat,no_telepon,email,golongan_darah,status_aktif,created_at,updated_at) VALUES(11,'3578091510010011','Maya Andriani',       TO_DATE('2001-10-15','YYYY-MM-DD'),'P','Jl. Flores No.11, Surabaya',  '08223344561','maya.an@email.com',    'A','Y',SYSTIMESTAMP,SYSTIMESTAMP);
INSERT INTO pasien (pasien_id,nik,nama_lengkap,tanggal_lahir,jenis_kelamin,alamat,no_telepon,email,golongan_darah,status_aktif,created_at,updated_at) VALUES(12,'3578100806650012','Bambang Sutejo',      TO_DATE('1965-06-08','YYYY-MM-DD'),'L','Jl. Sulawesi No.22, Surabaya', '08334455672','bambang.st@email.com', 'B','Y',SYSTIMESTAMP,SYSTIMESTAMP);
INSERT INTO pasien (pasien_id,nik,nama_lengkap,tanggal_lahir,jenis_kelamin,alamat,no_telepon,email,golongan_darah,status_aktif,created_at,updated_at) VALUES(13,'3578111205940013','Fitriani Nur',         TO_DATE('1994-05-12','YYYY-MM-DD'),'P','Jl. Bawean No.3, Surabaya',   '08445566783','fitri.nur@email.com',  'AB','Y',SYSTIMESTAMP,SYSTIMESTAMP);
INSERT INTO pasien (pasien_id,nik,nama_lengkap,tanggal_lahir,jenis_kelamin,alamat,no_telepon,email,golongan_darah,status_aktif,created_at,updated_at) VALUES(14,'3578122708820014','Agus Setiawan',       TO_DATE('1982-08-27','YYYY-MM-DD'),'L','Jl. Rungkut No.15, Surabaya', '08556677894','agus.sw@email.com',    'O','Y',SYSTIMESTAMP,SYSTIMESTAMP);
INSERT INTO pasien (pasien_id,nik,nama_lengkap,tanggal_lahir,jenis_kelamin,alamat,no_telepon,email,golongan_darah,status_aktif,created_at,updated_at) VALUES(15,'3578130314870015','Ratna Wati',          TO_DATE('1987-03-14','YYYY-MM-DD'),'P','Jl. Wonokromo No.8, Surabaya','08667788905','ratna.wt@email.com',   'A','Y',SYSTIMESTAMP,SYSTIMESTAMP);
INSERT INTO pasien (pasien_id,nik,nama_lengkap,tanggal_lahir,jenis_kelamin,alamat,no_telepon,email,golongan_darah,status_aktif,created_at,updated_at) VALUES(16,'3578140920000016','Doni Prasetyo',       TO_DATE('2000-09-20','YYYY-MM-DD'),'L','Jl. Diponegoro No.5, Surabaya','08778899016','doni.pr@email.com',    'B','Y',SYSTIMESTAMP,SYSTIMESTAMP);
INSERT INTO pasien (pasien_id,nik,nama_lengkap,tanggal_lahir,jenis_kelamin,alamat,no_telepon,email,golongan_darah,status_aktif,created_at,updated_at) VALUES(17,'3578150617960017','Eka Putri',           TO_DATE('1996-06-17','YYYY-MM-DD'),'P','Jl. Basuki Rahmat No.6, Sby',  '08889900127','eka.putri@email.com',  'O','Y',SYSTIMESTAMP,SYSTIMESTAMP);
INSERT INTO pasien (pasien_id,nik,nama_lengkap,tanggal_lahir,jenis_kelamin,alamat,no_telepon,email,golongan_darah,status_aktif,created_at,updated_at) VALUES(18,'3578160125750018','Wahyu Santoso',       TO_DATE('1975-01-25','YYYY-MM-DD'),'L','Jl. Ahmad Yani No.19, Sby',    '08990011238','wahyu.ss@email.com',   'AB','Y',SYSTIMESTAMP,SYSTIMESTAMP);
INSERT INTO pasien (pasien_id,nik,nama_lengkap,tanggal_lahir,jenis_kelamin,alamat,no_telepon,email,golongan_darah,status_aktif,created_at,updated_at) VALUES(19,'3578170409830019','Sri Mulyani',         TO_DATE('1983-04-09','YYYY-MM-DD'),'P','Jl. Pemuda No.30, Surabaya',   '08101122349','sri.ml@email.com',     'A','Y',SYSTIMESTAMP,SYSTIMESTAMP);
INSERT INTO pasien (pasien_id,nik,nama_lengkap,tanggal_lahir,jenis_kelamin,alamat,no_telepon,email,golongan_darah,status_aktif,created_at,updated_at) VALUES(20,'3578180711150020','Fauzan Rizki',        TO_DATE('2015-07-11','YYYY-MM-DD'),'L','Jl. Mayjend Sungkono No.2, Sby','08212233450','fauzan.rz@email.com',  'B','Y',SYSTIMESTAMP,SYSTIMESTAMP);
INSERT INTO pasien (pasien_id,nik,nama_lengkap,tanggal_lahir,jenis_kelamin,alamat,no_telepon,email,golongan_darah,status_aktif,created_at,updated_at) VALUES(21,'3578190316700021','Kartini Dewi',        TO_DATE('1970-03-16','YYYY-MM-DD'),'P','Jl. Darmo No.12, Surabaya',    '08323344561','kartini.d@email.com',  'O','Y',SYSTIMESTAMP,SYSTIMESTAMP);
INSERT INTO pasien (pasien_id,nik,nama_lengkap,tanggal_lahir,jenis_kelamin,alamat,no_telepon,email,golongan_darah,status_aktif,created_at,updated_at) VALUES(22,'3578201128880022','Hendro Wibowo',       TO_DATE('1988-11-28','YYYY-MM-DD'),'L','Jl. Kupang No.7, Surabaya',    '08434455672','hendro.wb@email.com',  'A','Y',SYSTIMESTAMP,SYSTIMESTAMP);
INSERT INTO pasien (pasien_id,nik,nama_lengkap,tanggal_lahir,jenis_kelamin,alamat,no_telepon,email,golongan_darah,status_aktif,created_at,updated_at) VALUES(23,'3578210207990023','Nurul Hidayah',       TO_DATE('1999-02-07','YYYY-MM-DD'),'P','Jl. Kenjeran No.9, Surabaya',  '08545566783','nurul.hd@email.com',   'AB','Y',SYSTIMESTAMP,SYSTIMESTAMP);
INSERT INTO pasien (pasien_id,nik,nama_lengkap,tanggal_lahir,jenis_kelamin,alamat,no_telepon,email,golongan_darah,status_aktif,created_at,updated_at) VALUES(24,'3578221831710024','Sigit Purnomo',       TO_DATE('1971-08-18','YYYY-MM-DD'),'L','Jl. Gubeng No.14, Surabaya',   '08656677894','sigit.pm@email.com',   'O','Y',SYSTIMESTAMP,SYSTIMESTAMP);
INSERT INTO pasien (pasien_id,nik,nama_lengkap,tanggal_lahir,jenis_kelamin,alamat,no_telepon,email,golongan_darah,status_aktif,created_at,updated_at) VALUES(25,'3578230524030025','Rena Marlina',        TO_DATE('2003-05-24','YYYY-MM-DD'),'P','Jl. Kayoon No.16, Surabaya',   '08767788905','rena.ml@email.com',    'A','Y',SYSTIMESTAMP,SYSTIMESTAMP);
INSERT INTO pasien (pasien_id,nik,nama_lengkap,tanggal_lahir,jenis_kelamin,alamat,no_telepon,email,golongan_darah,status_aktif,created_at,updated_at) VALUES(26,'3578241005600026','Yudi Hermawan',       TO_DATE('1960-05-10','YYYY-MM-DD'),'L','Jl. Pasar Kembang No.2, Sby',  '08878899016','yudi.hw@email.com',    'B','Y',SYSTIMESTAMP,SYSTIMESTAMP);
INSERT INTO pasien (pasien_id,nik,nama_lengkap,tanggal_lahir,jenis_kelamin,alamat,no_telepon,email,golongan_darah,status_aktif,created_at,updated_at) VALUES(27,'3578250713930027','Dwi Rahayu',          TO_DATE('1993-07-13','YYYY-MM-DD'),'P','Jl. Embong Malang No.5, Sby',  '08989900127','dwi.rh@email.com',     'O','Y',SYSTIMESTAMP,SYSTIMESTAMP);
INSERT INTO pasien (pasien_id,nik,nama_lengkap,tanggal_lahir,jenis_kelamin,alamat,no_telepon,email,golongan_darah,status_aktif,created_at,updated_at) VALUES(28,'3578260330100028','Bagas Prasetyo',      TO_DATE('2010-03-30','YYYY-MM-DD'),'L','Jl. Tambak Sari No.11, Sby',   '08190011238','bagas.pr@email.com',   'A','Y',SYSTIMESTAMP,SYSTIMESTAMP);
INSERT INTO pasien (pasien_id,nik,nama_lengkap,tanggal_lahir,jenis_kelamin,alamat,no_telepon,email,golongan_darah,status_aktif,created_at,updated_at) VALUES(29,'3578271202850029','Wulan Sari',          TO_DATE('1985-02-12','YYYY-MM-DD'),'P','Jl. Indragiri No.3, Surabaya', '08201122349','wulan.sr@email.com',   'AB','Y',SYSTIMESTAMP,SYSTIMESTAMP);
INSERT INTO pasien (pasien_id,nik,nama_lengkap,tanggal_lahir,jenis_kelamin,alamat,no_telepon,email,golongan_darah,status_aktif,created_at,updated_at) VALUES(30,'3578281916770030','Hadi Santosa',        TO_DATE('1977-09-19','YYYY-MM-DD'),'L','Jl. Sulawesi No.18, Surabaya', '08312233450','hadi.st@email.com',    'O','Y',SYSTIMESTAMP,SYSTIMESTAMP);

COMMIT;

-- ============================================================
-- 2. BULK HISTORICAL + TODAY + FUTURE APPOINTMENTS
-- ============================================================
DECLARE
  TYPE strtab IS TABLE OF VARCHAR2(500);

  -- ---- Keluhan ----
  v_kel_umum  strtab := strtab(
    'Demam tinggi 4 hari, tidak nafsu makan',
    'Sakit kepala hebat dan berkunang-kunang',
    'Batuk berdahak dan sesak ringan sejak 4 hari',
    'Nyeri ulu hati dan mual setiap pagi',
    'Pusing berputar saat berubah posisi',
    'Lemas, pucat, dan mudah lelah',
    'Mual muntah disertai diare sejak kemarin',
    'Gatal ruam merah di lengan dan dada',
    'Tekanan darah tinggi, minta kontrol rutin',
    'Gula darah tidak terkontrol seminggu ini',
    'Nyeri sendi lutut kiri sejak 1 bulan',
    'Berdebar-debar dan sesak saat aktivitas'
  );
  v_diag_umum strtab := strtab(
    'Demam Tifoid',
    'Sefalgia / Tension Headache',
    'Bronkitis Akut',
    'Gastritis Erosif',
    'Vertigo Posisional Benigna',
    'Anemia Ringan',
    'Gastroenteritis Akut',
    'Dermatitis Alergika',
    'Hipertensi Grade II',
    'Diabetes Mellitus Tipe 2 tidak terkontrol',
    'Osteoarthritis Genu Sinistra',
    'Aritmia — perlu evaluasi EKG'
  );
  v_tind_umum strtab := strtab(
    'Pemeriksaan fisik, tes widal, edukasi istirahat',
    'Pemeriksaan neurologis, anjuran relaksasi',
    'Auskultasi paru, nebulisasi NaCl 0.9%',
    'Pemeriksaan abdomen, edukasi pola makan',
    'Manuver Epley, fisioterapi vestibular',
    'Cek Hb, edukasi nutrisi tinggi zat besi',
    'Rehidrasi oral, diet lunak rendah serat',
    'Skin prick test, edukasi hindari alergen',
    'Pengukuran TD serial, konsultasi lifestyle',
    'Cek GDS, edukasi diet DM dan olahraga',
    'Fisioterapi, kompres hangat, NSAID topikal',
    'EKG, konsultasi kardiologi bila berlanjut'
  );
  v_biaya_o_umum strtab := strtab(
    '85000','45000','95000','77000','65000','60000','75000','39500','240000','180000','95000','55000'
  );

  -- ---- Anak ----
  v_kel_anak  strtab := strtab(
    'Anak 5 tahun demam 2 hari, rewel, suhu 38.8',
    'Bayi 10 bulan batuk pilek sejak 3 hari',
    'Anak 7 tahun BAB cair 6x sejak kemarin',
    'Anak 4 tahun sesak napas dan mengi malam',
    'Anak 8 tahun keluhan sakit tenggorokan hebat',
    'Bayi 8 bulan tidak mau minum ASI, demam',
    'Anak 6 tahun bintik-bintik merah seluruh badan',
    'Anak 3 tahun berat badan tidak naik 3 bulan',
    'Anak 9 tahun telinga sakit dan keluar cairan',
    'Bayi 6 bulan kuning sejak lahir',
    'Anak 5 tahun kejang demam pertama kali',
    'Anak 10 tahun keluhan nyeri perut berulang'
  );
  v_diag_anak strtab := strtab(
    'Faringitis Akut pada Anak',
    'ISPA pada Bayi',
    'Gastroenteritis Akut Anak',
    'Asma Bronkial Serangan Ringan',
    'Tonsillitis Akut',
    'Demam Tanpa Sumber Jelas (Bayi)',
    'Varisela (Cacar Air)',
    'Gizi Kurang / Stunting',
    'Otitis Media Akut',
    'Hiperbilirubinemia Neonatal',
    'Kejang Demam Sederhana',
    'Dispepsia Fungsional Anak'
  );
  v_tind_anak strtab := strtab(
    'Pemeriksaan THT, swab tenggorokan',
    'Nebulisasi NaCl 0.9%, edukasi ibu',
    'Rehidrasi oral Oralit, diet lunak',
    'Nebulisasi Salbutamol 2.5mg',
    'Pemeriksaan tonsil, kultur swab',
    'Observasi suhu, edukasi pemberian ASI',
    'Edukasi isolasi, perawatan lesi kulit',
    'Konsultasi gizi anak, target BB',
    'Aspirasi sekret, tetes telinga',
    'Fototerapi, cek bilirubin serial',
    'Penanganan kejang akut, edukasi orang tua',
    'Palpasi abdomen, edukasi diet'
  );
  v_biaya_o_anak strtab := strtab(
    '65000','55000','75000','120000','95000','55000','45000','35000',
    '85000','95000','110000','45000'
  );

  -- ---- Gigi ----
  v_kel_gigi  strtab := strtab(
    'Gigi ngilu saat minum dingin dan panas',
    'Gusi bengkak dan berdarah saat sikat gigi',
    'Gigi depan patah kena benturan tadi pagi',
    'Minta cabut gigi berlubang besar',
    'Bau mulut dan karang gigi menumpuk tebal',
    'Sakit rahang dan bunyi klik saat buka mulut',
    'Gigi geraham bungsu tumbuh miring, nyeri',
    'Kontrol kawat gigi rutin bulanan',
    'Gigi anak berlubang, minta ditambal',
    'Abses gigi dengan pembengkakan pipi',
    'Gigi sensitif setelah tambal bulan lalu',
    'Minta veneer gigi depan terlihat kuning'
  );
  v_diag_gigi strtab := strtab(
    'Hipersensitivitas Dentin',
    'Gingivitis Kronis',
    'Fraktur Mahkota Gigi Anterior',
    'Ekstraksi Gigi Indikasi Karies',
    'Kalkulus Supragingival Grade III',
    'Disfungsi Temporomandibular',
    'Perikoronitis Gigi M3 Impaksi',
    'Kontrol Ortodonti Rutin',
    'Karies Dentis Gigi Sulung',
    'Abses Periapikal Akut',
    'Hipersensitivitas Pasca Restorasi',
    'Diskolorisasi Gigi Ekstrinsik'
  );
  v_tind_gigi strtab := strtab(
    'Aplikasi desensitizer + fluoride',
    'Scaling ultrasonic + root planing',
    'Preparasi dan restorasi komposit estetik',
    'Ekstraksi dengan anestesi lokal',
    'Scaling dan poles seluruh gigi',
    'Splinting TMJ + fisioterapi rahang',
    'Operkulektomi + irigasi',
    'Evaluasi kawat, penggantian arch wire',
    'Restorasi GIC gigi sulung',
    'Insisi abses + drain + antibiotik',
    'Poles tambalan, aplikasi desensitizer',
    'Bleaching in-office, 1 sesi'
  );
  v_biaya_o_gigi strtab := strtab(
    '45000','65000','200000','50000','80000','75000','135000','35000',
    '55000','125000','45000','250000'
  );

  -- Variables
  v_date      DATE;
  v_day       VARCHAR2(3);
  v_app_id    NUMBER;
  v_rm_id     NUMBER;
  v_tag_id    NUMBER;
  v_sesi_id   NUMBER;
  v_p_id      NUMBER;
  v_nomor     NUMBER;
  v_cnt       PLS_INTEGER := 0;
  v_idx       PLS_INTEGER;
  v_bk        NUMBER;
  v_bo        NUMBER;
  v_td        VARCHAR2(10);
  v_suhu      NUMBER;
  v_bb        NUMBER;
  v_tb        NUMBER;
  v_spo2      NUMBER;
  v_method    VARCHAR2(10);

  FUNCTION get_method(n PLS_INTEGER) RETURN VARCHAR2 IS
  BEGIN
    RETURN CASE MOD(n,4) WHEN 0 THEN 'TUNAI' WHEN 1 THEN 'QRIS' WHEN 2 THEN 'TRANSFER' ELSE 'TUNAI' END;
  END;

BEGIN
  -- ===========================================================
  -- A. HISTORICAL: April 1 – Mei 24, 2026 (sesi_id = NULL)
  --    3 appointment per dokter per hari kerja
  -- ===========================================================
  FOR day_i IN 0..53 LOOP
    v_date := TO_DATE('2026-04-01','YYYY-MM-DD') + day_i;
    v_day  := TO_CHAR(v_date,'DY','NLS_DATE_LANGUAGE=AMERICAN');
    IF v_day IN ('SAT','SUN') THEN CONTINUE; END IF;

    FOR dok_i IN 1..3 LOOP
      v_bk := CASE dok_i WHEN 1 THEN 150000 WHEN 2 THEN 200000 ELSE 175000 END;

      FOR appt_i IN 1..3 LOOP
        v_cnt    := v_cnt + 1;
        v_p_id   := MOD(v_cnt-1, 22) + 9;
        v_idx    := MOD(v_cnt-1, CASE dok_i WHEN 2 THEN v_kel_anak.COUNT ELSE v_kel_umum.COUNT END) + 1;
        v_nomor  := appt_i;

        -- Vital sign values
        v_td   := CASE MOD(v_cnt,6) WHEN 0 THEN '120/80' WHEN 1 THEN '130/85' WHEN 2 THEN '118/76' WHEN 3 THEN '140/90' WHEN 4 THEN '125/82' ELSE '115/75' END;
        v_suhu := CASE dok_i WHEN 2 THEN 36.5 + MOD(v_cnt,3)*0.5 ELSE 36.2 + MOD(v_cnt,4)*0.3 END;
        v_bb   := CASE dok_i WHEN 2 THEN 12 + MOD(v_cnt,25) ELSE 48 + MOD(v_cnt,30) END;
        v_tb   := CASE dok_i WHEN 2 THEN 90 + MOD(v_cnt,40) ELSE 150 + MOD(v_cnt,25) END;
        v_spo2 := 96 + MOD(v_cnt,4);

        -- Appointment
        INSERT INTO appointment (pasien_id,dokter_id,sesi_id,tgl_appointment,jam_appointment,
          nomor_antrian,keluhan_awal,status,status_kehadiran,created_at,updated_at)
        VALUES (v_p_id, dok_i, NULL, v_date,
          CASE appt_i WHEN 1 THEN '08:00' WHEN 2 THEN '09:00' ELSE '10:00' END,
          v_nomor,
          CASE dok_i WHEN 1 THEN v_kel_umum(v_idx) WHEN 2 THEN v_kel_anak(v_idx) ELSE v_kel_gigi(v_idx) END,
          'SELESAI', 'SUDAH_CHECKIN', SYSTIMESTAMP, SYSTIMESTAMP)
        RETURNING appointment_id INTO v_app_id;

        -- Antrian
        INSERT INTO antrian (pasien_id,dokter_id,appointment_id,nomor_antrian,tanggal,
          status,jenis,waktu_dipanggil,waktu_selesai,created_at,updated_at)
        VALUES (v_p_id, dok_i, v_app_id, v_nomor, v_date, 'SELESAI', 'BOOKING',
          CAST(v_date AS TIMESTAMP) + NUMTODSINTERVAL(8*60 + v_nomor*30,   'MINUTE'),
          CAST(v_date AS TIMESTAMP) + NUMTODSINTERVAL(8*60 + v_nomor*30+35,'MINUTE'),
          SYSTIMESTAMP, SYSTIMESTAMP);

        -- Vital Signs
        INSERT INTO vital_signs (appointment_id,tekanan_darah,suhu_tubuh,berat_badan,tinggi_badan,saturasi_oksigen,created_at,updated_at)
        VALUES (v_app_id, v_td, v_suhu, v_bb, v_tb, v_spo2, SYSTIMESTAMP, SYSTIMESTAMP);

        -- Rekam Medis
        INSERT INTO rekam_medis (appointment_id,dokter_id,tgl_periksa,keluhan,diagnosis,tindakan,
          tekanan_darah,berat_badan,created_at,updated_at)
        VALUES (v_app_id, dok_i, v_date,
          CASE dok_i WHEN 1 THEN v_kel_umum(v_idx) WHEN 2 THEN v_kel_anak(v_idx) ELSE v_kel_gigi(v_idx) END,
          CASE dok_i WHEN 1 THEN v_diag_umum(v_idx) WHEN 2 THEN v_diag_anak(v_idx) ELSE v_diag_gigi(v_idx) END,
          CASE dok_i WHEN 1 THEN v_tind_umum(v_idx) WHEN 2 THEN v_tind_anak(v_idx) ELSE v_tind_gigi(v_idx) END,
          v_td, v_bb, SYSTIMESTAMP, SYSTIMESTAMP)
        RETURNING rekam_id INTO v_rm_id;

        -- Resep (1 item)
        INSERT INTO resep (rekam_id,obat_id,dosis,durasi,aturan_pakai,jumlah,status_ambil,created_at,updated_at)
        VALUES (v_rm_id, MOD(v_cnt-1,12)+1, '1 tablet/kapsul', '5 hari',
          CASE MOD(v_cnt,3) WHEN 0 THEN '3x sehari sesudah makan' WHEN 1 THEN '2x sehari pagi sore' ELSE '1x sehari malam hari' END,
          CASE MOD(v_cnt,3) WHEN 0 THEN 15 WHEN 1 THEN 10 ELSE 7 END,
          'SUDAH_DIAMBIL', SYSTIMESTAMP, SYSTIMESTAMP);

        -- Tagihan
        v_bo := TO_NUMBER(CASE dok_i WHEN 1 THEN v_biaya_o_umum(v_idx) WHEN 2 THEN v_biaya_o_anak(v_idx) ELSE v_biaya_o_gigi(v_idx) END);
        v_method := get_method(v_cnt);

        INSERT INTO tagihan (pasien_id,appointment_id,tgl_tagihan,biaya_konsultasi,biaya_obat,total_biaya,
          metode_bayar,status_bayar,created_at,updated_at)
        VALUES (v_p_id, v_app_id, v_date, v_bk, v_bo, v_bk+v_bo, v_method, 'LUNAS', SYSTIMESTAMP, SYSTIMESTAMP)
        RETURNING tagihan_id INTO v_tag_id;

        INSERT INTO tagihan_detail (tagihan_id,keterangan,jumlah,harga_satuan,created_at,updated_at)
        VALUES (v_tag_id,
          CASE dok_i WHEN 1 THEN 'Konsultasi Dokter Umum' WHEN 2 THEN 'Konsultasi Dokter Anak' ELSE 'Konsultasi Dokter Gigi' END,
          1, v_bk, SYSTIMESTAMP, SYSTIMESTAMP);

        INSERT INTO tagihan_detail (tagihan_id,keterangan,jumlah,harga_satuan,created_at,updated_at)
        VALUES (v_tag_id, 'Obat dan Tindakan', 1, v_bo, SYSTIMESTAMP, SYSTIMESTAMP);

      END LOOP; -- appt_i
    END LOOP; -- dok_i

    -- Commit setiap 10 hari agar tidak OOM
    IF MOD(day_i,10) = 0 THEN COMMIT; END IF;
  END LOOP; -- day_i (historical)

  -- ===========================================================
  -- B. HARI INI (1 Juni 2026) — tambah antrian ramai
  --    Dr. Andi    : nomor 2-8  (nomor 1 sudah Ahmad dari demo_data)
  --    Dr. Siti    : nomor 3-7  (nomor 1-2 sudah)
  --    drg. Budi   : nomor 2-6  (nomor 1 sudah)
  --    + Walk-in per dokter
  -- ===========================================================

  -- Dr. Andi PAGI: nomor 2-8
  SELECT sesi_id INTO v_sesi_id FROM sesi_praktik
  WHERE dokter_id=1 AND tanggal=TO_DATE('2026-06-01','YYYY-MM-DD') AND sesi='PAGI' AND ROWNUM=1;

  FOR n IN 2..8 LOOP
    v_cnt   := v_cnt + 1;
    v_p_id  := MOD(v_cnt-1,22)+9;
    v_idx   := MOD(n-1,12)+1;

    INSERT INTO appointment (pasien_id,dokter_id,sesi_id,tgl_appointment,jam_appointment,
      nomor_antrian,keluhan_awal,status,status_kehadiran,batas_hadir,created_at,updated_at)
    VALUES (v_p_id,1,v_sesi_id,TO_DATE('2026-06-01','YYYY-MM-DD'),
      TO_CHAR(TO_DATE('08:00','HH24:MI') + NUMTODSINTERVAL((n-1)*20,'MINUTE'),'HH24:MI'),
      n, v_kel_umum(v_idx), 'MENUNGGU',
      CASE WHEN n<=3 THEN 'SUDAH_CHECKIN' ELSE 'BELUM_CHECKIN' END,
      TO_TIMESTAMP('2026-06-01 12:00:00','YYYY-MM-DD HH24:MI:SS'),
      SYSTIMESTAMP, SYSTIMESTAMP)
    RETURNING appointment_id INTO v_app_id;

    INSERT INTO antrian (pasien_id,dokter_id,appointment_id,nomor_antrian,tanggal,status,jenis,
      waktu_dipanggil,waktu_selesai,created_at,updated_at)
    VALUES (v_p_id,1,v_app_id,n,TO_DATE('2026-06-01','YYYY-MM-DD'),
      CASE WHEN n<=3 THEN 'DIPANGGIL' ELSE 'MENUNGGU' END,
      'BOOKING', NULL, NULL, SYSTIMESTAMP, SYSTIMESTAMP);

    IF n <= 3 THEN
      INSERT INTO vital_signs (appointment_id,tekanan_darah,suhu_tubuh,berat_badan,tinggi_badan,saturasi_oksigen,created_at,updated_at)
      VALUES (v_app_id,
        CASE MOD(n,3) WHEN 0 THEN '128/83' WHEN 1 THEN '122/79' ELSE '136/88' END,
        36.4 + MOD(n,3)*0.3, 60+n*2, 162+n, 98, SYSTIMESTAMP, SYSTIMESTAMP);
    END IF;

    UPDATE sesi_praktik SET terisi=terisi+1 WHERE sesi_id=v_sesi_id;
  END LOOP;

  -- Dr. Siti PAGI: nomor 3-7
  SELECT sesi_id INTO v_sesi_id FROM sesi_praktik
  WHERE dokter_id=2 AND tanggal=TO_DATE('2026-06-01','YYYY-MM-DD') AND sesi='PAGI' AND ROWNUM=1;

  FOR n IN 3..7 LOOP
    v_cnt   := v_cnt + 1;
    v_p_id  := MOD(v_cnt-1,22)+9;
    v_idx   := MOD(n-1, v_kel_anak.COUNT)+1;

    INSERT INTO appointment (pasien_id,dokter_id,sesi_id,tgl_appointment,jam_appointment,
      nomor_antrian,keluhan_awal,status,status_kehadiran,batas_hadir,created_at,updated_at)
    VALUES (v_p_id,2,v_sesi_id,TO_DATE('2026-06-01','YYYY-MM-DD'),
      TO_CHAR(TO_DATE('08:00','HH24:MI') + NUMTODSINTERVAL((n-1)*25,'MINUTE'),'HH24:MI'),
      n, v_kel_anak(v_idx), 'MENUNGGU', 'BELUM_CHECKIN',
      TO_TIMESTAMP('2026-06-01 12:00:00','YYYY-MM-DD HH24:MI:SS'),
      SYSTIMESTAMP, SYSTIMESTAMP)
    RETURNING appointment_id INTO v_app_id;

    INSERT INTO antrian (pasien_id,dokter_id,appointment_id,nomor_antrian,tanggal,status,jenis,
      waktu_dipanggil,waktu_selesai,created_at,updated_at)
    VALUES (v_p_id,2,v_app_id,n,TO_DATE('2026-06-01','YYYY-MM-DD'),'MENUNGGU','BOOKING',
      NULL,NULL,SYSTIMESTAMP,SYSTIMESTAMP);

    UPDATE sesi_praktik SET terisi=terisi+1 WHERE sesi_id=v_sesi_id;
  END LOOP;

  -- drg. Budi PAGI: nomor 2-6
  SELECT sesi_id INTO v_sesi_id FROM sesi_praktik
  WHERE dokter_id=3 AND tanggal=TO_DATE('2026-06-01','YYYY-MM-DD') AND sesi='PAGI' AND ROWNUM=1;

  FOR n IN 2..6 LOOP
    v_cnt   := v_cnt + 1;
    v_p_id  := MOD(v_cnt-1,22)+9;
    v_idx   := MOD(n-1, v_kel_gigi.COUNT)+1;

    INSERT INTO appointment (pasien_id,dokter_id,sesi_id,tgl_appointment,jam_appointment,
      nomor_antrian,keluhan_awal,status,status_kehadiran,batas_hadir,created_at,updated_at)
    VALUES (v_p_id,3,v_sesi_id,TO_DATE('2026-06-01','YYYY-MM-DD'),
      TO_CHAR(TO_DATE('08:00','HH24:MI') + NUMTODSINTERVAL((n-1)*20,'MINUTE'),'HH24:MI'),
      n, v_kel_gigi(v_idx), 'MENUNGGU', 'BELUM_CHECKIN',
      TO_TIMESTAMP('2026-06-01 12:00:00','YYYY-MM-DD HH24:MI:SS'),
      SYSTIMESTAMP, SYSTIMESTAMP)
    RETURNING appointment_id INTO v_app_id;

    INSERT INTO antrian (pasien_id,dokter_id,appointment_id,nomor_antrian,tanggal,status,jenis,
      waktu_dipanggil,waktu_selesai,created_at,updated_at)
    VALUES (v_p_id,3,v_app_id,n,TO_DATE('2026-06-01','YYYY-MM-DD'),'MENUNGGU','BOOKING',
      NULL,NULL,SYSTIMESTAMP,SYSTIMESTAMP);

    UPDATE sesi_praktik SET terisi=terisi+1 WHERE sesi_id=v_sesi_id;
  END LOOP;

  -- Walk-in hari ini (WALKIN) — tanpa appointment
  FOR dok_i IN 1..3 LOOP
    v_cnt  := v_cnt + 1;
    v_p_id := MOD(v_cnt-1,22)+9;

    INSERT INTO antrian (pasien_id,dokter_id,appointment_id,nomor_antrian,tanggal,status,jenis,
      waktu_dipanggil,waktu_selesai,created_at,updated_at)
    VALUES (v_p_id, dok_i, NULL, 20+dok_i, TO_DATE('2026-06-01','YYYY-MM-DD'),
      'MENUNGGU','WALKIN', NULL, NULL, SYSTIMESTAMP, SYSTIMESTAMP);
  END LOOP;

  -- ===========================================================
  -- C. FUTURE BOOKINGS: Juni 2 – Juli 31, 2026
  --    1-2 appointment per dokter per hari
  -- ===========================================================
  FOR day_i IN 0..59 LOOP
    v_date := TO_DATE('2026-06-02','YYYY-MM-DD') + day_i;
    v_day  := TO_CHAR(v_date,'DY','NLS_DATE_LANGUAGE=AMERICAN');
    IF v_day IN ('SAT','SUN') THEN CONTINUE; END IF;

    FOR dok_i IN 1..3 LOOP
      v_bk  := CASE dok_i WHEN 1 THEN 150000 WHEN 2 THEN 200000 ELSE 175000 END;

      -- 2 appointments per doctor per future day
      FOR appt_i IN 1..2 LOOP
        v_cnt   := v_cnt + 1;
        v_p_id  := MOD(v_cnt-1,30)+1;
        v_idx   := MOD(v_cnt-1, CASE dok_i WHEN 2 THEN v_kel_anak.COUNT ELSE v_kel_umum.COUNT END)+1;
        v_nomor := appt_i + 3; -- nomor mulai 4 (1-3 dari demo_data)

        BEGIN
          SELECT sesi_id INTO v_sesi_id FROM sesi_praktik
          WHERE dokter_id=dok_i AND tanggal=v_date AND sesi=CASE appt_i WHEN 1 THEN 'PAGI' ELSE 'SIANG' END
          AND ROWNUM=1;
        EXCEPTION WHEN NO_DATA_FOUND THEN v_sesi_id := NULL; END;

        INSERT INTO appointment (pasien_id,dokter_id,sesi_id,tgl_appointment,jam_appointment,
          nomor_antrian,keluhan_awal,status,status_kehadiran,batas_hadir,created_at,updated_at)
        VALUES (v_p_id, dok_i, v_sesi_id, v_date,
          CASE appt_i WHEN 1 THEN '08:00' ELSE '13:00' END,
          v_nomor,
          CASE dok_i WHEN 1 THEN v_kel_umum(v_idx) WHEN 2 THEN v_kel_anak(v_idx) ELSE v_kel_gigi(v_idx) END,
          'MENUNGGU', 'BELUM_CHECKIN',
          CAST(v_date AS TIMESTAMP) + NUMTODSINTERVAL(CASE appt_i WHEN 1 THEN 12 ELSE 17 END * 60,'MINUTE'),
          SYSTIMESTAMP, SYSTIMESTAMP)
        RETURNING appointment_id INTO v_app_id;

        IF v_sesi_id IS NOT NULL THEN
          UPDATE sesi_praktik SET terisi=terisi+1 WHERE sesi_id=v_sesi_id;
        END IF;

      END LOOP; -- appt_i
    END LOOP; -- dok_i

    IF MOD(day_i,15)=0 THEN COMMIT; END IF;
  END LOOP; -- day_i (future)

  -- ===========================================================
  -- D. STOK OBAT LOG — penerimaan stok bulanan
  -- ===========================================================
  FOR obat_i IN 1..12 LOOP
    INSERT INTO stok_obat_log (obat_id,tipe,jumlah,keterangan,created_by,created_at,updated_at)
    VALUES (obat_i,'MASUK', 50+MOD(obat_i,5)*20,
      'Pengadaan bulan Mei 2026',1, SYSTIMESTAMP, SYSTIMESTAMP);
    INSERT INTO stok_obat_log (obat_id,tipe,jumlah,keterangan,created_by,created_at,updated_at)
    VALUES (obat_i,'MASUK', 30+MOD(obat_i,3)*15,
      'Pengadaan bulan April 2026',1, SYSTIMESTAMP, SYSTIMESTAMP);
  END LOOP;

  COMMIT;
END;
/
