import { useState, useEffect } from 'react';
import { StatCard } from '../components/StatCard';
import { Badge } from '../components/Badge';
import { DollarSign, TrendingUp, CreditCard, X, Printer } from 'lucide-react';
import { formatRupiah, formatDate } from '../../utils/formatters';
import api from '../../services/api';

interface TagihanDetail {
  detail_id: number;
  keterangan: string;
  jumlah: number;
  harga_satuan: number;
  subtotal: number;
}

interface TagihanItem {
  tagihan_id: number;
  tgl_tagihan: string;
  biaya_konsultasi: number;
  biaya_obat: number;
  total_biaya: number;
  metode_bayar: string;
  status_bayar: 'BELUM_BAYAR' | 'SEBAGIAN' | 'LUNAS';
  keterangan?: string;
  details?: TagihanDetail[];
  pasien?: { nama_lengkap: string };
  appointment?: { tgl_appointment: string; dokter?: { nama_dokter: string } };
}

export function Tagihan() {
  const [tagihanList, setTagihanList] = useState<TagihanItem[]>([]);
  const [filterStatus, setFilterStatus] = useState('');
  const [loading, setLoading] = useState(true);
  const [selectedTagihan, setSelectedTagihan] = useState<TagihanItem | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [metodeBayar, setMetodeBayar] = useState('TUNAI');
  const [paying, setPaying] = useState(false);

  useEffect(() => {
    fetchTagihan();
  }, []);

  const fetchTagihan = async () => {
    try {
      setLoading(true);
      const response = await api.get('/tagihan');
      setTagihanList(response.data.data ?? response.data);
    } catch (error) {
      console.error('Error fetching tagihan:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDetail = async (tagihan: TagihanItem) => {
    setSelectedTagihan(tagihan);
    setMetodeBayar(tagihan.metode_bayar || 'TUNAI');
    if (!tagihan.details) {
      try {
        setDetailLoading(true);
        const response = await api.get(`/tagihan/${tagihan.tagihan_id}`);
        const full = response.data?.data ?? response.data;
        setSelectedTagihan(full);
      } catch (error) {
        console.error('Error fetching tagihan detail:', error);
      } finally {
        setDetailLoading(false);
      }
    }
  };

  const handleTandaiLunas = async () => {
    if (!selectedTagihan) return;
    try {
      setPaying(true);
      await api.put(`/tagihan/${selectedTagihan.tagihan_id}`, {
        status_bayar: 'LUNAS',
        metode_bayar: metodeBayar,
      });
      setSelectedTagihan(null);
      fetchTagihan();
    } catch (error: any) {
      const msg = error.response?.data?.message || 'Gagal memperbarui tagihan';
      alert(msg);
    } finally {
      setPaying(false);
    }
  };

  const handlePrint = () => {
    window.print();
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
          title="Total Pendapatan"
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

      <div className="mb-4">
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0F766E]"
        >
          <option value="">Semua Status</option>
          <option value="LUNAS">Lunas</option>
          <option value="BELUM_BAYAR">Belum Dibayar</option>
          <option value="SEBAGIAN">Sebagian</option>
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
                <th className="px-4 py-3 text-left">Konsultasi</th>
                <th className="px-4 py-3 text-left">Obat</th>
                <th className="px-4 py-3 text-left">Total</th>
                <th className="px-4 py-3 text-left">Status</th>
                <th className="px-4 py-3 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredTagihan.map((tagihan) => (
                <tr key={tagihan.tagihan_id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm font-medium text-gray-900">
                    {tagihan.pasien?.nama_lengkap || '-'}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">
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
                  <td className="px-4 py-3">
                    <Badge status={tagihan.status_bayar} type="payment" />
                  </td>
                  <td className="px-4 py-3 text-center">
                    <button
                      onClick={() => handleOpenDetail(tagihan)}
                      className="px-3 py-1 text-xs bg-[#0F766E] text-white rounded-lg hover:bg-[#0D6B64] transition-colors"
                    >
                      Detail
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Detail Modal */}
      {selectedTagihan && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto" id="struk-print">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b print:hidden">
              <h2 className="text-lg font-bold text-gray-900">Detail Tagihan</h2>
              <button onClick={() => setSelectedTagihan(null)} className="text-gray-400 hover:text-gray-600">
                <X size={20} />
              </button>
            </div>

            {/* Struk Header (visible in print) */}
            <div className="hidden print:block text-center py-4 border-b">
              <h2 className="text-xl font-bold">Klinik BenMari</h2>
              <p className="text-sm text-gray-500">Struk Pembayaran</p>
            </div>

            {detailLoading ? (
              <div className="p-8 text-center text-gray-500">Memuat detail...</div>
            ) : (
              <div className="p-6 space-y-4">
                {/* Info Pasien */}
                <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Pasien</span>
                    <span className="font-medium">{selectedTagihan.pasien?.nama_lengkap || '-'}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Dokter</span>
                    <span className="font-medium">{selectedTagihan.appointment?.dokter?.nama_dokter || '-'}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Tgl. Kunjungan</span>
                    <span>{formatDate(selectedTagihan.appointment?.tgl_appointment || selectedTagihan.tgl_tagihan)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Tgl. Tagihan</span>
                    <span>{formatDate(selectedTagihan.tgl_tagihan)}</span>
                  </div>
                </div>

                {/* Rincian Biaya */}
                <div>
                  <h3 className="text-sm font-semibold text-gray-700 mb-2">Rincian Biaya</h3>
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b text-gray-500">
                        <th className="text-left pb-1">Keterangan</th>
                        <th className="text-right pb-1">Jml</th>
                        <th className="text-right pb-1">Harga</th>
                        <th className="text-right pb-1">Subtotal</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {selectedTagihan.details && selectedTagihan.details.length > 0 ? (
                        selectedTagihan.details.map((d) => (
                          <tr key={d.detail_id}>
                            <td className="py-1.5 text-gray-700">{d.keterangan}</td>
                            <td className="py-1.5 text-right text-gray-600">{d.jumlah}</td>
                            <td className="py-1.5 text-right text-gray-600">{formatRupiah(d.harga_satuan)}</td>
                            <td className="py-1.5 text-right font-medium">{formatRupiah(d.subtotal)}</td>
                          </tr>
                        ))
                      ) : (
                        <>
                          <tr>
                            <td className="py-1.5 text-gray-700">Biaya Konsultasi</td>
                            <td className="py-1.5 text-right">1</td>
                            <td className="py-1.5 text-right">{formatRupiah(selectedTagihan.biaya_konsultasi)}</td>
                            <td className="py-1.5 text-right font-medium">{formatRupiah(selectedTagihan.biaya_konsultasi)}</td>
                          </tr>
                          {Number(selectedTagihan.biaya_obat) > 0 && (
                            <tr>
                              <td className="py-1.5 text-gray-700">Biaya Obat</td>
                              <td className="py-1.5 text-right">-</td>
                              <td className="py-1.5 text-right">-</td>
                              <td className="py-1.5 text-right font-medium">{formatRupiah(selectedTagihan.biaya_obat)}</td>
                            </tr>
                          )}
                        </>
                      )}
                    </tbody>
                    <tfoot>
                      <tr className="border-t-2 border-gray-300">
                        <td colSpan={3} className="pt-2 font-bold text-gray-900">Total</td>
                        <td className="pt-2 text-right font-bold text-[#0F766E] text-base">{formatRupiah(selectedTagihan.total_biaya)}</td>
                      </tr>
                    </tfoot>
                  </table>
                </div>

                {/* Status */}
                <div className="flex items-center justify-between py-2 border-t">
                  <span className="text-sm text-gray-500">Status Pembayaran</span>
                  <Badge status={selectedTagihan.status_bayar} type="payment" />
                </div>

                {/* Metode Bayar + Aksi (only for belum bayar) */}
                {selectedTagihan.status_bayar === 'BELUM_BAYAR' && (
                  <div className="space-y-3 pt-2 print:hidden">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Metode Pembayaran</label>
                      <select
                        value={metodeBayar}
                        onChange={(e) => setMetodeBayar(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0F766E]"
                      >
                        <option value="TUNAI">Tunai</option>
                        <option value="TRANSFER">Transfer Bank</option>
                        <option value="QRIS">QRIS</option>
                        <option value="KARTU_KREDIT">Kartu Kredit/Debit</option>
                        <option value="BPJS">BPJS</option>
                      </select>
                    </div>
                    <button
                      onClick={handleTandaiLunas}
                      disabled={paying}
                      className="w-full py-2.5 bg-[#0F766E] text-white rounded-lg hover:bg-[#0D6B64] transition-colors font-medium disabled:opacity-50"
                    >
                      {paying ? 'Memproses...' : 'Tandai Lunas'}
                    </button>
                  </div>
                )}

                {selectedTagihan.status_bayar === 'LUNAS' && (
                  <div className="pt-2 print:hidden">
                    <div className="text-sm text-gray-500 mb-1">
                      Metode: <span className="font-medium text-gray-700">{selectedTagihan.metode_bayar || '-'}</span>
                    </div>
                  </div>
                )}

                {/* Print Button */}
                <div className="pt-2 print:hidden">
                  <button
                    onClick={handlePrint}
                    className="w-full flex items-center justify-center gap-2 py-2 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors"
                  >
                    <Printer size={16} />
                    Cetak Struk
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
