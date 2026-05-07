interface StokBarProps {
  stok: number;
  stokMax?: number;
}

export function StokBar({ stok, stokMax = 100 }: StokBarProps) {
  const pct = Math.min((stok / stokMax) * 100, 100);
  const color = pct > 50 ? 'bg-green-500' : pct > 20 ? 'bg-yellow-500' : 'bg-red-500';

  return (
    <div className="flex items-center gap-2">
      <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
        <div className={`h-full ${color} rounded-full`} style={{ width: `${pct}%` }} />
      </div>
      <span className="text-xs text-gray-600">{stok}</span>
    </div>
  );
}
