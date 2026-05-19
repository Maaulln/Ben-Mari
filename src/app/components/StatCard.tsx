import { ReactNode } from 'react';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: ReactNode;
  color: string;
  subtitle?: string;
  onClick?: () => void;
}

export function StatCard({
  title,
  value,
  icon,
  color,
  subtitle,
  onClick,
}: StatCardProps) {
  return (
    <div
      className={`bg-white rounded-xl p-5 border border-gray-100 shadow-sm ${
        onClick
          ? 'cursor-pointer hover:shadow-md transition-shadow'
          : ''
      }`}
      onClick={onClick}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-gray-500 font-medium">
            {title}
          </p>

          <p className="text-3xl font-bold text-gray-900 mt-1">
            {value}
          </p>

          {subtitle && (
            <p className="text-xs text-gray-400 mt-1">
              {subtitle}
            </p>
          )}
        </div>

        <div
          className={`p-3 rounded-lg ${color}`}
        >
          {icon}
        </div>
      </div>
    </div>
  );
}