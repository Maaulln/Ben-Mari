import { useState } from 'react';
import { StatCard } from '../components/StatCard';
import { Badge } from '../components/Badge';
import { DollarSign, TrendingUp, CreditCard, CheckCircle } from 'lucide-react';
import { mockTagihan, mockPasien, Tagihan as TagihanType } from '../../data/mockData';
import { formatRupiah, formatDate } from '../../utils/formatters';

export function Tagihan() {
  const [tagihanList, setTagihanList] = useState<TagihanType[]>(mockTagihan);
  const [filterStatus, setFilterStatus] = useState('');

  const totalPendapatan = tagihanList
    .filter(t => t.STATUS_BAYAR === 'LUNAS')
    .reduce((sum, t) => sum + t.TOTAL_BIAYA, 0);

  const totalBelum = tagihanList
    .filter(t => t.STATUS_BAYAR === 'BELUM')
    .reduce((sum, t) => sum + t.TOTAL_BIAYA, 0);

  const rataRata = tagihanList.length > 0
    ? tagihanList.reduce((sum, t) => sum + t.TOTAL_BIAYA, 0) / tagihanList.length
    : 0;

  const filteredTagihan = filterStatus
    ? tagihanList.filter(t => t.STATUS_BAYAR === filterStatus)
    : tagihanList;

  const handleTandaiLunas = (id: number) => {
    setTagihanList(
      tagihanList.map(t =>
        t.TAGIHAN_ID === id ? { ...t, STATUS_BAYAR: 'LUNAS' as 'LUNAS' } : t
      )
    );
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Tagihan & Pembayaran</h1>
        <p className="text-gray-500 mt-1">Kelola pembayaran dan keuangan klinik</p>
      </div>

      {/* Summary Cards */}
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

      {/* Filter */}
      <div className="mb-6">
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0F766E]"
        >
          <option value="">Semua Status</option>
          <option value="LUNAS">Lunas</option>
          <option value="BELUM">Belum Dibayar</option>
          <option value="CICIL">Cicil</option>
        </select>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
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
            {filteredTagihan.map((tagihan) => {
              const pasien = mockPasien.find(p => p.PASIEN_ID === tagihan.PASIEN_ID);

              return (
                <tr key={tagihan.TAGIHAN_ID} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm text-gray-700">{pasien?.NAMA_LENGKAP}</td>
                  <td className="px-4 py-3 text-sm text-gray-700">{formatDate(tagihan.TGL_TAGIHAN)}</td>
                  <td className="px-4 py-3 text-sm text-gray-700">{formatRupiah(tagihan.BIAYA_KONSULTASI)}</td>
                  <td className="px-4 py-3 text-sm text-gray-700">{formatRupiah(tagihan.BIAYA_OBAT)}</td>
                  <td className="px-4 py-3 text-sm font-semibold text-[#0F766E]">{formatRupiah(tagihan.TOTAL_BIAYA)}</td>
                  <td className="px-4 py-3 text-sm text-gray-700">{tagihan.METODE_BAYAR}</td>
                  <td className="px-4 py-3">
                    <Badge status={tagihan.STATUS_BAYAR} type="payment" />
                  </td>
                  <td className="px-4 py-3 text-center">
                    {tagihan.STATUS_BAYAR === 'BELUM' && (
                      <button
                        onClick={() => handleTandaiLunas(tagihan.TAGIHAN_ID)}
                        className="text-green-600 hover:text-green-800 font-medium text-sm flex items-center gap-1 mx-auto"
                      >
                        <CheckCircle size={16} />
                        Tandai Lunas
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
