export interface Pasien {
  PASIEN_ID: number;
  NIK: string;
  NAMA_LENGKAP: string;
  TANGGAL_LAHIR: string;
  JENIS_KELAMIN: 'L' | 'P';
  ALAMAT: string;
  NO_TELEPON: string;
  EMAIL: string;
  GOLONGAN_DARAH: 'A' | 'B' | 'AB' | 'O';
  STATUS_AKTIF: 'Y' | 'N';
}

export interface Dokter {
  DOKTER_ID: number;
  NAMA_DOKTER: string;
  SPESIALISASI: string;
  NO_SIP: string;
  NO_TELEPON: string;
  EMAIL: string;
  JADWAL_PRAKTIK: string;
  BIAYA_KONSULTASI: number;
  STATUS_AKTIF: 'Y' | 'N';
}

export interface Appointment {
  APPOINTMENT_ID: number;
  PASIEN_ID: number;
  DOKTER_ID: number;
  TGL_APPOINTMENT: string;
  JAM_APPOINTMENT: string;
  NOMOR_ANTRIAN: number;
  KELUHAN_AWAL: string;
  STATUS: 'MENUNGGU' | 'SELESAI' | 'BATAL';
  CATATAN: string;
}

export interface RekamMedis {
  REKAM_ID: number;
  APPOINTMENT_ID: number;
  DOKTER_ID: number;
  TGL_PERIKSA: string;
  KELUHAN: string;
  DIAGNOSIS: string;
  TINDAKAN: string;
  TEKANAN_DARAH: string;
  BERAT_BADAN: number;
  CATATAN_TAMBAHAN: string;
}

export interface Obat {
  OBAT_ID: number;
  NAMA_OBAT: string;
  KATEGORI: string;
  SATUAN: string;
  STOK_TERSEDIA: number;
  HARGA_SATUAN: number;
  TGL_KADALUARSA: string;
  DESKRIPSI: string;
  STATUS_AKTIF: 'Y' | 'N';
}

export interface Resep {
  RESEP_ID: number;
  REKAM_ID: number;
  OBAT_ID: number;
  DOSIS: string;
  ATURAN_PAKAI: string;
  JUMLAH: number;
  CATATAN_RESEP: string;
}

export interface Tagihan {
  TAGIHAN_ID: number;
  PASIEN_ID: number;
  APPOINTMENT_ID: number;
  TGL_TAGIHAN: string;
  BIAYA_KONSULTASI: number;
  BIAYA_OBAT: number;
  TOTAL_BIAYA: number;
  METODE_BAYAR: 'Tunai' | 'Transfer' | 'Debit' | 'BPJS';
  STATUS_BAYAR: 'BELUM' | 'LUNAS' | 'CICIL';
}

// Mock data
export const mockPasien: Pasien[] = [
  { PASIEN_ID: 1, NIK: '3578012345670001', NAMA_LENGKAP: 'Budi Santoso', TANGGAL_LAHIR: '1985-03-15', JENIS_KELAMIN: 'L', ALAMAT: 'Jl. Merdeka No. 123, Surabaya', NO_TELEPON: '081234567890', EMAIL: 'budi@email.com', GOLONGAN_DARAH: 'A', STATUS_AKTIF: 'Y' },
  { PASIEN_ID: 2, NIK: '3578012345670002', NAMA_LENGKAP: 'Siti Aminah', TANGGAL_LAHIR: '1990-07-22', JENIS_KELAMIN: 'P', ALAMAT: 'Jl. Pahlawan No. 45, Surabaya', NO_TELEPON: '081234567891', EMAIL: 'siti@email.com', GOLONGAN_DARAH: 'B', STATUS_AKTIF: 'Y' },
  { PASIEN_ID: 3, NIK: '3578012345670003', NAMA_LENGKAP: 'Ahmad Fauzi', TANGGAL_LAHIR: '1978-11-10', JENIS_KELAMIN: 'L', ALAMAT: 'Jl. Diponegoro No. 67, Surabaya', NO_TELEPON: '081234567892', EMAIL: 'ahmad@email.com', GOLONGAN_DARAH: 'O', STATUS_AKTIF: 'Y' },
  { PASIEN_ID: 4, NIK: '3578012345670004', NAMA_LENGKAP: 'Dewi Lestari', TANGGAL_LAHIR: '1995-05-18', JENIS_KELAMIN: 'P', ALAMAT: 'Jl. Sudirman No. 89, Surabaya', NO_TELEPON: '081234567893', EMAIL: 'dewi@email.com', GOLONGAN_DARAH: 'AB', STATUS_AKTIF: 'Y' },
  { PASIEN_ID: 5, NIK: '3578012345670005', NAMA_LENGKAP: 'Rudi Hartono', TANGGAL_LAHIR: '1982-09-25', JENIS_KELAMIN: 'L', ALAMAT: 'Jl. Gajah Mada No. 12, Surabaya', NO_TELEPON: '081234567894', EMAIL: 'rudi@email.com', GOLONGAN_DARAH: 'A', STATUS_AKTIF: 'Y' },
];

export const mockDokter: Dokter[] = [
  { DOKTER_ID: 1, NAMA_DOKTER: 'dr. Maria Wijaya, Sp.PD', SPESIALISASI: 'Penyakit Dalam', NO_SIP: 'SIP001/2020', NO_TELEPON: '081234560001', EMAIL: 'maria@klinik.com', JADWAL_PRAKTIK: 'Senin-Jumat 08:00-14:00', BIAYA_KONSULTASI: 150000, STATUS_AKTIF: 'Y' },
  { DOKTER_ID: 2, NAMA_DOKTER: 'dr. Benny Sutanto, Sp.A', SPESIALISASI: 'Anak', NO_SIP: 'SIP002/2020', NO_TELEPON: '081234560002', EMAIL: 'benny@klinik.com', JADWAL_PRAKTIK: 'Senin-Sabtu 13:00-18:00', BIAYA_KONSULTASI: 175000, STATUS_AKTIF: 'Y' },
  { DOKTER_ID: 3, NAMA_DOKTER: 'dr. Lisa Permata, Sp.OG', SPESIALISASI: 'Kandungan', NO_SIP: 'SIP003/2020', NO_TELEPON: '081234560003', EMAIL: 'lisa@klinik.com', JADWAL_PRAKTIK: 'Selasa-Kamis 09:00-15:00', BIAYA_KONSULTASI: 200000, STATUS_AKTIF: 'Y' },
  { DOKTER_ID: 4, NAMA_DOKTER: 'dr. Andi Rahman, Sp.JP', SPESIALISASI: 'Jantung', NO_SIP: 'SIP004/2020', NO_TELEPON: '081234560004', EMAIL: 'andi@klinik.com', JADWAL_PRAKTIK: 'Rabu-Jumat 10:00-16:00', BIAYA_KONSULTASI: 250000, STATUS_AKTIF: 'Y' },
  { DOKTER_ID: 5, NAMA_DOKTER: 'dr. Sri Mulyani, Sp.M', SPESIALISASI: 'Mata', NO_SIP: 'SIP005/2020', NO_TELEPON: '081234560005', EMAIL: 'sri@klinik.com', JADWAL_PRAKTIK: 'Senin-Rabu 14:00-20:00', BIAYA_KONSULTASI: 180000, STATUS_AKTIF: 'Y' },
];

export const mockAppointment: Appointment[] = [
  { APPOINTMENT_ID: 1, PASIEN_ID: 1, DOKTER_ID: 1, TGL_APPOINTMENT: '2026-05-05', JAM_APPOINTMENT: '09:00', NOMOR_ANTRIAN: 1, KELUHAN_AWAL: 'Demam tinggi sejak 3 hari', STATUS: 'MENUNGGU', CATATAN: '' },
  { APPOINTMENT_ID: 2, PASIEN_ID: 2, DOKTER_ID: 2, TGL_APPOINTMENT: '2026-05-05', JAM_APPOINTMENT: '14:00', NOMOR_ANTRIAN: 1, KELUHAN_AWAL: 'Anak batuk pilek', STATUS: 'SELESAI', CATATAN: 'Sudah diperiksa' },
  { APPOINTMENT_ID: 3, PASIEN_ID: 3, DOKTER_ID: 1, TGL_APPOINTMENT: '2026-05-04', JAM_APPOINTMENT: '10:00', NOMOR_ANTRIAN: 2, KELUHAN_AWAL: 'Nyeri dada', STATUS: 'SELESAI', CATATAN: '' },
  { APPOINTMENT_ID: 4, PASIEN_ID: 4, DOKTER_ID: 3, TGL_APPOINTMENT: '2026-05-06', JAM_APPOINTMENT: '10:00', NOMOR_ANTRIAN: 1, KELUHAN_AWAL: 'Kontrol kehamilan', STATUS: 'MENUNGGU', CATATAN: '' },
  { APPOINTMENT_ID: 5, PASIEN_ID: 5, DOKTER_ID: 4, TGL_APPOINTMENT: '2026-05-03', JAM_APPOINTMENT: '11:00', NOMOR_ANTRIAN: 1, KELUHAN_AWAL: 'Nyeri dada sebelah kiri', STATUS: 'BATAL', CATATAN: 'Dibatalkan pasien' },
];

export const mockRekamMedis: RekamMedis[] = [
  { REKAM_ID: 1, APPOINTMENT_ID: 2, DOKTER_ID: 2, TGL_PERIKSA: '2026-05-05', KELUHAN: 'Batuk pilek, demam ringan', DIAGNOSIS: 'ISPA (Infeksi Saluran Pernapasan Akut)', TINDAKAN: 'Pemberian obat simptomatik', TEKANAN_DARAH: '110/70', BERAT_BADAN: 18, CATATAN_TAMBAHAN: 'Istirahat cukup, banyak minum air putih' },
  { REKAM_ID: 2, APPOINTMENT_ID: 3, DOKTER_ID: 1, TGL_PERIKSA: '2026-05-04', KELUHAN: 'Nyeri dada, sesak napas', DIAGNOSIS: 'Gastritis akut', TINDAKAN: 'Konseling diet, pemberian antasida', TEKANAN_DARAH: '130/85', BERAT_BADAN: 75, CATATAN_TAMBAHAN: 'Hindari makanan pedas dan asam' },
];

export const mockObat: Obat[] = [
  { OBAT_ID: 1, NAMA_OBAT: 'Paracetamol 500mg', KATEGORI: 'Analgesik', SATUAN: 'Tablet', STOK_TERSEDIA: 500, HARGA_SATUAN: 500, TGL_KADALUARSA: '2027-12-31', DESKRIPSI: 'Pereda nyeri dan penurun demam', STATUS_AKTIF: 'Y' },
  { OBAT_ID: 2, NAMA_OBAT: 'Amoxicillin 500mg', KATEGORI: 'Antibiotik', SATUAN: 'Kapsul', STOK_TERSEDIA: 300, HARGA_SATUAN: 1500, TGL_KADALUARSA: '2027-06-30', DESKRIPSI: 'Antibiotik spektrum luas', STATUS_AKTIF: 'Y' },
  { OBAT_ID: 3, NAMA_OBAT: 'OBH Combi', KATEGORI: 'Antihistamin', SATUAN: 'Botol', STOK_TERSEDIA: 15, HARGA_SATUAN: 18000, TGL_KADALUARSA: '2026-08-15', DESKRIPSI: 'Obat batuk kombinasi', STATUS_AKTIF: 'Y' },
  { OBAT_ID: 4, NAMA_OBAT: 'Omeprazole 20mg', KATEGORI: 'Antasida', SATUAN: 'Kapsul', STOK_TERSEDIA: 200, HARGA_SATUAN: 2000, TGL_KADALUARSA: '2028-03-20', DESKRIPSI: 'Penghambat pompa proton', STATUS_AKTIF: 'Y' },
  { OBAT_ID: 5, NAMA_OBAT: 'Vitamin C 1000mg', KATEGORI: 'Vitamin', SATUAN: 'Tablet', STOK_TERSEDIA: 8, HARGA_SATUAN: 800, TGL_KADALUARSA: '2026-06-10', DESKRIPSI: 'Suplemen vitamin C', STATUS_AKTIF: 'Y' },
  { OBAT_ID: 6, NAMA_OBAT: 'CTM 4mg', KATEGORI: 'Antihistamin', SATUAN: 'Tablet', STOK_TERSEDIA: 450, HARGA_SATUAN: 300, TGL_KADALUARSA: '2027-09-15', DESKRIPSI: 'Antihistamin untuk alergi', STATUS_AKTIF: 'Y' },
];

export const mockResep: Resep[] = [
  { RESEP_ID: 1, REKAM_ID: 1, OBAT_ID: 1, DOSIS: '500mg', ATURAN_PAKAI: '3x1 sesudah makan', JUMLAH: 10, CATATAN_RESEP: 'Habiskan obat' },
  { RESEP_ID: 2, REKAM_ID: 1, OBAT_ID: 3, DOSIS: '15ml', ATURAN_PAKAI: '3x1 sendok makan', JUMLAH: 1, CATATAN_RESEP: '' },
  { RESEP_ID: 3, REKAM_ID: 1, OBAT_ID: 6, DOSIS: '4mg', ATURAN_PAKAI: '3x1 sebelum tidur jika perlu', JUMLAH: 6, CATATAN_RESEP: '' },
  { RESEP_ID: 4, REKAM_ID: 2, OBAT_ID: 4, DOSIS: '20mg', ATURAN_PAKAI: '2x1 sebelum makan', JUMLAH: 14, CATATAN_RESEP: 'Minum 30 menit sebelum makan' },
  { RESEP_ID: 5, REKAM_ID: 2, OBAT_ID: 1, DOSIS: '500mg', ATURAN_PAKAI: '3x1 jika nyeri', JUMLAH: 10, CATATAN_RESEP: '' },
];

export const mockTagihan: Tagihan[] = [
  { TAGIHAN_ID: 1, PASIEN_ID: 2, APPOINTMENT_ID: 2, TGL_TAGIHAN: '2026-05-05', BIAYA_KONSULTASI: 175000, BIAYA_OBAT: 26100, TOTAL_BIAYA: 201100, METODE_BAYAR: 'Tunai', STATUS_BAYAR: 'LUNAS' },
  { TAGIHAN_ID: 2, PASIEN_ID: 3, APPOINTMENT_ID: 3, TGL_TAGIHAN: '2026-05-04', BIAYA_KONSULTASI: 150000, BIAYA_OBAT: 33000, TOTAL_BIAYA: 183000, METODE_BAYAR: 'Transfer', STATUS_BAYAR: 'BELUM' },
];

// User untuk login
export interface User {
  id: number;
  nama: string;
  email: string;
  password: string;
  role: string;
  spesialisasi?: string;
}

export const mockUsers: User[] = [
  { id: 1, nama: 'Admin Klinik', email: 'admin@klinik.com', password: 'admin123', role: 'Admin' },
  { id: 1, nama: 'dr. Maria Wijaya, Sp.PD', email: 'maria@klinik.com', password: 'dokter123', role: 'dokter', spesialisasi: 'Penyakit Dalam' },
  { id: 2, nama: 'dr. Benny Sutanto, Sp.A', email: 'benny@klinik.com', password: 'dokter123', role: 'dokter', spesialisasi: 'Anak' },
  { id: 1, nama: 'Budi Santoso', email: 'budi@email.com', password: 'pasien123', role: 'pasien' },
];
