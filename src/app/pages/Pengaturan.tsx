import { useState, useEffect } from 'react';
import { Save, Building2, Phone, Mail, Clock, FileText, Edit2 } from 'lucide-react';
import { getPengaturan, updatePengaturan } from '../../services/adminService';
import { toast } from 'sonner';

interface PengaturanData {
  id?: number;
  nama_klinik: string;
  alamat: string;
  no_telepon: string;
  email: string;
  jam_operasional: string;
  deskripsi: string;
}

const defaultData: PengaturanData = {
  nama_klinik: '',
  alamat: '',
  no_telepon: '',
  email: '',
  jam_operasional: '',
  deskripsi: '',
};

export function Pengaturan() {
  const [data, setData] = useState<PengaturanData>(defaultData);
  const [form, setForm] = useState<PengaturanData>(defaultData);
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchPengaturan();
  }, []);

  const fetchPengaturan = async () => {
    setLoading(true);
    try {
      const res = await getPengaturan();
      const d = res.data;
      setData(d);
      setForm(d);
    } catch {
      toast.error('Gagal memuat pengaturan klinik.');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!form.nama_klinik || !form.alamat || !form.no_telepon || !form.email || !form.jam_operasional) {
      toast.error('Semua field wajib diisi.');
      return;
    }
    setSaving(true);
    try {
      const res = await updatePengaturan(form);
      setData(res.data);
      setForm(res.data);
      setEditing(false);
      toast.success('Pengaturan berhasil disimpan.');
    } catch {
      toast.error('Gagal menyimpan pengaturan.');
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setForm(data);
    setEditing(false);
  };

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-[#0F766E] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Pengaturan</h1>
          <p className="text-gray-500 mt-1">Konfigurasi informasi klinik</p>
        </div>
        {!editing && (
          <button
            onClick={() => setEditing(true)}
            className="flex items-center gap-2 px-4 py-2 bg-[#0F766E] text-white rounded-lg hover:bg-[#0d6b64] transition-colors text-sm font-medium"
          >
            <Edit2 size={16} />
            Edit
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Form */}
        <div className="lg:col-span-2 space-y-4">
          {/* Informasi Klinik */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
            <h3 className="font-semibold text-gray-900 mb-5 flex items-center gap-2">
              <Building2 size={18} className="text-[#0F766E]" />
              Informasi Klinik
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nama Klinik <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  value={form.nama_klinik}
                  disabled={!editing}
                  onChange={e => setForm({ ...form, nama_klinik: e.target.value })}
                  className={`w-full px-3 py-2 border border-gray-300 rounded-lg text-sm transition-colors ${
                    editing ? 'focus:outline-none focus:ring-2 focus:ring-[#0F766E] bg-white' : 'bg-gray-50 text-gray-600'
                  }`}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Alamat <span className="text-red-500">*</span></label>
                <textarea
                  value={form.alamat}
                  disabled={!editing}
                  onChange={e => setForm({ ...form, alamat: e.target.value })}
                  rows={3}
                  className={`w-full px-3 py-2 border border-gray-300 rounded-lg text-sm transition-colors resize-none ${
                    editing ? 'focus:outline-none focus:ring-2 focus:ring-[#0F766E] bg-white' : 'bg-gray-50 text-gray-600'
                  }`}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="flex items-center gap-1 text-sm font-medium text-gray-700 mb-1">
                    <Phone size={13} /> Telepon <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={form.no_telepon}
                    disabled={!editing}
                    onChange={e => setForm({ ...form, no_telepon: e.target.value })}
                    className={`w-full px-3 py-2 border border-gray-300 rounded-lg text-sm transition-colors ${
                      editing ? 'focus:outline-none focus:ring-2 focus:ring-[#0F766E] bg-white' : 'bg-gray-50 text-gray-600'
                    }`}
                  />
                </div>
                <div>
                  <label className="flex items-center gap-1 text-sm font-medium text-gray-700 mb-1">
                    <Mail size={13} /> Email <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    value={form.email}
                    disabled={!editing}
                    onChange={e => setForm({ ...form, email: e.target.value })}
                    className={`w-full px-3 py-2 border border-gray-300 rounded-lg text-sm transition-colors ${
                      editing ? 'focus:outline-none focus:ring-2 focus:ring-[#0F766E] bg-white' : 'bg-gray-50 text-gray-600'
                    }`}
                  />
                </div>
              </div>

              <div>
                <label className="flex items-center gap-1 text-sm font-medium text-gray-700 mb-1">
                  <Clock size={13} /> Jam Operasional <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={form.jam_operasional}
                  disabled={!editing}
                  onChange={e => setForm({ ...form, jam_operasional: e.target.value })}
                  placeholder="Contoh: Senin–Jumat: 08:00–17:00"
                  className={`w-full px-3 py-2 border border-gray-300 rounded-lg text-sm transition-colors ${
                    editing ? 'focus:outline-none focus:ring-2 focus:ring-[#0F766E] bg-white' : 'bg-gray-50 text-gray-600'
                  }`}
                />
              </div>

              <div>
                <label className="flex items-center gap-1 text-sm font-medium text-gray-700 mb-1">
                  <FileText size={13} /> Deskripsi
                </label>
                <textarea
                  value={form.deskripsi}
                  disabled={!editing}
                  onChange={e => setForm({ ...form, deskripsi: e.target.value })}
                  rows={3}
                  placeholder="Deskripsi singkat tentang klinik..."
                  className={`w-full px-3 py-2 border border-gray-300 rounded-lg text-sm transition-colors resize-none ${
                    editing ? 'focus:outline-none focus:ring-2 focus:ring-[#0F766E] bg-white' : 'bg-gray-50 text-gray-600'
                  }`}
                />
              </div>
            </div>

            {editing && (
              <div className="flex gap-3 mt-6 pt-4 border-t border-gray-100">
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="flex items-center gap-2 px-5 py-2 bg-[#0F766E] text-white rounded-lg hover:bg-[#0d6b64] disabled:opacity-60 transition-colors text-sm font-medium"
                >
                  <Save size={16} />
                  {saving ? 'Menyimpan...' : 'Simpan Perubahan'}
                </button>
                <button
                  onClick={handleCancel}
                  className="px-5 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm"
                >
                  Batal
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Info Card */}
        <div className="space-y-4">
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Pratinjau</h3>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <Building2 size={16} className="text-[#0F766E] mt-0.5 shrink-0" />
                <div>
                  <p className="text-xs text-gray-400">Nama</p>
                  <p className="text-sm font-medium text-gray-900">{data.nama_klinik || '-'}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Phone size={16} className="text-[#0F766E] mt-0.5 shrink-0" />
                <div>
                  <p className="text-xs text-gray-400">Telepon</p>
                  <p className="text-sm text-gray-700">{data.no_telepon || '-'}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Mail size={16} className="text-[#0F766E] mt-0.5 shrink-0" />
                <div>
                  <p className="text-xs text-gray-400">Email</p>
                  <p className="text-sm text-gray-700">{data.email || '-'}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Clock size={16} className="text-[#0F766E] mt-0.5 shrink-0" />
                <div>
                  <p className="text-xs text-gray-400">Jam Operasional</p>
                  <p className="text-sm text-gray-700">{data.jam_operasional || '-'}</p>
                </div>
              </div>
              {data.alamat && (
                <div className="flex items-start gap-3">
                  <FileText size={16} className="text-[#0F766E] mt-0.5 shrink-0" />
                  <div>
                    <p className="text-xs text-gray-400">Alamat</p>
                    <p className="text-sm text-gray-700">{data.alamat}</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="bg-teal-50 rounded-xl border border-teal-100 p-4">
            <p className="text-sm text-teal-700 font-medium mb-1">Info</p>
            <p className="text-xs text-teal-600">
              Informasi ini ditampilkan di seluruh sistem dan digunakan pada cetakan laporan.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
