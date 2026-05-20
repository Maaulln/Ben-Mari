import { Clock, CheckCircle, XCircle, AlertCircle, UserCheck, AlertTriangle, CreditCard } from 'lucide-react';

interface BadgeProps {
  status: string;
  type?: 'appointment' | 'payment' | 'active' | 'stock' | 'antrian';
}

export function Badge({ status, type = 'appointment' }: BadgeProps) {
  const getConfig = (): { style: string; icon: React.ReactNode; label: string } => {
    if (type === 'appointment') {
      switch (status) {
        case 'MENUNGGU':
          return { style: 'bg-yellow-100 text-yellow-700', icon: <Clock size={12} />, label: 'Menunggu' };
        case 'DIKONFIRMASI':
          return { style: 'bg-blue-100 text-blue-700', icon: <CheckCircle size={12} />, label: 'Dikonfirmasi' };
        case 'HADIR':
          return { style: 'bg-teal-100 text-teal-700', icon: <UserCheck size={12} />, label: 'Hadir' };
        case 'SELESAI':
          return { style: 'bg-green-100 text-green-700', icon: <CheckCircle size={12} />, label: 'Selesai' };
        case 'BATAL':
          return { style: 'bg-red-100 text-red-700', icon: <XCircle size={12} />, label: 'Batal' };
        case 'ABSEN':
          return { style: 'bg-gray-100 text-gray-600', icon: <AlertCircle size={12} />, label: 'Absen' };
        default:
          return { style: 'bg-gray-100 text-gray-700', icon: null, label: status };
      }
    }

    if (type === 'payment') {
      switch (status) {
        case 'LUNAS':
          return { style: 'bg-green-100 text-green-700', icon: <CheckCircle size={12} />, label: 'Lunas' };
        case 'BELUM_BAYAR':
          return { style: 'bg-red-100 text-red-700', icon: <AlertCircle size={12} />, label: 'Belum Bayar' };
        case 'SEBAGIAN':
          return { style: 'bg-orange-100 text-orange-700', icon: <CreditCard size={12} />, label: 'Sebagian' };
        default:
          return { style: 'bg-gray-100 text-gray-700', icon: null, label: status };
      }
    }

    if (type === 'active') {
      switch (status) {
        case 'Y':
        case 'AKTIF':
          return { style: 'bg-green-100 text-green-700', icon: <CheckCircle size={12} />, label: 'Aktif' };
        case 'N':
        case 'NONAKTIF':
          return { style: 'bg-gray-100 text-gray-500', icon: <XCircle size={12} />, label: 'Nonaktif' };
        default:
          return { style: 'bg-gray-100 text-gray-700', icon: null, label: status };
      }
    }

    if (type === 'antrian') {
      switch (status) {
        case 'MENUNGGU':
          return { style: 'bg-yellow-100 text-yellow-700', icon: <Clock size={12} />, label: 'Menunggu' };
        case 'DIPANGGIL':
          return { style: 'bg-purple-100 text-purple-700', icon: <AlertCircle size={12} />, label: 'Dipanggil' };
        case 'SELESAI':
          return { style: 'bg-green-100 text-green-700', icon: <CheckCircle size={12} />, label: 'Selesai' };
        case 'BATAL':
          return { style: 'bg-red-100 text-red-700', icon: <XCircle size={12} />, label: 'Batal' };
        default:
          return { style: 'bg-gray-100 text-gray-700', icon: null, label: status };
      }
    }

    if (type === 'stock') {
      switch (status) {
        case 'TERSEDIA':
          return { style: 'bg-green-100 text-green-700', icon: <CheckCircle size={12} />, label: 'Tersedia' };
        case 'MENIPIS':
          return { style: 'bg-yellow-100 text-yellow-700', icon: <AlertTriangle size={12} />, label: 'Menipis' };
        case 'HABIS':
          return { style: 'bg-red-100 text-red-700', icon: <XCircle size={12} />, label: 'Habis' };
        default:
          return { style: 'bg-gray-100 text-gray-700', icon: null, label: status };
      }
    }

    return { style: 'bg-gray-100 text-gray-700', icon: null, label: status };
  };

  const { style, icon, label } = getConfig();

  return (
    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${style}`}>
      {icon}
      {label}
    </span>
  );
}
