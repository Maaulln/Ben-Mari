import { useState, useEffect } from 'react';
import { Badge } from '../components/Badge';
import { Calendar, Clock, X, Stethoscope, AlertCircle, Printer } from 'lucide-react';
import {
  getAppointmentPasien,
  cancelAppointment,
  AppointmentPasien,
  getEstimasiMasukDokter,
} from '../../services/patientService';
import { formatDate } from '../../utils/formatters';

interface PatientAppointmentProps {
  pasienId: number;
}

export function PatientAppointment({ pasienId }: PatientAppointmentProps) {
  const [activeTab, setActiveTab] = useState<'mendatang' | 'riwayat'>('mendatang');
  const [appointments, setAppointments] = useState<AppointmentPasien[]>([]);
  const [loading, setLoading] = useState(true);
  const [printApt, setPrintApt] = useState<AppointmentPasien | null>(null);
  const [printEstimasiMasukJam, setPrintEstimasiMasukJam] = useState<string | null>(null);
  const [printing, setPrinting] = useState(false);

  useEffect(() => {
    loadAppointments();
  }, [pasienId, activeTab]);

  useEffect(() => {
    if (!printApt) return;

    let cancelled = false;
    let timeoutId: number | undefined;

    const afterPrint = () => {
      setPrintApt(null);
      setPrintEstimasiMasukJam(null);
      setPrinting(false);
    };
    window.addEventListener('afterprint', afterPrint);

    const run = async () => {
      try {
        setPrinting(true);
        setPrintEstimasiMasukJam(null);

        const tanggal = typeof printApt.tgl_appointment === 'string'
          ? printApt.tgl_appointment.split('T')[0]
          : printApt.tgl_appointment;

        const estimasi = await getEstimasiMasukDokter(
          printApt.dokter_id,
          tanggal,
          printApt.nomor_antrian
        );

        if (!cancelled) {
          setPrintEstimasiMasukJam(estimasi.jam_estimasi_masuk);
        }
      } catch (error) {
        console.error('Error fetching estimasi masuk:', error);
        if (!cancelled) {
          setPrintEstimasiMasukJam(null);
        }
      } finally {
        if (cancelled) return;
        // Beri waktu React merender area print-only sebelum memanggil dialog print
        timeoutId = window.setTimeout(() => window.print(), 50);
      }
    };

    run();

    return () => {
      cancelled = true;
      if (timeoutId) window.clearTimeout(timeoutId);
      window.removeEventListener('afterprint', afterPrint);
    };
  }, [printApt]);

  const isExpired = (apt: AppointmentPasien): boolean => {
    const today = new Date().toISOString().split('T')[0];
    const tgl = typeof apt.tgl_appointment === 'string'
      ? apt.tgl_appointment.split('T')[0]
      : apt.tgl_appointment;
    return tgl < today && (apt.status === 'MENUNGGU' || apt.status === 'DIKONFIRMASI');
  };

  const loadAppointments = async () => {
    try {
      setLoading(true);
      const data = await getAppointmentPasien(pasienId);

      // Safety net: anggap expired jika tanggal sudah lewat tapi status belum diupdate backend
      const filtered = activeTab === 'riwayat'
        ? data.filter(a =>
            a.status === 'SELESAI' || a.status === 'BATAL' || a.status === 'ABSEN' || isExpired(a)
          )
        : data.filter(a =>
            !isExpired(a) && (a.status === 'MENUNGGU' || a.status === 'DIKONFIRMASI' || a.status === 'HADIR')
          );

      setAppointments(filtered);
    } catch (error) {
      console.error('Error loading appointments:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (appointmentId: number) => {
    if (!confirm('Yakin ingin membatalkan appointment ini?')) return;

    try {
      await cancelAppointment(appointmentId);
      loadAppointments();
    } catch (error) {
      console.error('Error canceling appointment:', error);
      alert('Gagal membatalkan appointment');
    }
  };

  const handlePrint = (apt: AppointmentPasien) => {
    setPrintEstimasiMasukJam(null);
    setPrintApt(apt);
  };

  return (
    <div className="pb-20 md:pb-6">
      {/* Print-only: Struk */}
      <div className="print-only">
        {printApt && (
          <div className="min-h-screen bg-white p-6">
            <div className="mx-auto max-w-sm text-gray-900">
              <div className="text-center">
                <h1 className="text-xl font-bold">Klinik BenMari</h1>
                <p className="text-sm text-gray-600">Struk Antrian Pasien</p>
              </div>

              <div className="mt-6 border-t border-b border-gray-300 py-6 text-center">
                <p className="text-sm text-gray-600">Nomor Antrian</p>
                <p className="text-6xl font-bold tracking-wide">{printApt.nomor_antrian}</p>
              </div>

              <div className="mt-6 space-y-2 text-sm">
                <div className="flex justify-between gap-4">
                  <span className="text-gray-600">Dokter</span>
                  <span className="font-medium text-right">{printApt.dokter?.nama_dokter}</span>
                </div>
                <div className="flex justify-between gap-4">
                  <span className="text-gray-600">Spesialis</span>
                  <span className="font-medium text-right">{printApt.dokter?.spesialisasi}</span>
                </div>
                <div className="flex justify-between gap-4">
                  <span className="text-gray-600">Tanggal</span>
                  <span className="font-medium text-right">{formatDate(printApt.tgl_appointment)}</span>
                </div>
                <div className="flex justify-between gap-4">
                  <span className="text-gray-600">Perkiraan Masuk Ruangan</span>
                  <span className="font-medium text-right">{printEstimasiMasukJam ?? printApt.jam_appointment}</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="no-print">
        <div className="bg-white border-b sticky top-0 z-10">
          <div className="max-w-4xl mx-auto px-4 py-4">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Appointment Saya</h1>

            <div className="flex gap-2">
              <button
                onClick={() => setActiveTab('mendatang')}
                className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors ${
                  activeTab === 'mendatang'
                    ? 'bg-[#0F766E] text-white'
                    : 'bg-gray-100 text-gray-600'
                }`}
              >
                Mendatang
              </button>
              <button
                onClick={() => setActiveTab('riwayat')}
                className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors ${
                  activeTab === 'riwayat'
                    ? 'bg-[#0F766E] text-white'
                    : 'bg-gray-100 text-gray-600'
                }`}
              >
                Riwayat
              </button>
            </div>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-4 py-6">
          {loading ? (
            <div className="text-center py-8 text-gray-500">Memuat data...</div>
          ) : appointments.length === 0 ? (
            <div className="text-center py-12">
              <Calendar className="mx-auto text-gray-300 mb-4" size={64} />
              <p className="text-gray-500">
                {activeTab === 'mendatang'
                  ? 'Belum ada appointment mendatang'
                  : 'Belum ada riwayat appointment'}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {appointments.map((apt) => (
                <div key={apt.appointment_id} className="bg-white rounded-xl shadow-md p-5 border-l-4 border-[#0F766E]">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <Stethoscope size={16} className="text-[#0F766E] shrink-0" />
                        <h3 className="font-bold text-gray-900 text-lg leading-tight">
                          {apt.dokter?.nama_dokter}
                        </h3>
                      </div>
                      <p className="text-sm text-[#0F766E] ml-6">{apt.dokter?.spesialisasi}</p>
                    </div>
                    {activeTab === 'mendatang' && (
                      <div className="flex flex-col items-end gap-2">
                        <Badge status={apt.status} type="appointment" />
                        <div className="bg-[#0F766E] text-white px-4 py-2 rounded-lg text-center">
                          <p className="text-xs">No. Antrian</p>
                          <p className="text-2xl font-bold">{apt.nomor_antrian}</p>
                        </div>
                      </div>
                    )}
                    {activeTab === 'riwayat' && (
                      <Badge
                        status={isExpired(apt) ? 'ABSEN' : apt.status}
                        type="appointment"
                      />
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-3 mb-3">
                    <div className="flex items-center gap-2 text-gray-600">
                      <Calendar size={16} />
                      <span className="text-sm">{formatDate(apt.tgl_appointment)}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <Clock size={16} />
                      <span className="text-sm">{apt.jam_appointment}</span>
                    </div>
                  </div>

                  {apt.keluhan_awal && (
                    <div className="bg-gray-50 rounded-lg p-3 mb-3">
                      <div className="flex items-center gap-1 mb-1">
                        <AlertCircle size={12} className="text-gray-400" />
                        <p className="text-xs text-gray-500">Keluhan</p>
                      </div>
                      <p className="text-sm text-gray-700">{apt.keluhan_awal}</p>
                    </div>
                  )}

                  {activeTab === 'mendatang' && (
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={() => handlePrint(apt)}
                        disabled={printing}
                        className="w-full py-2 border-2 border-[#0F766E] text-[#0F766E] rounded-lg text-sm font-medium hover:bg-[#0F766E]/5 transition-colors flex items-center justify-center gap-2"
                      >
                        <Printer size={16} />
                        {printing ? 'Menyiapkan...' : 'Cetak Struk'}
                      </button>
                      <button
                        onClick={() => handleCancel(apt.appointment_id)}
                        className="w-full py-2 border-2 border-red-300 text-red-600 rounded-lg text-sm font-medium hover:bg-red-50 transition-colors flex items-center justify-center gap-2"
                      >
                        <X size={16} />
                        Batalkan
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
