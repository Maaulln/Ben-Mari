import { useState, useEffect } from 'react';
import { PatientNavigation } from '../components/PatientNavigation';
import { PatientBeranda } from './PatientBeranda';
import { PatientBuatAppointment } from './PatientBuatAppointment';
import { PatientAppointment } from './PatientAppointment';
import { PatientRekamMedis } from './PatientRekamMedis';
import { PatientTagihan } from './PatientTagihan';
import { PatientProfil } from './PatientProfil';

type PatientPageType = 'beranda' | 'buat-appointment' | 'appointment' | 'riwayat' | 'tagihan' | 'profil';

interface PatientAppProps {
  onLogout: () => void;
}

export function PatientApp({ onLogout }: PatientAppProps) {
  const [currentPage, setCurrentPage] = useState<PatientPageType>('beranda');
  const [currentUser, setCurrentUser] = useState<{ id: number; nama: string; nik: string } | null>(null);
  const [appointmentData, setAppointmentData] = useState<any>(null);

  useEffect(() => {
    const userData = localStorage.getItem('klinik_user');
    if (userData) {
      const user = JSON.parse(userData);
      setCurrentUser({
        id: user.id,
        nama: user.nama,
        nik: user.nik,
      });
    }
  }, []);

  const handleNavigate = (page: string, data?: any) => {
    setCurrentPage(page as PatientPageType);
    if (data) {
      setAppointmentData(data);
    } else {
      setAppointmentData(null);
    }
    // Scroll to top on navigation
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNavigateFromMenu = (page: string) => {
    handleNavigate(page);
  };

  const handleAppointmentSuccess = () => {
    handleNavigate('beranda');
  };

  if (!currentUser) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#F0FDF9]">
        <div className="text-gray-500">Memuat data pengguna...</div>
      </div>
    );
  }

  // Special pages without navigation
  if (currentPage === 'buat-appointment') {
    return (
      <div className="min-h-screen bg-[#F0FDF9]">
        <PatientBuatAppointment
          pasienId={currentUser.id}
          onBack={() => handleNavigate('beranda')}
          onSuccess={handleAppointmentSuccess}
          preselectedDokterId={appointmentData?.dokterId}
        />
      </div>
    );
  }

  const renderPage = () => {
    switch (currentPage) {
      case 'beranda':
        return (
          <PatientBeranda
            pasienId={currentUser.id}
            pasienNama={currentUser.nama}
            onNavigate={handleNavigate}
          />
        );
      case 'appointment':
        return <PatientAppointment pasienId={currentUser.id} />;
      case 'riwayat':
        return <PatientRekamMedis pasienId={currentUser.id} />;
      case 'tagihan':
        return <PatientTagihan pasienId={currentUser.id} />;
      case 'profil':
        return <PatientProfil pasienId={currentUser.id} onLogout={onLogout} />;
      default:
        return (
          <PatientBeranda
            pasienId={currentUser.id}
            pasienNama={currentUser.nama}
            onNavigate={handleNavigate}
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-[#F0FDF9]">
      <PatientNavigation
        currentPage={currentPage}
        onNavigate={handleNavigateFromMenu}
      />
      <main>{renderPage()}</main>
    </div>
  );
}
