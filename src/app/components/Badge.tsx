interface BadgeProps {
  status: string;
  type?: 'appointment' | 'payment' | 'active' | 'stock';
}

export function Badge({ status, type = 'appointment' }: BadgeProps) {
  const getStyles = () => {
    if (type === 'appointment') {
      switch (status) {
        case 'MENUNGGU':
          return 'bg-yellow-100 text-yellow-700';
        case 'SELESAI':
          return 'bg-green-100 text-green-700';
        case 'BATAL':
          return 'bg-red-100 text-red-700';
        default:
          return 'bg-gray-100 text-gray-700';
      }
    }

    if (type === 'payment') {
      switch (status) {
        case 'LUNAS':
          return 'bg-green-100 text-green-700';
        case 'BELUM':
          return 'bg-red-100 text-red-700';
        case 'CICIL':
          return 'bg-orange-100 text-orange-700';
        default:
          return 'bg-gray-100 text-gray-700';
      }
    }

    if (type === 'active') {
      switch (status) {
        case 'Y':
        case 'AKTIF':
          return 'bg-green-100 text-green-700';
        case 'N':
        case 'NONAKTIF':
          return 'bg-gray-100 text-gray-700';
        default:
          return 'bg-gray-100 text-gray-700';
      }
    }

    if (type === 'stock') {
      switch (status) {
        case 'TERSEDIA':
          return 'bg-green-100 text-green-700';
        case 'MENIPIS':
          return 'bg-yellow-100 text-yellow-700';
        case 'HABIS':
          return 'bg-red-100 text-red-700';
        default:
          return 'bg-gray-100 text-gray-700';
      }
    }

    return 'bg-gray-100 text-gray-700';
  };

  const displayText = type === 'active'
    ? (status === 'Y' ? 'AKTIF' : 'NONAKTIF')
    : status;

  return (
    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStyles()}`}>
      {displayText}
    </span>
  );
}
