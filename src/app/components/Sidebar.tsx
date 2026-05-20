import { useState } from 'react';
import {
  Home,
  Users,
  UserCircle,
  Calendar,
  FileText,
  Pill,
  Receipt,
  BarChart2,
  Settings,
  LogOut,
  Menu,
  X,
  ListOrdered,
  FlaskConical
} from 'lucide-react';

interface SidebarProps {
  currentPage: string;
  onNavigate: (page: string) => void;
  user: { nama: string; role: string } | null;
  onLogout: () => void;
}

export function Sidebar({ currentPage, onNavigate, user, onLogout }: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false);

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'pasien', label: 'Pasien', icon: Users },
    { id: 'dokter', label: 'Dokter', icon: UserCircle },
    { id: 'appointment', label: 'Appointment', icon: Calendar },
    { id: 'rekam-medis', label: 'Rekam Medis', icon: FileText },
    { id: 'obat', label: 'Obat', icon: Pill },
    { id: 'antrian', label: 'Antrian', icon: ListOrdered },
    { id: 'resep', label: 'Farmasi', icon: FlaskConical },
    { id: 'tagihan', label: 'Tagihan', icon: Receipt },
    { id: 'laporan', label: 'Laporan', icon: BarChart2 },
    { id: 'pengaturan', label: 'Pengaturan', icon: Settings },
  ];

  return (
    <div
      className={`h-screen bg-[#0F172A] text-[#CBD5E1] flex flex-col transition-all duration-300 ${
        collapsed ? 'w-20' : 'w-64'
      }`}
    >
      {/* Header */}
      <div className="p-4 border-b border-[#1E293B] flex items-center justify-between">
        {!collapsed && (
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-[#0F766E] rounded-lg flex items-center justify-center text-white font-bold">
              K
            </div>
            <span className="font-bold text-white">Klinik BenMari</span>
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
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[#0F766E] rounded-full flex items-center justify-center text-white font-semibold">
                {user.nama.charAt(0)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white truncate">{user.nama}</p>
                <p className="text-xs text-[#94A3B8]">{user.role}</p>
              </div>
            </div>
          ) : (
            <div className="w-10 h-10 bg-[#0F766E] rounded-full flex items-center justify-center text-white font-semibold mx-auto">
              {user.nama.charAt(0)}
            </div>
          )}
          <button
            onClick={onLogout}
            className="w-full mt-3 flex items-center justify-center gap-2 px-3 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors text-sm"
          >
            <LogOut size={16} />
            {!collapsed && <span>Logout</span>}
          </button>
        </div>
      )}
    </div>
  );
}
