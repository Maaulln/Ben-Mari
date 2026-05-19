import { useState, useEffect } from 'react';
import { Modal } from '../components/Modal';
import { UserCircle, Edit2, Key } from 'lucide-react';
import {
  getProfilDokter,
  updateProfilDokter,
  changePassword,
  ProfilDokter as ProfilType,
} from '../../services/doctorService';
import { formatRupiah } from '../../utils/formatters';

interface DoctorProfilProps {
  dokterId: number;
}

export function DoctorProfil({ dokterId }: DoctorProfilProps) {
  const [profil, setProfil] = useState<ProfilType | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);

  const [editData, setEditData] = useState({
    no_telepon: '',
    email: '',
    jadwal_praktik: '',
    biaya_konsultasi: 0,
  });

  const [passwordData, setPasswordData] = useState({
    passwordLama: '',
    passwordBaru: '',
    konfirmasiPassword: '',
  });

  useEffect(() => {
    loadProfil();
  }, [dokterId]);

  const loadProfil = async () => {
    try {
      setLoading(true);
      const data = await getProfilDokter(dokterId);
      setProfil(data);
      setEditData({
        no_telepon: data.no_telepon,
        email: data.email,
        jadwal_praktik: data.jadwal_praktik,
        biaya_konsultasi: data.biaya_konsultasi,
      });
    } catch (error) {
      console.error('Error loading profil:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProfil = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateProfilDokter(dokterId, editData);
      alert('Profil berhasil diperbarui');
      setIsEditModalOpen(false);
      loadProfil();
    } catch (error) {
      console.error('Error updating profil:', error);
      alert('Gagal memperbarui profil');
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();

    if (passwordData.passwordBaru !== passwordData.konfirmasiPassword) {
      alert('Password baru dan konfirmasi tidak cocok');
      return;
    }

    if (passwordData.passwordBaru.length < 8) {
      alert('Password baru minimal 8 karakter');
      return;
    }

    try {
      await changePassword(dokterId, passwordData);
      alert('Password berhasil diubah');
      setIsPasswordModalOpen(false);
      setPasswordData({
        passwordLama: '',
        passwordBaru: '',
        konfirmasiPassword: '',
      });
    } catch (error) {
      console.error('Error changing password:', error);
      alert('Gagal mengubah password. Pastikan password lama benar');
    }
  };

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center h-64">
        <div className="text-gray-500">Memuat profil...</div>
      </div>
    );
  }

  if (!profil) {
    return (
      <div className="p-6 flex items-center justify-center h-64">
        <div className="text-gray-500">Profil tidak ditemukan</div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Profil Saya</h1>
        <p className="text-gray-500 mt-1">Kelola informasi profil Anda</p>
      </div>

      {/* Profile Card */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 mb-6">
        <div className="flex items-start gap-6">
          <div className="w-24 h-24 bg-[#0F766E] rounded-full flex items-center justify-center text-white text-4xl font-semibold shrink-0">
            {profil.nama_dokter.charAt(0)}
          </div>
          <div className="flex-1">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">{profil.nama_dokter}</h2>
                <p className="text-[#0F766E] font-medium mt-1">{profil.spesialisasi}</p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setIsEditModalOpen(true)}
                  className="flex items-center gap-2 px-4 py-2 border border-[#0F766E] text-[#0F766E] hover:bg-[#0F766E] hover:text-white rounded-lg transition-colors"
                >
                  <Edit2 size={16} />
                  Edit Profil
                </button>
                <button
                  onClick={() => setIsPasswordModalOpen(true)}
                  className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                >
                  <Key size={16} />
                  Ganti Password
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Info Detail */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Informasi Umum */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
          <h3 className="font-semibold text-gray-900 mb-4">Informasi Umum</h3>
          <div className="space-y-4">
            <div>
              <label className="text-sm text-gray-500">Nama Lengkap</label>
              <p className="font-medium text-gray-900">{profil.nama_dokter}</p>
            </div>
            <div>
              <label className="text-sm text-gray-500">Spesialisasi</label>
              <p className="font-medium text-gray-900">{profil.spesialisasi}</p>
              <p className="text-xs text-gray-400 mt-1">*Hanya bisa diubah oleh admin</p>
            </div>
            <div>
              <label className="text-sm text-gray-500">No. SIP</label>
              <p className="font-medium text-gray-900 font-mono">{profil.no_sip}</p>
              <p className="text-xs text-gray-400 mt-1">*Hanya bisa diubah oleh admin</p>
            </div>
          </div>
        </div>

        {/* Kontak */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
          <h3 className="font-semibold text-gray-900 mb-4">Kontak</h3>
          <div className="space-y-4">
            <div>
              <label className="text-sm text-gray-500">No. Telepon</label>
              <p className="font-medium text-gray-900">{profil.no_telepon}</p>
            </div>
            <div>
              <label className="text-sm text-gray-500">Email</label>
              <p className="font-medium text-gray-900">{profil.email}</p>
            </div>
          </div>
        </div>

        {/* Praktik */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
          <h3 className="font-semibold text-gray-900 mb-4">Jadwal Praktik</h3>
          <p className="text-gray-700">{profil.jadwal_praktik}</p>
        </div>

        {/* Tarif */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
          <h3 className="font-semibold text-gray-900 mb-4">Biaya Konsultasi</h3>
          <p className="text-2xl font-bold text-[#0F766E]">
            {formatRupiah(profil.biaya_konsultasi)}
          </p>
          <p className="text-sm text-gray-500 mt-1">per kunjungan</p>
        </div>
      </div>

      {/* Modal Edit Profil */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Edit Profil"
      >
        <form onSubmit={handleUpdateProfil} className="space-y-4">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-sm text-blue-700">
            <p>Anda hanya dapat mengubah: No. Telepon, Email, Jadwal Praktik, dan Biaya Konsultasi.</p>
            <p className="mt-1">Untuk mengubah data lainnya, hubungi administrator.</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              No. Telepon <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={editData.no_telepon}
              onChange={(e) => setEditData({ ...editData, no_telepon: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0F766E]"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              value={editData.email}
              onChange={(e) => setEditData({ ...editData, email: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0F766E]"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Jadwal Praktik <span className="text-red-500">*</span>
            </label>
            <textarea
              value={editData.jadwal_praktik}
              onChange={(e) => setEditData({ ...editData, jadwal_praktik: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0F766E]"
              rows={2}
              placeholder="Contoh: Senin-Jumat 08:00-14:00"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Biaya Konsultasi <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              value={editData.biaya_konsultasi}
              onChange={(e) => setEditData({ ...editData, biaya_konsultasi: Number(e.target.value) })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0F766E]"
              min="0"
              required
            />
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={() => setIsEditModalOpen(false)}
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-[#0F766E] text-white rounded-lg hover:bg-[#0D6B64]"
            >
              Simpan Perubahan
            </button>
          </div>
        </form>
      </Modal>

      {/* Modal Ganti Password */}
      <Modal
        isOpen={isPasswordModalOpen}
        onClose={() => setIsPasswordModalOpen(false)}
        title="Ganti Password"
      >
        <form onSubmit={handleChangePassword} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password Lama <span className="text-red-500">*</span>
            </label>
            <input
              type="password"
              value={passwordData.passwordLama}
              onChange={(e) => setPasswordData({ ...passwordData, passwordLama: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0F766E]"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password Baru <span className="text-red-500">*</span>
            </label>
            <input
              type="password"
              value={passwordData.passwordBaru}
              onChange={(e) => setPasswordData({ ...passwordData, passwordBaru: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0F766E]"
              minLength={8}
              required
            />
            <p className="text-xs text-gray-500 mt-1">Minimal 8 karakter</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Konfirmasi Password Baru <span className="text-red-500">*</span>
            </label>
            <input
              type="password"
              value={passwordData.konfirmasiPassword}
              onChange={(e) => setPasswordData({ ...passwordData, konfirmasiPassword: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0F766E]"
              minLength={8}
              required
            />
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={() => setIsPasswordModalOpen(false)}
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-[#0F766E] text-white rounded-lg hover:bg-[#0D6B64]"
            >
              Ubah Password
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
