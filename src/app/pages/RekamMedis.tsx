import { useState } from 'react';
import { mockRekamMedis, mockPasien, mockDokter, mockResep, mockObat } from '../../data/mockData';
import { formatDate } from '../../utils/formatters';
import { FileText, ArrowRight } from 'lucide-react';

export function RekamMedis() {
  const [selectedRekam, setSelectedRekam] = useState<number | null>(null);

  const rekamWithDetails = mockRekamMedis.map(rm => {
    const apt = { PASIEN_ID: rm.APPOINTMENT_ID };
    const pasien = mockPasien.find(p => p.PASIEN_ID === (rm.APPOINTMENT_ID === 2 ? 2 : 3));
    const dokter = mockDokter.find(d => d.DOKTER_ID === rm.DOKTER_ID);
    const resep = mockResep.filter(r => r.REKAM_ID === rm.REKAM_ID);
    return { ...rm, pasien, dokter, resep };
  });

  const selectedDetail = rekamWithDetails.find(r => r.REKAM_ID === selectedRekam);

  if (selectedDetail) {
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
                    <span className="font-medium">{selectedDetail.pasien?.NAMA_LENGKAP}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">NIK:</span>
                    <span className="font-mono">{selectedDetail.pasien?.NIK}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Gol. Darah:</span>
                    <span>{selectedDetail.pasien?.GOLONGAN_DARAH}</span>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 mb-4">Informasi Pemeriksaan</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500">No. Rekam Medis:</span>
                    <span className="font-mono">RM-{String(selectedDetail.REKAM_ID).padStart(3, '0')}/2026</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Tanggal Periksa:</span>
                    <span>{formatDate(selectedDetail.TGL_PERIKSA)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Dokter:</span>
                    <span>{selectedDetail.dokter?.NAMA_DOKTER}</span>
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
                <p className="text-gray-900">{selectedDetail.KELUHAN}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">Diagnosis</label>
                <p className="text-gray-900 font-semibold">{selectedDetail.DIAGNOSIS}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">Tindakan</label>
                <p className="text-gray-900">{selectedDetail.TINDAKAN}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">Tekanan Darah</label>
                  <p className="text-gray-900">{selectedDetail.TEKANAN_DARAH} mmHg</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">Berat Badan</label>
                  <p className="text-gray-900">{selectedDetail.BERAT_BADAN} kg</p>
                </div>
              </div>
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-500 mb-1">Catatan Tambahan</label>
                <p className="text-gray-900">{selectedDetail.CATATAN_TAMBAHAN}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Resep Obat</h3>
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
                {selectedDetail.resep.map(r => {
                  const obat = mockObat.find(o => o.OBAT_ID === r.OBAT_ID);
                  return (
                    <tr key={r.RESEP_ID}>
                      <td className="px-4 py-3 text-sm text-gray-700">{obat?.NAMA_OBAT}</td>
                      <td className="px-4 py-3 text-sm text-gray-700">{r.DOSIS}</td>
                      <td className="px-4 py-3 text-sm text-gray-700">{r.ATURAN_PAKAI}</td>
                      <td className="px-4 py-3 text-sm text-gray-700">{r.JUMLAH} {obat?.SATUAN}</td>
                      <td className="px-4 py-3 text-sm text-gray-500">{r.CATATAN_RESEP}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
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
            {rekamWithDetails.map((rm) => (
              <tr key={rm.REKAM_ID} className="hover:bg-gray-50">
                <td className="px-4 py-3 text-sm font-mono text-gray-700">
                  RM-{String(rm.REKAM_ID).padStart(3, '0')}/2026
                </td>
                <td className="px-4 py-3 text-sm text-gray-700">{rm.pasien?.NAMA_LENGKAP}</td>
                <td className="px-4 py-3 text-sm text-gray-700">{rm.dokter?.NAMA_DOKTER}</td>
                <td className="px-4 py-3 text-sm text-gray-700">{formatDate(rm.TGL_PERIKSA)}</td>
                <td className="px-4 py-3 text-sm text-gray-700">{rm.DIAGNOSIS}</td>
                <td className="px-4 py-3 text-center">
                  <button
                    onClick={() => setSelectedRekam(rm.REKAM_ID)}
                    className="text-[#0F766E] hover:text-[#0D6B64] font-medium text-sm flex items-center gap-1 mx-auto"
                  >
                    Detail <ArrowRight size={14} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
