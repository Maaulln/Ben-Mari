import { useState, useEffect } from 'react';
import { Badge } from '../components/Badge';
import { Calendar, Clock, X } from 'lucide-react';
import { getAppointmentPasien, cancelAppointment, AppointmentPasien } from '../../services/patientService';
import { formatDate } from '../../utils/formatters';

interface PatientAppointmentProps {
  pasienId: number;
}

export function PatientAppointment({ pasienId }: PatientAppointmentProps) {
  const [activeTab, setActiveTab] = useState<'mendatang' | 'riwayat'>('mendatang');
  const [appointments, setAppointments] = useState<AppointmentPasien[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAppointments();
  }, [pasienId, activeTab]);

  const loadAppointments = async () => {
    try {
      setLoading(true);
      const status = activeTab === 'mendatang' ? 'MENUNGGU' : '';
      const data = await getAppointmentPasien(pasienId, status);

      const filtered = activeTab === 'riwayat'
        ? data.filter(a => a.status === 'SELESAI' || a.status === 'BATAL')
        : data;

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

  return (
    <div className="pb-20 md:pb-6">
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
                    <h3 className="font-bold text-gray-900 text-lg">
                      {apt.dokter?.nama_dokter}
                    </h3>
                    <p className="text-sm text-[#0F766E]">{apt.dokter?.SPESIALISASI}</p>
                  </div>
                  {activeTab === 'mendatang' && (
                    <div className="bg-[#0F766E] text-white px-4 py-2 rounded-lg text-center">
                      <p className="text-xs">No. Antrian</p>
                      <p className="text-2xl font-bold">{apt.nomor_antrian}</p>
                    </div>
                  )}
                  {activeTab === 'riwayat' && (
                    <Badge status={apt.status} type="appointment" />
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
                    <p className="text-xs text-gray-500 mb-1">Keluhan</p>
                    <p className="text-sm text-gray-700">{apt.keluhan_awal}</p>
                  </div>
                )}

                {activeTab === 'mendatang' && (
                  <button
                    onClick={() => handleCancel(apt.appointment_id)}
                    className="w-full py-2 border-2 border-red-300 text-red-600 rounded-lg text-sm font-medium hover:bg-red-50 transition-colors flex items-center justify-center gap-2"
                  >
                    <X size={16} />
                    Batalkan Appointment
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
