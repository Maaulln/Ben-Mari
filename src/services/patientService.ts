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
  APPOINTMENT_ID: number;
  PASIEN_ID: number;
  DOKTER_ID: number;
  TGL_APPOINTMENT: string;
  JAM_APPOINTMENT: string;
  NOMOR_ANTRIAN: number;
  KELUHAN_AWAL: string;
  STATUS: 'MENUNGGU' | 'SELESAI' | 'BATAL';
  CATATAN: string;
  dokter?: {
    NAMA_DOKTER: string;
    SPESIALISASI: string;
    BIAYA_KONSULTASI: number;
  };
}

export interface DokterPublic {
  DOKTER_ID: number;
  NAMA_DOKTER: string;
  SPESIALISASI: string;
  JADWAL_PRAKTIK: string;
  BIAYA_KONSULTASI: number;
  STATUS_AKTIF: string;
}

export interface SlotJam {
  jam: string;
  tersedia: boolean;
}

export interface RekamMedisPasien {
  REKAM_ID: number;
  TGL_PERIKSA: string;
  KELUHAN: string;
  DIAGNOSIS: string;
  TINDAKAN: string;
  TEKANAN_DARAH: string;
  BERAT_BADAN: number;
  CATATAN_TAMBAHAN: string;
  dokter?: {
    NAMA_DOKTER: string;
    SPESIALISASI: string;
  };
  resep?: Array<{
    NAMA_OBAT: string;
    DOSIS: string;
    ATURAN_PAKAI: string;
    JUMLAH: number;
    SATUAN: string;
  }>;
}

export interface TagihanPasien {
  TAGIHAN_ID: number;
  TGL_TAGIHAN: string;
  BIAYA_KONSULTASI: number;
  BIAYA_OBAT: number;
  TOTAL_BIAYA: number;
  METODE_BAYAR: string;
  STATUS_BAYAR: 'BELUM' | 'LUNAS' | 'CICIL';
  appointment?: {
    TGL_APPOINTMENT: string;
    dokter?: {
      NAMA_DOKTER: string;
    };
  };
}

export interface ProfilPasien {
  PASIEN_ID: number;
  NIK: string;
  NAMA_LENGKAP: string;
  TANGGAL_LAHIR: string;
  JENIS_KELAMIN: 'L' | 'P';
  ALAMAT: string;
  NO_TELEPON: string;
  EMAIL: string;
  GOLONGAN_DARAH: string;
  STATUS_AKTIF: string;
}

export interface CreateAppointmentRequest {
  pasien_id: number;
  dokter_id: number;
  tgl_appointment: string;
  jam_appointment: string;
  keluhan_awal: string;
}

export interface UpdateProfilPasienRequest {
  ALAMAT: string;
  NO_TELEPON: string;
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
  konfirmasiPassword: string;
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
  return response.data;
};

export const cancelAppointment = async (appointmentId: number): Promise<void> => {
  await api.put(`/appointment/${appointmentId}`, {
    STATUS: 'BATAL',
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
