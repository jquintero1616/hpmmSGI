import React, { useEffect, useState } from "react";
import DashboardCard from "../molecules/DashboardCard";
import {
  CubeIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  TruckIcon,
  BuildingStorefrontIcon,
  DocumentTextIcon,
} from "@heroicons/react/24/solid";

// Simulación de servicios (reemplaza por tus getters reales)
const useDashboardData = () => {
  const [data, setData] = useState({
    proximosAVencer: 0,
    bajasExistencias: 0,
    vencidos: 0,
    pactosPendientes: 0,
    proveedoresPendientes: 0,
    kardexSolicitudes: 0,
  });

  useEffect(() => {
    // Aquí llama a tus servicios reales y actualiza el estado
    setTimeout(() => {
      setData({
        proximosAVencer: 18,
        bajasExistencias: 3,
        vencidos: 0,
        pactosPendientes: 1,
        proveedoresPendientes: 2,
        kardexSolicitudes: 4,
      });
    }, 500);
  }, []);

  return data;
};

const HomePage: React.FC = () => {
  const {
    proximosAVencer,
    bajasExistencias,
    vencidos,
    pactosPendientes,
    proveedoresPendientes,
    kardexSolicitudes,
  } = useDashboardData();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Dashboard</h1>
          <p className="text-gray-600">Resumen del estado actual del sistema</p>
        </div>

        {/* Grid de tarjetas - Completamente responsive */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          
          <DashboardCard 
            title="Productos" 
            subtitle="Próximos a Vencer" 
            value={proximosAVencer}
            icon={<ExclamationTriangleIcon className="w-5 h-5 text-amber-600" />}
          />
          
          <DashboardCard 
            title="Productos" 
            subtitle="Bajas Existencias" 
            value={bajasExistencias}
            icon={<CubeIcon className="w-5 h-5 text-red-600" />}
          />
          
          <DashboardCard 
            title="Productos" 
            subtitle="Vencidos" 
            value={vencidos}
            icon={<CheckCircleIcon className="w-5 h-5 text-green-600" />}
          />
          
          <DashboardCard 
            title="Pactos" 
            subtitle="Pendientes de Entrega" 
            value={pactosPendientes}
            icon={<TruckIcon className="w-5 h-5 text-blue-600" />}
          />
          
          <DashboardCard 
            title="Proveedores" 
            subtitle="Entregas Pendientes" 
            value={proveedoresPendientes}
            icon={<BuildingStorefrontIcon className="w-5 h-5 text-purple-600" />}
          />
          
          <DashboardCard 
            title="Kardex" 
            subtitle="Solicitudes de Fusión" 
            value={kardexSolicitudes}
            icon={<DocumentTextIcon className="w-5 h-5 text-indigo-600" />}
          />
          
        </div>
      </div>
    </div>
  );
};

export default HomePage;
