import { useState, useEffect, useMemo } from 'react';
import { ChevronLeft, ChevronRight, Stethoscope, Eye, Calendar } from 'lucide-react';
import { Badge } from '../components/Badge';
import { getJadwalDokter, AppointmentDokter } from '../../services/doctorService';
import { formatDate } from '../../utils/formatters';

interface DoctorJadwalProps {
  dokterId: number;
  onPeriksaClick: (appointmentId: number) => void;
  onLihatRekamClick: (appointmentId: number) => void;
}

const NAMA_HARI  = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];
const NAMA_BULAN = ['Januari','Februari','Maret','April','Mei','Juni','Juli','Agustus','September','Oktober','November','Desember'];

function toDateStr(d: Date) {
  return d.toISOString().split('T')[0];
}

function sameDay(a: Date, b: Date) {
  return a.getFullYear() === b.getFullYear()
    && a.getMonth()     === b.getMonth()
    && a.getDate()      === b.getDate();
}

export function DoctorJadwal({ dokterId, onPeriksaClick, onLihatRekamClick }: DoctorJadwalProps) {
  const todayRaw = new Date();
  todayRaw.setHours(0, 0, 0, 0);

  const [currentMonth, setCurrentMonth]       = useState(new Date(todayRaw.getFullYear(), todayRaw.getMonth(), 1));
  const [selectedDate, setSelectedDate]       = useState(new Date(todayRaw));
  const [allAppointments, setAllAppointments] = useState<AppointmentDokter[]>([]);
  const [loading, setLoading]                 = useState(true);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const data = await getJadwalDokter(dokterId);
        setAllAppointments(data);
      } catch (e) {
        console.error('Error loading jadwal:', e);
      } finally {
        setLoading(false);
      }
    })();
  }, [dokterId]);

  // group appointments by date string
  const byDate = useMemo(() => {
    const map: Record<string, AppointmentDokter[]> = {};
    for (const apt of allAppointments) {
      const key = String(apt.tgl_appointment).split('T')[0];
      (map[key] ??= []).push(apt);
    }
    return map;
  }, [allAppointments]);

  const selectedStr  = toDateStr(selectedDate);
  const dayApts      = (byDate[selectedStr] ?? [])
    .slice()
    .sort((a, b) => a.jam_appointment.localeCompare(b.jam_appointment));

  // build calendar grid (42 cells = 6 weeks)
  const calendarDays = useMemo(() => {
    const year     = currentMonth.getFullYear();
    const month    = currentMonth.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const lastDate = new Date(year, month + 1, 0).getDate();
    const prevLast = new Date(year, month, 0).getDate();

    const days: { date: Date; current: boolean }[] = [];

    for (let i = firstDay - 1; i >= 0; i--)
      days.push({ date: new Date(year, month - 1, prevLast - i), current: false });

    for (let d = 1; d <= lastDate; d++)
      days.push({ date: new Date(year, month, d), current: true });

    const fill = 42 - days.length;
    for (let d = 1; d <= fill; d++)
      days.push({ date: new Date(year, month + 1, d), current: false });

    return days;
  }, [currentMonth]);

  const prevMonth = () =>
    setCurrentMonth(m => new Date(m.getFullYear(), m.getMonth() - 1, 1));
  const nextMonth = () =>
    setCurrentMonth(m => new Date(m.getFullYear(), m.getMonth() + 1, 1));

  const goToday = () => {
    setSelectedDate(new Date(todayRaw));
    setCurrentMonth(new Date(todayRaw.getFullYear(), todayRaw.getMonth(), 1));
  };

  return (
    <div className="p-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Jadwal Saya</h1>
          <p className="text-gray-500 mt-1">Klik tanggal pada kalender untuk melihat jadwal</p>
        </div>
        <button
          onClick={goToday}
          className="px-4 py-2 text-sm font-medium text-[#0F766E] border border-[#0F766E] rounded-lg hover:bg-[#0F766E] hover:text-white transition-colors"
        >
          Hari Ini
        </button>
      </div>

      <div className="flex gap-6 items-start">
        {/* ── Mini Calendar ── */}
        <div className="w-72 shrink-0 bg-white rounded-xl border border-gray-100 shadow-sm p-4">
          {/* Month navigation */}
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={prevMonth}
              className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors text-gray-600"
            >
              <ChevronLeft size={18} />
            </button>
            <span className="font-semibold text-gray-800 text-sm">
              {NAMA_BULAN[currentMonth.getMonth()]} {currentMonth.getFullYear()}
            </span>
            <button
              onClick={nextMonth}
              className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors text-gray-600"
            >
              <ChevronRight size={18} />
            </button>
          </div>

          {/* Day-of-week header */}
          <div className="grid grid-cols-7 mb-1">
            {NAMA_HARI.map(h => (
              <div key={h} className="text-center text-xs font-medium text-gray-400 py-1">
                {h}
              </div>
            ))}
          </div>

          {/* Date cells */}
          <div className="grid grid-cols-7 gap-y-0.5">
            {calendarDays.map(({ date, current }, i) => {
              const isSelected = sameDay(date, selectedDate);
              const isToday    = sameDay(date, todayRaw);
              const hasApt     = current && (byDate[toDateStr(date)]?.length ?? 0) > 0;

              return (
                <button
                  key={i}
                  disabled={!current}
                  onClick={() => { setSelectedDate(new Date(date)); }}
                  className={[
                    'relative flex flex-col items-center justify-center h-9 w-9 mx-auto rounded-lg text-sm transition-colors',
                    !current
                      ? 'text-gray-200 cursor-default'
                      : 'cursor-pointer',
                    isSelected
                      ? 'bg-[#0F766E] text-white font-semibold'
                      : isToday
                        ? 'border-2 border-[#0F766E] text-[#0F766E] font-semibold hover:bg-teal-50'
                        : current
                          ? 'text-gray-700 hover:bg-gray-100'
                          : '',
                  ].join(' ')}
                >
                  {date.getDate()}
                  {hasApt && (
                    <span
                      className={[
                        'absolute bottom-1 w-1 h-1 rounded-full',
                        isSelected ? 'bg-white' : 'bg-[#0F766E]',
                      ].join(' ')}
                    />
                  )}
                </button>
              );
            })}
          </div>

          {/* Legend */}
          <div className="mt-3 pt-3 border-t border-gray-100 flex items-center gap-3 text-xs text-gray-400">
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#0F766E] inline-block" />
              Ada jadwal
            </span>
            <span className="flex items-center gap-1.5">
              <span className="inline-flex items-center justify-center w-4 h-4 rounded border-2 border-[#0F766E] text-[9px] text-[#0F766E] font-bold leading-none">H</span>
              Hari ini
            </span>
          </div>

          {/* Month summary */}
          {!loading && (
            <div className="mt-3 pt-3 border-t border-gray-100">
              <p className="text-xs text-gray-400 text-center">
                {Object.values(byDate).reduce((s, a) => s + a.length, 0)} total appointment
              </p>
            </div>
          )}
        </div>

        {/* ── Appointment List ── */}
        <div className="flex-1 bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          {/* Header */}
          <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Calendar className="text-[#0F766E]" size={18} />
              <h3 className="font-semibold text-gray-800">
                {formatDate(selectedStr)}
              </h3>
            </div>
            <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
              {dayApts.length} jadwal
            </span>
          </div>

          {/* Content */}
          {loading ? (
            <div className="p-10 text-center text-gray-400">Memuat data...</div>
          ) : dayApts.length === 0 ? (
            <div className="p-14 text-center text-gray-400">
              <Calendar className="mx-auto mb-3 text-gray-200" size={52} />
              <p className="font-medium text-gray-500">Tidak ada jadwal</p>
              <p className="text-sm mt-1">Tidak ada appointment pada tanggal ini</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {dayApts.map((apt) => (
                <div
                  key={apt.appointment_id}
                  className="px-5 py-4 flex items-center gap-4 hover:bg-gray-50 transition-colors"
                >
                  {/* Time block */}
                  <div className="text-center w-14 shrink-0">
                    <div className="text-xl font-bold text-[#0F766E] font-mono leading-tight">
                      {apt.jam_appointment}
                    </div>
                    <div className="text-xs text-gray-400 mt-0.5">WIB</div>
                  </div>

                  {/* Vertical divider */}
                  <div className="w-px h-12 bg-gray-200 shrink-0" />

                  {/* Patient info */}
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-gray-800 truncate">
                      {apt.pasien?.nama_lengkap ?? 'Pasien'}
                    </div>
                    <div className="text-sm text-gray-500 mt-0.5 truncate">
                      {apt.keluhan_awal ?? 'Tidak ada keluhan tercatat'}
                    </div>
                    <div className="mt-1 text-xs text-gray-400 font-mono">
                      Antrian #{apt.nomor_antrian}
                    </div>
                  </div>

                  {/* Status + actions */}
                  <div className="flex items-center gap-3 shrink-0">
                    <Badge status={apt.status} type="appointment" />
                    {apt.status === 'MENUNGGU' && (
                      <button
                        onClick={() => onPeriksaClick(apt.appointment_id)}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-[#0F766E] hover:bg-[#0D6B64] text-white rounded-lg text-sm font-medium transition-colors"
                      >
                        <Stethoscope size={14} />
                        Periksa
                      </button>
                    )}
                    {apt.status === 'SELESAI' && (
                      <button
                        onClick={() => onLihatRekamClick(apt.appointment_id)}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-sm font-medium transition-colors"
                      >
                        <Eye size={14} />
                        Rekam Medis
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
