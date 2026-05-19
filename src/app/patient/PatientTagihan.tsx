import { useState, useEffect } from 'react';
import { Modal } from '../components/Modal';
import { Badge } from '../components/Badge';
import { Receipt } from 'lucide-react';
import {
  getTagihanPasien,
  getTagihanDetail,
  TagihanPasien
} from '../../services/patientService';
import { formatDate, formatRupiah } from '../../utils/formatters';

interface PatientTagihanProps {
  pasienId: number;
}

export function PatientTagihan({
  pasienId
}: PatientTagihanProps) {

  const [tagihanList, setTagihanList] = useState<TagihanPasien[]>([]);
  const [selectedTagihan, setSelectedTagihan] = useState<TagihanPasien | null>(null);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    loadTagihan();
  }, [pasienId]);

  const loadTagihan = async () => {
    try {
      setLoading(true);

      const data = await getTagihanPasien(pasienId);

      setTagihanList(data);

    } catch (error) {
      console.error('Error loading tagihan:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDetail = async (
    tagihan: TagihanPasien
  ) => {
    try {

      const detail = await getTagihanDetail(
        tagihan.tagihan_id
      );

      setSelectedTagihan(detail);

      setIsModalOpen(true);

    } catch (error) {
      console.error('Error loading detail:', error);
    }
  };

  const tagihanBelum = tagihanList.filter(
    (t) =>
      t.status_bayar === 'BELUM' ||
      t.status_bayar === 'CICIL'
  );

  const tagihanLunas = tagihanList.filter(
    (t) =>
      t.status_bayar === 'LUNAS'
  );

  return (
    <div className="pb-20 md:pb-6">

      <div className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4">

          <h1 className="text-2xl font-bold text-gray-900">
            Tagihan Saya
          </h1>

          <p className="text-sm text-gray-500 mt-1">
            Kelola pembayaran Anda
          </p>

        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">

        {loading ? (

          <div className="text-center py-8 text-gray-500">
            Memuat data...
          </div>

        ) : (

          <>
            {/* Tagihan Belum Dibayar */}
            {tagihanBelum.length > 0 && (
              <div>

                <h2 className="text-lg font-bold text-gray-900 mb-4">
                  Belum Dibayar
                </h2>

                <div className="space-y-3">

                  {tagihanBelum.map((tagihan) => (

                    <div
                      key={tagihan.tagihan_id}
                      className="bg-red-50 border-2 border-red-200 rounded-xl p-5"
                    >

                      <div className="flex items-start justify-between mb-3">

                        <div>

                          <p className="text-sm text-gray-600 mb-1">
                            {formatDate(tagihan.tgl_tagihan)}
                          </p>

                          <p className="font-medium text-gray-900">
                            {tagihan.appointment?.dokter?.nama_dokter}
                          </p>

                        </div>

                        <Badge
                          status={tagihan.status_bayar}
                          type="payment"
                        />

                      </div>

                      <div className="bg-white rounded-lg p-4 mb-3">

                        <div className="flex justify-between items-center mb-2">

                          <span className="text-sm text-gray-600">
                            Total Tagihan
                          </span>

                          <span className="text-2xl font-bold text-red-600">
                            {formatRupiah(tagihan.total_biaya)}
                          </span>

                        </div>

                      </div>

                      <button
                        onClick={() => handleOpenDetail(tagihan)}
                        className="w-full py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-medium transition-colors"
                      >
                        Lihat Detail Tagihan
                      </button>

                    </div>

                  ))}

                </div>

              </div>
            )}

            {/* Tagihan Lunas */}
            {tagihanLunas.length > 0 && (
              <div>

                <h2 className="text-lg font-bold text-gray-900 mb-4">
                  Sudah Lunas
                </h2>

                <div className="space-y-2">

                  {tagihanLunas.map((tagihan) => (

                    <div
                      key={tagihan.tagihan_id}
                      className="bg-white rounded-lg shadow-sm p-4 flex items-center justify-between"
                    >

                      <div>

                        <p className="text-sm text-gray-600">
                          {formatDate(tagihan.tgl_tagihan)}
                        </p>

                        <p className="font-medium text-gray-900">
                          {tagihan.appointment?.dokter?.nama_dokter}
                        </p>

                        <p className="text-sm font-semibold text-[#0F766E]">
                          {formatRupiah(tagihan.total_biaya)}
                        </p>

                      </div>

                      <Badge
                        status="LUNAS"
                        type="payment"
                      />

                    </div>

                  ))}

                </div>

              </div>
            )}

            {tagihanList.length === 0 && (
              <div className="text-center py-12">

                <Receipt
                  className="mx-auto text-gray-300 mb-4"
                  size={64}
                />

                <p className="text-gray-500">
                  Belum ada tagihan
                </p>

              </div>
            )}

          </>
        )}

      </div>

      {/* Modal Detail */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Detail Tagihan"
      >

        {selectedTagihan && (

          <div className="space-y-4">

            <div className="bg-gray-50 rounded-lg p-4">

              <p className="text-sm text-gray-600 mb-1">
                Tanggal Tagihan
              </p>

              <p className="font-semibold text-gray-900">
                {formatDate(selectedTagihan.tgl_tagihan)}
              </p>

            </div>

            <div>

              <p className="text-sm font-medium text-gray-700 mb-2">
                Rincian Biaya
              </p>

              <div className="space-y-2">

                <div className="flex justify-between">

                  <span className="text-gray-600">
                    Biaya Konsultasi
                  </span>

                  <span className="font-medium">
                    {formatRupiah(selectedTagihan.biaya_konsultasi)}
                  </span>

                </div>

                <div className="flex justify-between">

                  <span className="text-gray-600">
                    Biaya Obat
                  </span>

                  <span className="font-medium">
                    {formatRupiah(selectedTagihan.biaya_obat)}
                  </span>

                </div>

                <div className="border-t pt-2 flex justify-between">

                  <span className="font-semibold text-gray-900">
                    Total
                  </span>

                  <span className="font-bold text-xl text-[#0F766E]">
                    {formatRupiah(selectedTagihan.total_biaya)}
                  </span>

                </div>

              </div>

            </div>

            <div className="bg-blue-50 rounded-lg p-4">

              <p className="text-sm font-medium text-gray-700 mb-2">
                Metode Pembayaran
              </p>

              <p className="text-gray-900">
                {selectedTagihan.metode_bayar}
              </p>

              <p className="text-xs text-gray-600 mt-2">
                Silakan lakukan pembayaran di kasir klinik atau hubungi kami untuk informasi lebih lanjut.
              </p>

            </div>

          </div>

        )}

      </Modal>

    </div>
  );
}