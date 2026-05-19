import { useState, useEffect, useRef } from 'react';
import { FileText, TrendingUp, Printer, Users, DollarSign, Calendar } from 'lucide-react';
import { getLaporanKunjungan, getLaporanPendapatan } from '../../services/adminService';
import { formatRupiah, formatDate } from '../../utils/formatters';
import { toast } from 'sonner';

type TabType = 'kunjungan' | 'pendapatan';
type PeriodeType = 'harian' | 'bulanan';

interface KunjunganItem {
  appointment_id: number;
  tgl_appointment: string;
  jam_appointment: string;
  status: string;
  keluhan_awal: string;
  pasien?: { nama_lengkap: string; nik: string };
  dokter?: { nama_dokter: string; spesialisasi: string };
}

interface PendapatanItem {
  tagihan_id: number;
  tgl_tagihan: string;
  total_biaya: number;
  biaya_konsultasi: number;
  biaya_obat: number;
  metode_bayar: string;
  status_bayar: string;
  pasien?: { nama_lengkap: string };
  appointment?: { dokter?: { nama_dokter: string } };
}

export function Laporan() {
  const [tab, setTab] = useState<TabType>('kunjungan');
  const [periode, setPeriode] = useState<PeriodeType>('bulanan');
  const [tanggal, setTanggal] = useState(new Date().toISOString().slice(0, 10));
  const [bulan, setBulan] = useState(new Date().getMonth() + 1);
  const [tahun, setTahun] = useState(new Date().getFullYear());

  const [kunjunganData, setKunjunganData] = useState<{ total: number; kunjungan: KunjunganItem[] } | null>(null);
  const [pendapatanData, setPendapatanData] = useState<{ total_pendapatan: number; jumlah_tagihan: number; tagihan: PendapatanItem[] } | null>(null);
  const [loading, setLoading] = useState(false);

  const printRef = useRef<HTMLDivElement>(null);

  const namaBulan = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];

  const fetchLaporan = async () => {
    setLoading(true);
    try {
      const params = periode === 'harian'
        ? { periode, tanggal }
        : { periode, bulan, tahun };

      if (tab === 'kunjungan') {
        const res = await getLaporanKunjungan(params);
        setKunjunganData(res.data);
      } else {
        const res = await getLaporanPendapatan(params);
        setPendapatanData(res.data);
      }
    } catch {
      toast.error('Gagal memuat laporan.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLaporan();
  }, [tab, periode, tanggal, bulan, tahun]);

  const handlePrint = () => window.print();

  const periodLabel = periode === 'harian'
    ? formatDate(tanggal)
    : `${namaBulan[bulan - 1]} ${tahun}`;

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Laporan</h1>
          <p className="text-gray-500 mt-1">Laporan kunjungan dan pendapatan klinik</p>
        </div>
        <button
          onClick={handlePrint}
          className="flex items-center gap-2 px-4 py-2 bg-[#0F766E] text-white rounded-lg hover:bg-[#0d6b64] transition-colors text-sm font-medium print:hidden"
        >
          <Printer size={16} />
          Cetak Laporan
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-gray-100 p-1 rounded-lg w-fit mb-6 print:hidden">
        <button
          onClick={() => setTab('kunjungan')}
          className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            tab === 'kunjungan' ? 'bg-white text-[#0F766E] shadow-sm' : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <Users size={16} />
          Kunjungan
        </button>
        <button
          onClick={() => setTab('pendapatan')}
          className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            tab === 'pendapatan' ? 'bg-white text-[#0F766E] shadow-sm' : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <DollarSign size={16} />
          Pendapatan
        </button>
      </div>

      {/* Filter */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 mb-6 print:hidden">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2">
            <Calendar size={16} className="text-gray-500" />
            <span className="text-sm font-medium text-gray-700">Periode:</span>
          </div>

          <select
            value={periode}
            onChange={e => setPeriode(e.target.value as PeriodeType)}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0F766E]"
          >
            <option value="harian">Harian</option>
            <option value="bulanan">Bulanan</option>
          </select>

          {periode === 'harian' ? (
            <input
              type="date"
              value={tanggal}
              onChange={e => setTanggal(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0F766E]"
            />
          ) : (
            <div className="flex gap-2">
              <select
                value={bulan}
                onChange={e => setBulan(Number(e.target.value))}
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0F766E]"
              >
                {namaBulan.map((n, i) => (
                  <option key={i + 1} value={i + 1}>{n}</option>
                ))}
              </select>
              <select
                value={tahun}
                onChange={e => setTahun(Number(e.target.value))}
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0F766E]"
              >
                {[2024, 2025, 2026, 2027].map(y => (
                  <option key={y} value={y}>{y}</option>
                ))}
              </select>
            </div>
          )}
        </div>
      </div>

      {/* Printable Content */}
      <div ref={printRef}>
        {/* Print Header - hanya muncul saat cetak */}
        <div className="hidden print:block mb-6 border-b pb-4">
          <h2 className="text-xl font-bold">Klinik BenMari</h2>
          <p className="text-gray-600 text-sm">
            Laporan {tab === 'kunjungan' ? 'Kunjungan Pasien' : 'Pendapatan'} — {periodLabel}
          </p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-40">
            <div className="w-8 h-8 border-4 border-[#0F766E] border-t-transparent rounded-full animate-spin" />
          </div>
        ) : tab === 'kunjungan' ? (
          <KunjunganPanel data={kunjunganData} periodLabel={periodLabel} />
        ) : (
          <PendapatanPanel data={pendapatanData} periodLabel={periodLabel} />
        )}
      </div>

      <style>{`
        @media print {
          body > * { display: none; }
          #root > div > main { display: block !important; }
          .print\\:hidden { display: none !important; }
          .print\\:block { display: block !important; }
        }
      `}</style>
    </div>
  );
}

function KunjunganPanel({ data, periodLabel }: { data: { total: number; kunjungan: KunjunganItem[] } | null; periodLabel: string }) {
  if (!data) return null;

  return (
    <div>
      {/* Stat */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 flex items-center gap-4">
          <div className="w-12 h-12 bg-teal-50 rounded-lg flex items-center justify-center">
            <Users size={24} className="text-[#0F766E]" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Total Kunjungan</p>
            <p className="text-2xl font-bold text-gray-900">{data.total}</p>
            <p className="text-xs text-gray-400">{periodLabel}</p>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 flex items-center gap-4">
          <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center">
            <TrendingUp size={24} className="text-blue-600" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Rata-rata Per Hari</p>
            <p className="text-2xl font-bold text-gray-900">
              {data.kunjungan.length > 0
                ? (data.total / Math.max(1, new Set(data.kunjungan.map(k => k.tgl_appointment)).size)).toFixed(1)
                : 0}
            </p>
            <p className="text-xs text-gray-400">pasien/hari</p>
          </div>
        </div>
      </div>

      {/* Tabel */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-gray-100">
          <h3 className="font-semibold text-gray-900 flex items-center gap-2">
            <FileText size={16} className="text-[#0F766E]" />
            Detail Kunjungan
          </h3>
        </div>
        {data.kunjungan.length === 0 ? (
          <div className="p-8 text-center text-gray-400">Tidak ada data kunjungan pada periode ini.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left font-medium text-gray-600">No</th>
                  <th className="px-4 py-3 text-left font-medium text-gray-600">Tanggal</th>
                  <th className="px-4 py-3 text-left font-medium text-gray-600">Pasien</th>
                  <th className="px-4 py-3 text-left font-medium text-gray-600">Dokter</th>
                  <th className="px-4 py-3 text-left font-medium text-gray-600">Spesialisasi</th>
                  <th className="px-4 py-3 text-left font-medium text-gray-600">Keluhan</th>
                  <th className="px-4 py-3 text-left font-medium text-gray-600">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {data.kunjungan.map((k, i) => (
                  <tr key={k.appointment_id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3 text-gray-500">{i + 1}</td>
                    <td className="px-4 py-3 text-gray-700 whitespace-nowrap">
                      {formatDate(k.tgl_appointment)}
                      <span className="ml-1 text-gray-400 text-xs">{k.jam_appointment}</span>
                    </td>
                    <td className="px-4 py-3 font-medium text-gray-900">{k.pasien?.nama_lengkap ?? '-'}</td>
                    <td className="px-4 py-3 text-gray-700">{k.dokter?.nama_dokter ?? '-'}</td>
                    <td className="px-4 py-3 text-gray-500 text-xs">{k.dokter?.spesialisasi ?? '-'}</td>
                    <td className="px-4 py-3 text-gray-600 max-w-[200px] truncate">{k.keluhan_awal ?? '-'}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        k.status === 'SELESAI' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'
                      }`}>
                        {k.status}
                      </span>
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

function PendapatanPanel({ data, periodLabel }: { data: { total_pendapatan: number; jumlah_tagihan: number; tagihan: PendapatanItem[] } | null; periodLabel: string }) {
  if (!data) return null;

  const rataRata = data.jumlah_tagihan > 0 ? data.total_pendapatan / data.jumlah_tagihan : 0;

  return (
    <div>
      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 flex items-center gap-4">
          <div className="w-12 h-12 bg-green-50 rounded-lg flex items-center justify-center">
            <DollarSign size={24} className="text-green-600" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Total Pendapatan</p>
            <p className="text-xl font-bold text-gray-900">{formatRupiah(data.total_pendapatan)}</p>
            <p className="text-xs text-gray-400">{periodLabel}</p>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 flex items-center gap-4">
          <div className="w-12 h-12 bg-teal-50 rounded-lg flex items-center justify-center">
            <FileText size={24} className="text-[#0F766E]" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Jumlah Tagihan</p>
            <p className="text-2xl font-bold text-gray-900">{data.jumlah_tagihan}</p>
            <p className="text-xs text-gray-400">transaksi</p>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 flex items-center gap-4">
          <div className="w-12 h-12 bg-purple-50 rounded-lg flex items-center justify-center">
            <TrendingUp size={24} className="text-purple-600" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Rata-rata Tagihan</p>
            <p className="text-xl font-bold text-gray-900">{formatRupiah(rataRata)}</p>
            <p className="text-xs text-gray-400">per transaksi</p>
          </div>
        </div>
      </div>

      {/* Tabel */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-gray-100">
          <h3 className="font-semibold text-gray-900 flex items-center gap-2">
            <FileText size={16} className="text-[#0F766E]" />
            Detail Pendapatan
          </h3>
        </div>
        {data.tagihan.length === 0 ? (
          <div className="p-8 text-center text-gray-400">Tidak ada data pendapatan pada periode ini.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left font-medium text-gray-600">No</th>
                  <th className="px-4 py-3 text-left font-medium text-gray-600">Tanggal</th>
                  <th className="px-4 py-3 text-left font-medium text-gray-600">Pasien</th>
                  <th className="px-4 py-3 text-left font-medium text-gray-600">Dokter</th>
                  <th className="px-4 py-3 text-right font-medium text-gray-600">Konsultasi</th>
                  <th className="px-4 py-3 text-right font-medium text-gray-600">Obat</th>
                  <th className="px-4 py-3 text-right font-medium text-gray-600">Total</th>
                  <th className="px-4 py-3 text-left font-medium text-gray-600">Metode</th>
                  <th className="px-4 py-3 text-left font-medium text-gray-600">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {data.tagihan.map((t, i) => (
                  <tr key={t.tagihan_id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3 text-gray-500">{i + 1}</td>
                    <td className="px-4 py-3 text-gray-700 whitespace-nowrap">{formatDate(t.tgl_tagihan)}</td>
                    <td className="px-4 py-3 font-medium text-gray-900">{t.pasien?.nama_lengkap ?? '-'}</td>
                    <td className="px-4 py-3 text-gray-700">{t.appointment?.dokter?.nama_dokter ?? '-'}</td>
                    <td className="px-4 py-3 text-right text-gray-700">{formatRupiah(t.biaya_konsultasi)}</td>
                    <td className="px-4 py-3 text-right text-gray-700">{formatRupiah(t.biaya_obat)}</td>
                    <td className="px-4 py-3 text-right font-semibold text-gray-900">{formatRupiah(t.total_biaya)}</td>
                    <td className="px-4 py-3 text-gray-600 text-xs">{t.metode_bayar ?? '-'}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        t.status_bayar === 'LUNAS' ? 'bg-green-100 text-green-700'
                        : t.status_bayar === 'SEBAGIAN' ? 'bg-yellow-100 text-yellow-700'
                        : 'bg-red-100 text-red-700'
                      }`}>
                        {t.status_bayar}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot className="bg-gray-50 border-t-2 border-gray-200">
                <tr>
                  <td colSpan={6} className="px-4 py-3 font-semibold text-gray-700 text-right">Total:</td>
                  <td className="px-4 py-3 font-bold text-gray-900 text-right">{formatRupiah(data.total_pendapatan)}</td>
                  <td colSpan={2} />
                </tr>
              </tfoot>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
