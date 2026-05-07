import api from './api';

export interface DokterUser {
  id: number;
  nama: string;
  spesialisasi: string;
  role: 'dokter';
}

export interface DashboardStats {
  appointmentHariIni: number;
  pasienBulanIni: number;
  rekamMedisDibuat: number;
  appointmentMenunggu: number;
}

export interface AppointmentDokter {
  APPOINTMENT_ID: number;
  PASIEN_ID: number;
  DOKTER_ID: number;
  TGL_APPOINTMENT: string;
  JAM_APPOINTMENT: string;
  NOMOR_ANTRIAN: number;
  KELUHAN_AWAL: string;
  STATUS: 'MENUNGGU' | 'SELESAI' | 'BATAL';
  CATATAN: string;
  pasien?: {
    NAMA_LENGKAP: string;
    TANGGAL_LAHIR: string;
    GOLONGAN_DARAH: string;
  };
}

export interface PasienDokter {
  PASIEN_ID: number;
  NIK: string;
  NAMA_LENGKAP: string;
  TANGGAL_LAHIR: string;
  JENIS_KELAMIN: 'L' | 'P';
  ALAMAT: string;
  NO_TELEPON: string;
  EMAIL: string;
  GOLONGAN_DARAH: string;
  jumlahKunjungan: number;
}

export interface RekamMedisDokter {
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
  pasien?: {
    NAMA_LENGKAP: string;
  };
  resep?: any[];
}

export interface CreateRekamMedisRequest {
  APPOINTMENT_ID: number;
  KELUHAN: string;
  DIAGNOSIS: string;
  TINDAKAN: string;
  TEKANAN_DARAH: string;
  BERAT_BADAN: number;
  CATATAN_TAMBAHAN: string;
}

export interface CreateResepRequest {
  REKAM_ID: number;
  OBAT_ID: number;
  DOSIS: string;
  ATURAN_PAKAI: string;
  JUMLAH: number;
  CATATAN_RESEP: string;
}

export interface ProfilDokter {
  DOKTER_ID: number;
  NAMA_DOKTER: string;
  SPESIALISASI: string;
  NO_SIP: string;
  NO_TELEPON: string;
  EMAIL: string;
  JADWAL_PRAKTIK: string;
  BIAYA_KONSULTASI: number;
  STATUS_AKTIF: string;
}

export interface UpdateProfilRequest {
  NO_TELEPON: string;
  EMAIL: string;
  JADWAL_PRAKTIK: string;
  BIAYA_KONSULTASI: number;
}

export interface ChangePasswordRequest {
  passwordLama: string;
  passwordBaru: string;
  konfirmasiPassword: string;
}

// Dashboard
export const getDashboardStats = async (dokterId: number): Promise<DashboardStats> => {
  const response = await api.get(`/dokter/${dokterId}/dashboard/stats`);
  return response.data;
};

export const getJadwalHariIni = async (dokterId: number): Promise<AppointmentDokter[]> => {
  const today = new Date().toISOString().split('T')[0];
  const response = await api.get(`/appointment`, {
    params: {
      dokter_id: dokterId,
      tanggal: today,
    },
  });
  return response.data;
};

// Jadwal
export const getJadwalDokter = async (
  dokterId: number,
  tanggal?: string,
  status?: string
): Promise<AppointmentDokter[]> => {
  const response = await api.get(`/appointment`, {
    params: {
      dokter_id: dokterId,
      tanggal: tanggal || '',
      status: status || '',
    },
  });
  return response.data;
};

// Pasien
export const getPasienDokter = async (dokterId: number): Promise<PasienDokter[]> => {
  const response = await api.get(`/dokter/${dokterId}/pasien`);
  return response.data;
};

export const getRiwayatPasien = async (
  dokterId: number,
  pasienId: number
): Promise<AppointmentDokter[]> => {
  const response = await api.get(`/dokter/${dokterId}/pasien/${pasienId}/riwayat`);
  return response.data;
};

// Rekam Medis
export const getRekamMedisDokter = async (dokterId: number): Promise<RekamMedisDokter[]> => {
  const response = await api.get(`/rekam-medis`, {
    params: {
      dokter_id: dokterId,
    },
  });
  return response.data;
};

export const getRekamMedisDetail = async (rekamId: number): Promise<RekamMedisDokter> => {
  const response = await api.get(`/rekam-medis/${rekamId}`);
  return response.data;
};

export const createRekamMedis = async (
  data: CreateRekamMedisRequest
): Promise<RekamMedisDokter> => {
  const response = await api.post(`/rekam-medis`, data);
  return response.data;
};

export const createResep = async (data: CreateResepRequest): Promise<any> => {
  const response = await api.post(`/resep`, data);
  return response.data;
};

export const getAppointmentMenunggu = async (dokterId: number): Promise<AppointmentDokter[]> => {
  const response = await api.get(`/appointment`, {
    params: {
      dokter_id: dokterId,
      status: 'MENUNGGU',
    },
  });
  return response.data;
};

export const getObatList = async (): Promise<any[]> => {
  const response = await api.get(`/obat`);
  return response.data;
};

// Profil
export const getProfilDokter = async (dokterId: number): Promise<ProfilDokter> => {
  const response = await api.get(`/dokter/${dokterId}`);
  return response.data;
};

export const updateProfilDokter = async (
  dokterId: number,
  data: UpdateProfilRequest
): Promise<ProfilDokter> => {
  const response = await api.put(`/dokter/${dokterId}`, data);
  return response.data;
};

export const changePassword = async (
  dokterId: number,
  data: ChangePasswordRequest
): Promise<any> => {
  const response = await api.post(`/dokter/${dokterId}/change-password`, data);
  return response.data;
};
