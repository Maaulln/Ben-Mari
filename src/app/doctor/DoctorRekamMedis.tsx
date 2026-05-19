import { useState, useEffect } from 'react';
import { Modal } from '../components/Modal';
import {
  FileText,
  Plus,
  ArrowLeft,
} from 'lucide-react';

import {
  getRekamMedisDokter,
  getRekamMedisDetail,
  createRekamMedis,
  createResep,
  getAppointmentMenunggu,
  getObatList,
  RekamMedisDokter as RekamMedisType,
  AppointmentDokter,
} from '../../services/doctorService';

import { formatDate } from '../../utils/formatters';

interface DoctorRekamMedisProps {
  dokterId: number;
  createFromAppointmentId?: number;
}

export function DoctorRekamMedis({
  dokterId,
  createFromAppointmentId,
}: DoctorRekamMedisProps) {
  const [rekamList, setRekamList] =
    useState<RekamMedisType[]>([]);

  const [selectedRekam, setSelectedRekam] =
    useState<RekamMedisType | null>(
      null
    );

  const [loading, setLoading] =
    useState(true);

  const [isModalOpen, setIsModalOpen] =
    useState(false);

  const [
    isResepModalOpen,
    setIsResepModalOpen,
  ] = useState(false);

  const [appointmentList, setAppointmentList] =
    useState<AppointmentDokter[]>([]);

  const [obatList, setObatList] =
    useState<any[]>([]);

  // =========================
  // FORM DATA
  // =========================
  const [formData, setFormData] =
    useState({
      appointment_id:
        createFromAppointmentId || 0,

      dokter_id: dokterId,

      tgl_periksa: new Date()
        .toISOString()
        .split('T')[0],

      keluhan: '',
      diagnosis: '',
      tindakan: '',

      tekanan_darah: '',
      berat_badan: 0,

      catatan_tambahan: '',
    });

  // =========================
  // RESEP DATA
  // =========================
  const [resepData, setResepData] =
    useState({
      obat_id: 0,
      dosis: '',
      aturan_pakai: '',
      jumlah: 1,
      catatan_resep: '',
    });

  useEffect(() => {
    loadRekamMedis();
    loadAppointmentMenunggu();
    loadObatList();

    if (createFromAppointmentId) {
      setIsModalOpen(true);

      setFormData((prev) => ({
        ...prev,
        appointment_id:
          createFromAppointmentId,
      }));
    }
  }, [dokterId]);

  // =========================
  // LOAD REKAM MEDIS
  // =========================
  const loadRekamMedis = async () => {
    try {
      setLoading(true);

      const data =
        await getRekamMedisDokter(
          dokterId
        );

      setRekamList(data);
    } catch (error) {
      console.error(
        'Error loading rekam medis:',
        error
      );
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // LOAD APPOINTMENT
  // =========================
  const loadAppointmentMenunggu =
    async () => {
      try {
        const data =
          await getAppointmentMenunggu(
            dokterId
          );

        setAppointmentList(data);
      } catch (error) {
        console.error(
          'Error loading appointments:',
          error
        );
      }
    };

  // =========================
  // LOAD OBAT
  // =========================
  const loadObatList = async () => {
    try {
      const data = await getObatList();

      setObatList(
        data.filter(
          (o: any) =>
            o.status_aktif === 'Y' &&
            o.stok_tersedia > 0
        )
      );
    } catch (error) {
      console.error(
        'Error loading obat:',
        error
      );
    }
  };

  // =========================
  // SUBMIT REKAM MEDIS
  // =========================
  const handleSubmitRekamMedis =
    async (e: React.FormEvent) => {
      e.preventDefault();

      try {
        await createRekamMedis(
          formData
        );

        alert(
          'Rekam medis berhasil dibuat'
        );

        setIsModalOpen(false);

        loadRekamMedis();
        loadAppointmentMenunggu();

        // RESET FORM
        setFormData({
          appointment_id: 0,

          dokter_id: dokterId,

          tgl_periksa: new Date()
            .toISOString()
            .split('T')[0],

          keluhan: '',
          diagnosis: '',
          tindakan: '',

          tekanan_darah: '',
          berat_badan: 0,

          catatan_tambahan: '',
        });
      } catch (error) {
        console.error(
          'Error creating rekam medis:',
          error
        );

        alert(
          'Gagal membuat rekam medis'
        );
      }
    };

  // =========================
  // DETAIL REKAM MEDIS
  // =========================
  const handleOpenDetail = async (
    rekam: RekamMedisType
  ) => {
    try {
      const detail =
        await getRekamMedisDetail(
          rekam.rekam_id
        );

      setSelectedRekam(detail);
    } catch (error) {
      console.error(
        'Error loading detail:',
        error
      );
    }
  };

  // =========================
  // SUBMIT RESEP
  // =========================
  const handleSubmitResep =
    async (e: React.FormEvent) => {
      e.preventDefault();

      if (!selectedRekam) return;

      try {
        await createResep({
          rekam_id:
            selectedRekam.rekam_id,

          obat_id:
            resepData.obat_id,

          dosis: resepData.dosis,

          aturan_pakai:
            resepData.aturan_pakai,

          jumlah:
            resepData.jumlah,

          catatan_resep:
            resepData.catatan_resep,
        });

        alert(
          'Resep berhasil ditambahkan'
        );

        setIsResepModalOpen(false);

        setResepData({
          obat_id: 0,
          dosis: '',
          aturan_pakai: '',
          jumlah: 1,
          catatan_resep: '',
        });

        // REFRESH DETAIL
        handleOpenDetail(selectedRekam);
      } catch (error) {
        console.error(
          'Error creating resep:',
          error
        );

        alert(
          'Gagal menambahkan resep'
        );
      }
    };

  // =========================
  // DETAIL VIEW
  // =========================
  if (selectedRekam) {
    return (
      <div className="p-6">
        <div className="mb-6 flex items-center gap-2">
          <button
            onClick={() =>
              setSelectedRekam(null)
            }
            className="flex items-center gap-2 text-[#0F766E] hover:text-[#0D6B64] font-medium"
          >
            <ArrowLeft size={20} />
            Kembali
          </button>

          <span className="text-gray-400">
            |
          </span>

          <h1 className="text-2xl font-bold text-gray-900">
            Detail Rekam Medis
          </h1>
        </div>

        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 space-y-4">
          <div>
            <h2 className="text-lg font-semibold text-gray-800">
              RM-
              {String(
                selectedRekam.rekam_id
              ).padStart(3, '0')}
              /2026
            </h2>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500">
                Nama Pasien
              </p>

              <p className="font-medium">
                {
                  selectedRekam
                    .appointment
                    ?.pasien
                    ?.nama_lengkap
                }
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-500">
                Tanggal Periksa
              </p>

              <p className="font-medium">
                {formatDate(
                  selectedRekam.tgl_periksa
                )}
              </p>
            </div>
          </div>

          <div>
            <p className="text-sm text-gray-500 mb-1">
              Keluhan
            </p>

            <div className="p-3 bg-gray-50 rounded-lg">
              {selectedRekam.keluhan}
            </div>
          </div>

          <div>
            <p className="text-sm text-gray-500 mb-1">
              Diagnosis
            </p>

            <div className="p-3 bg-gray-50 rounded-lg">
              {
                selectedRekam.diagnosis
              }
            </div>
          </div>

          <div>
            <p className="text-sm text-gray-500 mb-1">
              Tindakan
            </p>

            <div className="p-3 bg-gray-50 rounded-lg">
              {
                selectedRekam.tindakan
              }
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500">
                Tekanan Darah
              </p>

              <p className="font-medium">
                {
                  selectedRekam.tekanan_darah
                }
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-500">
                Berat Badan
              </p>

              <p className="font-medium">
                {
                  selectedRekam.berat_badan
                }{' '}
                kg
              </p>
            </div>
          </div>

          <div>
            <p className="text-sm text-gray-500 mb-1">
              Catatan Tambahan
            </p>

            <div className="p-3 bg-gray-50 rounded-lg">
              {
                selectedRekam.catatan_tambahan
              }
            </div>
          </div>

          {/* ========================= */}
          {/* TOMBOL TAMBAH RESEP */}
          {/* ========================= */}
          <div className="pt-4">
            {(!selectedRekam.resep ||
              selectedRekam.resep
                .length === 0) && (
              <button
                onClick={() =>
                  setIsResepModalOpen(
                    true
                  )
                }
                className="flex items-center gap-2 px-3 py-1.5 bg-[#0F766E] hover:bg-[#0D6B64] text-white rounded-lg"
              >
                <Plus size={16} />
                Tambah Resep
              </button>
            )}
          </div>

          {/* ========================= */}
          {/* LIST RESEP */}
          {/* ========================= */}
          {selectedRekam.resep &&
            selectedRekam.resep
              .length > 0 && (
              <div className="pt-4 border-t">
                <h3 className="font-semibold text-gray-800 mb-3">
                  Resep Obat
                </h3>

                <div className="space-y-3">
                  {selectedRekam.resep.map(
                    (
                      resep: any,
                      index: number
                    ) => (
                      <div
                        key={index}
                        className="p-4 bg-gray-50 rounded-lg"
                      >
                        <p className="font-medium">
                          {
                            resep.obat
                              ?.nama_obat
                          }
                        </p>

                        <p className="text-sm text-gray-600">
                          Dosis:{' '}
                          {resep.dosis}
                        </p>

                        <p className="text-sm text-gray-600">
                          Aturan Pakai:{' '}
                          {
                            resep.aturan_pakai
                          }
                        </p>

                        <p className="text-sm text-gray-600">
                          Jumlah:{' '}
                          {resep.jumlah}
                        </p>

                        {resep.catatan_resep && (
                          <p className="text-sm text-gray-600">
                            Catatan:{' '}
                            {
                              resep.catatan_resep
                            }
                          </p>
                        )}
                      </div>
                    )
                  )}
                </div>
              </div>
            )}
        </div>

        {/* ========================= */}
        {/* MODAL RESEP */}
        {/* ========================= */}
        <Modal
          isOpen={isResepModalOpen}
          onClose={() =>
            setIsResepModalOpen(false)
          }
          title="Tambah Resep"
          size="md"
        >
          <form
            onSubmit={
              handleSubmitResep
            }
            className="space-y-4"
          >
            <select
              value={resepData.obat_id}
              onChange={(e) =>
                setResepData({
                  ...resepData,
                  obat_id: Number(
                    e.target.value
                  ),
                })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              required
            >
              <option value={0}>
                -- Pilih Obat --
              </option>

              {obatList.map((obat) => (
                <option
                  key={obat.obat_id}
                  value={obat.obat_id}
                >
                  {obat.nama_obat} (
                  Stok:{' '}
                  {
                    obat.stok_tersedia
                  }
                  )
                </option>
              ))}
            </select>

            <input
              type="text"
              placeholder="Dosis"
              value={resepData.dosis}
              onChange={(e) =>
                setResepData({
                  ...resepData,
                  dosis:
                    e.target.value,
                })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              required
            />

            <input
              type="text"
              placeholder="Aturan Pakai"
              value={
                resepData.aturan_pakai
              }
              onChange={(e) =>
                setResepData({
                  ...resepData,
                  aturan_pakai:
                    e.target.value,
                })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              required
            />

            <input
              type="number"
              placeholder="Jumlah"
              value={resepData.jumlah}
              onChange={(e) =>
                setResepData({
                  ...resepData,
                  jumlah: Number(
                    e.target.value
                  ),
                })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              required
            />

            <textarea
              placeholder="Catatan Resep"
              value={
                resepData.catatan_resep
              }
              onChange={(e) =>
                setResepData({
                  ...resepData,
                  catatan_resep:
                    e.target.value,
                })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              rows={3}
            />

            <div className="flex justify-end gap-3 pt-4">
              <button
                type="button"
                onClick={() =>
                  setIsResepModalOpen(
                    false
                  )
                }
                className="px-4 py-2 border border-gray-300 rounded-lg"
              >
                Batal
              </button>

              <button
                type="submit"
                className="px-4 py-2 bg-[#0F766E] text-white rounded-lg"
              >
                Simpan Resep
              </button>
            </div>
          </form>
        </Modal>
      </div>
    );
  }

  // =========================
  // MAIN VIEW
  // =========================
  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">
          Rekam Medis
        </h1>

        <p className="text-gray-500 mt-1">
          Kelola rekam medis pasien
          Anda
        </p>
      </div>

      <div className="mb-6">
        <button
          onClick={() =>
            setIsModalOpen(true)
          }
          className="flex items-center gap-2 px-4 py-2 bg-[#0F766E] hover:bg-[#0D6B64] text-white rounded-lg font-medium"
        >
          <Plus size={20} />
          Buat Rekam Medis Baru
        </button>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-gray-500">
            Memuat data...
          </div>
        ) : rekamList.length ===
          0 ? (
          <div className="p-8 text-center text-gray-500">
            <FileText
              className="mx-auto mb-2 text-gray-300"
              size={48}
            />

            <p>
              Belum ada rekam medis
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 text-xs font-medium text-gray-500 uppercase tracking-wider">
                <tr>
                  <th className="px-4 py-3 text-left">
                    No. Rekam
                  </th>

                  <th className="px-4 py-3 text-left">
                    Nama Pasien
                  </th>

                  <th className="px-4 py-3 text-left">
                    Tgl. Periksa
                  </th>

                  <th className="px-4 py-3 text-left">
                    Diagnosis
                  </th>

                  <th className="px-4 py-3 text-center">
                    Aksi
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-100">
                {rekamList.map(
                  (rekam) => (
                    <tr
                      key={
                        rekam.rekam_id
                      }
                      className="hover:bg-gray-50"
                    >
                      <td className="px-4 py-3 text-sm font-mono text-gray-700">
                        RM-
                        {String(
                          rekam.rekam_id
                        ).padStart(
                          3,
                          '0'
                        )}
                        /2026
                      </td>

                      <td className="px-4 py-3 text-sm text-gray-700">
                        {
                          rekam
                            .appointment
                            ?.pasien
                            ?.nama_lengkap
                        }
                      </td>

                      <td className="px-4 py-3 text-sm text-gray-700">
                        {formatDate(
                          rekam.tgl_periksa
                        )}
                      </td>

                      <td className="px-4 py-3 text-sm text-gray-700">
                        {
                          rekam.diagnosis
                        }
                      </td>

                      <td className="px-4 py-3 text-center">
                        <button
                          onClick={() =>
                            handleOpenDetail(
                              rekam
                            )
                          }
                          className="px-3 py-1.5 bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-sm font-medium"
                        >
                          Detail
                        </button>
                      </td>
                    </tr>
                  )
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ========================= */}
      {/* MODAL REKAM MEDIS */}
      {/* ========================= */}
      <Modal
        isOpen={isModalOpen}
        onClose={() =>
          setIsModalOpen(false)
        }
        title="Buat Rekam Medis Baru"
        size="lg"
      >
        <form
          onSubmit={
            handleSubmitRekamMedis
          }
          className="space-y-4"
        >
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Pilih Appointment
            </label>

            <select
              value={
                formData.appointment_id
              }
              onChange={(e) =>
                setFormData({
                  ...formData,
                  appointment_id:
                    Number(
                      e.target.value
                    ),
                })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              required
            >
              <option value={0}>
                -- Pilih Appointment --
              </option>

              {appointmentList.map(
                (apt) => (
                  <option
                    key={
                      apt.appointment_id
                    }
                    value={
                      apt.appointment_id
                    }
                  >
                    {
                      apt.pasien
                        ?.nama_lengkap
                    }{' '}
                    -{' '}
                    {formatDate(
                      apt.tgl_appointment
                    )}
                  </option>
                )
              )}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tanggal Periksa
            </label>

            <input
              type="date"
              value={
                formData.tgl_periksa
              }
              onChange={(e) =>
                setFormData({
                  ...formData,
                  tgl_periksa:
                    e.target.value,
                })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Keluhan
            </label>

            <textarea
              value={formData.keluhan}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  keluhan:
                    e.target.value,
                })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              rows={2}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Diagnosis
            </label>

            <textarea
              value={
                formData.diagnosis
              }
              onChange={(e) =>
                setFormData({
                  ...formData,
                  diagnosis:
                    e.target.value,
                })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              rows={2}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tindakan
            </label>

            <textarea
              value={formData.tindakan}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  tindakan:
                    e.target.value,
                })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              rows={2}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Tekanan Darah"
              value={
                formData.tekanan_darah
              }
              onChange={(e) =>
                setFormData({
                  ...formData,
                  tekanan_darah:
                    e.target.value,
                })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              required
            />

            <input
              type="number"
              placeholder="Berat Badan"
              value={
                formData.berat_badan
              }
              onChange={(e) =>
                setFormData({
                  ...formData,
                  berat_badan:
                    Number(
                      e.target.value
                    ),
                })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              required
            />
          </div>

          <div>
            <textarea
              placeholder="Catatan Tambahan"
              value={
                formData.catatan_tambahan
              }
              onChange={(e) =>
                setFormData({
                  ...formData,
                  catatan_tambahan:
                    e.target.value,
                })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              rows={3}
            />
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={() =>
                setIsModalOpen(false)
              }
              className="px-4 py-2 border border-gray-300 rounded-lg"
            >
              Batal
            </button>

            <button
              type="submit"
              className="px-4 py-2 bg-[#0F766E] text-white rounded-lg"
            >
              Simpan Rekam Medis
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}