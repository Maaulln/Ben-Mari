import { Home, Calendar, FileText, User } from 'lucide-react';

interface PatientNavigationProps {
  currentPage: string;
  onNavigate: (page: string) => void;
}

export function PatientNavigation({ currentPage, onNavigate }: PatientNavigationProps) {
  const menuItems = [
    { id: 'beranda', label: 'Beranda', icon: Home },
    { id: 'appointment', label: 'Appointment', icon: Calendar },
    { id: 'riwayat', label: 'Riwayat', icon: FileText },
    { id: 'profil', label: 'Profil', icon: User },
  ];

  return (
    <>
      {/* Desktop Top Navigation */}
      <nav className="hidden md:block bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-[#0F766E] rounded-lg flex items-center justify-center text-white font-bold">
                K
              </div>
              <div>
                <span className="font-bold text-gray-900">Klinik BenMari</span>
                <p className="text-xs text-gray-500">Portal Pasien</p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              {menuItems.map((item) => {
                const Icon = item.icon;
                const isActive = currentPage === item.id;

                return (
                  <button
                    key={item.id}
                    onClick={() => onNavigate(item.id)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                      isActive
                        ? 'bg-[#0F766E] text-white'
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    <Icon size={20} />
                    <span className="font-medium">{item.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-40">
        <div className="flex items-center justify-around h-16">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentPage === item.id;

            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={`flex flex-col items-center justify-center flex-1 h-full transition-colors ${
                  isActive ? 'text-[#0F766E]' : 'text-gray-600'
                }`}
              >
                <Icon size={24} />
                <span className="text-xs mt-1 font-medium">{item.label}</span>
              </button>
            );
          })}
        </div>
      </nav>
    </>
  );
}
