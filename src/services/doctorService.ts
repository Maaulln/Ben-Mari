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
  appointment_id: number;
  pasien_id: number;
  dokter_id: number;

  tgl_appointment: string;
  jam_appointment: string;

  nomor_antrian: number;

  keluhan_awal: string;

  status:
    | 'MENUNGGU'
    | 'SELESAI'
    | 'BATAL';

  catatan: string;

  pasien?: {
    nama_lengkap: string;
    tanggal_lahir: string;
    golongan_darah: string;
  };
}

export interface PasienDokter {
  pasien_id: number;

  nik: string;
  nama_lengkap: string;

  tanggal_lahir: string;

  jenis_kelamin:
    | 'L'
    | 'P';

  alamat: string;
  no_telepon: string;
  email: string;

  golongan_darah: string;

  jumlahKunjungan: number;
}

// =========================
// FIX INTERFACE LOWERCASE
// =========================
export interface RekamMedisDokter {
  rekam_id: number;

  appointment_id: number;
  dokter_id: number;

  tgl_periksa: string;

  keluhan: string;
  diagnosis: string;
  tindakan: string;

  tekanan_darah: string;
  berat_badan: number;

  catatan_tambahan: string;

  appointment?: {
    pasien?: {
      nama_lengkap: string;
    };
  };

  resep?: any[];
}

export interface CreateRekamMedisRequest {
  appointment_id: number;

  dokter_id?: number;

  tgl_periksa?: string;

  keluhan: string;
  diagnosis: string;
  tindakan: string;

  tekanan_darah: string;
  berat_badan: number;

  catatan_tambahan: string;
}

// =========================
// FIX CREATE RESEP
// =========================
export interface CreateResepRequest {
  rekam_id: number;
  obat_id: number;
  dosis: string;
  aturan_pakai: string;
  jumlah: number;
  catatan_resep: string;
}

export interface ProfilDokter {
  dokter_id: number;

  nama_dokter: string;

  spesialisasi: string;

  no_sip: string;

  no_telepon: string;

  email: string;

  jadwal_praktik: string;

  biaya_konsultasi: number;

  status_aktif: string;
}

export interface UpdateProfilRequest {
  no_telepon: string;

  email: string;

  jadwal_praktik: string;

  biaya_konsultasi: number;
}

export interface ChangePasswordRequest {
  passwordLama: string;

  passwordBaru: string;

  konfirmasiPassword: string;
}

// =========================
// DASHBOARD
// =========================
export const getDashboardStats = async (
  dokterId: number
): Promise<DashboardStats> => {
  const response = await api.get(
    `/dokter/${dokterId}/dashboard/stats`
  );

  return response.data;
};

export const getJadwalHariIni = async (
  dokterId: number
): Promise<AppointmentDokter[]> => {
  const today = new Date()
    .toISOString()
    .split('T')[0];

  const response = await api.get(
    `/appointment`,
    {
      params: {
        dokter_id: dokterId,
        tanggal: today,
      },
    }
  );

  return response.data;
};

// =========================
// JADWAL
// =========================
export const getJadwalDokter = async (
  dokterId: number,
  tanggal?: string,
  status?: string
): Promise<AppointmentDokter[]> => {
  const response = await api.get(
    `/appointment`,
    {
      params: {
        dokter_id: dokterId,
        tanggal: tanggal || '',
        status: status || '',
      },
    }
  );

  return response.data;
};

// =========================
// PASIEN
// =========================
export const getPasienDokter = async (
  dokterId: number
): Promise<PasienDokter[]> => {
  const response = await api.get(
    `/dokter/${dokterId}/pasien`
  );

  return response.data;
};

export const getRiwayatPasien = async (
  dokterId: number,
  pasienId: number
): Promise<AppointmentDokter[]> => {
  const response = await api.get(
    `/dokter/${dokterId}/pasien/${pasienId}/riwayat`
  );

  return response.data;
};

// =========================
// REKAM MEDIS
// =========================
export const getRekamMedisDokter = async (
  dokterId: number
): Promise<RekamMedisDokter[]> => {
  const response = await api.get(
    `/rekam-medis`,
    {
      params: {
        dokter_id: dokterId,
      },
    }
  );

  return response.data;
};

export const getRekamMedisDetail = async (
  rekamId: number
): Promise<RekamMedisDokter> => {
  const response = await api.get(
    `/rekam-medis/${rekamId}`
  );

  return response.data;
};

export const createRekamMedis = async (
  data: CreateRekamMedisRequest
): Promise<RekamMedisDokter> => {
  const payload = {
    appointment_id:
      data.appointment_id,

    dokter_id:
      data.dokter_id,

    tgl_periksa:
      data.tgl_periksa ||
      new Date()
        .toISOString()
        .split('T')[0],

    keluhan:
      data.keluhan,

    diagnosis:
      data.diagnosis,

    tindakan:
      data.tindakan,

    tekanan_darah:
      data.tekanan_darah,

    berat_badan:
      data.berat_badan,

    catatan_tambahan:
      data.catatan_tambahan,
  };

  const response = await api.post(
    `/rekam-medis`,
    payload
  );

  return response.data;
};

// =========================
// FIX CREATE RESEP LOWERCASE
// =========================
export const createResep = async (
  data: CreateResepRequest
): Promise<any> => {
  const payload = {
    rekam_id:
      data.rekam_id,

    obat_id:
      data.obat_id,

    dosis:
      data.dosis,

    aturan_pakai:
      data.aturan_pakai,

    jumlah:
      data.jumlah,

    catatan_resep:
      data.catatan_resep,
  };

  const response = await api.post(
    `/resep`,
    payload
  );

  return response.data;
};

export const getAppointmentMenunggu = async (
  dokterId: number
): Promise<AppointmentDokter[]> => {
  const response = await api.get(
    `/appointment`,
    {
      params: {
        dokter_id: dokterId,
        status: 'MENUNGGU',
      },
    }
  );

  return response.data;
};

export const getObatList = async (): Promise<any[]> => {
  const response = await api.get(
    `/obat`
  );

  return response.data;
};

// =========================
// PROFIL
// =========================
export const getProfilDokter = async (
  dokterId: number
): Promise<ProfilDokter> => {
  const response = await api.get(
    `/dokter/${dokterId}`
  );

  return response.data;
};

export const updateProfilDokter = async (
  dokterId: number,
  data: UpdateProfilRequest
): Promise<ProfilDokter> => {
  const response = await api.put(
    `/dokter/${dokterId}`,
    data
  );

  return response.data;
};

export const changePassword = async (
  dokterId: number,
  data: ChangePasswordRequest
): Promise<any> => {
  const response = await api.post(
    `/dokter/${dokterId}/change-password`,
    data
  );

  return response.data;
};

// =========================
// VITAL SIGNS
// =========================
export interface VitalSignsData {
  vs_id?: number;
  appointment_id: number;
  tekanan_darah?: string;
  suhu_tubuh?: number;
  berat_badan?: number;
  tinggi_badan?: number;
  saturasi_oksigen?: number;
  catatan_perawat?: string;
}

export const getVitalSigns = async (
  appointmentId: number
): Promise<VitalSignsData | null> => {
  const response = await api.get(`/vital-signs/${appointmentId}`);
  return response.data?.data ?? null;
};

export const saveVitalSigns = async (
  data: VitalSignsData
): Promise<VitalSignsData> => {
  const response = await api.post('/vital-signs', data);
  return response.data?.data ?? response.data;
};

export const updateVitalSigns = async (
  vsId: number,
  data: Partial<VitalSignsData>
): Promise<VitalSignsData> => {
  const response = await api.put(`/vital-signs/${vsId}`, data);
  return response.data?.data ?? response.data;
};

// =========================
// ANTRIAN DOKTER
// =========================
export interface AntrianItem {
  antrian_id: number;
  pasien_id: number;
  dokter_id: number;
  appointment_id?: number;
  nomor_antrian: number;
  tanggal: string;
  status: 'MENUNGGU' | 'DIPANGGIL' | 'SELESAI' | 'BATAL';
  jenis: 'WALKIN' | 'BOOKING';
  pasien?: { nama_lengkap: string };
}

export const getAntrianDokter = async (
  dokterId: number,
  tanggal?: string
): Promise<AntrianItem[]> => {
  const response = await api.get('/antrian', {
    params: {
      dokter_id: dokterId,
      tanggal: tanggal || new Date().toISOString().split('T')[0],
    },
  });
  return response.data?.data ?? response.data;
};

export const panggilAntrian = async (antrianId: number): Promise<AntrianItem> => {
  const response = await api.put(`/antrian/${antrianId}/status`, {
    status: 'DIPANGGIL',
  });
  return response.data?.data ?? response.data;
};

export const selesaikanAntrian = async (antrianId: number): Promise<AntrianItem> => {
  const response = await api.put(`/antrian/${antrianId}/status`, {
    status: 'SELESAI',
  });
  return response.data?.data ?? response.data;
};

// =========================
// JADWAL MINGGUAN DOKTER
// =========================
export const getJadwalMingguan = async (
  dokterId: number
): Promise<any[]> => {
  const response = await api.get(`/dokter/${dokterId}/jadwal`);
  return response.data?.data ?? response.data;
};