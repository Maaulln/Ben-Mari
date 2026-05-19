import { useState, useEffect } from 'react';
import { formatDate } from '../../utils/formatters';
import { FileText, ArrowRight } from 'lucide-react';
import api from '../../services/api';

export function RekamMedis() {
  const [rekamList, setRekamList] = useState<any[]>([]);
  const [selectedRekam, setSelectedRekam] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRekamMedis();
  }, []);

  const fetchRekamMedis = async () => {
    try {
      setLoading(true);
      const response = await api.get('/rekam-medis');
      setRekamList(response.data);
    } catch (error) {
      console.error('Error fetching rekam medis:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDetail = async (rekamId: number) => {
    try {
      const response = await api.get(`/rekam-medis/${rekamId}`);
      setSelectedRekam(response.data);
    } catch (error) {
      console.error('Error fetching detail:', error);
    }
  };

  if (selectedRekam) {
    return (
      <div className="p-6">
        <div className="mb-6 flex items-center gap-2">
          <button
            onClick={() => setSelectedRekam(null)}
            className="text-[#0F766E] hover:text-[#0D6B64] font-medium"
          >
            ← Kembali
          </button>
          <span className="text-gray-400">|</span>
          <h1 className="text-2xl font-bold text-gray-900">Detail Rekam Medis</h1>
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
            <div className="grid grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold text-gray-900 mb-4">Informasi Pasien</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Nama:</span>
                    <span className="font-medium">{selectedRekam.appointment?.pasien?.nama_lengkap}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">NIK:</span>
                    <span className="font-mono">{selectedRekam.appointment?.pasien?.nik}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Gol. Darah:</span>
                    <span>{selectedRekam.appointment?.pasien?.golongan_darah}</span>
                  </div>
                </div>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-4">Informasi Pemeriksaan</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500">No. Rekam Medis:</span>
                    <span className="font-mono">RM-{String(selectedRekam.rekam_id).padStart(3, '0')}/2026</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Tanggal Periksa:</span>
                    <span>{formatDate(selectedRekam.tgl_periksa)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Dokter:</span>
                    <span>{selectedRekam.dokter?.nama_dokter}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Data Medis</h3>
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">Keluhan</label>
                <p className="text-gray-900">{selectedRekam.keluhan}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">Diagnosis</label>
                <p className="text-gray-900 font-semibold">{selectedRekam.diagnosis}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">Tindakan</label>
                <p className="text-gray-900">{selectedRekam.tindakan}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">Tekanan Darah</label>
                  <p className="text-gray-900">{selectedRekam.tekanan_darah} mmHg</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">Berat Badan</label>
                  <p className="text-gray-900">{selectedRekam.berat_badan} kg</p>
                </div>
              </div>
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-500 mb-1">Catatan Tambahan</label>
                <p className="text-gray-900">{selectedRekam.catatan_tambahan || '-'}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Resep Obat</h3>
            {selectedRekam.resep && selectedRekam.resep.length > 0 ? (
              <table className="w-full">
                <thead className="bg-gray-50 text-xs font-medium text-gray-500 uppercase">
                  <tr>
                    <th className="px-4 py-2 text-left">Nama Obat</th>
                    <th className="px-4 py-2 text-left">Dosis</th>
                    <th className="px-4 py-2 text-left">Aturan Pakai</th>
                    <th className="px-4 py-2 text-left">Jumlah</th>
                    <th className="px-4 py-2 text-left">Catatan</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {selectedRekam.resep.map((r: any) => (
                    <tr key={r.resep_id}>
                      <td className="px-4 py-3 text-sm text-gray-700">{r.obat?.nama_obat}</td>
                      <td className="px-4 py-3 text-sm text-gray-700">{r.dosis}</td>
                      <td className="px-4 py-3 text-sm text-gray-700">{r.aturan_pakai}</td>
                      <td className="px-4 py-3 text-sm text-gray-700">{r.jumlah}</td>
                      <td className="px-4 py-3 text-sm text-gray-500">{r.catatan_resep || '-'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p className="text-sm text-gray-500 text-center py-4">Belum ada resep</p>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Rekam Medis</h1>
        <p className="text-gray-500 mt-1">Riwayat pemeriksaan medis pasien</p>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-gray-500">Memuat data...</div>
        ) : rekamList.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            <FileText className="mx-auto mb-2 text-gray-300" size={48} />
            <p>Belum ada rekam medis</p>
          </div>
        ) : (
          <table className="w-full">
            <thead className="bg-gray-50 text-xs font-medium text-gray-500 uppercase tracking-wider">
              <tr>
                <th className="px-4 py-3 text-left">No. Rekam</th>
                <th className="px-4 py-3 text-left">Pasien</th>
                <th className="px-4 py-3 text-left">Dokter</th>
                <th className="px-4 py-3 text-left">Tgl. Periksa</th>
                <th className="px-4 py-3 text-left">Diagnosis</th>
                <th className="px-4 py-3 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {rekamList.map((rm) => (
                <tr key={rm.rekam_id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm font-mono text-gray-700">
                    RM-{String(rm.rekam_id).padStart(3, '0')}/2026
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-700">
                    {rm.appointment?.pasien?.nama_lengkap}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-700">
                    {rm.dokter?.nama_dokter}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-700">
                    {formatDate(rm.tgl_periksa)}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-700">{rm.diagnosis}</td>
                  <td className="px-4 py-3 text-center">
                    <button
                      onClick={() => handleDetail(rm.rekam_id)}
                      className="text-[#0F766E] hover:text-[#0D6B64] font-medium text-sm flex items-center gap-1 mx-auto"
                    >
                      Detail <ArrowRight size={14} />
                    </button>
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