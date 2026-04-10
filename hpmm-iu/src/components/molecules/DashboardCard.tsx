import React from "react";

interface DashboardCardProps {
  title: string;
  subtitle: string;
  value: number | string;
  icon?: React.ReactNode;
  onClick?: () => void;
  colorVariant?: string;
  trend?: string;
}

const colorMap: Record<string, string> = {
  green: "from-green-400 to-green-200",
  yellow: "from-yellow-400 to-yellow-200",
  red: "from-red-400 to-red-200",
  orange: "from-orange-400 to-orange-200",
  indigo: "from-indigo-400 to-indigo-200",
  purple: "from-purple-400 to-purple-200",
  blue: "from-blue-400 to-blue-200",
  gray: "from-gray-400 to-gray-200",
};

const DashboardCard: React.FC<DashboardCardProps> = ({
  title,
  subtitle,
  value,
  icon,
  onClick,
  colorVariant,
}) => {
  const gradient = colorVariant && colorMap[colorVariant]
    ? colorMap[colorVariant]
    : "from-gray-300 to-gray-100";

  return (
    <div
      className={`bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 p-6 border border-gray-100 hover:border-gray-200 group cursor-pointer`}
      onClick={onClick}
      tabIndex={onClick ? 0 : undefined}
      role={onClick ? "button" : undefined}
    >
      {/* Header con icono */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          {icon && (
            <div className="p-2 bg-gray-50 rounded-lg group-hover:bg-gray-100 transition-colors duration-300">
              {icon}
            </div>
          )}
          <div>
            <h3 className="font-semibold text-gray-900 text-sm">
              {title}
            </h3>
            <p className="text-gray-500 text-xs mt-1">
              {subtitle}
            </p>
          </div>
        </div>
      </div>
      
      {/* Valor principal */}
      <div className="flex items-end justify-between">
        <div className="text-3xl font-bold text-gray-900 group-hover:text-gray-700 transition-colors duration-300">
          {value}
        </div>
        
        {/* Indicador visual sutil */}
        <div className={`w-2 h-8 bg-gradient-to-t ${gradient} rounded-full group-hover:opacity-80 transition-all duration-300`}></div>
      </div>
    </div>
  );
};

export default DashboardCard;