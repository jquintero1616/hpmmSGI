import React, { useEffect, useState } from "react";
import DashboardCard from "../molecules/DashboardCard";

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
    <div className="flex flex-col min-h-screen">
      <div className="flex-1 flex flex-col md:ml-0">
        <main className="flex-1 p-6 overflow-auto bg-black-50 flex items-center justify-center">
          <div className="w-full max-w-5xl flex flex-wrap justify-center items-center">
            <DashboardCard title="Productos" subtitle="Próximos a Vencer" value={proximosAVencer} />
            <DashboardCard title="Productos" subtitle="Bajas Existencias" value={bajasExistencias} />
            <DashboardCard title="Productos" subtitle="Vencidos" value={vencidos} />
            <DashboardCard title="Pactos" subtitle="Pendientes de Entrega" value={pactosPendientes} />
            <DashboardCard title="Proveedores" subtitle="Entregas Pendientes" value={proveedoresPendientes} />
            <DashboardCard title="Kardex" subtitle="Solicitudes de Fusión" value={kardexSolicitudes} />
          </div>
        </main>
      </div>
    </div>
  );
};

export default HomePage;
