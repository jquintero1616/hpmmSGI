import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import DashboardCard from "../molecules/DashboardCard";
import {
  CubeIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  DocumentTextIcon,
} from "@heroicons/react/24/solid";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useAuth } from "../../hooks/use.Auth";
import { useProducts } from "../../hooks/use.Product";
import { useKardex } from "../../hooks/use.Kardex"; 

// Simulación de servicios
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
    setTimeout(() => {
      setData({
        proximosAVencer: 0,
        bajasExistencias: 0,
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
  const location = useLocation();
  const showWelcome = location.state?.showWelcome;
  const { username } = useAuth();
  const { products } = useProducts();
  const { kardex } = useKardex();

  // Filtrar kardex pendientes y aprobados (insensible a mayúsculas/espacios)
  const kardexPendientes = kardex
    ? kardex.filter((item: any) => item.tipo?.toLowerCase().trim() === "pendiente")
    : [];

  const kardexAprobados = kardex
    ? kardex.filter((item: any) => item.tipo?.toLowerCase().trim() === "aprobado")
    : [];



  useEffect(() => {
    if (showWelcome) {
      toast.success(
        `¡Bienvenido al Sistema de Gestión de Inventario, ${username || "Usuario"}!`,
        {
          position: "top-right",
          autoClose: 3000,
        }
      );
      window.history.replaceState({}, document.title);
    }
  }, [showWelcome, username]);

  const { proximosAVencer, bajasExistencias, vencidos } = useDashboardData();

  return (
    <div className="min-h-screen bg-gray-50">
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Dashboard</h1>
          <p className="text-gray-600">Resumen del estado actual del sistema</p>
        </div>
        {/* Grid de tarjetas */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          <DashboardCard
            title="Productos"
            subtitle="Registrados"
            value={products.length}
            icon={<CubeIcon className="w-5 h-5 text-blue-600" />}
          />
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
            title="Kardex"
            subtitle="Solicitudes a Fusiones"
            value={kardexPendientes.length}
            icon={<DocumentTextIcon className="w-5 h-5 text-indigo-600" />}
          />
          <DashboardCard
            title="Kardex"
            subtitle="Aprobados"
            value={kardexAprobados.length}
            icon={<CheckCircleIcon className="w-5 h-5 text-green-600" />}
          />
        </div>
      </div>
    </div>
  );
};

export default HomePage;
