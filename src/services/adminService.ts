import api from './api';

// Pasien Management
export const getAllPasien = async () => {
  const response = await api.get('/pasien');
  return response.data.map((p: any) => ({
    PASIEN_ID: p.pasien_id,
    NIK: p.nik,
    NAMA_LENGKAP: p.nama_lengkap,
    TANGGAL_LAHIR: p.tanggal_lahir,
    JENIS_KELAMIN: p.jenis_kelamin,
    ALAMAT: p.alamat,
    NO_TELEPON: p.no_telepon,
    EMAIL: p.email,
    GOLONGAN_DARAH: p.golongan_darah,
    STATUS_AKTIF: p.status_aktif,
  }));
};

export const createPasien = async (data: any) => {
  // Map frontend (UPPERCASE) to backend (lowercase)
  const mappedData = {
    nik: data.NIK,
    nama_lengkap: data.NAMA_LENGKAP,
    tanggal_lahir: data.TANGGAL_LAHIR,
    jenis_kelamin: data.JENIS_KELAMIN,
    alamat: data.ALAMAT,
    no_telepon: data.NO_TELEPON,
    email: data.EMAIL,
    golongan_darah: data.GOLONGAN_DARAH,
    status_aktif: data.STATUS_AKTIF || 'Y',
  };
  const response = await api.post('/pasien', mappedData);
  return response.data;
};

export const updatePasien = async (id: number, data: any) => {
  const mappedData = {
    nik: data.NIK,
    nama_lengkap: data.NAMA_LENGKAP,
    tanggal_lahir: data.TANGGAL_LAHIR,
    jenis_kelamin: data.JENIS_KELAMIN,
    alamat: data.ALAMAT,
    no_telepon: data.NO_TELEPON,
    email: data.EMAIL,
    golongan_darah: data.GOLONGAN_DARAH,
    status_aktif: data.STATUS_AKTIF,
  };
  const response = await api.put(`/pasien/${id}`, mappedData);
  return response.data;
};

export const deletePasien = async (id: number) => {
  const response = await api.delete(`/pasien/${id}`);
  return response.data;
};

// Dokter Management
export const getAllDokter = async () => {
  const response = await api.get('/dokter');
  return response.data.map((d: any) => ({
    DOKTER_ID: d.dokter_id,
    NAMA_DOKTER: d.nama_dokter,
    SPESIALISASI: d.spesialisasi,
    NO_SIP: d.no_sip,
    NO_TELEPON: d.no_telepon,
    EMAIL: d.email,
    JADWAL_PRAKTIK: d.jadwal_praktik,
    BIAYA_KONSULTASI: d.biaya_konsultasi,
    STATUS_AKTIF: d.status_aktif,
  }));
};

export const createDokter = async (data: any) => {
  const mappedData = {
    nama_dokter: data.NAMA_DOKTER,
    spesialisasi: data.SPESIALISASI,
    no_sip: data.NO_SIP,
    no_telepon: data.NO_TELEPON,
    email: data.EMAIL,
    jadwal_praktik: data.JADWAL_PRAKTIK,
    biaya_konsultasi: data.BIAYA_KONSULTASI,
    status_aktif: data.STATUS_AKTIF || 'Y',
  };
  const response = await api.post('/dokter', mappedData);
  return response.data;
};

export const updateDokter = async (id: number, data: any) => {
  const mappedData = {
    nama_dokter: data.NAMA_DOKTER,
    spesialisasi: data.SPESIALISASI,
    no_sip: data.NO_SIP,
    no_telepon: data.NO_TELEPON,
    email: data.EMAIL,
    jadwal_praktik: data.JADWAL_PRAKTIK,
    biaya_konsultasi: data.BIAYA_KONSULTASI,
    status_aktif: data.STATUS_AKTIF,
  };
  const response = await api.put(`/dokter/${id}`, mappedData);
  return response.data;
};

export const deleteDokter = async (id: number) => {
  const response = await api.delete(`/dokter/${id}`);
  return response.data;
};

// Appointment Management
export const getAllAppointment = async () => {
  const response = await api.get('/appointment');
  return response.data.map((a: any) => ({
    APPOINTMENT_ID: a.appointment_id,
    PASIEN_ID: a.pasien_id,
    DOKTER_ID: a.dokter_id,
    TGL_APPOINTMENT: a.tgl_appointment,
    JAM_APPOINTMENT: a.jam_appointment,
    NOMOR_ANTRIAN: a.nomor_antrian,
    KELUHAN_AWAL: a.keluhan_awal,
    STATUS: a.status,
    CATATAN: a.catatan,
    pasien: a.pasien ? {
      NAMA_LENGKAP: a.pasien.nama_lengkap,
    } : undefined,
    dokter: a.dokter ? {
      NAMA_DOKTER: a.dokter.nama_dokter,
    } : undefined,
  }));
};

export const createAppointmentAdmin = async (data: any) => {
  const mappedData = {
    pasien_id: data.PASIEN_ID,
    dokter_id: data.DOKTER_ID,
    tgl_appointment: data.TGL_APPOINTMENT,
    jam_appointment: data.JAM_APPOINTMENT,
    keluhan_awal: data.KELUHAN_AWAL,
    status: data.STATUS || 'MENUNGGU',
  };
  const response = await api.post('/appointment', mappedData);
  return response.data;
};

export const updateAppointmentStatus = async (id: number, status: string) => {
  const response = await api.put(`/appointment/${id}`, { status });
  return response.data;
};

// Obat Management
export const getDashboardStats = async () => {
  const [apts, pasiens, obats, tagihans] = await Promise.all([
    getAllAppointment(),
    getAllPasien(),
    getAllObat(),
    api.get('/tagihan'), // Assuming tagihan exists
  ]);

  const today = new Date().toISOString().split('T')[0];
  
  return {
    totalPasien: pasiens.length,
    appointmentHariIni: apts.filter((a: any) => a.TGL_APPOINTMENT === today).length,
    tagihanPending: tagihans.data.filter((t: any) => t.status_bayar === 'BELUM').length,
    stokMenipis: obats.filter((o: any) => o.STOK_TERSEDIA < 20).length,
    recentAppointments: apts.slice(0, 5),
    statusDistribution: [
      { name: 'Menunggu', value: apts.filter((a: any) => a.STATUS === 'MENUNGGU').length, color: '#D97706' },
      { name: 'Selesai', value: apts.filter((a: any) => a.STATUS === 'SELESAI').length, color: '#059669' },
      { name: 'Batal', value: apts.filter((a: any) => a.STATUS === 'BATAL').length, color: '#DC2626' },
    ]
  };
};

export const getAllObat = async () => {
  const response = await api.get('/obat');
  return response.data.map((o: any) => ({
    OBAT_ID: o.obat_id,
    NAMA_OBAT: o.nama_obat,
    KATEGORI: o.kategori,
    SATUAN: o.satuan,
    STOK_TERSEDIA: o.stok_tersedia,
    HARGA_SATUAN: o.harga_satuan,
    TGL_KADALUARSA: o.tgl_kadaluarsa,
    DESKRIPSI: o.deskripsi,
    STATUS_AKTIF: o.status_aktif,
  }));
};

export const createObat = async (data: any) => {
  const mappedData = {
    nama_obat: data.NAMA_OBAT,
    kategori: data.KATEGORI,
    satuan: data.SATUAN,
    stok_tersedia: data.STOK_TERSEDIA,
    harga_satuan: data.HARGA_SATUAN,
    tgl_kadaluarsa: data.TGL_KADALUARSA,
    deskripsi: data.DESKRIPSI,
    status_aktif: data.STATUS_AKTIF || 'Y',
  };
  const response = await api.post('/obat', mappedData);
  return response.data;
};

export const updateObat = async (id: number, data: any) => {
  const mappedData = {
    nama_obat: data.NAMA_OBAT,
    kategori: data.KATEGORI,
    satuan: data.SATUAN,
    stok_tersedia: data.STOK_TERSEDIA,
    harga_satuan: data.HARGA_SATUAN,
    tgl_kadaluarsa: data.TGL_KADALUARSA,
    deskripsi: data.DESKRIPSI,
    status_aktif: data.STATUS_AKTIF,
  };
  const response = await api.put(`/obat/${id}`, mappedData);
  return response.data;
};

export const deleteObat = async (id: number) => {
  const response = await api.delete(`/obat/${id}`);
  return response.data;
};
