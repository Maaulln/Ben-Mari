import { useState, useEffect } from 'react';
import { Modal } from '../components/Modal';
import { Badge } from '../components/Badge';
import { Plus, Edit2, Calendar, Trash2, Clock } from 'lucide-react';
import { Dokter as DokterType } from '../../data/mockData';
import { formatRupiah } from '../../utils/formatters';
import {
  validateSIP,
  validatePhone,
  validateEmail,
} from '../../utils/validators';

import * as adminService from '../../services/adminService';
import { toast } from 'sonner';

const HARI_OPTIONS = ['SENIN', 'SELASA', 'RABU', 'KAMIS', 'JUMAT', 'SABTU', 'MINGGU'];

const HARI_LABEL: Record<string, string> = {
  SENIN: 'Senin', SELASA: 'Selasa', RABU: 'Rabu',
  KAMIS: 'Kamis', JUMAT: 'Jumat', SABTU: 'Sabtu', MINGGU: 'Minggu',
};

export function Dokter() {
  const [dokterList, setDokterList] =
    useState<DokterType[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [
    filterSpesialisasi,
    setFilterSpesialisasi,
  ] = useState('');

  const [isModalOpen, setIsModalOpen] =
    useState(false);

  const [editingDokter, setEditingDokter] =
    useState<DokterType | null>(null);

  useEffect(() => {
    fetchDokter();
  }, []);

  const fetchDokter = async () => {
    try {
      setLoading(true);

      const data =
        await adminService.getAllDokter();

      setDokterList(data);
    } catch (error) {
      console.error(
        'Error fetching dokter:',
        error
      );

      toast.error(
        'Gagal mengambil data dokter'
      );
    } finally {
      setLoading(false);
    }
  };

  const [formData, setFormData] =
    useState<any>({
      NAMA_DOKTER: '',
      SPESIALISASI: '',
      NO_SIP: '',
      NO_TELEPON: '',
      EMAIL: '',
      PASSWORD: '',
      JADWAL_PRAKTIK: '',
      BIAYA_KONSULTASI: 0,
      STATUS_AKTIF: 'Y',
    });

  const [formErrors, setFormErrors] =
    useState<Record<string, string>>({});

  // ── Jadwal modal state ──
  const [isJadwalModalOpen, setIsJadwalModalOpen] = useState(false);
  const [jadwalDokter, setJadwalDokter] = useState<DokterType | null>(null);
  const [jadwalList, setJadwalList] = useState<any[]>([]);
  const [jadwalLoading, setJadwalLoading] = useState(false);
  const [jadwalForm, setJadwalForm] = useState({
    hari: 'SENIN',
    jam_mulai: '08:00',
    jam_selesai: '16:00',
    kuota: 20,
  });
  const [jadwalFormError, setJadwalFormError] = useState('');

  const fetchJadwal = async (dokterId: number) => {
    try {
      setJadwalLoading(true);
      const data = await adminService.getJadwalDokterTemplate(dokterId);
      setJadwalList(data);
    } catch {
      toast.error('Gagal memuat jadwal dokter');
    } finally {
      setJadwalLoading(false);
    }
  };

  const handleOpenJadwalModal = (dokter: DokterType) => {
    setJadwalDokter(dokter);
    setJadwalList([]);
    setJadwalForm({ hari: 'SENIN', jam_mulai: '08:00', jam_selesai: '16:00', kuota: 20 });
    setJadwalFormError('');
    setIsJadwalModalOpen(true);
    fetchJadwal(dokter.DOKTER_ID);
  };

  const handleAddJadwal = async () => {
    if (!jadwalDokter) return;
    if (jadwalForm.jam_mulai >= jadwalForm.jam_selesai) {
      setJadwalFormError('Jam selesai harus lebih dari jam mulai');
      return;
    }
    setJadwalFormError('');
    try {
      await adminService.createJadwalDokter({
        dokter_id: jadwalDokter.DOKTER_ID,
        hari: jadwalForm.hari,
        jam_mulai: jadwalForm.jam_mulai,
        jam_selesai: jadwalForm.jam_selesai,
        kuota: jadwalForm.kuota,
      });
      toast.success('Jadwal berhasil ditambahkan');
      fetchJadwal(jadwalDokter.DOKTER_ID);
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Gagal menambahkan jadwal');
    }
  };

  const handleDeleteJadwal = async (jadwalId: number) => {
    if (!jadwalDokter) return;
    try {
      await adminService.deleteJadwalDokter(jadwalId);
      toast.success('Jadwal berhasil dihapus');
      fetchJadwal(jadwalDokter.DOKTER_ID);
    } catch {
      toast.error('Gagal menghapus jadwal');
    }
  };

  // Filter dokter by spesialisasi
  const filteredDokter =
    filterSpesialisasi
      ? dokterList.filter(
          (d) =>
            d.SPESIALISASI ===
            filterSpesialisasi
        )
      : dokterList;

  // Get unique spesialisasi
  const spesialisasiList = Array.from(
    new Set(
      dokterList.map(
        (d) => d.SPESIALISASI
      )
    )
  );

  const validateForm = (): boolean => {
    const errors: Record<
      string,
      string
    > = {};

    if (
      !formData.NAMA_DOKTER ||
      formData.NAMA_DOKTER.length < 3
    ) {
      errors.NAMA_DOKTER =
        'Nama dokter minimal 3 karakter';
    }

    if (!formData.SPESIALISASI) {
      errors.SPESIALISASI =
        'Spesialisasi harus diisi';
    }

    if (
      !formData.NO_SIP ||
      !validateSIP(formData.NO_SIP)
    ) {
      errors.NO_SIP =
        'No. SIP tidak valid';
    }

    if (
      !formData.NO_TELEPON ||
      !validatePhone(
        formData.NO_TELEPON
      )
    ) {
      errors.NO_TELEPON =
        'No. telepon tidak valid';
    }

    if (
      !formData.EMAIL ||
      !validateEmail(formData.EMAIL)
    ) {
      errors.EMAIL =
        'Format email tidak valid';
    }

    if (
      !editingDokter &&
      (!formData.PASSWORD ||
        formData.PASSWORD.length < 8)
    ) {
      errors.PASSWORD =
        'Password minimal 8 karakter';
    }

    if (!formData.JADWAL_PRAKTIK) {
      errors.JADWAL_PRAKTIK =
        'Jadwal praktik harus diisi';
    }

    if (
      !formData.BIAYA_KONSULTASI ||
      formData.BIAYA_KONSULTASI <= 0
    ) {
      errors.BIAYA_KONSULTASI =
        'Biaya konsultasi harus lebih dari 0';
    }

    setFormErrors(errors);

    return (
      Object.keys(errors).length === 0
    );
  };

  const handleOpenModal = (
    dokter?: DokterType
  ) => {
    if (dokter) {
      setEditingDokter(dokter);

      setFormData({
        ...dokter,
        PASSWORD: '',
      });
    } else {
      setEditingDokter(null);

      setFormData({
        NAMA_DOKTER: '',
        SPESIALISASI: '',
        NO_SIP: '',
        NO_TELEPON: '',
        EMAIL: '',
        PASSWORD: '',
        JADWAL_PRAKTIK: '',
        BIAYA_KONSULTASI: 0,
        STATUS_AKTIF: 'Y',
      });
    }

    setFormErrors({});
    setIsModalOpen(true);
  };

  const handleSubmit = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      if (editingDokter) {
        await adminService.updateDokter(
          editingDokter.DOKTER_ID,
          formData
        );

        toast.success(
          'Dokter berhasil diperbarui'
        );
      } else {
        await adminService.createDokter(
          formData
        );

        toast.success(
          'Dokter berhasil ditambahkan'
        );
      }

      setIsModalOpen(false);
      fetchDokter();
    } catch (error: any) {
      console.error(
        'Error saving dokter:',
        error
      );

      toast.error(
        error.response?.data?.message ||
          'Gagal menyimpan data dokter'
      );
    }
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">
          Manajemen Dokter
        </h1>

        <p className="text-gray-500 mt-1">
          Kelola data dokter klinik
        </p>
      </div>

      {/* Filter & Add */}
      <div className="flex gap-4 mb-6">
        <select
          value={filterSpesialisasi}
          onChange={(e) =>
            setFilterSpesialisasi(
              e.target.value
            )
          }
          className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0F766E]"
        >
          <option value="">
            Semua Spesialisasi
          </option>

          {spesialisasiList.map((sp) => (
            <option
              key={sp}
              value={sp}
            >
              {sp}
            </option>
          ))}
        </select>

        <button
          onClick={() =>
            handleOpenModal()
          }
          className="ml-auto bg-[#0F766E] text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-[#0D6B64] transition-colors"
        >
          <Plus size={20} />
          Tambah Dokter
        </button>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredDokter.map((dokter) => (
          <div
            key={dokter.DOKTER_ID}
            className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 hover:shadow-md transition-shadow"
          >
            {/* Avatar & Name */}
            <div className="flex items-start gap-4 mb-4">
              <div className="w-12 h-12 bg-[#0F766E] rounded-full flex items-center justify-center text-white text-xl font-semibold">
                {dokter.NAMA_DOKTER.charAt(
                  0
                )}
              </div>

              <div className="flex-1">
                <h3 className="font-semibold text-gray-900">
                  {dokter.NAMA_DOKTER}
                </h3>

                <p className="text-sm text-[#0F766E]">
                  {
                    dokter.SPESIALISASI
                  }
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleOpenJadwalModal(dokter)}
                  className="text-teal-600 hover:text-teal-800 transition-colors"
                  title="Kelola Jadwal"
                >
                  <Calendar size={18} />
                </button>
                <button
                  onClick={() =>
                    handleOpenModal(
                      dokter
                    )
                  }
                  className="text-blue-600 hover:text-blue-800 transition-colors"
                  title="Edit Dokter"
                >
                  <Edit2 size={18} />
                </button>
              </div>
            </div>

            {/* Details */}
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">
                  No. SIP:
                </span>

                <span className="font-mono text-gray-700">
                  {dokter.NO_SIP}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-500">
                  Telepon:
                </span>

                <span className="text-gray-700">
                  {
                    dokter.NO_TELEPON
                  }
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-500">
                  Jadwal:
                </span>

                <span className="text-gray-700 text-right">
                  {
                    dokter.JADWAL_PRAKTIK
                  }
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-500">
                  Tarif:
                </span>

                <span className="font-semibold text-[#0F766E]">
                  {formatRupiah(
                    dokter.BIAYA_KONSULTASI
                  )}
                </span>
              </div>
            </div>

            {/* Status Badge */}
            <div className="mt-4">
              <Badge
                status={
                  dokter.STATUS_AKTIF
                }
                type="active"
              />
            </div>
          </div>
        ))}
      </div>

      {/* Modal Jadwal */}
      <Modal
        isOpen={isJadwalModalOpen}
        onClose={() => setIsJadwalModalOpen(false)}
        title={`Jadwal – ${jadwalDokter?.NAMA_DOKTER ?? ''}`}
        size="lg"
      >
        <div className="space-y-5">
          {/* Form tambah jadwal */}
          <div className="bg-gray-50 rounded-lg p-4 space-y-3">
            <h4 className="text-sm font-semibold text-gray-700">Tambah Jadwal Baru</h4>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Hari</label>
                <select
                  value={jadwalForm.hari}
                  onChange={(e) => setJadwalForm({ ...jadwalForm, hari: e.target.value })}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0F766E]"
                >
                  {HARI_OPTIONS.map((h) => (
                    <option key={h} value={h}>{HARI_LABEL[h]}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Kuota Pasien</label>
                <input
                  type="number"
                  min={1}
                  max={200}
                  value={jadwalForm.kuota}
                  onChange={(e) => setJadwalForm({ ...jadwalForm, kuota: Number(e.target.value) })}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0F766E]"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Jam Mulai</label>
                <input
                  type="time"
                  value={jadwalForm.jam_mulai}
                  onChange={(e) => setJadwalForm({ ...jadwalForm, jam_mulai: e.target.value })}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0F766E]"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Jam Selesai</label>
                <input
                  type="time"
                  value={jadwalForm.jam_selesai}
                  onChange={(e) => setJadwalForm({ ...jadwalForm, jam_selesai: e.target.value })}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0F766E]"
                />
              </div>
            </div>
            {jadwalFormError && (
              <p className="text-red-500 text-xs">{jadwalFormError}</p>
            )}
            <button
              onClick={handleAddJadwal}
              className="flex items-center gap-2 px-4 py-2 bg-[#0F766E] text-white text-sm rounded-lg hover:bg-[#0D6B64] transition-colors"
            >
              <Plus size={16} />
              Tambah Jadwal
            </button>
          </div>

          {/* Daftar jadwal */}
          <div>
            <h4 className="text-sm font-semibold text-gray-700 mb-2">Jadwal Terdaftar</h4>
            {jadwalLoading ? (
              <p className="text-sm text-gray-400 text-center py-4">Memuat...</p>
            ) : jadwalList.length === 0 ? (
              <p className="text-sm text-gray-400 text-center py-4">Belum ada jadwal</p>
            ) : (
              <div className="space-y-2">
                {jadwalList.map((j) => (
                  <div
                    key={j.jadwal_id}
                    className="flex items-center justify-between bg-white border border-gray-200 rounded-lg px-4 py-3"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-semibold text-white bg-[#0F766E] rounded px-2 py-0.5 w-20 text-center">
                        {HARI_LABEL[j.hari] ?? j.hari}
                      </span>
                      <div className="flex items-center gap-1 text-sm text-gray-700">
                        <Clock size={14} className="text-gray-400" />
                        {j.jam_mulai} – {j.jam_selesai}
                      </div>
                      <span className="text-xs text-gray-500">Kuota: {j.kuota ?? '-'}</span>
                    </div>
                    <button
                      onClick={() => handleDeleteJadwal(j.jadwal_id)}
                      className="text-red-500 hover:text-red-700 transition-colors"
                      title="Hapus jadwal"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </Modal>

      {/* Modal Form */}
      <Modal
        isOpen={isModalOpen}
        onClose={() =>
          setIsModalOpen(false)
        }
        title={
          editingDokter
            ? 'Edit Dokter'
            : 'Tambah Dokter'
        }
        size="lg"
      >
        <form
          onSubmit={handleSubmit}
          className="space-y-4"
        >
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nama Dokter{' '}
              <span className="text-red-500">
                *
              </span>
            </label>

            <input
              type="text"
              value={
                formData.NAMA_DOKTER
              }
              onChange={(e) =>
                setFormData({
                  ...formData,
                  NAMA_DOKTER:
                    e.target.value,
                })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0F766E]"
            />

            {formErrors.NAMA_DOKTER && (
              <p className="text-red-500 text-xs mt-1">
                {
                  formErrors.NAMA_DOKTER
                }
              </p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Spesialisasi{' '}
                <span className="text-red-500">
                  *
                </span>
              </label>

              <input
                type="text"
                value={
                  formData.SPESIALISASI
                }
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    SPESIALISASI:
                      e.target.value,
                  })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0F766E]"
              />

              {formErrors.SPESIALISASI && (
                <p className="text-red-500 text-xs mt-1">
                  {
                    formErrors.SPESIALISASI
                  }
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                No. SIP{' '}
                <span className="text-red-500">
                  *
                </span>
              </label>

              <input
                type="text"
                value={formData.NO_SIP}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    NO_SIP:
                      e.target.value,
                  })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0F766E]"
              />

              {formErrors.NO_SIP && (
                <p className="text-red-500 text-xs mt-1">
                  {formErrors.NO_SIP}
                </p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                No. Telepon{' '}
                <span className="text-red-500">
                  *
                </span>
              </label>

              <input
                type="text"
                value={
                  formData.NO_TELEPON
                }
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    NO_TELEPON:
                      e.target.value,
                  })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0F766E]"
              />

              {formErrors.NO_TELEPON && (
                <p className="text-red-500 text-xs mt-1">
                  {
                    formErrors.NO_TELEPON
                  }
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email{' '}
                <span className="text-red-500">
                  *
                </span>
              </label>

              <input
                type="email"
                value={formData.EMAIL}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    EMAIL:
                      e.target.value,
                  })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0F766E]"
              />

              {formErrors.EMAIL && (
                <p className="text-red-500 text-xs mt-1">
                  {formErrors.EMAIL}
                </p>
              )}
            </div>
          </div>

          {!editingDokter && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Password{' '}
                <span className="text-red-500">
                  *
                </span>
              </label>

              <input
                type="password"
                value={
                  formData.PASSWORD ||
                  ''
                }
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    PASSWORD:
                      e.target.value,
                  })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0F766E]"
              />

              {formErrors.PASSWORD && (
                <p className="text-red-500 text-xs mt-1">
                  {
                    formErrors.PASSWORD
                  }
                </p>
              )}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Jadwal Praktik{' '}
              <span className="text-red-500">
                *
              </span>
            </label>

            <textarea
              value={
                formData.JADWAL_PRAKTIK
              }
              onChange={(e) =>
                setFormData({
                  ...formData,
                  JADWAL_PRAKTIK:
                    e.target.value,
                })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0F766E]"
              rows={2}
              placeholder="Contoh: Senin-Jumat 08:00-14:00"
            />

            {formErrors.JADWAL_PRAKTIK && (
              <p className="text-red-500 text-xs mt-1">
                {
                  formErrors.JADWAL_PRAKTIK
                }
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Biaya Konsultasi{' '}
              <span className="text-red-500">
                *
              </span>
            </label>

            <input
              type="number"
              value={
                formData.BIAYA_KONSULTASI
              }
              onChange={(e) =>
                setFormData({
                  ...formData,
                  BIAYA_KONSULTASI:
                    Number(
                      e.target.value
                    ),
                })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0F766E]"
              min="0"
            />

            {formErrors.BIAYA_KONSULTASI && (
              <p className="text-red-500 text-xs mt-1">
                {
                  formErrors.BIAYA_KONSULTASI
                }
              </p>
            )}
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={() =>
                setIsModalOpen(false)
              }
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
            >
              Batal
            </button>

            <button
              type="submit"
              className="px-4 py-2 bg-[#0F766E] text-white rounded-lg hover:bg-[#0D6B64]"
            >
              {editingDokter
                ? 'Update'
                : 'Simpan'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}