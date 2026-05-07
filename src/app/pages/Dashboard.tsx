import { useState, useEffect } from 'react';
import { StatCard } from '../components/StatCard';
import { Badge } from '../components/Badge';
import { Users, Calendar, DollarSign, AlertCircle } from 'lucide-react';
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { formatRupiah, formatDate } from '../../utils/formatters';
import * as adminService from '../../services/adminService';
import { toast } from 'sonner';

export function Dashboard() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const data = await adminService.getDashboardStats();
      setStats(data);
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      toast.error('Gagal mengambil data dashboard');
    } finally {
      setLoading(false);
    }
  };

  if (loading || !stats) {
    return <div className="p-6 text-center">Loading data dashboard...</div>;
  }

  const { totalPasien, appointmentHariIni, tagihanPending, stokMenipis, statusDistribution, recentAppointments } = stats;

  // Chart data - Appointment per hari (Mocked for now as we don't have historical API)
  const appointmentChartData = [
    { hari: 'Sen', jumlah: 8 },
    { hari: 'Sel', jumlah: 12 },
    { hari: 'Rab', jumlah: 10 },
    { hari: 'Kam', jumlah: 14 },
    { hari: 'Jum', jumlah: 11 },
    { hari: 'Sab', jumlah: 9 },
    { hari: 'Min', jumlah: 5 },
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-500 mt-1">Ringkasan aktivitas klinik hari ini</p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Pasien Terdaftar"
          value={totalPasien}
          icon={<Users className="text-white" size={24} />}
          color="bg-blue-500"
        />
        <StatCard
          title="Appointment Hari Ini"
          value={appointmentHariIni}
          icon={<Calendar className="text-white" size={24} />}
          color="bg-[#0F766E]"
        />
        <StatCard
          title="Tagihan Pending"
          value={tagihanPending}
          icon={<DollarSign className="text-white" size={24} />}
          color="bg-red-500"
        />
        <StatCard
          title="Stok Obat Menipis"
          value={stokMenipis}
          icon={<AlertCircle className="text-white" size={24} />}
          color="bg-orange-500"
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Bar Chart */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
          <h3 className="font-semibold text-gray-800 mb-4">Appointment 7 Hari Terakhir</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={appointmentChartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="hari" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="jumlah" fill="#0F766E" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Pie Chart */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
          <h3 className="font-semibold text-gray-800 mb-4">Status Appointment</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={statusDistribution}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {statusDistribution.map((entry: any, index: number) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Appointments Table */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-gray-100">
          <h3 className="font-semibold text-gray-800">Appointment Terbaru</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 text-xs font-medium text-gray-500 uppercase tracking-wider">
              <tr>
                <th className="px-4 py-3 text-left">Pasien</th>
                <th className="px-4 py-3 text-left">Dokter</th>
                <th className="px-4 py-3 text-left">Tanggal</th>
                <th className="px-4 py-3 text-left">Jam</th>
                <th className="px-4 py-3 text-left">No. Antrian</th>
                <th className="px-4 py-3 text-left">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {recentAppointments.map((apt) => (
                <tr key={apt.APPOINTMENT_ID} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3 text-sm text-gray-700">{apt.pasien?.NAMA_LENGKAP}</td>
                  <td className="px-4 py-3 text-sm text-gray-700">{apt.dokter?.NAMA_DOKTER}</td>
                  <td className="px-4 py-3 text-sm text-gray-700">{formatDate(apt.TGL_APPOINTMENT)}</td>
                  <td className="px-4 py-3 text-sm text-gray-700">{apt.JAM_APPOINTMENT}</td>
                  <td className="px-4 py-3 text-sm text-gray-700 font-mono">{apt.NOMOR_ANTRIAN}</td>
                  <td className="px-4 py-3">
                    <Badge status={apt.STATUS} type="appointment" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
