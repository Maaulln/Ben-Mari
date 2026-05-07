import { useState, useEffect } from 'react';
import { Modal } from '../components/Modal';
import { Badge } from '../components/Badge';
import { StokBar } from '../components/StokBar';
import { Search, Plus, Edit2, AlertTriangle } from 'lucide-react';
import { Obat as ObatType } from '../../data/mockData';
import { formatRupiah, formatDate } from '../../utils/formatters';
import * as adminService from '../../services/adminService';
import { toast } from 'sonner';

export function Obat() {
  const [obatList, setObatList] = useState<ObatType[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterKategori, setFilterKategori] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingObat, setEditingObat] = useState<ObatType | null>(null);

  useEffect(() => {
    fetchObat();
  }, []);

  const fetchObat = async () => {
    try {
      setLoading(true);
      const data = await adminService.getAllObat();
      setObatList(data);
    } catch (error) {
      console.error('Error fetching obat:', error);
      toast.error('Gagal mengambil data obat');
    } finally {
      setLoading(false);
    }
  };

  const [formData, setFormData] = useState<Partial<ObatType>>({
    NAMA_OBAT: '',
    KATEGORI: 'Analgesik',
    SATUAN: 'Tablet',
    STOK_TERSEDIA: 0,
    HARGA_SATUAN: 0,
    TGL_KADALUARSA: '',
    DESKRIPSI: '',
    STATUS_AKTIF: 'Y',
  });

  const filteredObat = obatList.filter(
    (o) =>
      (o.NAMA_OBAT.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (filterKategori === '' || o.KATEGORI === filterKategori)
  );

  const kategoriList = Array.from(new Set(obatList.map((o) => o.KATEGORI)));

  const getStokStatus = (stok: number): string => {
    if (stok === 0) return 'HABIS';
    if (stok < 20) return 'MENIPIS';
    return 'TERSEDIA';
  };

  const isKadaluarsa = (tglKadaluarsa: string): boolean => {
    const diff = new Date(tglKadaluarsa).getTime() - new Date().getTime();
    return diff < 30 * 24 * 60 * 60 * 1000; // < 30 hari
  };

  const handleOpenModal = (obat?: ObatType) => {
    if (obat) {
      setEditingObat(obat);
      setFormData(obat);
    } else {
      setEditingObat(null);
      setFormData({
        NAMA_OBAT: '',
        KATEGORI: 'Analgesik',
        SATUAN: 'Tablet',
        STOK_TERSEDIA: 0,
        HARGA_SATUAN: 0,
        TGL_KADALUARSA: '',
        DESKRIPSI: '',
        STATUS_AKTIF: 'Y',
      });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (editingObat) {
        await adminService.updateObat(editingObat.OBAT_ID, formData);
        toast.success('Obat berhasil diperbarui');
      } else {
        await adminService.createObat(formData);
        toast.success('Obat berhasil ditambahkan');
      }
      setIsModalOpen(false);
      fetchObat();
    } catch (error: any) {
      console.error('Error saving obat:', error);
      toast.error(error.response?.data?.message || 'Gagal menyimpan data obat');
    }
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Manajemen Obat</h1>
        <p className="text-gray-500 mt-1">Kelola stok obat dan farmasi</p>
      </div>

      <div className="flex gap-4 mb-6">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Cari nama obat..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0F766E]"
          />
        </div>
        <select
          value={filterKategori}
          onChange={(e) => setFilterKategori(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0F766E]"
        >
          <option value="">Semua Kategori</option>
          {kategoriList.map((k) => (
            <option key={k} value={k}>{k}</option>
          ))}
        </select>
        <button
          onClick={() => handleOpenModal()}
          className="bg-[#0F766E] text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-[#0D6B64]"
        >
          <Plus size={20} />
          Tambah Obat
        </button>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 text-xs font-medium text-gray-500 uppercase tracking-wider">
            <tr>
              <th className="px-4 py-3 text-left">Nama Obat</th>
              <th className="px-4 py-3 text-left">Kategori</th>
              <th className="px-4 py-3 text-left">Satuan</th>
              <th className="px-4 py-3 text-left">Stok</th>
              <th className="px-4 py-3 text-left">Harga/Satuan</th>
              <th className="px-4 py-3 text-left">Kadaluarsa</th>
              <th className="px-4 py-3 text-left">Status</th>
              <th className="px-4 py-3 text-center">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filteredObat.map((obat) => (
              <tr key={obat.OBAT_ID} className="hover:bg-gray-50">
                <td className="px-4 py-3 text-sm text-gray-700">{obat.NAMA_OBAT}</td>
                <td className="px-4 py-3 text-sm text-gray-700">{obat.KATEGORI}</td>
                <td className="px-4 py-3 text-sm text-gray-700">{obat.SATUAN}</td>
                <td className="px-4 py-3">
                  <StokBar stok={obat.STOK_TERSEDIA} stokMax={500} />
                </td>
                <td className="px-4 py-3 text-sm text-gray-700">{formatRupiah(obat.HARGA_SATUAN)}</td>
                <td className="px-4 py-3 text-sm text-gray-700">
                  <div className="flex items-center gap-1">
                    {isKadaluarsa(obat.TGL_KADALUARSA) && (
                      <AlertTriangle size={14} className="text-red-500" />
                    )}
                    {formatDate(obat.TGL_KADALUARSA)}
                  </div>
                </td>
                <td className="px-4 py-3">
                  <Badge status={getStokStatus(obat.STOK_TERSEDIA)} type="stock" />
                </td>
                <td className="px-4 py-3 text-center">
                  <button
                    onClick={() => handleOpenModal(obat)}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    <Edit2 size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingObat ? 'Edit Obat' : 'Tambah Obat'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nama Obat</label>
            <input
              type="text"
              value={formData.NAMA_OBAT}
              onChange={(e) => setFormData({ ...formData, NAMA_OBAT: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0F766E]"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Kategori</label>
              <select
                value={formData.KATEGORI}
                onChange={(e) => setFormData({ ...formData, KATEGORI: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0F766E]"
              >
                <option value="Analgesik">Analgesik</option>
                <option value="Antibiotik">Antibiotik</option>
                <option value="Antihistamin">Antihistamin</option>
                <option value="Antasida">Antasida</option>
                <option value="Vitamin">Vitamin</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Satuan</label>
              <select
                value={formData.SATUAN}
                onChange={(e) => setFormData({ ...formData, SATUAN: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0F766E]"
              >
                <option value="Tablet">Tablet</option>
                <option value="Kapsul">Kapsul</option>
                <option value="Botol">Botol</option>
                <option value="Ml">Ml</option>
                <option value="Sachet">Sachet</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Stok Tersedia</label>
              <input
                type="number"
                value={formData.STOK_TERSEDIA}
                onChange={(e) => setFormData({ ...formData, STOK_TERSEDIA: Number(e.target.value) })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0F766E]"
                min="0"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Harga Satuan</label>
              <input
                type="number"
                value={formData.HARGA_SATUAN}
                onChange={(e) => setFormData({ ...formData, HARGA_SATUAN: Number(e.target.value) })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0F766E]"
                min="0"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Tanggal Kadaluarsa</label>
            <input
              type="date"
              value={formData.TGL_KADALUARSA}
              onChange={(e) => setFormData({ ...formData, TGL_KADALUARSA: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0F766E]"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Deskripsi</label>
            <textarea
              value={formData.DESKRIPSI}
              onChange={(e) => setFormData({ ...formData, DESKRIPSI: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0F766E]"
              rows={2}
            />
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
              {editingObat ? 'Update' : 'Simpan'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
