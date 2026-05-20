import { useState, useEffect } from 'react';
import { Pill, Package, CheckCircle, Clock } from 'lucide-react';
import { StatCard } from '../components/StatCard';
import api from '../../services/api';

interface ResepItem {
  resep_id: number;
  rekam_id: number;
  jumlah: number;
  dosis: string;
  aturan_pakai: string;
  status_ambil: 'BELUM_DIAMBIL' | 'SUDAH_DIAMBIL' | 'BATAL';
  catatan?: string;
  obat?: { nama_obat: string; satuan: string };
  rekam_medis?: {
    appointment?: {
      pasien?: { nama_lengkap: string };
      dokter?: { nama_dokter: string };
    };
  };
}

export function Resep() {
  const [resepList, setResepList] = useState<ResepItem[]>([]);
  const [filterStatus, setFilterStatus] = useState('');
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState<number | null>(null);

  useEffect(() => {
    fetchResep();
  }, [filterStatus]);

  const fetchResep = async () => {
    try {
      setLoading(true);
      const response = await api.get('/resep', {
        params: filterStatus ? { status_ambil: filterStatus } : {},
      });
      const data = response.data?.data ?? response.data;
      setResepList(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching resep:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSerahkan = async (id: number) => {
    if (!confirm('Tandai resep ini sebagai sudah diambil? Stok obat akan berkurang.')) return;
    try {
      setProcessing(id);
      await api.put(`/resep/${id}`, { status_ambil: 'SUDAH_DIAMBIL' });
      fetchResep();
    } catch (error: any) {
      const msg = error.response?.data?.message || 'Gagal memperbarui status resep';
      alert(msg);
    } finally {
      setProcessing(null);
    }
  };

  const handleBatal = async (id: number) => {
    if (!confirm('Batalkan resep ini?')) return;
    try {
      setProcessing(id);
      await api.put(`/resep/${id}`, { status_ambil: 'BATAL' });
      fetchResep();
    } catch (error: any) {
      const msg = error.response?.data?.message || 'Gagal membatalkan resep';
      alert(msg);
    } finally {
      setProcessing(null);
    }
  };

  const stats = {
    total: resepList.length,
    belumDiambil: resepList.filter(r => r.status_ambil === 'BELUM_DIAMBIL').length,
    sudahDiambil: resepList.filter(r => r.status_ambil === 'SUDAH_DIAMBIL').length,
    batal: resepList.filter(r => r.status_ambil === 'BATAL').length,
  };

  const statusColor = (status: string) => {
    if (status === 'SUDAH_DIAMBIL') return 'bg-green-100 text-green-700';
    if (status === 'BATAL') return 'bg-red-100 text-red-600';
    return 'bg-yellow-100 text-yellow-700';
  };

  const statusLabel = (status: string) => {
    if (status === 'SUDAH_DIAMBIL') return 'Sudah Diambil';
    if (status === 'BATAL') return 'Batal';
    return 'Belum Diambil';
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Farmasi & Resep</h1>
        <p className="text-gray-500 mt-1">Kelola pengambilan resep dan stok obat</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <StatCard title="Total Resep" value={stats.total} icon={<Pill className="text-white" size={24} />} color="bg-blue-500" />
        <StatCard title="Belum Diambil" value={stats.belumDiambil} icon={<Clock className="text-white" size={24} />} color="bg-yellow-500" />
        <StatCard title="Sudah Diambil" value={stats.sudahDiambil} icon={<CheckCircle className="text-white" size={24} />} color="bg-green-500" />
        <StatCard title="Dibatalkan" value={stats.batal} icon={<Package className="text-white" size={24} />} color="bg-red-500" />
      </div>

      {/* Filter */}
      <div className="mb-4">
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0F766E]"
        >
          <option value="">Semua Status</option>
          <option value="BELUM_DIAMBIL">Belum Diambil</option>
          <option value="SUDAH_DIAMBIL">Sudah Diambil</option>
          <option value="BATAL">Batal</option>
        </select>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-gray-500">Memuat data...</div>
        ) : resepList.length === 0 ? (
          <div className="p-8 text-center text-gray-400">Tidak ada data resep</div>
        ) : (
          <table className="w-full">
            <thead className="bg-gray-50 text-xs font-medium text-gray-500 uppercase tracking-wider">
              <tr>
                <th className="px-4 py-3 text-left">Pasien</th>
                <th className="px-4 py-3 text-left">Nama Obat</th>
                <th className="px-4 py-3 text-left">Jumlah</th>
                <th className="px-4 py-3 text-left">Dosis</th>
                <th className="px-4 py-3 text-left">Aturan Pakai</th>
                <th className="px-4 py-3 text-left">Status</th>
                <th className="px-4 py-3 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {resepList.map((resep) => {
                const pasien = resep.rekam_medis?.appointment?.pasien;
                return (
                  <tr key={resep.resep_id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm font-medium text-gray-900">
                      {pasien?.nama_lengkap || '-'}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-700">
                      <div className="font-medium">{resep.obat?.nama_obat || '-'}</div>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-700">
                      {resep.jumlah} {resep.obat?.satuan || ''}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-700">
                      {resep.dosis || '-'}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-700">
                      {resep.aturan_pakai || '-'}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex px-2 py-0.5 rounded text-xs font-medium ${statusColor(resep.status_ambil)}`}>
                        {statusLabel(resep.status_ambil)}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-center gap-2">
                        {resep.status_ambil === 'BELUM_DIAMBIL' && (
                          <>
                            <button
                              onClick={() => handleSerahkan(resep.resep_id)}
                              disabled={processing === resep.resep_id}
                              className="px-3 py-1 text-xs bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
                            >
                              Serahkan
                            </button>
                            <button
                              onClick={() => handleBatal(resep.resep_id)}
                              disabled={processing === resep.resep_id}
                              className="px-3 py-1 text-xs bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors disabled:opacity-50"
                            >
                              Batal
                            </button>
                          </>
                        )}
                        {resep.status_ambil !== 'BELUM_DIAMBIL' && (
                          <span className="text-xs text-gray-400">—</span>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
