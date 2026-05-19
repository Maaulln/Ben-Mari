import { useState } from 'react';
import { ArrowLeft, Check } from 'lucide-react';
import { registerPasien } from '../../services/patientService';
import { validateNIK, validatePhone, validateEmail } from '../../utils/validators';

interface PatientRegisterProps {
  onBackToLogin: () => void;
  onSuccess: () => void;
}

export function PatientRegister({ onBackToLogin, onSuccess }: PatientRegisterProps) {
  const [formData, setFormData] = useState({
    NIK: '',
    NAMA_LENGKAP: '',
    TANGGAL_LAHIR: '',
    JENIS_KELAMIN: 'L' as 'L' | 'P',
    GOLONGAN_DARAH: 'A',
    ALAMAT: '',
    NO_TELEPON: '',
    EMAIL: '',
    password: '',
    konfirmasiPassword: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.NIK || !validateNIK(formData.NIK)) {
      newErrors.NIK = 'NIK harus 16 digit angka';
    }

    if (!formData.NAMA_LENGKAP || formData.NAMA_LENGKAP.length < 3) {
      newErrors.NAMA_LENGKAP = 'Nama minimal 3 karakter';
    }

    if (!formData.TANGGAL_LAHIR) {
      newErrors.TANGGAL_LAHIR = 'Tanggal lahir harus diisi';
    } else if (new Date(formData.TANGGAL_LAHIR) > new Date()) {
      newErrors.TANGGAL_LAHIR = 'Tanggal lahir tidak boleh masa depan';
    }

    if (!formData.ALAMAT) {
      newErrors.ALAMAT = 'Alamat harus diisi';
    }

    if (!formData.NO_TELEPON || !validatePhone(formData.NO_TELEPON)) {
      newErrors.NO_TELEPON = 'No. telepon harus dimulai 08 dan 10-15 digit';
    }

    if (!formData.EMAIL || !validateEmail(formData.EMAIL)) {
      newErrors.EMAIL = 'Format email tidak valid';
    }

    if (!formData.password || formData.password.length < 8) {
      newErrors.password = 'Password minimal 8 karakter';
    }

    if (formData.password !== formData.konfirmasiPassword) {
      newErrors.konfirmasiPassword = 'Konfirmasi password tidak cocok';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      setLoading(true);
      await registerPasien({
        NIK: formData.NIK,
        nama_lengkap: formData.NAMA_LENGKAP,
        tanggal_lahir: formData.TANGGAL_LAHIR,
        jenis_kelamin: formData.JENIS_KELAMIN,
        golongan_darah: formData.GOLONGAN_DARAH,
        ALAMAT: formData.ALAMAT,
        no_telepon: formData.NO_TELEPON,
        EMAIL: formData.EMAIL,
        password: formData.password,
        konfirmasiPassword: formData.konfirmasiPassword,
      });
      alert('Akun berhasil dibuat! Silakan login.');
      onSuccess();
    } catch (error: any) {
      console.error('Error registering:', error);
      const message = error.response?.data?.message || 'Gagal membuat akun. Silakan periksa kembali data Anda.';
      const details = error.response?.data?.errors;
      
      if (details) {
        const errorMsgs = Object.values(details).flat().join('\n');
        alert(`${message}\n\n${errorMsgs}`);
      } else {
        alert(message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F0FDF9] py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          {/* Header */}
          <div className="flex items-center gap-4 mb-6">
            <button
              onClick={onBackToLogin}
              className="text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft size={24} />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Daftar Akun Baru</h1>
              <p className="text-sm text-gray-500 mt-1">
                Lengkapi data diri Anda untuk membuat akun
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* NIK */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                NIK <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.NIK}
                onChange={(e) => {
                  setFormData({ ...formData, NIK: e.target.value });
                  setErrors({ ...errors, NIK: '' });
                }}
                maxLength={16}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0F766E]"
                placeholder="16 digit"
              />
              {errors.NIK && <p className="text-red-500 text-xs mt-1">{errors.NIK}</p>}
            </div>

            {/* Nama */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nama Lengkap <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.NAMA_LENGKAP}
                onChange={(e) => {
                  setFormData({ ...formData, NAMA_LENGKAP: e.target.value });
                  setErrors({ ...errors, NAMA_LENGKAP: '' });
                }}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0F766E]"
              />
              {errors.NAMA_LENGKAP && (
                <p className="text-red-500 text-xs mt-1">{errors.NAMA_LENGKAP}</p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              {/* Tanggal Lahir */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tanggal Lahir <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  value={formData.TANGGAL_LAHIR}
                  onChange={(e) => {
                    setFormData({ ...formData, TANGGAL_LAHIR: e.target.value });
                    setErrors({ ...errors, TANGGAL_LAHIR: '' });
                  }}
                  max={new Date().toISOString().split('T')[0]}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0F766E]"
                />
                {errors.TANGGAL_LAHIR && (
                  <p className="text-red-500 text-xs mt-1">{errors.TANGGAL_LAHIR}</p>
                )}
              </div>

              {/* Golongan Darah */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Golongan Darah <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.GOLONGAN_DARAH}
                  onChange={(e) => setFormData({ ...formData, GOLONGAN_DARAH: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0F766E]"
                >
                  <option value="A">A</option>
                  <option value="B">B</option>
                  <option value="AB">AB</option>
                  <option value="O">O</option>
                </select>
              </div>
            </div>

            {/* Jenis Kelamin */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Jenis Kelamin <span className="text-red-500">*</span>
              </label>
              <div className="flex gap-6">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    value="L"
                    checked={formData.JENIS_KELAMIN === 'L'}
                    onChange={(e) => setFormData({ ...formData, JENIS_KELAMIN: e.target.value as 'L' | 'P' })}
                    className="text-[#0F766E]"
                  />
                  <span>Laki-laki</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    value="P"
                    checked={formData.JENIS_KELAMIN === 'P'}
                    onChange={(e) => setFormData({ ...formData, JENIS_KELAMIN: e.target.value as 'L' | 'P' })}
                    className="text-[#0F766E]"
                  />
                  <span>Perempuan</span>
                </label>
              </div>
            </div>

            {/* Alamat */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Alamat <span className="text-red-500">*</span>
              </label>
              <textarea
                value={formData.ALAMAT}
                onChange={(e) => {
                  setFormData({ ...formData, ALAMAT: e.target.value });
                  setErrors({ ...errors, ALAMAT: '' });
                }}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0F766E]"
                rows={2}
              />
              {errors.ALAMAT && <p className="text-red-500 text-xs mt-1">{errors.ALAMAT}</p>}
            </div>

            <div className="grid grid-cols-2 gap-4">
              {/* No Telepon */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  No. Telepon <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.NO_TELEPON}
                  onChange={(e) => {
                    setFormData({ ...formData, NO_TELEPON: e.target.value });
                    setErrors({ ...errors, NO_TELEPON: '' });
                  }}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0F766E]"
                  placeholder="08xxxxxxxxxx"
                />
                {errors.NO_TELEPON && (
                  <p className="text-red-500 text-xs mt-1">{errors.NO_TELEPON}</p>
                )}
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  value={formData.EMAIL}
                  onChange={(e) => {
                    setFormData({ ...formData, EMAIL: e.target.value });
                    setErrors({ ...errors, EMAIL: '' });
                  }}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0F766E]"
                />
                {errors.EMAIL && <p className="text-red-500 text-xs mt-1">{errors.EMAIL}</p>}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {/* Password */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Password <span className="text-red-500">*</span>
                </label>
                <input
                  type="password"
                  value={formData.password}
                  onChange={(e) => {
                    setFormData({ ...formData, password: e.target.value });
                    setErrors({ ...errors, password: '' });
                  }}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0F766E]"
                  minLength={8}
                />
                {errors.password && (
                  <p className="text-red-500 text-xs mt-1">{errors.password}</p>
                )}
              </div>

              {/* Konfirmasi Password */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Konfirmasi Password <span className="text-red-500">*</span>
                </label>
                <input
                  type="password"
                  value={formData.konfirmasiPassword}
                  onChange={(e) => {
                    setFormData({ ...formData, konfirmasiPassword: e.target.value });
                    setErrors({ ...errors, konfirmasiPassword: '' });
                  }}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0F766E]"
                  minLength={8}
                />
                {errors.konfirmasiPassword && (
                  <p className="text-red-500 text-xs mt-1">{errors.konfirmasiPassword}</p>
                )}
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-[#0F766E] hover:bg-[#0D6B64] text-white rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? 'Mendaftar...' : 'Daftar Sekarang'}
            </button>
          </form>

          <p className="text-center text-sm text-gray-600 mt-6">
            Sudah punya akun?{' '}
            <button
              onClick={onBackToLogin}
              className="text-[#0F766E] font-medium hover:underline"
            >
              Login di sini
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
