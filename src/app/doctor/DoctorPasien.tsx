import { useState, useEffect } from 'react';
import { Modal } from '../components/Modal';
import { Users, ArrowLeft } from 'lucide-react';
import { getPasienDokter, getRiwayatPasien, PasienDokter, AppointmentDokter } from '../../services/doctorService';
import { formatDate } from '../../utils/formatters';
import { Badge } from '../components/Badge';

interface DoctorPasienProps {
  dokterId: number;
}

export function DoctorPasien({ dokterId }: DoctorPasienProps) {
  const [pasienList, setPasienList] = useState<PasienDokter[]>([]);
  const [selectedPasien, setSelectedPasien] = useState<PasienDokter | null>(null);
  const [riwayat, setRiwayat] = useState<AppointmentDokter[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingRiwayat, setLoadingRiwayat] = useState(false);

  useEffect(() => {
    loadPasien();
  }, [dokterId]);

  const loadPasien = async () => {
    try {
      setLoading(true);
      const data = await getPasienDokter(dokterId);
      setPasienList(data);
    } catch (error) {
      console.error('Error loading pasien:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePasienClick = async (pasien: PasienDokter) => {
    setSelectedPasien(pasien);
    setLoadingRiwayat(true);
    try {
      const data = await getRiwayatPasien(dokterId, pasien.PASIEN_ID);
      setRiwayat(data);
    } catch (error) {
      console.error('Error loading riwayat:', error);
    } finally {
      setLoadingRiwayat(false);
    }
  };

  const calculateAge = (birthDate: string): number => {
    const birth = new Date(birthDate);
    const today = new Date();
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return age;
  };

  if (selectedPasien) {
    return (
      <div className="p-6">
        <div className="mb-6 flex items-center gap-2">
          <button
            onClick={() => setSelectedPasien(null)}
            className="flex items-center gap-2 text-[#0F766E] hover:text-[#0D6B64] font-medium"
          >
            <ArrowLeft size={20} />
            Kembali
          </button>
          <span className="text-gray-400">|</span>
          <h1 className="text-2xl font-bold text-gray-900">Riwayat Pasien</h1>
        </div>

        {/* Patient Info Card */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 mb-6">
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 bg-[#0F766E] rounded-full flex items-center justify-center text-white text-2xl font-semibold">
              {selectedPasien.NAMA_LENGKAP.charAt(0)}
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-bold text-gray-900">{selectedPasien.NAMA_LENGKAP}</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-3 text-sm">
                <div>
                  <span className="text-gray-500">Usia:</span>
                  <p className="font-medium">{calculateAge(selectedPasien.TANGGAL_LAHIR)} tahun</p>
                </div>
                <div>
                  <span className="text-gray-500">Jenis Kelamin:</span>
                  <p className="font-medium">{selectedPasien.JENIS_KELAMIN === 'L' ? 'Laki-laki' : 'Perempuan'}</p>
                </div>
                <div>
                  <span className="text-gray-500">Gol. Darah:</span>
                  <p className="font-medium">{selectedPasien.GOLONGAN_DARAH}</p>
                </div>
                <div>
                  <span className="text-gray-500">Total Kunjungan:</span>
                  <p className="font-medium">{selectedPasien.jumlahKunjungan}x</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Riwayat Table */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="p-4 border-b border-gray-100">
            <h3 className="font-semibold text-gray-800">Riwayat Kunjungan dengan Anda</h3>
          </div>
          {loadingRiwayat ? (
            <div className="p-8 text-center text-gray-500">Memuat riwayat...</div>
          ) : riwayat.length === 0 ? (
            <div className="p-8 text-center text-gray-500">Belum ada riwayat kunjungan</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 text-xs font-medium text-gray-500 uppercase">
                  <tr>
                    <th className="px-4 py-3 text-left">Tanggal</th>
                    <th className="px-4 py-3 text-left">Jam</th>
                    <th className="px-4 py-3 text-left">Keluhan</th>
                    <th className="px-4 py-3 text-left">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {riwayat.map((r) => (
                    <tr key={r.APPOINTMENT_ID} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm text-gray-700">
                        {formatDate(r.TGL_APPOINTMENT)}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-700 font-mono">
                        {r.JAM_APPOINTMENT}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-700">
                        {r.KELUHAN_AWAL || '-'}
                      </td>
                      <td className="px-4 py-3">
                        <Badge status={r.STATUS} type="appointment" />
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

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Pasien Saya</h1>
        <p className="text-gray-500 mt-1">Daftar pasien yang pernah Anda tangani</p>
      </div>

      {loading ? (
        <div className="p-8 text-center text-gray-500">Memuat data...</div>
      ) : pasienList.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-8 text-center">
          <Users className="mx-auto mb-2 text-gray-300" size={48} />
          <p className="text-gray-500">Belum ada pasien yang ditangani</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {pasienList.map((pasien) => (
            <button
              key={pasien.PASIEN_ID}
              onClick={() => handlePasienClick(pasien)}
              className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 hover:shadow-md hover:border-[#0F766E] transition-all text-left"
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-[#0F766E] rounded-full flex items-center justify-center text-white font-semibold shrink-0">
                  {pasien.NAMA_LENGKAP.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-gray-900 truncate">
                    {pasien.NAMA_LENGKAP}
                  </h3>
                  <div className="grid grid-cols-2 gap-2 mt-2 text-sm">
                    <div>
                      <span className="text-gray-500 text-xs">Usia</span>
                      <p className="font-medium">{calculateAge(pasien.TANGGAL_LAHIR)} th</p>
                    </div>
                    <div>
                      <span className="text-gray-500 text-xs">Gol. Darah</span>
                      <p className="font-medium">{pasien.GOLONGAN_DARAH}</p>
                    </div>
                  </div>
                  <div className="mt-2 pt-2 border-t border-gray-100">
                    <span className="text-xs text-gray-500">Total Kunjungan</span>
                    <p className="font-semibold text-[#0F766E]">{pasien.jumlahKunjungan}x</p>
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
