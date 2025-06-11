import React from "react";

interface DashboardCardProps {
  title: string;
  subtitle: string;
  value: number | string;
  icon?: React.ReactNode;
}

const DashboardCard: React.FC<DashboardCardProps> = ({
  title,
  subtitle,
  value,
  icon,
}) => {
  return (
    <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 p-6 border border-gray-100 hover:border-gray-200 group">
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
        <div className="w-2 h-8 bg-gradient-to-t from-gray-300 to-gray-100 rounded-full group-hover:from-gray-400 group-hover:to-gray-200 transition-all duration-300"></div>
      </div>
    </div>
  );
};

export default DashboardCard;