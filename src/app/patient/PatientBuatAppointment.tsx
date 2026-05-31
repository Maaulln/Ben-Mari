import { useState, useEffect } from 'react';
import { ArrowLeft, ArrowRight, Check, Calendar as CalendarIcon, Clock, DollarSign, Printer, Stethoscope } from 'lucide-react';
import {
  getDokterTersedia,
  getSlotJamTersedia,
  getEstimasiMasukDokter,
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
  const [selectedSesiId, setSelectedSesiId] = useState<number | null>(null);
  const [slotJam, setSlotJam] = useState<SlotJam[]>([]);
  const [keluhan, setKeluhan] = useState('');
  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [nomorAntrian, setNomorAntrian] = useState(0);
  const [estimasiMasukJam, setEstimasiMasukJam] = useState<string | null>(null);
  const [printing, setPrinting] = useState(false);

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
    if (!selectedDokter || !selectedTanggal || !selectedSesiId) return;

    try {
      setLoading(true);
      const result = await createAppointment({
        pasien_id: pasienId,
        dokter_id: selectedDokter.dokter_id,
        tgl_appointment: selectedTanggal,
        jam_appointment: selectedJam,
        sesi_id: selectedSesiId ?? undefined,
        keluhan_awal: keluhan,
      });

      setNomorAntrian(result.nomor_antrian);
      setEstimasiMasukJam(null);
      setShowSuccess(true);

      // Ambil estimasi awal untuk ditampilkan di layar sukses
      try {
        const estimasi = await getEstimasiMasukDokter(
          selectedDokter.dokter_id,
          selectedTanggal,
          result.nomor_antrian
        );
        setEstimasiMasukJam(estimasi.jam_estimasi_masuk);
      } catch (error) {
        console.error('Error fetching estimasi masuk (post-booking):', error);
      }
    } catch (error) {
      console.error('Error creating appointment:', error);
      alert('Gagal membuat appointment. Silakan coba lagi.');
    } finally {
      setLoading(false);
    }
  };

  const handlePrintStruk = async () => {
    if (!selectedDokter || !selectedTanggal || !nomorAntrian) {
      window.print();
      return;
    }

    try {
      setPrinting(true);
      const estimasi = await getEstimasiMasukDokter(
        selectedDokter.dokter_id,
        selectedTanggal,
        nomorAntrian
      );
      setEstimasiMasukJam(estimasi.jam_estimasi_masuk);
    } catch (error) {
      console.error('Error fetching estimasi masuk:', error);
      setEstimasiMasukJam(null);
    } finally {
      window.setTimeout(() => {
        window.print();
        setPrinting(false);
      }, 50);
    }
  };

  const spesialisasiList = Array.from(new Set(dokterList.map((d) => d.spesialisasi)));
  const filteredDokter = filterSpesialisasi
    ? dokterList.filter((d) => d.spesialisasi === filterSpesialisasi)
    : dokterList;

  // Success Screen
  if (showSuccess) {
    return (
      <div className="min-h-screen bg-[#F0FDF9] p-4">
        <div className="no-print flex items-center justify-center min-h-screen">
          <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Check className="text-green-600" size={40} />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-1">Booking Berhasil!</h2>
            <p className="text-sm text-gray-500 mb-6">Appointment Anda telah terdaftar</p>

            <div className="rounded-xl overflow-hidden border border-gray-200 mb-4">
              {/* Nomor antrian — teal solid, teks putih */}
              <div className="bg-[#0F766E] py-5 px-5 text-center">
                <p className="text-xs text-teal-100 uppercase tracking-widest mb-2">Nomor Antrian</p>
                <p className="text-6xl font-bold text-white">{nomorAntrian}</p>
              </div>

              {/* Detail — putih, teks gelap */}
              <div className="bg-white px-5 py-4 space-y-3 text-left">
                {/* Dokter */}
                <div className="flex items-start justify-between gap-4">
                  <span className="text-sm text-gray-500 shrink-0 mt-0.5">Dokter</span>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-gray-900">{selectedDokter?.nama_dokter}</p>
                    <p className="text-xs text-[#0F766E] font-medium">{selectedDokter?.spesialisasi}</p>
                  </div>
                </div>
                {/* Tanggal */}
                <div className="flex items-center justify-between gap-4">
                  <span className="text-sm text-gray-500">Tanggal</span>
                  <span className="text-sm font-semibold text-gray-900">{formatDate(selectedTanggal)}</span>
                </div>
                {/* Jam booking */}
                <div className="flex items-center justify-between gap-4">
                  <span className="text-sm text-gray-500">Jam Booking</span>
                  <span className="text-sm font-semibold text-gray-900">{selectedJam}</span>
                </div>
                {/* Estimasi masuk */}
                <div className="flex items-center justify-between gap-4 border-t border-gray-100 pt-3">
                  <span className="text-sm text-gray-500">Estimasi Masuk Ruangan</span>
                  <span className="text-sm font-bold text-[#0F766E]">
                    {estimasiMasukJam ?? selectedJam}
                  </span>
                </div>
              </div>
            </div>

            {/* Next step hint */}
            <div className="bg-blue-50 border border-blue-100 rounded-lg px-4 py-3 mb-5 text-left">
              <p className="text-xs text-blue-700 leading-relaxed">
                <span className="font-semibold">Langkah selanjutnya:</span> Datang ke klinik sesuai jadwal, lalu lakukan <span className="font-semibold">check-in</span> di resepsionis untuk mendapatkan nomor antrian.
              </p>
            </div>

            <div className="space-y-3">
              <button
                onClick={handlePrintStruk}
                disabled={printing}
                className="w-full py-3 border-2 border-[#0F766E] text-[#0F766E] rounded-lg font-medium hover:bg-[#0F766E]/5 transition-colors inline-flex items-center justify-center gap-2"
              >
                <Printer size={18} />
                {printing ? 'Menyiapkan Struk...' : 'Cetak Struk'}
              </button>

              <button
                onClick={onSuccess}
                className="w-full py-3 bg-[#0F766E] hover:bg-[#0D6B64] text-white rounded-lg font-medium"
              >
                Kembali ke Beranda
              </button>
            </div>
          </div>
        </div>

        {/* Print-only: Struk */}
        <div className="print-only">
          <div className="min-h-screen bg-white p-6">
            <div className="mx-auto max-w-sm text-gray-900">
              <div className="text-center">
                <h1 className="text-xl font-bold">Klinik BenMari</h1>
                <p className="text-sm text-gray-600">Struk Antrian Pasien</p>
              </div>

              <div className="mt-6 border-t border-b border-gray-300 py-6 text-center">
                <p className="text-sm text-gray-600">Nomor Antrian</p>
                <p className="text-6xl font-bold tracking-wide">{nomorAntrian}</p>
              </div>

              <div className="mt-6 space-y-2 text-sm">
                <div className="flex justify-between gap-4">
                  <span className="text-gray-600">Dokter</span>
                  <span className="font-medium text-right">{selectedDokter?.nama_dokter}</span>
                </div>
                <div className="flex justify-between gap-4">
                  <span className="text-gray-600">Spesialis</span>
                  <span className="font-medium text-right">{selectedDokter?.spesialisasi}</span>
                </div>
                <div className="flex justify-between gap-4">
                  <span className="text-gray-600">Tanggal</span>
                  <span className="font-medium text-right">{formatDate(selectedTanggal)}</span>
                </div>
                <div className="flex justify-between gap-4">
                  <span className="text-gray-600">Jam Booking</span>
                  <span className="font-medium text-right">{selectedJam}</span>
                </div>
                <div className="flex justify-between gap-4">
                  <span className="text-gray-600">Estimasi Masuk Ruangan</span>
                  <span className="font-medium text-right">{estimasiMasukJam ?? selectedJam}</span>
                </div>
              </div>
            </div>
          </div>
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
            <button
              type="button"
              onClick={onBack}
              aria-label="Kembali"
              className="text-gray-600 hover:text-gray-900"
            >
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
              <label
                htmlFor="filterSpesialisasi"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Filter Spesialisasi
              </label>
              <select
                id="filterSpesialisasi"
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
                      <p className="text-sm text-[#0F766E]">{dokter.spesialisasi}</p>
                    </div>
                  </div>

                  <div className="space-y-2 text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                      <Clock size={14} />
                      <span className="text-xs">{dokter.jadwal_praktik}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <DollarSign size={14} className="text-[#0F766E]" />
                      <span className="font-semibold text-[#0F766E]">
                        {formatRupiah(dokter.biaya_konsultasi)}
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
              <p className="text-sm text-[#0F766E]">{selectedDokter.spesialisasi}</p>
            </div>

            <div className="mb-6">
              <label
                htmlFor="tanggalAppointment"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Pilih Tanggal
              </label>
              <input
                id="tanggalAppointment"
                type="date"
                value={selectedTanggal}
                onChange={(e) => {
                  setSelectedTanggal(e.target.value);
                  setSelectedJam('');
                  setSelectedSesiId(null);
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
                {slotJam.length === 0 ? (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-sm text-yellow-700">
                    Tidak ada jam praktik tersedia pada tanggal ini. Silakan pilih tanggal lain.
                  </div>
                ) : (
                  <div className="grid grid-cols-3 md:grid-cols-4 gap-3">
                    {slotJam.map((slot, idx) => (
                      <button
                        key={`${slot.sesi_id}-${slot.jam}-${idx}`}
                        onClick={() => {
                          if (!slot.tersedia) return;
                          setSelectedJam(slot.jam);
                          setSelectedSesiId(slot.sesi_id);
                        }}
                        disabled={!slot.tersedia}
                        className={`py-3 px-4 rounded-lg font-medium transition-colors ${
                          selectedJam === slot.jam && selectedSesiId === slot.sesi_id
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
                )}
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
                disabled={!selectedTanggal || !selectedSesiId}
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
                <div className="flex items-start gap-3 pb-3 border-b">
                  <div className="w-10 h-10 bg-[#0F766E] bg-opacity-10 rounded-full flex items-center justify-center shrink-0">
                    <Stethoscope size={20} className="text-[#0F766E]" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Dokter</p>
                    <p className="font-medium text-gray-900">{selectedDokter.nama_dokter}</p>
                    <p className="text-sm text-[#0F766E]">{selectedDokter.spesialisasi}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-start gap-2">
                    <CalendarIcon size={16} className="text-gray-400 mt-0.5 shrink-0" />
                    <div>
                      <p className="text-sm text-gray-600">Tanggal</p>
                      <p className="font-medium text-gray-900">{formatDate(selectedTanggal)}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <Clock size={16} className="text-gray-400 mt-0.5 shrink-0" />
                    <div>
                      <p className="text-sm text-gray-600">Jam</p>
                      <p className="font-medium text-gray-900">{selectedJam}</p>
                    </div>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <DollarSign size={16} className="text-[#0F766E] mt-0.5 shrink-0" />
                  <div>
                    <p className="text-sm text-gray-600">Perkiraan Biaya Konsultasi</p>
                    <p className="text-xl font-bold text-[#0F766E]">
                      {formatRupiah(selectedDokter.biaya_konsultasi)}
                    </p>
                  </div>
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
