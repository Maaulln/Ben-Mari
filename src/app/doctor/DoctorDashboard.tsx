import { useState, useEffect } from 'react';
import { StatCard } from '../components/StatCard';
import { Badge } from '../components/Badge';
import { Calendar, Users, FileText, Clock, Stethoscope } from 'lucide-react';
import { getDashboardStats, getJadwalHariIni, AppointmentDokter } from '../../services/doctorService';
import { formatDate } from '../../utils/formatters';

interface DoctorDashboardProps {
  dokterId: number;
  onNavigateToRekamMedis: (appointmentId: number) => void;
}

export function DoctorDashboard({ dokterId, onNavigateToRekamMedis }: DoctorDashboardProps) {
  const [stats, setStats] = useState({
    appointmentHariIni: 0,
    pasienBulanIni: 0,
    rekamMedisDibuat: 0,
    appointmentMenunggu: 0,
  });
  const [jadwalHariIni, setJadwalHariIni] = useState<AppointmentDokter[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboard();
  }, [dokterId]);

  const loadDashboard = async () => {
    try {
      setLoading(true);
      const [statsData, jadwalData] = await Promise.all([
        getDashboardStats(dokterId),
        getJadwalHariIni(dokterId),
      ]);

      setStats(statsData);
      setJadwalHariIni(jadwalData.sort((a, b) => {
        if (a.JAM_APPOINTMENT !== b.JAM_APPOINTMENT) {
          return a.JAM_APPOINTMENT.localeCompare(b.JAM_APPOINTMENT);
        }
        return a.NOMOR_ANTRIAN - b.NOMOR_ANTRIAN;
      }));
    } catch (error) {
      console.error('Error loading dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center h-64">
        <div className="text-gray-500">Memuat data...</div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard Dokter</h1>
        <p className="text-gray-500 mt-1">Ringkasan aktivitas praktik Anda</p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Appointment Hari Ini"
          value={stats.appointmentHariIni}
          icon={<Calendar className="text-white" size={24} />}
          color="bg-[#0F766E]"
        />
        <StatCard
          title="Pasien Bulan Ini"
          value={stats.pasienBulanIni}
          icon={<Users className="text-white" size={24} />}
          color="bg-blue-500"
        />
        <StatCard
          title="Rekam Medis Dibuat"
          value={stats.rekamMedisDibuat}
          icon={<FileText className="text-white" size={24} />}
          color="bg-green-500"
        />
        <StatCard
          title="Menunggu Pemeriksaan"
          value={stats.appointmentMenunggu}
          icon={<Clock className="text-white" size={24} />}
          color="bg-orange-500"
        />
      </div>

      {/* Jadwal Hari Ini */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-gray-100 flex items-center gap-2">
          <Stethoscope className="text-[#0F766E]" size={20} />
          <h3 className="font-semibold text-gray-800">Jadwal Hari Ini</h3>
          <span className="ml-auto text-sm text-gray-500">
            {formatDate(new Date().toISOString())}
          </span>
        </div>

        {jadwalHariIni.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            <Calendar className="mx-auto mb-2 text-gray-300" size={48} />
            <p>Tidak ada jadwal hari ini</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 text-xs font-medium text-gray-500 uppercase tracking-wider">
                <tr>
                  <th className="px-4 py-3 text-left">No. Antrian</th>
                  <th className="px-4 py-3 text-left">Nama Pasien</th>
                  <th className="px-4 py-3 text-left">Jam</th>
                  <th className="px-4 py-3 text-left">Keluhan Awal</th>
                  <th className="px-4 py-3 text-left">Status</th>
                  <th className="px-4 py-3 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {jadwalHariIni.map((apt) => (
                  <tr key={apt.APPOINTMENT_ID} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3">
                      <span className="font-mono font-semibold text-[#0F766E]">
                        #{apt.NOMOR_ANTRIAN}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-700">
                      {apt.pasien?.NAMA_LENGKAP || '-'}
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
                    <td className="px-4 py-3 text-center">
                      {apt.STATUS === 'MENUNGGU' && (
                        <button
                          onClick={() => onNavigateToRekamMedis(apt.APPOINTMENT_ID)}
                          className="px-3 py-1.5 bg-[#0F766E] hover:bg-[#0D6B64] text-white rounded-lg text-sm font-medium transition-colors"
                        >
                          Mulai Periksa
                        </button>
                      )}
                      {apt.STATUS === 'SELESAI' && (
                        <span className="text-xs text-gray-400">Selesai</span>
                      )}
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
