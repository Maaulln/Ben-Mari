import { useState, useEffect } from 'react';
import { Modal } from '../components/Modal';
import { Badge } from '../components/Badge';
import { Plus, Edit2 } from 'lucide-react';
import { Dokter as DokterType } from '../../data/mockData';
import { formatRupiah } from '../../utils/formatters';
import { validateSIP, validatePhone, validateEmail } from '../../utils/validators';
import * as adminService from '../../services/adminService';
import { toast } from 'sonner';

export function Dokter() {
  const [dokterList, setDokterList] = useState<DokterType[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterSpesialisasi, setFilterSpesialisasi] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingDokter, setEditingDokter] = useState<DokterType | null>(null);

  useEffect(() => {
    fetchDokter();
  }, []);

  const fetchDokter = async () => {
    try {
      setLoading(true);
      const data = await adminService.getAllDokter();
      setDokterList(data);
    } catch (error) {
      console.error('Error fetching dokter:', error);
      toast.error('Gagal mengambil data dokter');
    } finally {
      setLoading(false);
    }
  };

  const [formData, setFormData] = useState<Partial<DokterType>>({
    NAMA_DOKTER: '',
    SPESIALISASI: '',
    NO_SIP: '',
    NO_TELEPON: '',
    EMAIL: '',
    JADWAL_PRAKTIK: '',
    BIAYA_KONSULTASI: 0,
    STATUS_AKTIF: 'Y',
  });

  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  // Filter dokter by spesialisasi
  const filteredDokter = filterSpesialisasi
    ? dokterList.filter((d) => d.SPESIALISASI === filterSpesialisasi)
    : dokterList;

  // Get unique spesialisasi
  const spesialisasiList = Array.from(new Set(dokterList.map((d) => d.SPESIALISASI)));

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    if (!formData.NAMA_DOKTER || formData.NAMA_DOKTER.length < 3) {
      errors.NAMA_DOKTER = 'Nama dokter minimal 3 karakter';
    }

    if (!formData.SPESIALISASI) {
      errors.SPESIALISASI = 'Spesialisasi harus diisi';
    }

    if (!formData.NO_SIP || !validateSIP(formData.NO_SIP)) {
      errors.NO_SIP = 'No. SIP tidak valid';
    }

    if (!formData.NO_TELEPON || !validatePhone(formData.NO_TELEPON)) {
      errors.NO_TELEPON = 'No. telepon tidak valid';
    }

    if (!formData.EMAIL || !validateEmail(formData.EMAIL)) {
      errors.EMAIL = 'Format email tidak valid';
    }

    if (!formData.JADWAL_PRAKTIK) {
      errors.JADWAL_PRAKTIK = 'Jadwal praktik harus diisi';
    }

    if (!formData.BIAYA_KONSULTASI || formData.BIAYA_KONSULTASI <= 0) {
      errors.BIAYA_KONSULTASI = 'Biaya konsultasi harus lebih dari 0';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleOpenModal = (dokter?: DokterType) => {
    if (dokter) {
      setEditingDokter(dokter);
      setFormData(dokter);
    } else {
      setEditingDokter(null);
      setFormData({
        NAMA_DOKTER: '',
        SPESIALISASI: '',
        NO_SIP: '',
        NO_TELEPON: '',
        EMAIL: '',
        JADWAL_PRAKTIK: '',
        BIAYA_KONSULTASI: 0,
        STATUS_AKTIF: 'Y',
      });
    }
    setFormErrors({});
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      if (editingDokter) {
        await adminService.updateDokter(editingDokter.DOKTER_ID, formData);
        toast.success('Dokter berhasil diperbarui');
      } else {
        await adminService.createDokter(formData);
        toast.success('Dokter berhasil ditambahkan');
      }
      setIsModalOpen(false);
      fetchDokter();
    } catch (error: any) {
      console.error('Error saving dokter:', error);
      toast.error(error.response?.data?.message || 'Gagal menyimpan data dokter');
    }
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Manajemen Dokter</h1>
        <p className="text-gray-500 mt-1">Kelola data dokter klinik</p>
      </div>

      {/* Filter & Add */}
      <div className="flex gap-4 mb-6">
        <select
          value={filterSpesialisasi}
          onChange={(e) => setFilterSpesialisasi(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0F766E]"
        >
          <option value="">Semua Spesialisasi</option>
          {spesialisasiList.map((sp) => (
            <option key={sp} value={sp}>
              {sp}
            </option>
          ))}
        </select>
        <button
          onClick={() => handleOpenModal()}
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
                {dokter.NAMA_DOKTER.charAt(0)}
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900">{dokter.NAMA_DOKTER}</h3>
                <p className="text-sm text-[#0F766E]">{dokter.SPESIALISASI}</p>
              </div>
              <button
                onClick={() => handleOpenModal(dokter)}
                className="text-blue-600 hover:text-blue-800 transition-colors"
              >
                <Edit2 size={18} />
              </button>
            </div>

            {/* Details */}
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">No. SIP:</span>
                <span className="font-mono text-gray-700">{dokter.NO_SIP}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Telepon:</span>
                <span className="text-gray-700">{dokter.NO_TELEPON}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Jadwal:</span>
                <span className="text-gray-700 text-right">{dokter.JADWAL_PRAKTIK}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Tarif:</span>
                <span className="font-semibold text-[#0F766E]">{formatRupiah(dokter.BIAYA_KONSULTASI)}</span>
              </div>
            </div>

            {/* Status Badge */}
            <div className="mt-4">
              <Badge status={dokter.STATUS_AKTIF} type="active" />
            </div>
          </div>
        ))}
      </div>

      {/* Modal Form */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingDokter ? 'Edit Dokter' : 'Tambah Dokter'}
        size="lg"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nama Dokter <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.NAMA_DOKTER}
              onChange={(e) => setFormData({ ...formData, NAMA_DOKTER: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0F766E]"
            />
            {formErrors.NAMA_DOKTER && <p className="text-red-500 text-xs mt-1">{formErrors.NAMA_DOKTER}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Spesialisasi <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.SPESIALISASI}
                onChange={(e) => setFormData({ ...formData, SPESIALISASI: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0F766E]"
              />
              {formErrors.SPESIALISASI && <p className="text-red-500 text-xs mt-1">{formErrors.SPESIALISASI}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                No. SIP <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.NO_SIP}
                onChange={(e) => setFormData({ ...formData, NO_SIP: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0F766E]"
              />
              {formErrors.NO_SIP && <p className="text-red-500 text-xs mt-1">{formErrors.NO_SIP}</p>}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                No. Telepon <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.NO_TELEPON}
                onChange={(e) => setFormData({ ...formData, NO_TELEPON: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0F766E]"
              />
              {formErrors.NO_TELEPON && <p className="text-red-500 text-xs mt-1">{formErrors.NO_TELEPON}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                value={formData.EMAIL}
                onChange={(e) => setFormData({ ...formData, EMAIL: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0F766E]"
              />
              {formErrors.EMAIL && <p className="text-red-500 text-xs mt-1">{formErrors.EMAIL}</p>}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Jadwal Praktik <span className="text-red-500">*</span>
            </label>
            <textarea
              value={formData.JADWAL_PRAKTIK}
              onChange={(e) => setFormData({ ...formData, JADWAL_PRAKTIK: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0F766E]"
              rows={2}
              placeholder="Contoh: Senin-Jumat 08:00-14:00"
            />
            {formErrors.JADWAL_PRAKTIK && <p className="text-red-500 text-xs mt-1">{formErrors.JADWAL_PRAKTIK}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Biaya Konsultasi <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              value={formData.BIAYA_KONSULTASI}
              onChange={(e) => setFormData({ ...formData, BIAYA_KONSULTASI: Number(e.target.value) })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0F766E]"
              min="0"
            />
            {formErrors.BIAYA_KONSULTASI && <p className="text-red-500 text-xs mt-1">{formErrors.BIAYA_KONSULTASI}</p>}
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-[#0F766E] text-white rounded-lg hover:bg-[#0D6B64]"
            >
              {editingDokter ? 'Update' : 'Simpan'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
