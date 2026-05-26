import api from './api';

// Set to 'api' for backend API (Laravel)
const USE_SERVICE: 'api' = 'api';

export interface PasienUser {
  id: number;
  nama: string;
  nik: string;
  role: 'pasien';
}

export interface AppointmentPasien {
  appointment_id: number;
  pasien_id: number;
  dokter_id: number;
  tgl_appointment: string;
  jam_appointment: string;
  nomor_antrian: number;
  keluhan_awal: string;
  status: 'MENUNGGU' | 'DIKONFIRMASI' | 'HADIR' | 'SELESAI' | 'BATAL' | 'ABSEN';
  status_kehadiran?: 'BELUM_CHECKIN' | 'ON_TIME' | 'TERLAMBAT';
  batas_hadir?: string;
  waktu_checkin?: string;
  catatan: string;
  dokter?: {
    nama_dokter: string;
    spesialisasi: string;
    biaya_konsultasi: number;
  };
}

export interface DokterPublic {
  dokter_id: number;
  nama_dokter: string;
  spesialisasi: string;
  jadwal_praktik: string;
  biaya_konsultasi: number;
  status_aktif: string;
}

export interface SlotJam {
  sesi_id: number;
  sesi: 'PAGI' | 'SIANG' | 'SORE' | 'MALAM';
  jam: string;
  tersedia: boolean;
}

export interface RekamMedisPasien {
  rekam_id: number;
  tgl_periksa: string;
  keluhan: string;
  diagnosis: string;
  tindakan: string;
  tekanan_darah: string;
  berat_badan: number;
  catatan_tambahan: string;
  dokter?: {
    nama_dokter: string;
    spesialisasi: string;
  };
  resep?: Array<{
    nama_obat: string;
    dosis: string;
    aturan_pakai: string;
    jumlah: number;
    satuan: string;
  }>;
}

export interface TagihanPasien {
  tagihan_id: number;
  tgl_tagihan: string;
  biaya_konsultasi: number;
  biaya_obat: number;
  total_biaya: number;
  metode_bayar: string;
  status_bayar: 'BELUM_BAYAR' | 'SEBAGIAN' | 'LUNAS';
  keterangan?: string;
  details?: Array<{
    detail_id: number;
    keterangan: string;
    jumlah: number;
    harga_satuan: number;
    subtotal: number;
  }>;
  appointment?: {
    tgl_appointment: string;
    dokter?: {
      nama_dokter: string;
    };
  };
}

export interface ProfilPasien {
  pasien_id: number;
  NIK: string;
  nama_lengkap: string;
  tanggal_lahir: string;
  jenis_kelamin: 'L' | 'P';
  ALAMAT: string;
  no_telepon: string;
  EMAIL: string;
  golongan_darah: string;
  status_aktif: string;
}

export interface CreateAppointmentRequest {
  pasien_id: number;
  dokter_id: number;
  tgl_appointment: string;
  jam_appointment: string;
  sesi_id?: number;
  keluhan_awal: string;
}

export interface UpdateProfilPasienRequest {
  ALAMAT: string;
  no_telepon: string;
  EMAIL: string;
}

export interface ChangePasswordPasienRequest {
  passwordLama: string;
  passwordBaru: string;
  konfirmasiPassword: string;
}

export interface RegisterPasienRequest {
  NIK: string;
  NAMA_LENGKAP: string;
  TANGGAL_LAHIR: string;
  JENIS_KELAMIN: 'L' | 'P';
  GOLONGAN_DARAH: string;
  ALAMAT: string;
  NO_TELEPON: string;
  EMAIL: string;
  password: string;
}

// Beranda
export const getAppointmentTerdekat = async (pasienId: number): Promise<AppointmentPasien | null> => {
  const response = await api.get(`/pasien/${pasienId}/appointment/terdekat`);
  return response.data;
};

export const getDokterTersedia = async (): Promise<DokterPublic[]> => {
  const response = await api.get('/dokter', {
    params: { status: 'Y' },
  });
  return response.data;
};

// Appointment
export const getAppointmentPasien = async (
  pasienId: number,
  status?: string
): Promise<AppointmentPasien[]> => {
  const response = await api.get('/appointment', {
    params: {
      pasien_id: pasienId,
      status: status || '',
    },
  });
  return response.data;
};

export const createAppointment = async (
  data: CreateAppointmentRequest
): Promise<AppointmentPasien> => {
  const response = await api.post('/appointment', data);
  // Backend kadang membungkus payload sebagai { status, data }
  return response.data?.data ?? response.data;
};

export const cancelAppointment = async (appointmentId: number): Promise<void> => {
  await api.put(`/appointment/${appointmentId}`, {
    status: 'BATAL',
  });
};

export const getSlotJamTersedia = async (
  dokterId: number,
  tanggal: string
): Promise<SlotJam[]> => {
  const response = await api.get(`/dokter/${dokterId}/slot-jam`, {
    params: { tanggal },
  });
  return response.data;
};

// Rekam Medis
export const getRekamMedisPasien = async (
  pasienId: number
): Promise<RekamMedisPasien[]> => {
  const response = await api.get('/rekam-medis', {
    params: {
      pasien_id: pasienId,
    },
  });
  return response.data;
};

export const getRekamMedisDetail = async (
  rekamId: number
): Promise<RekamMedisPasien> => {
  const response = await api.get(`/rekam-medis/${rekamId}`);
  return response.data;
};

// Tagihan
export const getTagihanPasien = async (
  pasienId: number
): Promise<TagihanPasien[]> => {
  const response = await api.get('/tagihan', {
    params: {
      pasien_id: pasienId,
    },
  });
  return response.data;
};

export const getTagihanDetail = async (tagihanId: number): Promise<TagihanPasien> => {
  const response = await api.get(`/tagihan/${tagihanId}`);
  return response.data;
};

// Profil
export const getProfilPasien = async (pasienId: number): Promise<ProfilPasien> => {
  const response = await api.get(`/pasien/${pasienId}`);
  return response.data;
};

export const updateProfilPasien = async (
  pasienId: number,
  data: UpdateProfilPasienRequest
): Promise<ProfilPasien> => {
  const response = await api.put(`/pasien/${pasienId}`, data);
  return response.data;
};

export const changePasswordPasien = async (
  pasienId: number,
  data: ChangePasswordPasienRequest
): Promise<void> => {
  await api.post(`/pasien/${pasienId}/change-password`, data);
};

// Register
export const registerPasien = async (
  data: RegisterPasienRequest
): Promise<void> => {
  await api.post('/auth/register', data);
};

// Check-in pasien ke klinik
export const checkinAppointment = async (
  appointmentId: number
): Promise<{ status_kehadiran: string; nomor_antrian: number }> => {
  const response = await api.post(`/appointment/${appointmentId}/checkin`);
  return response.data;
};

// Antrian pasien
export interface AntrianPasien {
  antrian_id: number;
  nomor_antrian: number;
  tanggal: string;
  status: 'MENUNGGU' | 'DIPANGGIL' | 'SELESAI' | 'BATAL';
  jenis: 'WALKIN' | 'BOOKING';
  dokter?: { nama_dokter: string };
}

export const getAntrianPasien = async (
  pasienId: number,
  tanggal?: string
): Promise<AntrianPasien[]> => {
  const response = await api.get('/antrian', {
    params: {
      pasien_id: pasienId,
      tanggal: tanggal || new Date().toISOString().split('T')[0],
    },
  });
  return response.data?.data ?? response.data;
};

// Estimasi masuk ruangan berdasarkan progres antrian dokter
export interface EstimasiMasuk {
  dokter_id: number;
  tanggal: string;
  nomor_antrian: number;
  avg_durasi_menit: number;
  estimasi_masuk: string;
  jam_estimasi_masuk: string;
  estimasi_menunggu_menit: number;
}

export const getEstimasiMasukDokter = async (
  dokterId: number,
  tanggal: string,
  nomorAntrian: number
): Promise<EstimasiMasuk> => {
  const response = await api.get(`/dokter/${dokterId}/estimasi-masuk`, {
    params: {
      tanggal,
      nomor_antrian: nomorAntrian,
    },
  });
  return response.data?.data ?? response.data;
};