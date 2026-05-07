import { useState, useEffect } from 'react';
import { Modal } from '../components/Modal';
import { Badge } from '../components/Badge';
import { Search, Plus, Edit2, Trash2 } from 'lucide-react';
import { Pasien as PasienType } from '../../data/mockData';
import { formatDate } from '../../utils/formatters';
import { validateNIK, validatePhone, validateEmail } from '../../utils/validators';
import * as adminService from '../../services/adminService';
import { toast } from 'sonner';

export function Pasien() {
  const [pasienList, setPasienList] = useState<PasienType[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPasien, setEditingPasien] = useState<PasienType | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    fetchPasien();
  }, []);

  const fetchPasien = async () => {
    try {
      setLoading(true);
      const data = await adminService.getAllPasien();
      setPasienList(data);
    } catch (error) {
      console.error('Error fetching pasien:', error);
      toast.error('Gagal mengambil data pasien');
    } finally {
      setLoading(false);
    }
  };

  const [formData, setFormData] = useState<Partial<PasienType>>({
    NIK: '',
    NAMA_LENGKAP: '',
    TANGGAL_LAHIR: '',
    JENIS_KELAMIN: 'L',
    ALAMAT: '',
    NO_TELEPON: '',
    EMAIL: '',
    GOLONGAN_DARAH: 'A',
    STATUS_AKTIF: 'Y',
  });

  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  // Filter pasien berdasarkan search
  const filteredPasien = pasienList.filter(
    (p) =>
      p.NAMA_LENGKAP.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.NIK.includes(searchTerm)
  );

  // Pagination
  const totalPages = Math.ceil(filteredPasien.length / itemsPerPage);
  const paginatedPasien = filteredPasien.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    if (!formData.NIK || !validateNIK(formData.NIK)) {
      errors.NIK = 'NIK harus 16 digit angka';
    }

    if (!formData.NAMA_LENGKAP || formData.NAMA_LENGKAP.length < 3) {
      errors.NAMA_LENGKAP = 'Nama minimal 3 karakter';
    }

    if (!formData.TANGGAL_LAHIR) {
      errors.TANGGAL_LAHIR = 'Tanggal lahir harus diisi';
    } else if (new Date(formData.TANGGAL_LAHIR) > new Date()) {
      errors.TANGGAL_LAHIR = 'Tanggal lahir tidak boleh masa depan';
    }

    if (!formData.NO_TELEPON || !validatePhone(formData.NO_TELEPON)) {
      errors.NO_TELEPON = 'No. telepon harus dimulai 08 dan 10-15 digit';
    }

    if (formData.EMAIL && !validateEmail(formData.EMAIL)) {
      errors.EMAIL = 'Format email tidak valid';
    }

    if (!formData.ALAMAT) {
      errors.ALAMAT = 'Alamat harus diisi';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleOpenModal = (pasien?: PasienType) => {
    if (pasien) {
      setEditingPasien(pasien);
      setFormData(pasien);
    } else {
      setEditingPasien(null);
      setFormData({
        NIK: '',
        NAMA_LENGKAP: '',
        TANGGAL_LAHIR: '',
        JENIS_KELAMIN: 'L',
        ALAMAT: '',
        NO_TELEPON: '',
        EMAIL: '',
        GOLONGAN_DARAH: 'A',
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
      if (editingPasien) {
        // Update
        await adminService.updatePasien(editingPasien.PASIEN_ID, formData);
        toast.success('Pasien berhasil diperbarui');
      } else {
        // Create
        await adminService.createPasien(formData);
        toast.success('Pasien berhasil ditambahkan');
      }
      setIsModalOpen(false);
      fetchPasien();
    } catch (error: any) {
      console.error('Error saving pasien:', error);
      toast.error(error.response?.data?.message || 'Gagal menyimpan data pasien');
    }
  };

  const handleDelete = async (pasien: PasienType) => {
    if (confirm(`Yakin ingin menghapus pasien ${pasien.NAMA_LENGKAP}?`)) {
      try {
        await adminService.deletePasien(pasien.PASIEN_ID);
        toast.success('Pasien berhasil dihapus');
        fetchPasien();
      } catch (error) {
        console.error('Error deleting pasien:', error);
        toast.error('Gagal menghapus pasien');
      }
    }
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Manajemen Pasien</h1>
        <p className="text-gray-500 mt-1">Kelola data pasien klinik</p>
      </div>

      {/* Search & Add */}
      <div className="flex gap-4 mb-6">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Cari pasien berdasarkan nama atau NIK..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0F766E]"
          />
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="bg-[#0F766E] text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-[#0D6B64] transition-colors"
        >
          <Plus size={20} />
          Tambah Pasien
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 text-xs font-medium text-gray-500 uppercase tracking-wider">
              <tr>
                <th className="px-4 py-3 text-left">Nama</th>
                <th className="px-4 py-3 text-left">NIK</th>
                <th className="px-4 py-3 text-left">Tgl Lahir</th>
                <th className="px-4 py-3 text-left">Telepon</th>
                <th className="px-4 py-3 text-left">Gol. Darah</th>
                <th className="px-4 py-3 text-left">Status</th>
                <th className="px-4 py-3 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {paginatedPasien.map((pasien) => (
                <tr key={pasien.PASIEN_ID} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3 text-sm text-gray-700">{pasien.NAMA_LENGKAP}</td>
                  <td className="px-4 py-3 text-sm text-gray-700 font-mono">{pasien.NIK}</td>
                  <td className="px-4 py-3 text-sm text-gray-700">{formatDate(pasien.TANGGAL_LAHIR)}</td>
                  <td className="px-4 py-3 text-sm text-gray-700">{pasien.NO_TELEPON}</td>
                  <td className="px-4 py-3 text-sm text-gray-700">{pasien.GOLONGAN_DARAH}</td>
                  <td className="px-4 py-3">
                    <Badge status={pasien.STATUS_AKTIF} type="active" />
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={() => handleOpenModal(pasien)}
                        className="text-blue-600 hover:text-blue-800 transition-colors"
                      >
                        <Edit2 size={16} />
                      </button>
                      {pasien.STATUS_AKTIF === 'Y' && (
                        <button
                          onClick={() => handleDelete(pasien)}
                          className="text-red-600 hover:text-red-800 transition-colors"
                        >
                          <Trash2 size={16} />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="p-4 border-t border-gray-100 flex items-center justify-between">
          <p className="text-sm text-gray-600">
            Menampilkan {((currentPage - 1) * itemsPerPage) + 1} - {Math.min(currentPage * itemsPerPage, filteredPasien.length)} dari {filteredPasien.length} pasien
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="px-3 py-1 border border-gray-300 rounded-lg text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
            >
              Prev
            </button>
            <button
              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              className="px-3 py-1 border border-gray-300 rounded-lg text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
            >
              Next
            </button>
          </div>
        </div>
      </div>

      {/* Modal Form */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingPasien ? 'Edit Pasien' : 'Tambah Pasien'}
        size="lg"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                NIK <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.NIK}
                onChange={(e) => setFormData({ ...formData, NIK: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0F766E]"
                placeholder="16 digit"
                maxLength={16}
              />
              {formErrors.NIK && <p className="text-red-500 text-xs mt-1">{formErrors.NIK}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nama Lengkap <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.NAMA_LENGKAP}
                onChange={(e) => setFormData({ ...formData, NAMA_LENGKAP: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0F766E]"
              />
              {formErrors.NAMA_LENGKAP && <p className="text-red-500 text-xs mt-1">{formErrors.NAMA_LENGKAP}</p>}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tanggal Lahir <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                value={formData.TANGGAL_LAHIR}
                onChange={(e) => setFormData({ ...formData, TANGGAL_LAHIR: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0F766E]"
              />
              {formErrors.TANGGAL_LAHIR && <p className="text-red-500 text-xs mt-1">{formErrors.TANGGAL_LAHIR}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Jenis Kelamin <span className="text-red-500">*</span>
              </label>
              <div className="flex gap-4 pt-2">
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    value="L"
                    checked={formData.JENIS_KELAMIN === 'L'}
                    onChange={(e) => setFormData({ ...formData, JENIS_KELAMIN: e.target.value as 'L' | 'P' })}
                    className="text-[#0F766E]"
                  />
                  <span className="text-sm">Laki-laki</span>
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    value="P"
                    checked={formData.JENIS_KELAMIN === 'P'}
                    onChange={(e) => setFormData({ ...formData, JENIS_KELAMIN: e.target.value as 'L' | 'P' })}
                    className="text-[#0F766E]"
                  />
                  <span className="text-sm">Perempuan</span>
                </label>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Alamat <span className="text-red-500">*</span>
            </label>
            <textarea
              value={formData.ALAMAT}
              onChange={(e) => setFormData({ ...formData, ALAMAT: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0F766E]"
              rows={3}
            />
            {formErrors.ALAMAT && <p className="text-red-500 text-xs mt-1">{formErrors.ALAMAT}</p>}
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
                placeholder="08xxxxxxxxxx"
              />
              {formErrors.NO_TELEPON && <p className="text-red-500 text-xs mt-1">{formErrors.NO_TELEPON}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
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
              Golongan Darah <span className="text-red-500">*</span>
            </label>
            <select
              value={formData.GOLONGAN_DARAH}
              onChange={(e) => setFormData({ ...formData, GOLONGAN_DARAH: e.target.value as 'A' | 'B' | 'AB' | 'O' })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0F766E]"
            >
              <option value="A">A</option>
              <option value="B">B</option>
              <option value="AB">AB</option>
              <option value="O">O</option>
            </select>
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
              {editingPasien ? 'Update' : 'Simpan'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
