import { useState, useEffect } from 'react';
import { Modal } from '../components/Modal';
import { Badge } from '../components/Badge';
import { Plus, Check, X } from 'lucide-react';
import { Pasien as PasienType, Dokter as DokterType, Appointment as AppointmentType } from '../../data/mockData';
import { formatDate } from '../../utils/formatters';
import * as adminService from '../../services/adminService';
import { toast } from 'sonner';

export function Appointment() {
  const [appointmentList, setAppointmentList] = useState<AppointmentType[]>([]);
  const [pasienList, setPasienList] = useState<PasienType[]>([]);
  const [dokterList, setDokterList] = useState<DokterType[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filterStatus, setFilterStatus] = useState('');

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    try {
      setLoading(true);
      const [apts, pasiens, dokters] = await Promise.all([
        adminService.getAllAppointment(),
        adminService.getAllPasien(),
        adminService.getAllDokter(),
      ]);
      setAppointmentList(apts);
      setPasienList(pasiens);
      setDokterList(dokters);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Gagal mengambil data');
    } finally {
      setLoading(false);
    }
  };

  const fetchAppointments = async () => {
    try {
      const data = await adminService.getAllAppointment();
      setAppointmentList(data);
    } catch (error) {
      console.error('Error fetching appointments:', error);
    }
  };
  const [formData, setFormData] = useState<Partial<AppointmentType>>({
    PASIEN_ID: 0,
    DOKTER_ID: 0,
    TGL_APPOINTMENT: '',
    JAM_APPOINTMENT: '',
    KELUHAN_AWAL: '',
    STATUS: 'MENUNGGU',
  });

  const filteredAppointments = filterStatus
    ? appointmentList.filter((a) => a.STATUS === filterStatus)
    : appointmentList;

  const handleOpenModal = () => {
    if (pasienList.length === 0 || dokterList.length === 0) {
      toast.error('Data pasien atau dokter belum tersedia');
      return;
    }
    setFormData({
      PASIEN_ID: pasienList[0].PASIEN_ID,
      DOKTER_ID: dokterList[0].DOKTER_ID,
      TGL_APPOINTMENT: new Date().toISOString().split('T')[0],
      JAM_APPOINTMENT: '09:00',
      KELUHAN_AWAL: '',
      STATUS: 'MENUNGGU',
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await adminService.createAppointmentAdmin(formData);
      toast.success('Appointment berhasil dibuat');
      setIsModalOpen(false);
      fetchAppointments();
    } catch (error) {
      console.error('Error creating appointment:', error);
      toast.error('Gagal membuat appointment');
    }
  };

  const handleUpdateStatus = async (id: number, status: 'SELESAI' | 'BATAL') => {
    try {
      await adminService.updateAppointmentStatus(id, status);
      toast.success(`Status berhasil diperbarui menjadi ${status}`);
      fetchAppointments();
    } catch (error) {
      console.error('Error updating status:', error);
      toast.error('Gagal memperbarui status');
    }
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Manajemen Appointment</h1>
        <p className="text-gray-500 mt-1">Kelola jadwal kunjungan pasien</p>
      </div>

      <div className="flex gap-4 mb-6">
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0F766E]"
        >
          <option value="">Semua Status</option>
          <option value="MENUNGGU">Menunggu</option>
          <option value="SELESAI">Selesai</option>
          <option value="BATAL">Batal</option>
        </select>
        <button
          onClick={handleOpenModal}
          className="ml-auto bg-[#0F766E] text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-[#0D6B64]"
        >
          <Plus size={20} />
          Buat Appointment
        </button>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 text-xs font-medium text-gray-500 uppercase tracking-wider">
            <tr>
              <th className="px-4 py-3 text-left">Pasien</th>
              <th className="px-4 py-3 text-left">Dokter</th>
              <th className="px-4 py-3 text-left">Tanggal</th>
              <th className="px-4 py-3 text-left">Jam</th>
              <th className="px-4 py-3 text-left">No. Antrian</th>
              <th className="px-4 py-3 text-left">Keluhan</th>
              <th className="px-4 py-3 text-left">Status</th>
              <th className="px-4 py-3 text-center">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filteredAppointments.map((apt) => {
              return (
                <tr key={apt.APPOINTMENT_ID} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm text-gray-700">{apt.pasien?.NAMA_LENGKAP || 'Unknown'}</td>
                  <td className="px-4 py-3 text-sm text-gray-700">{apt.dokter?.NAMA_DOKTER || 'Unknown'}</td>
                  <td className="px-4 py-3 text-sm text-gray-700">{formatDate(apt.TGL_APPOINTMENT)}</td>
                  <td className="px-4 py-3 text-sm text-gray-700">{apt.JAM_APPOINTMENT}</td>
                  <td className="px-4 py-3 text-sm text-gray-700 font-mono">{apt.NOMOR_ANTRIAN}</td>
                  <td className="px-4 py-3 text-sm text-gray-700">{apt.KELUHAN_AWAL}</td>
                  <td className="px-4 py-3">
                    <Badge status={apt.STATUS} type="appointment" />
                  </td>
                  <td className="px-4 py-3">
                    {apt.STATUS === 'MENUNGGU' && (
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => handleUpdateStatus(apt.APPOINTMENT_ID, 'SELESAI')}
                          className="text-green-600 hover:text-green-800"
                          title="Tandai Selesai"
                        >
                          <Check size={16} />
                        </button>
                        <button
                          onClick={() => handleUpdateStatus(apt.APPOINTMENT_ID, 'BATAL')}
                          className="text-red-600 hover:text-red-800"
                          title="Batalkan"
                        >
                          <X size={16} />
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Buat Appointment Baru"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Pasien</label>
            <select
              value={formData.PASIEN_ID}
              onChange={(e) => setFormData({ ...formData, PASIEN_ID: Number(e.target.value) })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0F766E]"
            >
              {pasienList.filter(p => p.STATUS_AKTIF === 'Y').map((p) => (
                <option key={p.PASIEN_ID} value={p.PASIEN_ID}>
                  {p.NAMA_LENGKAP}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Dokter</label>
            <select
              value={formData.DOKTER_ID}
              onChange={(e) => setFormData({ ...formData, DOKTER_ID: Number(e.target.value) })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0F766E]"
            >
              {dokterList.filter(d => d.STATUS_AKTIF === 'Y').map((d) => (
                <option key={d.DOKTER_ID} value={d.DOKTER_ID}>
                  {d.NAMA_DOKTER} - {d.SPESIALISASI}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tanggal</label>
              <input
                type="date"
                value={formData.TGL_APPOINTMENT}
                onChange={(e) => setFormData({ ...formData, TGL_APPOINTMENT: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0F766E]"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Jam</label>
              <input
                type="time"
                value={formData.JAM_APPOINTMENT}
                onChange={(e) => setFormData({ ...formData, JAM_APPOINTMENT: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0F766E]"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Keluhan Awal</label>
            <textarea
              value={formData.KELUHAN_AWAL}
              onChange={(e) => setFormData({ ...formData, KELUHAN_AWAL: e.target.value })}
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
              Simpan
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
