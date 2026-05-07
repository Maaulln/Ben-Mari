import { useState, useEffect } from 'react';
import { Badge } from '../components/Badge';
import { Calendar, Filter, Eye, Stethoscope } from 'lucide-react';
import { getJadwalDokter, AppointmentDokter } from '../../services/doctorService';
import { formatDate } from '../../utils/formatters';

interface DoctorJadwalProps {
  dokterId: number;
  onPeriksaClick: (appointmentId: number) => void;
  onLihatRekamClick: (appointmentId: number) => void;
}

export function DoctorJadwal({ dokterId, onPeriksaClick, onLihatRekamClick }: DoctorJadwalProps) {
  const [jadwalList, setJadwalList] = useState<AppointmentDokter[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterTanggal, setFilterTanggal] = useState('');
  const [filterStatus, setFilterStatus] = useState('');

  useEffect(() => {
    loadJadwal();
  }, [dokterId, filterTanggal, filterStatus]);

  const loadJadwal = async () => {
    try {
      setLoading(true);
      const data = await getJadwalDokter(dokterId, filterTanggal, filterStatus);
      setJadwalList(data);
    } catch (error) {
      console.error('Error loading jadwal:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Jadwal Saya</h1>
        <p className="text-gray-500 mt-1">Kelola jadwal appointment Anda</p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 mb-6">
        <div className="flex items-center gap-2 mb-3">
          <Filter className="text-[#0F766E]" size={18} />
          <span className="font-medium text-gray-700">Filter</span>
        </div>
        <div className="flex gap-4">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">Tanggal</label>
            <input
              type="date"
              value={filterTanggal}
              onChange={(e) => setFilterTanggal(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0F766E]"
            />
          </div>
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0F766E]"
            >
              <option value="">Semua Status</option>
              <option value="MENUNGGU">Menunggu</option>
              <option value="SELESAI">Selesai</option>
              <option value="BATAL">Batal</option>
            </select>
          </div>
          {(filterTanggal || filterStatus) && (
            <div className="flex items-end">
              <button
                onClick={() => {
                  setFilterTanggal('');
                  setFilterStatus('');
                }}
                className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 underline"
              >
                Reset Filter
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-gray-500">Memuat data...</div>
        ) : jadwalList.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            <Calendar className="mx-auto mb-2 text-gray-300" size={48} />
            <p>Tidak ada jadwal ditemukan</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 text-xs font-medium text-gray-500 uppercase tracking-wider">
                <tr>
                  <th className="px-4 py-3 text-left">No. Antrian</th>
                  <th className="px-4 py-3 text-left">Nama Pasien</th>
                  <th className="px-4 py-3 text-left">Tanggal</th>
                  <th className="px-4 py-3 text-left">Jam</th>
                  <th className="px-4 py-3 text-left">Keluhan Awal</th>
                  <th className="px-4 py-3 text-left">Status</th>
                  <th className="px-4 py-3 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {jadwalList.map((apt) => (
                  <tr key={apt.APPOINTMENT_ID} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3">
                      <span className="font-mono font-semibold text-[#0F766E]">
                        #{apt.NOMOR_ANTRIAN}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-700">
                      {apt.pasien?.NAMA_LENGKAP || '-'}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-700">
                      {formatDate(apt.TGL_APPOINTMENT)}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-700 font-mono">
                      {apt.JAM_APPOINTMENT}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-700">
                      {apt.KELUHAN_AWAL || '-'}
                    </td>
                    <td className="px-4 py-3">
                      <Badge status={apt.STATUS} type="appointment" />
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-center gap-2">
                        {apt.STATUS === 'MENUNGGU' && (
                          <button
                            onClick={() => onPeriksaClick(apt.APPOINTMENT_ID)}
                            className="flex items-center gap-1 px-3 py-1.5 bg-[#0F766E] hover:bg-[#0D6B64] text-white rounded-lg text-sm font-medium transition-colors"
                          >
                            <Stethoscope size={14} />
                            Periksa
                          </button>
                        )}
                        {apt.STATUS === 'SELESAI' && (
                          <button
                            onClick={() => onLihatRekamClick(apt.APPOINTMENT_ID)}
                            className="flex items-center gap-1 px-3 py-1.5 bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-sm font-medium transition-colors"
                          >
                            <Eye size={14} />
                            Lihat Rekam
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
