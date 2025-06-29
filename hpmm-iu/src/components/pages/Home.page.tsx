import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import DashboardCard from "../molecules/DashboardCard";
import {
  CubeIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  DocumentTextIcon,
  ShoppingCartIcon,
  ClipboardDocumentListIcon,
} from "@heroicons/react/24/solid";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useAuth } from "../../hooks/use.Auth";
import { useProducts } from "../../hooks/use.Product";
import { useKardex } from "../../hooks/use.Kardex";
import { useRequisicion } from "../../hooks/use.Requisicion";
import { useSolicitudCompras } from "../../hooks/use.SolicitudCompras";
import { subMenuVisibility } from "../../config/permissions";
import dayjs from "dayjs";

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
  const navigate = useNavigate();
  const showWelcome = location.state?.showWelcome;
  const { username, roleName, idEmployes } = useAuth();
  const { products } = useProducts();
  const { kardex } = useKardex();
  const { requisitions } = useRequisicion();
  const { scompras } = useSolicitudCompras();

  // Función para saber si el usuario puede ver la card (igual que en Sidebar)
  const canViewCard = (
    menuKey: keyof typeof subMenuVisibility,
    path: string
  ) => {
    if (!roleName) return false;
    const menu = subMenuVisibility[menuKey];
    if (!menu) return false;
    const allowed = (menu as Record<string, string[]>)[roleName];
    return allowed ? allowed.includes(path) : false;
  };

  // Filtrar datos según el rol
  const requisicionesUsuario =
    roleName === "Administrador" || roleName === "Super Admin"
      ? requisitions
      : requisitions?.filter((r: any) => r.id_employes === idEmployes);

  const solicitudesUsuario =
    roleName === "Administrador" || roleName === "Super Admin"
      ? scompras
      : scompras?.filter((s: any) => s.id_employes === idEmployes);

  // Filtrar kardex pendientes y aprobados (insensible a mayúsculas/espacios)
  const kardexPendientes = kardex
    ? kardex.filter(
        (item: any) => item.tipo?.toLowerCase().trim() === "pendiente"
      )
    : [];

  const kardexAprobados = kardex
    ? kardex.filter(
        (item: any) => item.tipo?.toLowerCase().trim() === "aprobado"
      )
    : [];

  // Función para obtener el saludo según la hora
  const getSaludo = () => {
    const hora = new Date().getHours();
    if (hora < 12) return "Buenos días";
    if (hora < 18) return "Buenas tardes";
    return "Buenas noches";
  };

  useEffect(() => {
    if (showWelcome) {
      toast.success(
        `¡Bienvenido al Sistema de Gestión de Inventario, ${
          username || "Usuario"
        }!`,
        {
          position: "top-center",
          autoClose: 3000,
        }
      );
      window.history.replaceState({}, document.title);
    }
  }, [showWelcome, username]);

  const hoy = dayjs();
  const en30dias = hoy.add(30, "day");

  // Calcula el stock actual por producto usando kardex
  const computeStock = (productId: string) => {
    return kardex
      .filter((k: any) => k.id_product === productId && k.tipo === "Aprobado")
      .reduce((acc: number, k: any) => {
        const qty = parseFloat(k.cantidad);
        return acc + (k.tipo_movimiento === "Entrada" ? qty : -qty);
      }, 0);
  };

  // Obtiene todas las fechas de vencimiento de entradas aprobadas por producto
  const getFechasVencimiento = (productId: string) => {
    return kardex
      .filter(
        (k: any) =>
          k.id_product === productId &&
          k.tipo === "Aprobado" &&
          k.tipo_movimiento === "Entrada" &&
          k.fecha_vencimiento
      )
      .map((k: any) => k.fecha_vencimiento);
  };

  const productosConStock = products.map((p: any) => ({
    ...p,
    stock_actual: computeStock(p.id_product),
    fechas_vencimiento: getFechasVencimiento(p.id_product),
  }));

  // Próximos a vencer: al menos una fecha de vencimiento entre hoy y 30 días, y stock > 0
  const proximosAVencer = productosConStock.filter(
    (p) =>
      p.stock_actual > 0 &&
      p.fechas_vencimiento.some((fv: string) => {
        const fecha = dayjs(fv);
        return fecha.isAfter(hoy) && fecha.isBefore(en30dias);
      })
  ).length;

  // Vencidos: al menos una fecha de vencimiento menor a hoy, y stock > 0
  const vencidos = productosConStock.filter(
    (p) =>
      p.stock_actual > 0 &&
      p.fechas_vencimiento.some((fv: string) => {
        const fecha = dayjs(fv);
        return fecha.isBefore(hoy, "day");
      })
  ).length;

  // Bajas existencias: stock actual menor al 30% del stock máximo
  const bajasExistencias = productosConStock.filter(
    (p) => p.stock_maximo > 0 && p.stock_actual / p.stock_maximo < 0.1 // cambiar 0.1 a 0.3 si se quiere el 30%
  ).length;

  return (
    <div className="min-h-screen bg-gray-50">
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            {getSaludo()}, {username || "Usuario"}!
          </h1>
          <p className="text-gray-600">Resumen del estado actual del sistema</p>
        </div>
        {/* Grid de tarjetas */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {/* Productos Registrados */}
          {canViewCard("inventario", "/products") && (
            <DashboardCard
              title="Productos"
              subtitle="Registrados"
              value={products.length}
              icon={<CubeIcon className="w-5 h-5 text-blue-600" />}
              onClick={() => navigate("/products")}
            />
          )}

          {/* Productos Próximos a Vencer */}
          {canViewCard("inventario", "/products") && (
            <DashboardCard
              title="Productos"
              subtitle="Próximos a Vencer"
              value={proximosAVencer}
              icon={
                <ExclamationTriangleIcon className="w-5 h-5 text-amber-600" />
              }
              onClick={() => navigate("/products")}
            />
          )}

          {/* Productos Bajas Existencias */}
          {canViewCard("inventario", "/stock-critico") && (
            <DashboardCard
              title="Productos"
              subtitle="Bajas Existencias"
              value={bajasExistencias}
              icon={<CubeIcon className="w-5 h-5 text-red-600" />}
              onClick={() => navigate("/products")}
            />
          )}

          {/* Productos Vencidos */}
          {canViewCard("inventario", "/products") && (
            <DashboardCard
              title="Productos"
              subtitle="Vencidos"
              value={vencidos}
              icon={<CheckCircleIcon className="w-5 h-5 text-green-600" />}
              onClick={() => navigate("/products")}
            />
          )}

          {/* Kardex Solicitudes a Fusiones */}
          {canViewCard("kardex", "/KardexPendiente") && (
            <DashboardCard
              title="Kardex"
              subtitle="Solicitudes a Fusiones"
              value={kardexPendientes.length}
              icon={<DocumentTextIcon className="w-5 h-5 text-indigo-600" />}
              onClick={() => navigate("/KardexPendiente")}
            />
          )}

          {/* Kardex Aprobados */}
          {canViewCard("kardex", "/kardex") && (
            <DashboardCard
              title="Kardex"
              subtitle="Aprobados"
              value={kardexAprobados.length}
              icon={<CheckCircleIcon className="w-5 h-5 text-green-600" />}
              onClick={() => navigate("/kardex")}
            />
          )}

          {/* Requisiciones */}
          {canViewCard("requisiciones", "/requisicionPendiente") && (
            <DashboardCard
              title="Requisiciones"
              subtitle="Pendientes"
              value={requisicionesUsuario?.length || 0}
              icon={
                <ClipboardDocumentListIcon className="w-5 h-5 text-indigo-600" />
              }
              onClick={() => navigate("/requisicionPendiente")}
            />
          )}

          {/* Progreso de Requisición */}
          {canViewCard("requisiciones", "/requisicionSeguimiento") && (
            <DashboardCard
              title="Solicitud de Requisición"
              subtitle="En Espera"
              value={solicitudesUsuario?.length || 0}
              icon={<ShoppingCartIcon className="w-5 h-5 text-green-600" />}
              onClick={() => navigate("/requisicionSeguimiento")}
            />
          )}
        </div>
        {/* Enlace al historial de notificaciones */}
        <div className="mt-8 text-center">
          <Link to="/notificaciones" className="text-blue-600 underline">
            Ver historial de notificaciones
          </Link>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
