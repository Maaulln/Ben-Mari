import { useState, useEffect } from 'react';
import { DoctorSidebar } from '../components/DoctorSidebar';
import { DoctorDashboard } from './DoctorDashboard';
import { DoctorJadwal } from './DoctorJadwal';
import { DoctorPasien } from './DoctorPasien';
import { DoctorRekamMedis } from './DoctorRekamMedis';
import { DoctorProfil } from './DoctorProfil';

type DoctorPageType = 'dashboard' | 'jadwal' | 'pasien' | 'rekam-medis' | 'profil';

interface DoctorAppProps {
  onLogout: () => void;
}

export function DoctorApp({ onLogout }: DoctorAppProps) {
  const [currentPage, setCurrentPage] = useState<DoctorPageType>('dashboard');
  const [currentUser, setCurrentUser] = useState<{ id: number; nama: string; spesialisasi: string } | null>(null);
  const [createRekamMedisFromAppointment, setCreateRekamMedisFromAppointment] = useState<number | undefined>(undefined);

  useEffect(() => {
    const userData = localStorage.getItem('klinik_user');
    if (userData) {
      const user = JSON.parse(userData);
      setCurrentUser({
        id: user.id,
        nama: user.nama,
        spesialisasi: user.spesialisasi,
      });
    }
  }, []);

  const handleNavigate = (page: string) => {
    setCurrentPage(page as DoctorPageType);
    // Reset create from appointment when navigating
    if (page !== 'rekam-medis') {
      setCreateRekamMedisFromAppointment(undefined);
    }
  };

  const handleNavigateToRekamMedis = (appointmentId: number) => {
    setCreateRekamMedisFromAppointment(appointmentId);
    setCurrentPage('rekam-medis');
  };

  const handlePeriksaClick = (appointmentId: number) => {
    setCreateRekamMedisFromAppointment(appointmentId);
    setCurrentPage('rekam-medis');
  };

  const handleLihatRekamClick = (appointmentId: number) => {
    // For now, just navigate to rekam medis page
    // In a full implementation, you'd navigate to the specific record
    setCurrentPage('rekam-medis');
  };

  if (!currentUser) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#F8FAFC]">
        <div className="text-gray-500">Memuat data pengguna...</div>
      </div>
    );
  }

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return (
          <DoctorDashboard
            dokterId={currentUser.id}
            onNavigateToRekamMedis={handleNavigateToRekamMedis}
          />
        );
      case 'jadwal':
        return (
          <DoctorJadwal
            dokterId={currentUser.id}
            onPeriksaClick={handlePeriksaClick}
            onLihatRekamClick={handleLihatRekamClick}
          />
        );
      case 'pasien':
        return <DoctorPasien dokterId={currentUser.id} />;
      case 'rekam-medis':
        return (
          <DoctorRekamMedis
            dokterId={currentUser.id}
            createFromAppointmentId={createRekamMedisFromAppointment}
          />
        );
      case 'profil':
        return <DoctorProfil dokterId={currentUser.id} />;
      default:
        return (
          <DoctorDashboard
            dokterId={currentUser.id}
            onNavigateToRekamMedis={handleNavigateToRekamMedis}
          />
        );
    }
  };

  return (
    <div className="flex h-screen bg-[#F8FAFC]">
      <DoctorSidebar
        currentPage={currentPage}
        onNavigate={handleNavigate}
        user={currentUser}
        onLogout={onLogout}
      />
      <main className="flex-1 overflow-y-auto">
        {renderPage()}
      </main>
    </div>
  );
}
