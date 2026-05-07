import { useState, useEffect } from 'react';
import { Modal } from '../components/Modal';
import { FileText, Plus, ArrowLeft, Pill } from 'lucide-react';
import {
  getRekamMedisDokter,
  getRekamMedisDetail,
  createRekamMedis,
  createResep,
  getAppointmentMenunggu,
  getObatList,
  RekamMedisDokter as RekamMedisType,
  AppointmentDokter,
} from '../../services/doctorService';
import { formatDate } from '../../utils/formatters';

interface DoctorRekamMedisProps {
  dokterId: number;
  createFromAppointmentId?: number;
}

export function DoctorRekamMedis({ dokterId, createFromAppointmentId }: DoctorRekamMedisProps) {
  const [rekamList, setRekamList] = useState<RekamMedisType[]>([]);
  const [selectedRekam, setSelectedRekam] = useState<RekamMedisType | null>(null);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isResepModalOpen, setIsResepModalOpen] = useState(false);
  const [appointmentList, setAppointmentList] = useState<AppointmentDokter[]>([]);
  const [obatList, setObatList] = useState<any[]>([]);

  const [formData, setFormData] = useState({
    APPOINTMENT_ID: createFromAppointmentId || 0,
    KELUHAN: '',
    DIAGNOSIS: '',
    TINDAKAN: '',
    TEKANAN_DARAH: '',
    BERAT_BADAN: 0,
    CATATAN_TAMBAHAN: '',
  });

  const [resepData, setResepData] = useState({
    OBAT_ID: 0,
    DOSIS: '',
    ATURAN_PAKAI: '',
    JUMLAH: 1,
    CATATAN_RESEP: '',
  });

  useEffect(() => {
    loadRekamMedis();
    loadAppointmentMenunggu();
    loadObatList();

    if (createFromAppointmentId) {
      setIsModalOpen(true);
      setFormData((prev) => ({ ...prev, APPOINTMENT_ID: createFromAppointmentId }));
    }
  }, [dokterId]);

  const loadRekamMedis = async () => {
    try {
      setLoading(true);
      const data = await getRekamMedisDokter(dokterId);
      setRekamList(data);
    } catch (error) {
      console.error('Error loading rekam medis:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadAppointmentMenunggu = async () => {
    try {
      const data = await getAppointmentMenunggu(dokterId);
      setAppointmentList(data);
    } catch (error) {
      console.error('Error loading appointments:', error);
    }
  };

  const loadObatList = async () => {
    try {
      const data = await getObatList();
      setObatList(data.filter((o: any) => o.STATUS_AKTIF === 'Y' && o.STOK_TERSEDIA > 0));
    } catch (error) {
      console.error('Error loading obat:', error);
    }
  };

  const handleSubmitRekamMedis = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createRekamMedis(formData);
      alert('Rekam medis berhasil dibuat');
      setIsModalOpen(false);
      loadRekamMedis();
      loadAppointmentMenunggu();
      setFormData({
        APPOINTMENT_ID: 0,
        KELUHAN: '',
        DIAGNOSIS: '',
        TINDAKAN: '',
        TEKANAN_DARAH: '',
        BERAT_BADAN: 0,
        CATATAN_TAMBAHAN: '',
      });
    } catch (error) {
      console.error('Error creating rekam medis:', error);
      alert('Gagal membuat rekam medis');
    }
  };

  const handleOpenDetail = async (rekam: RekamMedisType) => {
    try {
      const detail = await getRekamMedisDetail(rekam.REKAM_ID);
      setSelectedRekam(detail);
    } catch (error) {
      console.error('Error loading detail:', error);
    }
  };

  const handleSubmitResep = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRekam) return;

    try {
      await createResep({
        REKAM_ID: selectedRekam.REKAM_ID,
        ...resepData,
      });
      alert('Resep berhasil ditambahkan');
      setIsResepModalOpen(false);
      setResepData({
        OBAT_ID: 0,
        DOSIS: '',
        ATURAN_PAKAI: '',
        JUMLAH: 1,
        CATATAN_RESEP: '',
      });
      // Reload detail
      handleOpenDetail(selectedRekam);
    } catch (error) {
      console.error('Error creating resep:', error);
      alert('Gagal menambahkan resep');
    }
  };

  if (selectedRekam) {
    return (
      <div className="p-6">
        <div className="mb-6 flex items-center gap-2">
          <button
            onClick={() => setSelectedRekam(null)}
            className="flex items-center gap-2 text-[#0F766E] hover:text-[#0D6B64] font-medium"
          >
            <ArrowLeft size={20} />
            Kembali
          </button>
          <span className="text-gray-400">|</span>
          <h1 className="text-2xl font-bold text-gray-900">Detail Rekam Medis</h1>
        </div>

        <div className="space-y-6">
          {/* Info Pasien */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Informasi Pasien</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-500">Nama Pasien:</span>
                <p className="font-medium">{selectedRekam.pasien?.NAMA_LENGKAP}</p>
              </div>
              <div>
                <span className="text-gray-500">No. Rekam Medis:</span>
                <p className="font-mono font-medium">RM-{String(selectedRekam.REKAM_ID).padStart(3, '0')}/2026</p>
              </div>
              <div>
                <span className="text-gray-500">Tanggal Periksa:</span>
                <p className="font-medium">{formatDate(selectedRekam.TGL_PERIKSA)}</p>
              </div>
            </div>
          </div>

          {/* Data Medis */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Data Medis</h3>
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">Keluhan</label>
                <p className="text-gray-900">{selectedRekam.KELUHAN}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">Diagnosis</label>
                <p className="text-gray-900 font-semibold">{selectedRekam.DIAGNOSIS}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">Tindakan</label>
                <p className="text-gray-900">{selectedRekam.TINDAKAN}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">Tekanan Darah</label>
                  <p className="text-gray-900">{selectedRekam.TEKANAN_DARAH} mmHg</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">Berat Badan</label>
                  <p className="text-gray-900">{selectedRekam.BERAT_BADAN} kg</p>
                </div>
              </div>
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-500 mb-1">Catatan Tambahan</label>
                <p className="text-gray-900">{selectedRekam.CATATAN_TAMBAHAN || '-'}</p>
              </div>
            </div>
          </div>

          {/* Resep */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-900">Resep Obat</h3>
              <button
                onClick={() => setIsResepModalOpen(true)}
                className="flex items-center gap-2 px-3 py-1.5 bg-[#0F766E] hover:bg-[#0D6B64] text-white rounded-lg text-sm font-medium"
              >
                <Plus size={16} />
                Tambah Resep
              </button>
            </div>
            {selectedRekam.resep && selectedRekam.resep.length > 0 ? (
              <table className="w-full">
                <thead className="bg-gray-50 text-xs font-medium text-gray-500 uppercase">
                  <tr>
                    <th className="px-4 py-2 text-left">Nama Obat</th>
                    <th className="px-4 py-2 text-left">Dosis</th>
                    <th className="px-4 py-2 text-left">Aturan Pakai</th>
                    <th className="px-4 py-2 text-left">Jumlah</th>
                    <th className="px-4 py-2 text-left">Catatan</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {selectedRekam.resep.map((r: any) => (
                    <tr key={r.RESEP_ID}>
                      <td className="px-4 py-3 text-sm text-gray-700">{r.obat?.NAMA_OBAT}</td>
                      <td className="px-4 py-3 text-sm text-gray-700">{r.DOSIS}</td>
                      <td className="px-4 py-3 text-sm text-gray-700">{r.ATURAN_PAKAI}</td>
                      <td className="px-4 py-3 text-sm text-gray-700">{r.JUMLAH}</td>
                      <td className="px-4 py-3 text-sm text-gray-500">{r.CATATAN_RESEP || '-'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p className="text-sm text-gray-500 text-center py-4">Belum ada resep</p>
            )}
          </div>
        </div>

        {/* Modal Tambah Resep */}
        <Modal
          isOpen={isResepModalOpen}
          onClose={() => setIsResepModalOpen(false)}
          title="Tambah Resep Obat"
        >
          <form onSubmit={handleSubmitResep} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Pilih Obat <span className="text-red-500">*</span>
              </label>
              <select
                value={resepData.OBAT_ID}
                onChange={(e) => setResepData({ ...resepData, OBAT_ID: Number(e.target.value) })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0F766E]"
                required
              >
                <option value={0}>-- Pilih Obat --</option>
                {obatList.map((obat) => (
                  <option key={obat.OBAT_ID} value={obat.OBAT_ID}>
                    {obat.NAMA_OBAT} (Stok: {obat.STOK_TERSEDIA})
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Dosis <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={resepData.DOSIS}
                  onChange={(e) => setResepData({ ...resepData, DOSIS: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0F766E]"
                  placeholder="500mg"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Jumlah <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  value={resepData.JUMLAH}
                  onChange={(e) => setResepData({ ...resepData, JUMLAH: Number(e.target.value) })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0F766E]"
                  min="1"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Aturan Pakai <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={resepData.ATURAN_PAKAI}
                onChange={(e) => setResepData({ ...resepData, ATURAN_PAKAI: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0F766E]"
                placeholder="3x1 sesudah makan"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Catatan Resep
              </label>
              <textarea
                value={resepData.CATATAN_RESEP}
                onChange={(e) => setResepData({ ...resepData, CATATAN_RESEP: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0F766E]"
                rows={2}
              />
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <button
                type="button"
                onClick={() => setIsResepModalOpen(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
              >
                Batal
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-[#0F766E] text-white rounded-lg hover:bg-[#0D6B64]"
              >
                Simpan Resep
              </button>
            </div>
          </form>
        </Modal>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Rekam Medis</h1>
        <p className="text-gray-500 mt-1">Kelola rekam medis pasien Anda</p>
      </div>

      {/* Action Button */}
      <div className="mb-6">
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-[#0F766E] hover:bg-[#0D6B64] text-white rounded-lg font-medium"
        >
          <Plus size={20} />
          Buat Rekam Medis Baru
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-gray-500">Memuat data...</div>
        ) : rekamList.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            <FileText className="mx-auto mb-2 text-gray-300" size={48} />
            <p>Belum ada rekam medis</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 text-xs font-medium text-gray-500 uppercase tracking-wider">
                <tr>
                  <th className="px-4 py-3 text-left">No. Rekam</th>
                  <th className="px-4 py-3 text-left">Nama Pasien</th>
                  <th className="px-4 py-3 text-left">Tgl. Periksa</th>
                  <th className="px-4 py-3 text-left">Diagnosis</th>
                  <th className="px-4 py-3 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {rekamList.map((rekam) => (
                  <tr key={rekam.REKAM_ID} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm font-mono text-gray-700">
                      RM-{String(rekam.REKAM_ID).padStart(3, '0')}/2026
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-700">
                      {rekam.pasien?.NAMA_LENGKAP}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-700">
                      {formatDate(rekam.TGL_PERIKSA)}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-700">{rekam.DIAGNOSIS}</td>
                    <td className="px-4 py-3 text-center">
                      <button
                        onClick={() => handleOpenDetail(rekam)}
                        className="px-3 py-1.5 bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-sm font-medium"
                      >
                        Detail
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal Create Rekam Medis */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Buat Rekam Medis Baru"
        size="lg"
      >
        <form onSubmit={handleSubmitRekamMedis} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Pilih Appointment <span className="text-red-500">*</span>
            </label>
            <select
              value={formData.APPOINTMENT_ID}
              onChange={(e) => setFormData({ ...formData, APPOINTMENT_ID: Number(e.target.value) })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0F766E]"
              required
              disabled={!!createFromAppointmentId}
            >
              <option value={0}>-- Pilih Appointment --</option>
              {appointmentList.map((apt) => (
                <option key={apt.APPOINTMENT_ID} value={apt.APPOINTMENT_ID}>
                  {apt.pasien?.NAMA_LENGKAP} - {formatDate(apt.TGL_APPOINTMENT)} {apt.JAM_APPOINTMENT}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Keluhan <span className="text-red-500">*</span>
            </label>
            <textarea
              value={formData.KELUHAN}
              onChange={(e) => setFormData({ ...formData, KELUHAN: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0F766E]"
              rows={2}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Diagnosis <span className="text-red-500">*</span>
            </label>
            <textarea
              value={formData.DIAGNOSIS}
              onChange={(e) => setFormData({ ...formData, DIAGNOSIS: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0F766E]"
              rows={2}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tindakan <span className="text-red-500">*</span>
            </label>
            <textarea
              value={formData.TINDAKAN}
              onChange={(e) => setFormData({ ...formData, TINDAKAN: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0F766E]"
              rows={2}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tekanan Darah <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.TEKANAN_DARAH}
                onChange={(e) => setFormData({ ...formData, TEKANAN_DARAH: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0F766E]"
                placeholder="120/80"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Berat Badan (kg) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                value={formData.BERAT_BADAN}
                onChange={(e) => setFormData({ ...formData, BERAT_BADAN: Number(e.target.value) })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0F766E]"
                min="0"
                step="0.1"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Catatan Tambahan
            </label>
            <textarea
              value={formData.CATATAN_TAMBAHAN}
              onChange={(e) => setFormData({ ...formData, CATATAN_TAMBAHAN: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0F766E]"
              rows={3}
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
              Simpan Rekam Medis
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
