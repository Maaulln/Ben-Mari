import { useState, useEffect } from 'react';
import { StatCard } from '../components/StatCard';
import { Badge } from '../components/Badge';
import { DollarSign, TrendingUp, CreditCard, CheckCircle } from 'lucide-react';
import { formatRupiah, formatDate } from '../../utils/formatters';
import api from '../../services/api';

export function Tagihan() {
  const [tagihanList, setTagihanList] = useState<any[]>([]);
  const [filterStatus, setFilterStatus] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTagihan();
  }, []);

  const fetchTagihan = async () => {
    try {
      setLoading(true);
      const response = await api.get('/tagihan');
      setTagihanList(response.data.data);
    } catch (error) {
      console.error('Error fetching tagihan:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleTandaiLunas = async (id: number) => {
    try {
      await api.put(`/tagihan/${id}`, { status_bayar: 'LUNAS' });
      fetchTagihan();
    } catch (error) {
      console.error('Error updating tagihan:', error);
    }
  };

  const totalPendapatan = tagihanList
    .filter(t => t.status_bayar === 'LUNAS')
    .reduce((sum, t) => sum + Number(t.total_biaya), 0);

  const totalBelum = tagihanList
    .filter(t => t.status_bayar === 'BELUM_BAYAR')
    .reduce((sum, t) => sum + Number(t.total_biaya), 0);

  const rataRata = tagihanList.length > 0
    ? tagihanList.reduce((sum, t) => sum + Number(t.total_biaya), 0) / tagihanList.length
    : 0;

  const filteredTagihan = filterStatus
    ? tagihanList.filter(t => t.status_bayar === filterStatus)
    : tagihanList;

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Tagihan & Pembayaran</h1>
        <p className="text-gray-500 mt-1">Kelola pembayaran dan keuangan klinik</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <StatCard
          title="Total Pendapatan Bulan Ini"
          value={formatRupiah(totalPendapatan)}
          icon={<DollarSign className="text-white" size={24} />}
          color="bg-blue-500"
        />
        <StatCard
          title="Total Belum Dibayar"
          value={formatRupiah(totalBelum)}
          icon={<TrendingUp className="text-white" size={24} />}
          color="bg-red-500"
        />
        <StatCard
          title="Rata-rata Tagihan"
          value={formatRupiah(rataRata)}
          icon={<CreditCard className="text-white" size={24} />}
          color="bg-green-500"
        />
      </div>

      <div className="mb-6">
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0F766E]"
        >
          <option value="">Semua Status</option>
          <option value="LUNAS">Lunas</option>
          <option value="BELUM_BAYAR">Belum Dibayar</option>
          <option value="CICIL">Cicil</option>
        </select>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-gray-500">Memuat data...</div>
        ) : (
          <table className="w-full">
            <thead className="bg-gray-50 text-xs font-medium text-gray-500 uppercase tracking-wider">
              <tr>
                <th className="px-4 py-3 text-left">Pasien</th>
                <th className="px-4 py-3 text-left">Tgl. Tagihan</th>
                <th className="px-4 py-3 text-left">Biaya Konsultasi</th>
                <th className="px-4 py-3 text-left">Biaya Obat</th>
                <th className="px-4 py-3 text-left">Total</th>
                <th className="px-4 py-3 text-left">Metode Bayar</th>
                <th className="px-4 py-3 text-left">Status</th>
                <th className="px-4 py-3 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredTagihan.map((tagihan) => (
                <tr key={tagihan.tagihan_id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm text-gray-700">
                    {tagihan.pasien?.nama_lengkap}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-700">
                    {formatDate(tagihan.tgl_tagihan)}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-700">
                    {formatRupiah(tagihan.biaya_konsultasi)}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-700">
                    {formatRupiah(tagihan.biaya_obat)}
                  </td>
                  <td className="px-4 py-3 text-sm font-semibold text-[#0F766E]">
                    {formatRupiah(tagihan.total_biaya)}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-700">
                    {tagihan.metode_bayar || '-'}
                  </td>
                  <td className="px-4 py-3">
                    <Badge status={tagihan.status_bayar} type="payment" />
                  </td>
                  <td className="px-4 py-3 text-center">
                    {tagihan.status_bayar === 'BELUM_BAYAR' && (
                      <button
                        onClick={() => handleTandaiLunas(tagihan.tagihan_id)}
                        className="text-green-600 hover:text-green-800 font-medium text-sm flex items-center gap-1 mx-auto"
                      >
                        <CheckCircle size={16} />
                        Tandai Lunas
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}