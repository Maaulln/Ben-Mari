import { useState, useEffect } from 'react';
import { ArrowLeft, ArrowRight, Check, Calendar as CalendarIcon, Clock } from 'lucide-react';
import {
  getDokterTersedia,
  getSlotJamTersedia,
  createAppointment,
  DokterPublic,
  SlotJam,
} from '../../services/patientService';
import { formatRupiah, formatDate } from '../../utils/formatters';

interface PatientBuatAppointmentProps {
  pasienId: number;
  onBack: () => void;
  onSuccess: () => void;
  preselectedDokterId?: number;
}

export function PatientBuatAppointment({
  pasienId,
  onBack,
  onSuccess,
  preselectedDokterId,
}: PatientBuatAppointmentProps) {
  const [step, setStep] = useState(1);
  const [dokterList, setDokterList] = useState<DokterPublic[]>([]);
  const [filterSpesialisasi, setFilterSpesialisasi] = useState('');
  const [selectedDokter, setSelectedDokter] = useState<DokterPublic | null>(null);
  const [selectedTanggal, setSelectedTanggal] = useState('');
  const [selectedJam, setSelectedJam] = useState('');
  const [slotJam, setSlotJam] = useState<SlotJam[]>([]);
  const [keluhan, setKeluhan] = useState('');
  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [nomorAntrian, setNomorAntrian] = useState(0);

  useEffect(() => {
    loadDokter();
  }, []);

  useEffect(() => {
    if (preselectedDokterId && dokterList.length > 0) {
      const dokter = dokterList.find((d) => d.dokter_id === preselectedDokterId);
      if (dokter) {
        setSelectedDokter(dokter);
        setStep(2);
      }
    }
  }, [preselectedDokterId, dokterList]);

  useEffect(() => {
    if (selectedDokter && selectedTanggal) {
      loadSlotJam();
    }
  }, [selectedDokter, selectedTanggal]);

  const loadDokter = async () => {
    try {
      const data = await getDokterTersedia();
      setDokterList(data);
    } catch (error) {
      console.error('Error loading dokter:', error);
    }
  };

  const loadSlotJam = async () => {
    if (!selectedDokter) return;
    try {
      const data = await getSlotJamTersedia(selectedDokter.dokter_id, selectedTanggal);
      setSlotJam(data);
    } catch (error) {
      console.error('Error loading slot jam:', error);
    }
  };

  const handleSubmit = async () => {
    if (!selectedDokter || !selectedTanggal || !selectedJam) return;

    try {
      setLoading(true);
      const result = await createAppointment({
        pasien_id: pasienId,
        dokter_id: selectedDokter.dokter_id,
        tgl_appointment: selectedTanggal,
        jam_appointment: selectedJam,
        keluhan_awal: keluhan,
      });

      setNomorAntrian(result.nomor_antrian);
      setShowSuccess(true);
    } catch (error) {
      console.error('Error creating appointment:', error);
      alert('Gagal membuat appointment. Silakan coba lagi.');
    } finally {
      setLoading(false);
    }
  };

  const spesialisasiList = Array.from(new Set(dokterList.map((d) => d.SPESIALISASI)));
  const filteredDokter = filterSpesialisasi
    ? dokterList.filter((d) => d.SPESIALISASI === filterSpesialisasi)
    : dokterList;

  // Success Screen
  if (showSuccess) {
    return (
      <div className="min-h-screen bg-[#F0FDF9] flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Check className="text-green-600" size={40} />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Booking Berhasil!</h2>
          <p className="text-gray-600 mb-6">Appointment Anda telah terdaftar</p>

          <div className="bg-[#0F766E] bg-opacity-10 rounded-xl p-6 mb-6">
            <p className="text-sm text-gray-600 mb-2">Nomor Antrian Anda</p>
            <p className="text-5xl font-bold text-[#0F766E] mb-4">{nomorAntrian}</p>
            <div className="border-t border-[#0F766E] border-opacity-20 pt-4 text-left space-y-2">
              <p className="text-sm">
                <span className="text-gray-600">Dokter:</span>{' '}
                <span className="font-medium">{selectedDokter?.nama_dokter}</span>
              </p>
              <p className="text-sm">
                <span className="text-gray-600">Tanggal:</span>{' '}
                <span className="font-medium">{formatDate(selectedTanggal)}</span>
              </p>
              <p className="text-sm">
                <span className="text-gray-600">Jam:</span>{' '}
                <span className="font-medium">{selectedJam}</span>
              </p>
            </div>
          </div>

          <button
            onClick={onSuccess}
            className="w-full py-3 bg-[#0F766E] hover:bg-[#0D6B64] text-white rounded-lg font-medium"
          >
            Kembali ke Beranda
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F0FDF9] pb-20 md:pb-6">
      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <button onClick={onBack} className="text-gray-600 hover:text-gray-900">
              <ArrowLeft size={24} />
            </button>
            <div className="flex-1">
              <h1 className="text-xl font-bold text-gray-900">Buat Appointment</h1>
              <p className="text-sm text-gray-500">Langkah {step} dari 3</p>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="flex gap-2 mt-4">
            {[1, 2, 3].map((s) => (
              <div
                key={s}
                className={`flex-1 h-2 rounded-full ${
                  s <= step ? 'bg-[#0F766E]' : 'bg-gray-200'
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-6">
        {/* Step 1: Pilih Dokter */}
        {step === 1 && (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Pilih Dokter</h2>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Filter Spesialisasi
              </label>
              <select
                value={filterSpesialisasi}
                onChange={(e) => setFilterSpesialisasi(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0F766E]"
              >
                <option value="">Semua Spesialisasi</option>
                {spesialisasiList.map((sp) => (
                  <option key={sp} value={sp}>
                    {sp}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredDokter.map((dokter) => (
                <button
                  key={dokter.dokter_id}
                  onClick={() => {
                    setSelectedDokter(dokter);
                    setStep(2);
                  }}
                  className={`bg-white rounded-xl p-4 text-left hover:shadow-lg transition-all border-2 ${
                    selectedDokter?.dokter_id === dokter.dokter_id
                      ? 'border-[#0F766E]'
                      : 'border-transparent'
                  }`}
                >
                  <div className="flex items-start gap-3 mb-3">
                    <div className="w-14 h-14 bg-[#0F766E] rounded-full flex items-center justify-center text-white text-xl font-semibold shrink-0">
                      {dokter.nama_dokter.charAt(0)}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">{dokter.nama_dokter}</h3>
                      <p className="text-sm text-[#0F766E]">{dokter.SPESIALISASI}</p>
                    </div>
                  </div>

                  <div className="space-y-2 text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                      <Clock size={14} />
                      <span className="text-xs">{dokter.JADWAL_PRAKTIK}</span>
                    </div>
                    <div>
                      <span className="font-semibold text-[#0F766E]">
                        {formatRupiah(dokter.BIAYA_KONSULTASI)}
                      </span>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 2: Pilih Jadwal */}
        {step === 2 && selectedDokter && (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Pilih Jadwal</h2>

            <div className="bg-white rounded-xl p-4 mb-6">
              <p className="text-sm text-gray-600 mb-1">Dokter yang dipilih:</p>
              <p className="font-semibold text-gray-900">{selectedDokter.nama_dokter}</p>
              <p className="text-sm text-[#0F766E]">{selectedDokter.SPESIALISASI}</p>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Pilih Tanggal
              </label>
              <input
                type="date"
                value={selectedTanggal}
                onChange={(e) => {
                  setSelectedTanggal(e.target.value);
                  setSelectedJam('');
                }}
                min={new Date().toISOString().split('T')[0]}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0F766E]"
              />
            </div>

            {selectedTanggal && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Pilih Jam
                </label>
                <div className="grid grid-cols-3 md:grid-cols-4 gap-3">
                  {slotJam.map((slot) => (
                    <button
                      key={slot.jam}
                      onClick={() => slot.tersedia && setSelectedJam(slot.jam)}
                      disabled={!slot.tersedia}
                      className={`py-3 px-4 rounded-lg font-medium transition-colors ${
                        selectedJam === slot.jam
                          ? 'bg-[#0F766E] text-white'
                          : slot.tersedia
                          ? 'bg-white border-2 border-gray-300 text-gray-700 hover:border-[#0F766E]'
                          : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      }`}
                    >
                      {slot.jam}
                      {!slot.tersedia && (
                        <span className="block text-xs mt-1">Penuh</span>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setStep(1)}
                className="flex-1 py-3 border-2 border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50"
              >
                Kembali
              </button>
              <button
                onClick={() => setStep(3)}
                disabled={!selectedTanggal || !selectedJam}
                className="flex-1 py-3 bg-[#0F766E] hover:bg-[#0D6B64] text-white rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Lanjutkan
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Konfirmasi */}
        {step === 3 && selectedDokter && (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Konfirmasi Booking</h2>

            <div className="bg-white rounded-xl p-6 mb-6">
              <h3 className="font-semibold text-gray-900 mb-4">Ringkasan Appointment</h3>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-600">Dokter</p>
                  <p className="font-medium text-gray-900">{selectedDokter.nama_dokter}</p>
                  <p className="text-sm text-[#0F766E]">{selectedDokter.SPESIALISASI}</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Tanggal</p>
                    <p className="font-medium text-gray-900">{formatDate(selectedTanggal)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Jam</p>
                    <p className="font-medium text-gray-900">{selectedJam}</p>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Perkiraan Biaya Konsultasi</p>
                  <p className="text-xl font-bold text-[#0F766E]">
                    {formatRupiah(selectedDokter.BIAYA_KONSULTASI)}
                  </p>
                </div>
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Keluhan Awal <span className="text-gray-400">(Opsional)</span>
              </label>
              <textarea
                value={keluhan}
                onChange={(e) => setKeluhan(e.target.value)}
                placeholder="Ceritakan keluhan Anda..."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0F766E]"
                rows={4}
              />
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setStep(2)}
                className="flex-1 py-3 border-2 border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50"
              >
                Kembali
              </button>
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="flex-1 py-3 bg-[#0F766E] hover:bg-[#0D6B64] text-white rounded-lg font-medium disabled:opacity-50"
              >
                {loading ? 'Memproses...' : 'Konfirmasi Booking'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
