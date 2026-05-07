import { useState } from 'react';
import {
  Home,
  Calendar,
  Users,
  FileText,
  UserCircle,
  LogOut,
  Menu,
  X,
  Stethoscope
} from 'lucide-react';

interface DoctorSidebarProps {
  currentPage: string;
  onNavigate: (page: string) => void;
  user: { nama: string; spesialisasi: string } | null;
  onLogout: () => void;
}

export function DoctorSidebar({ currentPage, onNavigate, user, onLogout }: DoctorSidebarProps) {
  const [collapsed, setCollapsed] = useState(false);

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'jadwal', label: 'Jadwal Saya', icon: Calendar },
    { id: 'pasien', label: 'Pasien Saya', icon: Users },
    { id: 'rekam-medis', label: 'Rekam Medis', icon: FileText },
    { id: 'profil', label: 'Profil Saya', icon: UserCircle },
  ];

  return (
    <div
      className={`h-screen bg-[#0F2027] text-[#CBD5E1] flex flex-col transition-all duration-300 ${
        collapsed ? 'w-20' : 'w-64'
      }`}
    >
      {/* Header */}
      <div className="p-4 border-b border-[#1E293B] flex items-center justify-between">
        {!collapsed && (
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-[#0F766E] rounded-lg flex items-center justify-center text-white">
              <Stethoscope size={18} />
            </div>
            <div>
              <span className="font-bold text-white text-sm">Klinik BenMari</span>
              <p className="text-xs text-[#94A3B8]">Portal Dokter</p>
            </div>
          </div>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="text-[#CBD5E1] hover:text-white transition-colors"
        >
          {collapsed ? <Menu size={20} /> : <X size={20} />}
        </button>
      </div>

      {/* Menu Items */}
      <nav className="flex-1 py-4 overflow-y-auto">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentPage === item.id;

          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 transition-colors ${
                isActive
                  ? 'bg-[rgba(15,118,110,0.2)] text-white border-l-4 border-[#0F766E]'
                  : 'hover:bg-[#1E293B] text-[#CBD5E1]'
              }`}
            >
              <Icon size={20} />
              {!collapsed && <span>{item.label}</span>}
            </button>
          );
        })}
      </nav>

      {/* User Card */}
      {user && (
        <div className="p-4 border-t border-[#1E293B]">
          {!collapsed ? (
            <div>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-[#0F766E] rounded-full flex items-center justify-center text-white font-semibold">
                  {user.nama.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white truncate">{user.nama}</p>
                  <p className="text-xs text-[#94A3B8] truncate">{user.spesialisasi}</p>
                </div>
              </div>
              <button
                onClick={onLogout}
                className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors text-sm"
              >
                <LogOut size={16} />
                <span>Logout</span>
              </button>
            </div>
          ) : (
            <div>
              <div className="w-10 h-10 bg-[#0F766E] rounded-full flex items-center justify-center text-white font-semibold mx-auto mb-2">
                {user.nama.charAt(0)}
              </div>
              <button
                onClick={onLogout}
                className="w-full flex items-center justify-center px-2 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
              >
                <LogOut size={16} />
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
