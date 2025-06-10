import React from "react";

interface DashboardCardProps {
  title: string;
  subtitle: string;
  value: number | string;
  color?: string;
}

const DashboardCard: React.FC<DashboardCardProps> = ({
  title,
  subtitle,
  value,
  color = "text-purple-700",
}) => (
  <div className="bg-gray-200 rounded-lg shadow-md p-6 flex flex-col justify-between w-64 h-32 m-2">
    <div>
      <h3 className="font-bold text-lg">{title}</h3>
      <p className="text-gray-600">{subtitle}</p>
    </div>
    <div className={`text-3xl font-bold ${color} text-right`}>{value}</div>
  </div>
);

export default DashboardCard;