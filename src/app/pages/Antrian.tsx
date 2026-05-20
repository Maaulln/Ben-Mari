import { useState, useEffect } from 'react';
import { Users, Clock, CheckCircle, XCircle, Plus, ChevronDown } from 'lucide-react';
import { StatCard } from '../components/StatCard';
import { Badge } from '../components/Badge';
import api from '../../services/api';

interface AntrianItem {
  antrian_id: number;
  nomor_antrian: number;
  tanggal: string;
  status: 'MENUNGGU' | 'DIPANGGIL' | 'SELESAI' | 'BATAL';
  jenis: 'WALKIN' | 'BOOKING';
  pasien?: { nama_lengkap: string; pasien_id: number };
  dokter?: { nama_dokter: string; dokter_id: number };
}

export function Antrian() {
  const [antrianList, setAntrianList] = useState<AntrianItem[]>([]);
  const [dokterList, setDokterList] = useState<any[]>([]);
  const [pasienList, setPasienList] = useState<any[]>([]);
  const [filterTanggal, setFilterTanggal] = useState(new Date().toISOString().split('T')[0]);
  const [filterDokter, setFilterDokter] = useState('');
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [walkinForm, setWalkinForm] = useState({ pasien_id: '', dokter_id: '' });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchDokter();
    fetchPasien();
  }, []);

  useEffect(() => {
    fetchAntrian();
  }, [filterTanggal, filterDokter]);

  const fetchAntrian = async () => {
    try {
      setLoading(true);
      const response = await api.get('/antrian', {
        params: {
          tanggal: filterTanggal,
          dokter_id: filterDokter || undefined,
        },
      });
      const data = response.data?.data ?? response.data;
      setAntrianList(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching antrian:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchDokter = async () => {
    try {
      const response = await api.get('/dokter', { params: { status: 'Y' } });
      setDokterList(response.data);
    } catch (error) {
      console.error('Error fetching dokter:', error);
    }
  };

  const fetchPasien = async () => {
    try {
      const response = await api.get('/pasien');
      setPasienList(response.data);
    } catch (error) {
      console.error('Error fetching pasien:', error);
    }
  };

  const handleUpdateStatus = async (id: number, status: string) => {
    try {
      await api.put(`/antrian/${id}/status`, { status });
      fetchAntrian();
    } catch (error) {
      console.error('Error updating antrian status:', error);
      alert('Gagal mengubah status antrian');
    }
  };

  const handleWalkinSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!walkinForm.pasien_id || !walkinForm.dokter_id) {
      alert('Pasien dan dokter harus dipilih');
      return;
    }
    try {
      setSubmitting(true);
      await api.post('/antrian', {
        pasien_id: Number(walkinForm.pasien_id),
        dokter_id: Number(walkinForm.dokter_id),
        tanggal: filterTanggal,
        jenis: 'WALKIN',
      });
      setShowModal(false);
      setWalkinForm({ pasien_id: '', dokter_id: '' });
      fetchAntrian();
    } catch (error: any) {
      const msg = error.response?.data?.message || 'Gagal menambah antrian';
      alert(msg);
    } finally {
      setSubmitting(false);
    }
  };

  const stats = {
    total: antrianList.length,
    menunggu: antrianList.filter(a => a.status === 'MENUNGGU').length,
    dipanggil: antrianList.filter(a => a.status === 'DIPANGGIL').length,
    selesai: antrianList.filter(a => a.status === 'SELESAI').length,
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Manajemen Antrian</h1>
          <p className="text-gray-500 mt-1">Kelola antrian pasien harian</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-[#0F766E] text-white rounded-lg hover:bg-[#0D6B64] transition-colors"
        >
          <Plus size={18} />
          Tambah Walk-in
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <StatCard title="Total Antrian" value={stats.total} icon={<Users className="text-white" size={24} />} color="bg-blue-500" />
        <StatCard title="Menunggu" value={stats.menunggu} icon={<Clock className="text-white" size={24} />} color="bg-yellow-500" />
        <StatCard title="Dipanggil" value={stats.dipanggil} icon={<ChevronDown className="text-white" size={24} />} color="bg-purple-500" />
        <StatCard title="Selesai" value={stats.selesai} icon={<CheckCircle className="text-white" size={24} />} color="bg-green-500" />
      </div>

      {/* Filters */}
      <div className="flex gap-3 mb-4 flex-wrap">
        <input
          type="date"
          value={filterTanggal}
          onChange={(e) => setFilterTanggal(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0F766E]"
        />
        <select
          value={filterDokter}
          onChange={(e) => setFilterDokter(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0F766E]"
        >
          <option value="">Semua Dokter</option>
          {dokterList.map((d: any) => (
            <option key={d.dokter_id} value={d.dokter_id}>{d.nama_dokter}</option>
          ))}
        </select>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-gray-500">Memuat data...</div>
        ) : antrianList.length === 0 ? (
          <div className="p-8 text-center text-gray-400">Tidak ada antrian untuk tanggal ini</div>
        ) : (
          <table className="w-full">
            <thead className="bg-gray-50 text-xs font-medium text-gray-500 uppercase tracking-wider">
              <tr>
                <th className="px-4 py-3 text-left">No.</th>
                <th className="px-4 py-3 text-left">Pasien</th>
                <th className="px-4 py-3 text-left">Dokter</th>
                <th className="px-4 py-3 text-left">Jenis</th>
                <th className="px-4 py-3 text-left">Status</th>
                <th className="px-4 py-3 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {antrianList.map((antrian) => (
                <tr key={antrian.antrian_id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <span className="w-9 h-9 rounded-full bg-[#0F766E] text-white flex items-center justify-center font-bold text-sm">
                      {antrian.nomor_antrian}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm font-medium text-gray-900">
                    {antrian.pasien?.nama_lengkap || '-'}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">
                    {antrian.dokter?.nama_dokter || '-'}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex px-2 py-0.5 rounded text-xs font-medium ${
                      antrian.jenis === 'WALKIN'
                        ? 'bg-orange-100 text-orange-700'
                        : 'bg-blue-100 text-blue-700'
                    }`}>
                      {antrian.jenis === 'WALKIN' ? 'Walk-in' : 'Booking'}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <Badge status={antrian.status} type="antrian" />
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-center gap-2">
                      {antrian.status === 'MENUNGGU' && (
                        <button
                          onClick={() => handleUpdateStatus(antrian.antrian_id, 'DIPANGGIL')}
                          className="px-3 py-1 text-xs bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                        >
                          Panggil
                        </button>
                      )}
                      {antrian.status === 'DIPANGGIL' && (
                        <button
                          onClick={() => handleUpdateStatus(antrian.antrian_id, 'SELESAI')}
                          className="px-3 py-1 text-xs bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                        >
                          Selesai
                        </button>
                      )}
                      {(antrian.status === 'MENUNGGU' || antrian.status === 'DIPANGGIL') && (
                        <button
                          onClick={() => handleUpdateStatus(antrian.antrian_id, 'BATAL')}
                          className="px-3 py-1 text-xs bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors"
                        >
                          Batal
                        </button>
                      )}
                      {(antrian.status === 'SELESAI' || antrian.status === 'BATAL') && (
                        <span className="text-xs text-gray-400">—</span>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Walk-in Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Tambah Pasien Walk-in</h2>
            <form onSubmit={handleWalkinSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Pasien</label>
                <select
                  value={walkinForm.pasien_id}
                  onChange={(e) => setWalkinForm({ ...walkinForm, pasien_id: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0F766E]"
                  required
                >
                  <option value="">-- Pilih Pasien --</option>
                  {pasienList.map((p: any) => (
                    <option key={p.pasien_id} value={p.pasien_id}>{p.nama_lengkap}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Dokter</label>
                <select
                  value={walkinForm.dokter_id}
                  onChange={(e) => setWalkinForm({ ...walkinForm, dokter_id: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0F766E]"
                  required
                >
                  <option value="">-- Pilih Dokter --</option>
                  {dokterList.map((d: any) => (
                    <option key={d.dokter_id} value={d.dokter_id}>{d.nama_dokter}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tanggal</label>
                <input
                  type="date"
                  value={filterTanggal}
                  readOnly
                  className="w-full px-4 py-2 border border-gray-200 bg-gray-50 rounded-lg text-gray-500"
                />
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => { setShowModal(false); setWalkinForm({ pasien_id: '', dokter_id: '' }); }}
                  className="flex-1 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 py-2 bg-[#0F766E] text-white rounded-lg hover:bg-[#0D6B64] transition-colors disabled:opacity-50"
                >
                  {submitting ? 'Menyimpan...' : 'Tambah Antrian'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
