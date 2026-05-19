import { useState, useEffect } from 'react';
import { Modal } from '../components/Modal';
import { User, Edit2, Key, MapPin, Phone, Mail, Droplet, Calendar, UserCircle, LogOut } from 'lucide-react';
import {
  getProfilPasien,
  updateProfilPasien,
  changePasswordPasien,
  ProfilPasien,
} from '../../services/patientService';
import { formatDate } from '../../utils/formatters';

interface PatientProfilProps {
  pasienId: number;
  onLogout: () => void;
}

export function PatientProfil({ pasienId, onLogout }: PatientProfilProps) {
  const [profil, setProfil] = useState<ProfilPasien | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);

  const [editData, setEditData] = useState({
    ALAMAT: '',
    no_telepon: '',
    EMAIL: '',
  });

  const [passwordData, setPasswordData] = useState({
    passwordLama: '',
    passwordBaru: '',
    konfirmasiPassword: '',
  });

  useEffect(() => {
    loadProfil();
  }, [pasienId]);

  const loadProfil = async () => {
    try {
      setLoading(true);
      const data = await getProfilPasien(pasienId);
      setProfil(data);
      setEditData({
        ALAMAT: data.ALAMAT,
        no_telepon: data.no_telepon,
        EMAIL: data.EMAIL,
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
      await updateProfilPasien(pasienId, editData);
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
      await changePasswordPasien(pasienId, passwordData);
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

  const calculateAge = (birthDate: string): number => {
    const birth = new Date(birthDate);
    const today = new Date();
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return age;
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
    <div className="pb-20 md:pb-6">
      <div className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold text-gray-900">Profil Saya</h1>
          <p className="text-sm text-gray-500 mt-1">Kelola informasi pribadi Anda</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-6">
        {/* Profile Header */}
        <div className="bg-gradient-to-br from-[#0F766E] to-[#14B8A6] rounded-2xl p-6 mb-6 text-white">
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-3xl font-bold">
              {(profil.nama_lengkap || profil.nama_lengkap || '?').charAt(0)}
            </div>
            <div>
              <h2 className="text-2xl font-bold">{profil.nama_lengkap}</h2>
              <p className="opacity-90">NIK: {profil.NIK}</p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <button
            onClick={() => setIsEditModalOpen(true)}
            className="py-3 bg-white border-2 border-[#0F766E] text-[#0F766E] rounded-lg font-medium flex items-center justify-center gap-2 hover:bg-[#0F766E] hover:text-white transition-colors"
          >
            <Edit2 size={18} />
            Edit Profil
          </button>
          <button
            onClick={() => setIsPasswordModalOpen(true)}
            className="py-3 bg-white border-2 border-gray-300 text-gray-700 rounded-lg font-medium flex items-center justify-center gap-2 hover:bg-gray-50 transition-colors"
          >
            <Key size={18} />
            Ganti Password
          </button>
        </div>

        {/* Info Cards */}
        <div className="space-y-4">
          <div className="bg-white rounded-xl shadow-sm p-5">
            <div className="flex items-center gap-2 mb-4">
              <UserCircle size={18} className="text-[#0F766E]" />
              <h3 className="font-semibold text-gray-900">Informasi Pribadi</h3>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-start gap-2">
                <Calendar size={14} className="text-gray-400 mt-1 shrink-0" />
                <div>
                  <p className="text-sm text-gray-500">Tanggal Lahir</p>
                  <p className="font-medium text-gray-900">{formatDate(profil.tanggal_lahir)}</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <User size={14} className="text-gray-400 mt-1 shrink-0" />
                <div>
                  <p className="text-sm text-gray-500">Usia</p>
                  <p className="font-medium text-gray-900">{calculateAge(profil.tanggal_lahir)} tahun</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <User size={14} className="text-gray-400 mt-1 shrink-0" />
                <div>
                  <p className="text-sm text-gray-500">Jenis Kelamin</p>
                  <p className="font-medium text-gray-900">
                    {profil.jenis_kelamin === 'L' ? 'Laki-laki' : 'Perempuan'}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <Droplet size={14} className="text-gray-400 mt-1 shrink-0" />
                <div>
                  <p className="text-sm text-gray-500">Golongan Darah</p>
                  <p className="font-medium text-gray-900">{profil.golongan_darah}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-5">
            <div className="flex items-center gap-2 mb-4">
              <Phone size={18} className="text-[#0F766E]" />
              <h3 className="font-semibold text-gray-900">Kontak</h3>
            </div>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <MapPin size={16} className="text-gray-400 mt-0.5 shrink-0" />
                <div>
                  <p className="text-sm text-gray-500">Alamat</p>
                  <p className="font-medium text-gray-900">{profil.ALAMAT}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-start gap-3">
                  <Phone size={14} className="text-gray-400 mt-1 shrink-0" />
                  <div>
                    <p className="text-sm text-gray-500">No. Telepon</p>
                    <p className="font-medium text-gray-900">{profil.no_telepon}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Mail size={14} className="text-gray-400 mt-1 shrink-0" />
                  <div>
                    <p className="text-sm text-gray-500">Email</p>
                    <p className="font-medium text-gray-900 break-all">{profil.EMAIL}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <button
            onClick={onLogout}
            className="w-full py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
          >
            <LogOut size={18} />
            Logout
          </button>
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
            <p>Anda hanya dapat mengubah: Alamat, No. Telepon, dan Email.</p>
            <p className="mt-1">Untuk mengubah data lainnya, hubungi admin klinik.</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Alamat <span className="text-red-500">*</span>
            </label>
            <textarea
              value={editData.ALAMAT}
              onChange={(e) => setEditData({ ...editData, ALAMAT: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0F766E]"
              rows={3}
              required
            />
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
              value={editData.EMAIL}
              onChange={(e) => setEditData({ ...editData, EMAIL: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0F766E]"
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
