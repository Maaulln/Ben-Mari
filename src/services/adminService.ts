import api from './api';

// =========================
// PASIEN MANAGEMENT
// =========================
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

  const response = await api.post(
    '/pasien',
    mappedData
  );

  return response.data;
};

export const updatePasien = async (
  id: number,
  data: any
) => {
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

  const response = await api.put(
    `/pasien/${id}`,
    mappedData
  );

  return response.data;
};

export const deletePasien = async (
  id: number
) => {
  const response = await api.delete(
    `/pasien/${id}`
  );

  return response.data;
};

// =========================
// DOKTER MANAGEMENT
// =========================
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
    BIAYA_KONSULTASI:
      d.biaya_konsultasi,
    STATUS_AKTIF: d.status_aktif,
  }));
};

export const createDokter = async (
  data: any
) => {
  const mappedData = {
    nama_dokter: data.NAMA_DOKTER,
    spesialisasi:
      data.SPESIALISASI,
    no_sip: data.NO_SIP,
    no_telepon: data.NO_TELEPON,
    email: data.EMAIL,
    password: data.PASSWORD, // FIX LOGIN DOKTER
    jadwal_praktik:
      data.JADWAL_PRAKTIK,
    biaya_konsultasi:
      data.BIAYA_KONSULTASI,
    status_aktif:
      data.STATUS_AKTIF || 'Y',
  };

  const response = await api.post(
    '/dokter',
    mappedData
  );

  return response.data;
};

export const updateDokter = async (
  id: number,
  data: any
) => {
  const mappedData = {
    nama_dokter: data.NAMA_DOKTER,
    spesialisasi:
      data.SPESIALISASI,
    no_sip: data.NO_SIP,
    no_telepon: data.NO_TELEPON,
    email: data.EMAIL,
    jadwal_praktik:
      data.JADWAL_PRAKTIK,
    biaya_konsultasi:
      data.BIAYA_KONSULTASI,
    status_aktif:
      data.STATUS_AKTIF,
  };

  const response = await api.put(
    `/dokter/${id}`,
    mappedData
  );

  return response.data;
};

export const deleteDokter = async (
  id: number
) => {
  const response = await api.delete(
    `/dokter/${id}`
  );

  return response.data;
};

// =========================
// APPOINTMENT MANAGEMENT
// =========================
export const getAllAppointment =
  async () => {
    const response =
      await api.get('/appointment');

    return response.data.map(
      (a: any) => ({
        APPOINTMENT_ID:
          a.appointment_id,

        PASIEN_ID: a.pasien_id,

        DOKTER_ID: a.dokter_id,

        TGL_APPOINTMENT:
          a.tgl_appointment
            ? String(a.tgl_appointment).split('T')[0]
            : a.tgl_appointment,

        JAM_APPOINTMENT:
          a.jam_appointment,

        NOMOR_ANTRIAN:
          a.nomor_antrian,

        KELUHAN_AWAL:
          a.keluhan_awal,

        STATUS: a.status,

        CATATAN: a.catatan,

        pasien: a.pasien
          ? {
              NAMA_LENGKAP:
                a.pasien
                  .nama_lengkap,
            }
          : undefined,

        dokter: a.dokter
          ? {
              NAMA_DOKTER:
                a.dokter
                  .nama_dokter,
            }
          : undefined,
      })
    );
  };

export const createAppointmentAdmin =
  async (data: any) => {
    const mappedData = {
      pasien_id: data.PASIEN_ID,
      dokter_id: data.DOKTER_ID,
      tgl_appointment:
        data.TGL_APPOINTMENT,
      jam_appointment:
        data.JAM_APPOINTMENT,
      keluhan_awal:
        data.KELUHAN_AWAL,
      status:
        data.STATUS ||
        'MENUNGGU',
    };

    const response =
      await api.post(
        '/appointment',
        mappedData
      );

    return response.data;
  };

export const updateAppointmentStatus =
  async (
    id: number,
    status: string
  ) => {
    const response =
      await api.put(
        `/appointment/${id}`,
        { status }
      );

    return response.data;
  };

// =========================
// DASHBOARD
// =========================
export const getDashboardStats =
  async () => {
    const [
      apts,
      pasiens,
      obats,
      tagihans,
    ] = await Promise.all([
      getAllAppointment(),
      getAllPasien(),
      getAllObat(),
      api.get('/tagihan'),
    ]);

    const today = new Date()
      .toISOString()
      .split('T')[0];

    // Bar chart: appointment per hari untuk 7 hari terakhir
    const dayNames = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];
    const appointmentChartData = Array.from({ length: 7 }, (_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - (6 - i));
      const dateStr = d.toISOString().split('T')[0];
      return {
        hari: dayNames[d.getDay()],
        tanggal: dateStr,
        jumlah: apts.filter((a: any) => a.TGL_APPOINTMENT === dateStr).length,
      };
    });

    return {
      totalPasien: pasiens.length,

      appointmentHariIni: apts.filter(
        (a: any) => a.TGL_APPOINTMENT === today
      ).length,

      tagihanPending: tagihans.data.data.filter(
        (t: any) => t.status_bayar === 'BELUM_BAYAR'
      ).length,

      stokMenipis: obats.filter(
        (o: any) => o.STOK_TERSEDIA < 20
      ).length,

      recentAppointments: apts.slice(0, 5),

      appointmentChartData,

      statusDistribution: [
        {
          name: 'Menunggu',
          value: apts.filter((a: any) => a.STATUS === 'MENUNGGU').length,
          color: '#D97706',
        },
        {
          name: 'Selesai',
          value: apts.filter((a: any) => a.STATUS === 'SELESAI').length,
          color: '#059669',
        },
        {
          name: 'Batal',
          value: apts.filter((a: any) => a.STATUS === 'BATAL').length,
          color: '#DC2626',
        },
        {
          name: 'Hadir',
          value: apts.filter((a: any) => a.STATUS === 'HADIR').length,
          color: '#3B82F6',
        },
      ].filter(s => s.value > 0),
    };
  };

// =========================
// OBAT MANAGEMENT
// =========================
export const getAllObat =
  async () => {
    const response =
      await api.get('/obat');

    return response.data.map(
      (o: any) => ({
        OBAT_ID: o.obat_id,
        NAMA_OBAT: o.nama_obat,
        KATEGORI: o.kategori,
        SATUAN: o.satuan,
        STOK_TERSEDIA:
          o.stok_tersedia,
        HARGA_SATUAN:
          o.harga_satuan,
        TGL_KADALUARSA:
          o.tgl_kadaluarsa,
        DESKRIPSI:
          o.deskripsi,
        STATUS_AKTIF:
          o.status_aktif,
      })
    );
  };

export const createObat = async (
  data: any
) => {
  const mappedData = {
    nama_obat: data.NAMA_OBAT,
    kategori: data.KATEGORI,
    satuan: data.SATUAN,
    stok_tersedia:
      data.STOK_TERSEDIA,
    harga_satuan:
      data.HARGA_SATUAN,
    tgl_kadaluarsa:
      data.TGL_KADALUARSA,
    deskripsi:
      data.DESKRIPSI,
    status_aktif:
      data.STATUS_AKTIF || 'Y',
  };

  const response = await api.post(
    '/obat',
    mappedData
  );

  return response.data;
};

export const updateObat = async (
  id: number,
  data: any
) => {
  const mappedData = {
    nama_obat: data.NAMA_OBAT,
    kategori: data.KATEGORI,
    satuan: data.SATUAN,
    stok_tersedia:
      data.STOK_TERSEDIA,
    harga_satuan:
      data.HARGA_SATUAN,
    tgl_kadaluarsa:
      data.TGL_KADALUARSA,
    deskripsi:
      data.DESKRIPSI,
    status_aktif:
      data.STATUS_AKTIF,
  };

  const response = await api.put(
    `/obat/${id}`,
    mappedData
  );

  return response.data;
};

export const deleteObat = async (
  id: number
) => {
  const response = await api.delete(
    `/obat/${id}`
  );

  return response.data;
};

export const getAlertStokObat = async () => {
  const response = await api.get('/obat/alert-stok');
  return response.data;
};

export const stokMasukObat = async (id: number, jumlah: number, keterangan?: string) => {
  const response = await api.post(`/obat/${id}/stok-masuk`, { jumlah, keterangan });
  return response.data;
};

// =========================
// ANTRIAN MANAGEMENT
// =========================
export const getAntrianHariIni = async (dokterId?: number) => {
  const response = await api.get('/antrian', {
    params: { dokter_id: dokterId || '' },
  });
  return response.data;
};

export const createAntrianWalkin = async (data: {
  pasien_id: number;
  dokter_id: number;
  tanggal?: string;
}) => {
  const response = await api.post('/antrian', { ...data, jenis: 'WALKIN' });
  return response.data;
};

export const updateStatusAntrian = async (id: number, status: string) => {
  const response = await api.put(`/antrian/${id}/status`, { status });
  return response.data;
};

// =========================
// JADWAL DOKTER
// =========================
export const getJadwalDokterTemplate = async (dokterId?: number) => {
  const response = await api.get('/jadwal-dokter', {
    params: { dokter_id: dokterId || '' },
  });
  return response.data.data as any[];
};

export const createJadwalDokter = async (data: {
  dokter_id: number;
  hari: string;
  jam_mulai: string;
  jam_selesai: string;
  kuota?: number;
}) => {
  const response = await api.post('/jadwal-dokter', data);
  return response.data.data;
};

export const deleteJadwalDokter = async (id: number) => {
  const response = await api.delete(`/jadwal-dokter/${id}`);
  return response.data;
};

// =========================
// LAPORAN
// =========================
export const getLaporanKunjungan = async (params: {
  periode?: 'harian' | 'bulanan';
  tanggal?: string;
  bulan?: number;
  tahun?: number;
}) => {
  const response = await api.get('/laporan/kunjungan', { params });
  return response.data;
};

export const getLaporanPendapatan = async (params: {
  periode?: 'harian' | 'bulanan';
  tanggal?: string;
  bulan?: number;
  tahun?: number;
}) => {
  const response = await api.get('/laporan/pendapatan', { params });
  return response.data;
};

// =========================
// TAGIHAN DETAIL
// =========================
export const getTagihanDetail = async (tagihanId: number) => {
  const response = await api.get(`/tagihan/${tagihanId}`);
  return response.data;
};

export const updateStatusTagihan = async (
  id: number,
  data: { status_bayar: string; metode_bayar?: string; keterangan?: string }
) => {
  const response = await api.put(`/tagihan/${id}`, data);
  return response.data;
};

// =========================
// RESEP STATUS AMBIL
// =========================
export const updateStatusAmbilResep = async (
  resepId: number,
  statusAmbil: 'BELUM_DIAMBIL' | 'SUDAH_DIAMBIL' | 'BATAL'
) => {
  const response = await api.put(`/resep/${resepId}`, { status_ambil: statusAmbil });
  return response.data;
};

export const getResepBelumDiambil = async () => {
  const response = await api.get('/resep', {
    params: { status_ambil: 'BELUM_DIAMBIL' },
  });
  return response.data;
};

// =========================
// PENGATURAN KLINIK
// =========================
export const getPengaturan = async () => {
  const response = await api.get('/pengaturan');
  return response.data;
};

export const updatePengaturan = async (data: {
  nama_klinik: string;
  alamat: string;
  no_telepon: string;
  email: string;
  jam_operasional: string;
  deskripsi?: string;
}) => {
  const response = await api.put('/pengaturan', data);
  return response.data;
};