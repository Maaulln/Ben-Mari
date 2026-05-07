import { useState, useEffect } from 'react';
import { Calendar, FileText, Receipt, Plus, ChevronRight, Clock, Stethoscope } from 'lucide-react';
import {
  getAppointmentTerdekat,
  getDokterTersedia,
  AppointmentPasien,
  DokterPublic,
} from '../../services/patientService';
import { formatDate, formatRupiah } from '../../utils/formatters';

interface PatientBerandaProps {
  pasienId: number;
  pasienNama: string;
  onNavigate: (page: string, data?: any) => void;
}

export function PatientBeranda({ pasienId, pasienNama, onNavigate }: PatientBerandaProps) {
  const [appointmentTerdekat, setAppointmentTerdekat] = useState<AppointmentPasien | null>(null);
  const [dokterList, setDokterList] = useState<DokterPublic[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, [pasienId]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [appointment, dokter] = await Promise.all([
        getAppointmentTerdekat(pasienId),
        getDokterTersedia(),
      ]);

      setAppointmentTerdekat(appointment);
      setDokterList(dokter);
    } catch (error) {
      console.error('Error loading beranda:', error);
    } finally {
      setLoading(false);
    }
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Selamat pagi';
    if (hour < 15) return 'Selamat siang';
    if (hour < 18) return 'Selamat sore';
    return 'Selamat malam';
  };

  const getInitials = (nama: string) => {
    return nama
      .split(' ')
      .map((n) => n[0])
      .join('')
      .substring(0, 2)
      .toUpperCase();
  };

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center h-64">
        <div className="text-gray-500">Memuat data...</div>
      </div>
    );
  }

  return (
    <div className="pb-20 md:pb-6">
      {/* Header with Greeting */}
      <div className="bg-gradient-to-br from-[#0F766E] to-[#14B8A6] text-white p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">{getGreeting()},</h1>
              <p className="text-lg mt-1 opacity-90">{pasienNama}</p>
            </div>
            <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-xl font-bold">
              {getInitials(pasienNama)}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 -mt-4">
        {/* Appointment Terdekat Card */}
        {appointmentTerdekat ? (
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-6 border-l-4 border-[#0F766E]">
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="text-sm text-gray-500 mb-1">Appointment Terdekat</p>
                <h3 className="text-xl font-bold text-gray-900">
                  {appointmentTerdekat.dokter?.NAMA_DOKTER}
                </h3>
                <p className="text-sm text-[#0F766E]">
                  {appointmentTerdekat.dokter?.SPESIALISASI}
                </p>
              </div>
              <div className="text-right">
                <div className="bg-[#0F766E] text-white px-4 py-2 rounded-lg">
                  <p className="text-xs">Nomor Antrian</p>
                  <p className="text-3xl font-bold">{appointmentTerdekat.NOMOR_ANTRIAN}</p>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 pt-4 border-t">
              <div className="flex items-center gap-2 text-gray-600">
                <Calendar size={18} />
                <div>
                  <p className="text-xs text-gray-500">Tanggal</p>
                  <p className="text-sm font-medium">
                    {formatDate(appointmentTerdekat.TGL_APPOINTMENT)}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <Clock size={18} />
                <div>
                  <p className="text-xs text-gray-500">Jam</p>
                  <p className="text-sm font-medium">{appointmentTerdekat.JAM_APPOINTMENT}</p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-lg p-8 mb-6 text-center">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Calendar className="text-gray-400" size={40} />
            </div>
            <p className="text-gray-600 mb-4">Belum ada jadwal kunjungan</p>
            <button
              onClick={() => onNavigate('buat-appointment')}
              className="px-6 py-3 bg-[#0F766E] hover:bg-[#0D6B64] text-white rounded-lg font-medium transition-colors inline-flex items-center gap-2"
            >
              <Plus size={20} />
              Buat Appointment Sekarang
            </button>
          </div>
        )}

        {/* Shortcut Menu */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <button
            onClick={() => onNavigate('buat-appointment')}
            className="bg-white rounded-xl shadow-md p-4 hover:shadow-lg transition-shadow text-left"
          >
            <div className="w-12 h-12 bg-[#0F766E] bg-opacity-10 rounded-lg flex items-center justify-center mb-3">
              <Plus className="text-[#0F766E]" size={24} />
            </div>
            <h3 className="font-semibold text-gray-900">Buat Appointment</h3>
            <p className="text-xs text-gray-500 mt-1">Jadwalkan kunjungan</p>
          </button>

          <button
            onClick={() => onNavigate('appointment')}
            className="bg-white rounded-xl shadow-md p-4 hover:shadow-lg transition-shadow text-left"
          >
            <div className="w-12 h-12 bg-blue-500 bg-opacity-10 rounded-lg flex items-center justify-center mb-3">
              <Calendar className="text-blue-500" size={24} />
            </div>
            <h3 className="font-semibold text-gray-900">Riwayat Kunjungan</h3>
            <p className="text-xs text-gray-500 mt-1">Lihat jadwal Anda</p>
          </button>

          <button
            onClick={() => onNavigate('riwayat')}
            className="bg-white rounded-xl shadow-md p-4 hover:shadow-lg transition-shadow text-left"
          >
            <div className="w-12 h-12 bg-green-500 bg-opacity-10 rounded-lg flex items-center justify-center mb-3">
              <FileText className="text-green-500" size={24} />
            </div>
            <h3 className="font-semibold text-gray-900">Rekam Medis Saya</h3>
            <p className="text-xs text-gray-500 mt-1">Lihat riwayat medis</p>
          </button>

          <button
            onClick={() => onNavigate('tagihan')}
            className="bg-white rounded-xl shadow-md p-4 hover:shadow-lg transition-shadow text-left"
          >
            <div className="w-12 h-12 bg-orange-500 bg-opacity-10 rounded-lg flex items-center justify-center mb-3">
              <Receipt className="text-orange-500" size={24} />
            </div>
            <h3 className="font-semibold text-gray-900">Tagihan Saya</h3>
            <p className="text-xs text-gray-500 mt-1">Cek pembayaran</p>
          </button>
        </div>

        {/* Dokter Tersedia */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-gray-900">Dokter Tersedia</h2>
            <ChevronRight className="text-gray-400" size={20} />
          </div>

          <div className="overflow-x-auto -mx-6 px-6">
            <div className="flex gap-4 pb-2">
              {dokterList.slice(0, 5).map((dokter) => (
                <div
                  key={dokter.DOKTER_ID}
                  className="bg-gray-50 rounded-xl p-4 min-w-[280px] hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start gap-3 mb-3">
                    <div className="w-12 h-12 bg-[#0F766E] rounded-full flex items-center justify-center text-white font-semibold shrink-0">
                      {dokter.NAMA_DOKTER.charAt(0)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-900 truncate">
                        {dokter.NAMA_DOKTER}
                      </h3>
                      <p className="text-sm text-[#0F766E]">{dokter.SPESIALISASI}</p>
                    </div>
                  </div>

                  <div className="space-y-2 text-sm text-gray-600 mb-3">
                    <div className="flex items-center gap-2">
                      <Clock size={14} />
                      <span className="text-xs">{dokter.JADWAL_PRAKTIK}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Receipt size={14} />
                      <span className="text-xs font-semibold text-[#0F766E]">
                        {formatRupiah(dokter.BIAYA_KONSULTASI)}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => onNavigate('buat-appointment', { dokterId: dokter.DOKTER_ID })}
                    className="w-full py-2 bg-[#0F766E] hover:bg-[#0D6B64] text-white rounded-lg text-sm font-medium transition-colors"
                  >
                    Buat Janji
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
