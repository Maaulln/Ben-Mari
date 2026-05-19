import { useState, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { Login } from './pages/Login';
import { Dashboard } from './pages/Dashboard';
import { Pasien } from './pages/Pasien';
import { Dokter } from './pages/Dokter';
import { Appointment } from './pages/Appointment';
import { RekamMedis } from './pages/RekamMedis';
import { Obat } from './pages/Obat';
import { Tagihan } from './pages/Tagihan';
import { Pengaturan } from './pages/Pengaturan';
import { Laporan } from './pages/Laporan';
import { DoctorApp } from './doctor/DoctorApp';
import { PatientApp } from './patient/PatientApp';
import { PatientRegister } from './patient/PatientRegister';
import api from '../services/api';

type PageType = 'dashboard' | 'pasien' | 'dokter' | 'appointment' | 'rekam-medis' | 'obat' | 'tagihan' | 'laporan' | 'pengaturan';

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState<{ nama: string; role: string; id?: number; spesialisasi?: string; nik?: string } | null>(null);
  const [currentPage, setCurrentPage] = useState<PageType>('dashboard');
  const [showRegister, setShowRegister] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('klinik_token');
    const userData = localStorage.getItem('klinik_user');

    if (token && userData) {
      setIsAuthenticated(true);
      setCurrentUser(JSON.parse(userData));
    }
  }, []);

  const handleLogin = async (email: string, password: string): Promise<boolean> => {
    try {
      const response = await api.post('/auth/login', { email, password });

      if (response.data && response.data.token) {
        const { token, user } = response.data;
        
        setIsAuthenticated(true);
        setCurrentUser(user);
        setShowRegister(false);
        
        localStorage.setItem('klinik_token', token);
        localStorage.setItem('klinik_user', JSON.stringify(user));
        return true;
      }

      return false;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setCurrentUser(null);
    setCurrentPage('dashboard');
    localStorage.removeItem('klinik_token');
    localStorage.removeItem('klinik_user');
  };

  const handleNavigate = (page: string) => {
    setCurrentPage(page as PageType);
  };

  // Show register page
  if (showRegister) {
    return (
      <PatientRegister
        onBackToLogin={() => setShowRegister(false)}
        onSuccess={() => setShowRegister(false)}
      />
    );
  }

  if (!isAuthenticated) {
    return <Login onLogin={handleLogin} onRegister={() => setShowRegister(true)} />;
  }

  // Route protection: If role is dokter, show DoctorApp
  if (currentUser?.role === 'dokter') {
    return <DoctorApp onLogout={handleLogout} />;
  }

  // Route protection: If role is pasien, show PatientApp
  if (currentUser?.role === 'pasien') {
    return <PatientApp onLogout={handleLogout} />;
  }

  // Route protection: If role is not admin, redirect to login
  if (currentUser?.role !== 'Admin') {
    handleLogout();
    return <Login onLogin={handleLogin} onRegister={() => setShowRegister(true)} />;
  }

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard />;
      case 'pasien':
        return <Pasien />;
      case 'dokter':
        return <Dokter />;
      case 'appointment':
        return <Appointment />;
      case 'rekam-medis':
        return <RekamMedis />;
      case 'obat':
        return <Obat />;
      case 'tagihan':
        return <Tagihan />;
      case 'laporan':
        return <Laporan />;
      case 'pengaturan':
        return <Pengaturan />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="flex h-screen bg-[#F8FAFC]">
      <Sidebar
        currentPage={currentPage}
        onNavigate={handleNavigate}
        user={currentUser}
        onLogout={handleLogout}
      />
      <main className="flex-1 overflow-y-auto">
        {renderPage()}
      </main>
    </div>
  );
}
