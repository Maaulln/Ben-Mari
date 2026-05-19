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

// ── Jadwal Praktik Widget ──────────────────────────────────────────────────

const HARI_LIST = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu', 'Minggu'];

interface DayEntry {
  hari: string;
  aktif: boolean;
  mulai: string;
  selesai: string;
}

function parseJadwal(str: string): DayEntry[] {
  const defaults: DayEntry[] = HARI_LIST.map(h => ({
    hari: h, aktif: false, mulai: '08:00', selesai: '14:00',
  }));
  if (!str) return defaults;

  // Handle range like "Senin-Jumat 08:00-14:00"
  const segments = str.split(/[,;]/);
  for (const seg of segments) {
    const trimmed = seg.trim();
    const timeMatch = trimmed.match(/(\d{2}:\d{2})-(\d{2}:\d{2})/);
    const mulai = timeMatch ? timeMatch[1] : '08:00';
    const selesai = timeMatch ? timeMatch[2] : '14:00';

    const rangeMatch = trimmed.match(
      /(Senin|Selasa|Rabu|Kamis|Jumat|Sabtu|Minggu)-(Senin|Selasa|Rabu|Kamis|Jumat|Sabtu|Minggu)/
    );
    if (rangeMatch) {
      const start = HARI_LIST.indexOf(rangeMatch[1]);
      const end   = HARI_LIST.indexOf(rangeMatch[2]);
      for (let i = Math.min(start, end); i <= Math.max(start, end); i++) {
        defaults[i].aktif  = true;
        defaults[i].mulai  = mulai;
        defaults[i].selesai = selesai;
      }
    } else {
      for (const entry of defaults) {
        if (trimmed.includes(entry.hari)) {
          entry.aktif   = true;
          entry.mulai   = mulai;
          entry.selesai = selesai;
        }
      }
    }
  }

  return defaults;
}

function serializeJadwal(entries: DayEntry[]): string {
  const active = entries.filter(e => e.aktif);
  if (active.length === 0) return '';

  // Group consecutive days with identical times into one entry
  const groups: { days: string[]; mulai: string; selesai: string }[] = [];
  for (const entry of active) {
    const last = groups[groups.length - 1];
    if (last && last.mulai === entry.mulai && last.selesai === entry.selesai) {
      last.days.push(entry.hari);
    } else {
      groups.push({ days: [entry.hari], mulai: entry.mulai, selesai: entry.selesai });
    }
  }

  return groups
    .map(g => {
      const dayStr =
        g.days.length >= 3
          ? `${g.days[0]}-${g.days[g.days.length - 1]}`
          : g.days.join(', ');
      return `${dayStr} ${g.mulai}-${g.selesai}`;
    })
    .join('; ');
}

// ── Component ──────────────────────────────────────────────────────────────

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

  const [jadwalEntries, setJadwalEntries] = useState<DayEntry[]>(() =>
    HARI_LIST.map(h => ({ hari: h, aktif: false, mulai: '08:00', selesai: '14:00' }))
  );

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

  const openEditModal = () => {
    if (!profil) return;
    const entries = parseJadwal(profil.jadwal_praktik);
    setJadwalEntries(entries);
    setEditData({
      no_telepon: profil.no_telepon,
      email: profil.email,
      jadwal_praktik: profil.jadwal_praktik,
      biaya_konsultasi: profil.biaya_konsultasi,
    });
    setIsEditModalOpen(true);
  };

  const updateJadwalEntry = (idx: number, field: keyof DayEntry, value: string | boolean) => {
    setJadwalEntries(prev => {
      const next = prev.map((e, i) => (i === idx ? { ...e, [field]: value } : e));
      setEditData(ed => ({ ...ed, jadwal_praktik: serializeJadwal(next) }));
      return next;
    });
  };

  const handleUpdateProfil = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editData.jadwal_praktik) {
      alert('Pilih minimal satu hari praktik');
      return;
    }
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
                  onClick={openEditModal}
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

          {/* ── Jadwal Praktik Widget ── */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Jadwal Praktik <span className="text-red-500">*</span>
            </label>
            <div className="border border-gray-200 rounded-lg overflow-hidden">
              {jadwalEntries.map((entry, i) => (
                <div
                  key={entry.hari}
                  className={[
                    'flex items-center gap-3 px-3 py-2.5',
                    i > 0 ? 'border-t border-gray-100' : '',
                    entry.aktif ? 'bg-teal-50' : 'bg-white',
                  ].join(' ')}
                >
                  <input
                    type="checkbox"
                    id={`hari-${entry.hari}`}
                    checked={entry.aktif}
                    onChange={e => updateJadwalEntry(i, 'aktif', e.target.checked)}
                    className="w-4 h-4 accent-[#0F766E] cursor-pointer"
                  />
                  <label
                    htmlFor={`hari-${entry.hari}`}
                    className="w-16 text-sm font-medium text-gray-700 cursor-pointer select-none"
                  >
                    {entry.hari}
                  </label>

                  {entry.aktif ? (
                    <div className="flex items-center gap-2 flex-1">
                      <input
                        type="time"
                        value={entry.mulai}
                        onChange={e => updateJadwalEntry(i, 'mulai', e.target.value)}
                        className="px-2 py-1 border border-gray-200 rounded text-sm focus:outline-none focus:ring-1 focus:ring-[#0F766E] bg-white"
                      />
                      <span className="text-gray-400 text-sm select-none">—</span>
                      <input
                        type="time"
                        value={entry.selesai}
                        onChange={e => updateJadwalEntry(i, 'selesai', e.target.value)}
                        className="px-2 py-1 border border-gray-200 rounded text-sm focus:outline-none focus:ring-1 focus:ring-[#0F766E] bg-white"
                      />
                    </div>
                  ) : (
                    <span className="text-xs text-gray-400 flex-1 italic">Libur</span>
                  )}
                </div>
              ))}
            </div>

            {editData.jadwal_praktik ? (
              <p className="text-xs text-gray-500 mt-1.5">
                Preview: <span className="font-medium text-gray-700">{editData.jadwal_praktik}</span>
              </p>
            ) : (
              <p className="text-xs text-red-500 mt-1.5">Pilih minimal satu hari praktik</p>
            )}
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
