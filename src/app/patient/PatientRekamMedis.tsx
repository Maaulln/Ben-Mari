import { useState, useEffect } from 'react';
import { Modal } from '../components/Modal';
import { FileText, ChevronDown } from 'lucide-react';
import { getRekamMedisPasien, getRekamMedisDetail, RekamMedisPasien } from '../../services/patientService';
import { formatDate } from '../../utils/formatters';

interface PatientRekamMedisProps {
  pasienId: number;
}

export function PatientRekamMedis({ pasienId }: PatientRekamMedisProps) {
  const [rekamList, setRekamList] = useState<RekamMedisPasien[]>([]);
  const [selectedRekam, setSelectedRekam] = useState<RekamMedisPasien | null>(null);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    loadRekamMedis();
  }, [pasienId]);

  const loadRekamMedis = async () => {
    try {
      setLoading(true);
      const data = await getRekamMedisPasien(pasienId);
      setRekamList(data);
    } catch (error) {
      console.error('Error loading rekam medis:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDetail = async (rekam: RekamMedisPasien) => {
    try {
      const detail = await getRekamMedisDetail(rekam.REKAM_ID);
      setSelectedRekam(detail);
      setIsModalOpen(true);
    } catch (error) {
      console.error('Error loading detail:', error);
    }
  };

  return (
    <div className="pb-20 md:pb-6">
      <div className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold text-gray-900">Rekam Medis Saya</h1>
          <p className="text-sm text-gray-500 mt-1">Riwayat kesehatan Anda</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-6">
        {loading ? (
          <div className="text-center py-8 text-gray-500">Memuat data...</div>
        ) : rekamList.length === 0 ? (
          <div className="text-center py-12">
            <FileText className="mx-auto text-gray-300 mb-4" size={64} />
            <p className="text-gray-500">Belum ada rekam medis</p>
          </div>
        ) : (
          <div className="relative">
            {/* Timeline Line */}
            <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gray-200" />

            <div className="space-y-6">
              {rekamList.map((rekam, index) => (
                <div key={rekam.REKAM_ID} className="relative pl-14">
                  {/* Timeline Dot */}
                  <div className="absolute left-3 top-3 w-6 h-6 bg-[#0F766E] rounded-full border-4 border-[#F0FDF9]" />

                  <div className="bg-white rounded-xl shadow-md p-5">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <p className="text-sm text-gray-500 mb-1">
                          {formatDate(rekam.TGL_PERIKSA)}
                        </p>
                        <h3 className="font-bold text-gray-900">{rekam.dokter?.NAMA_DOKTER}</h3>
                        <p className="text-sm text-[#0F766E]">{rekam.dokter?.SPESIALISASI}</p>
                      </div>
                    </div>

                    <div className="space-y-2 mb-3">
                      <div>
                        <p className="text-xs text-gray-500">Diagnosis</p>
                        <p className="font-medium text-gray-900">{rekam.DIAGNOSIS}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Tindakan</p>
                        <p className="text-sm text-gray-700">{rekam.TINDAKAN}</p>
                      </div>
                    </div>

                    <button
                      onClick={() => handleOpenDetail(rekam)}
                      className="w-full py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2"
                    >
                      Lihat Detail Lengkap
                      <ChevronDown size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Modal Detail */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Detail Rekam Medis"
        size="lg"
      >
        {selectedRekam && (
          <div className="space-y-4">
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-sm text-gray-600 mb-2">Diperiksa oleh</p>
              <p className="font-semibold text-gray-900">{selectedRekam.dokter?.NAMA_DOKTER}</p>
              <p className="text-sm text-[#0F766E]">{selectedRekam.dokter?.SPESIALISASI}</p>
              <p className="text-sm text-gray-500 mt-1">{formatDate(selectedRekam.TGL_PERIKSA)}</p>
            </div>

            <div>
              <p className="text-sm font-medium text-gray-700 mb-1">Keluhan</p>
              <p className="text-gray-900">{selectedRekam.KELUHAN}</p>
            </div>

            <div>
              <p className="text-sm font-medium text-gray-700 mb-1">Diagnosis</p>
              <p className="text-gray-900 font-semibold">{selectedRekam.DIAGNOSIS}</p>
            </div>

            <div>
              <p className="text-sm font-medium text-gray-700 mb-1">Tindakan</p>
              <p className="text-gray-900">{selectedRekam.TINDAKAN}</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-gray-700 mb-1">Tekanan Darah</p>
                <p className="text-gray-900">{selectedRekam.TEKANAN_DARAH} mmHg</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-700 mb-1">Berat Badan</p>
                <p className="text-gray-900">{selectedRekam.BERAT_BADAN} kg</p>
              </div>
            </div>

            {selectedRekam.CATATAN_TAMBAHAN && (
              <div>
                <p className="text-sm font-medium text-gray-700 mb-1">Catatan Dokter</p>
                <p className="text-gray-900">{selectedRekam.CATATAN_TAMBAHAN}</p>
              </div>
            )}

            {selectedRekam.resep && selectedRekam.resep.length > 0 && (
              <div>
                <p className="text-sm font-medium text-gray-700 mb-2">Obat yang Diresepkan</p>
                <div className="space-y-2">
                  {selectedRekam.resep.map((r, idx) => (
                    <div key={idx} className="bg-blue-50 rounded-lg p-3">
                      <p className="font-medium text-gray-900">{r.NAMA_OBAT}</p>
                      <p className="text-sm text-gray-600">
                        {r.DOSIS} • {r.ATURAN_PAKAI}
                      </p>
                      <p className="text-sm text-gray-500">
                        Jumlah: {r.JUMLAH} {r.SATUAN}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
}
