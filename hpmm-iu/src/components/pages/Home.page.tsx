import React, { useEffect, useState } from "react";
import { useLocation, useNavigate} from "react-router-dom";
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
import "dayjs/locale/es";
dayjs.locale("es");

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

const formatFechaLarga = () => {
  const d = dayjs();
  const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);
  const weekday = capitalize(d.format("dddd"));
  const dayNum = d.format("DD");
  const month = capitalize(d.format("MMMM"));
  const year = d.format("YYYY");
  return `${weekday} ${dayNum} de ${month} del ${year}`;
};

const HomePage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const showWelcome = location.state?.showWelcome;
  const { username, roleName, idEmployes } = useAuth();
  const { products } = useProducts();
  const { kardex, kardexDetail } = useKardex();
  const { requisitions } = useRequisicion();
  const { scompras } = useSolicitudCompras();
  const [fechaHoy, setFechaHoy] = useState(formatFechaLarga());

  // Roles que pueden ver Productos y Kardex
  const rolesConAccesoInventario = [
    "Almacen",
    "Jefe de Logistica",
    "Jefa de Almacen",
    "Administrador",
    "Super Admin",
  ];

  // Verificar si el usuario actual puede ver las secciones de inventario
  const puedeVerInventario = rolesConAccesoInventario.includes(roleName || "");

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

  // Función para verificar si el usuario tiene acceso a alguna card de una sección
  const hasAccessToSection = (
    menuKey: keyof typeof subMenuVisibility,
    paths: string[]
  ) => {
    return paths.some(path => canViewCard(menuKey, path));
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

  // Filtrar requisiciones por estado
  const requisicionesPendientes = requisicionesUsuario?.filter(
    (r: any) => r.estado?.toLowerCase().trim() === "pendiente"
  ) || [];

  const totalRequisiciones = requisicionesUsuario?.length || 0;

  // Filtrar solicitudes de compras por estado
  const solicitudesPendientes = solicitudesUsuario?.filter(
    (s: any) => s.estado?.toLowerCase().trim() === "pendiente"
  ) || [];

  const totalSolicitudes = solicitudesUsuario?.length || 0;

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

  // Función para obtener el saludo según el horario
  const getSaludo = () => {
    const hora = new Date().getHours();
    if (hora < 12) return "Buenos días";
    if (hora < 18) return "Buenas tardes";
    return "Buenas noches";
  };

  useEffect(() => {
    if (showWelcome) {
      toast.success(
        `¡Bienvenido , ${
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

  // Usar kardexDetail que ya tiene toda la información desglosada
  // Filtrar solo los movimientos de kardex aprobados de tipo Entrada
  const kardexAprobadosEntrada = kardexDetail
    ? kardexDetail.filter(
        (k: any) => 
          k.tipo?.toLowerCase().trim() === "aprobado" &&
          k.tipo_movimiento === "Entrada"
      )
    : [];

  // Productos con existencia: registros de kardex aprobados con stock_actual > 0
  // Agrupar por producto para evitar duplicados
  const productosUnicos = new Map();
  kardexAprobadosEntrada.forEach((k: any) => {
    if (k.id_product && !productosUnicos.has(k.id_product)) {
      productosUnicos.set(k.id_product, {
        id_product: k.id_product,
        nombre_producto: k.nombre_producto,
        stock_actual: k.stock_actual || k.calculado_stock || 0,
        stock_maximo: k.stock_maximo || 0,
      });
    }
  });

  // Contar productos únicos con stock > 0
  const productosEnExistencia = Array.from(productosUnicos.values()).filter(
    (p: any) => p.stock_actual > 0
  ).length;

  // Próximos a vencer: registros de kardex aprobados con fecha_vencimiento entre hoy y 30 días
  const proximosAVencer = kardexAprobadosEntrada.filter((k: any) => {
    if (!k.fecha_vencimiento) return false;
    const fecha = dayjs(k.fecha_vencimiento);
    const stockDisponible = k.stock_actual || k.calculado_stock || k.cantidad || 0;
    return stockDisponible > 0 && fecha.isAfter(hoy) && fecha.isBefore(en30dias);
  }).length;

  // Vencidos: registros de kardex aprobados con fecha_vencimiento menor a hoy
  const vencidos = kardexAprobadosEntrada.filter((k: any) => {
    if (!k.fecha_vencimiento) return false;
    const fecha = dayjs(k.fecha_vencimiento);
    const stockDisponible = k.stock_actual || k.calculado_stock || k.cantidad || 0;
    return stockDisponible > 0 && fecha.isBefore(hoy, "day");
  }).length;

  // Bajas existencias: productos con stock actual menor al 10% del stock máximo
  const bajasExistencias = Array.from(productosUnicos.values()).filter(
    (p: any) => p.stock_maximo > 0 && p.stock_actual > 0 && p.stock_actual / p.stock_maximo < 0.1
  ).length;

  useEffect(() => {
    // Actualiza cada minuto por si cruza medianoche
    const id = setInterval(() => setFechaHoy(formatFechaLarga()), 60 * 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="bg-gray-50 min-h-full">
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">
            {getSaludo()}, {username || "Usuario"}!
          </h1>
          <p className="text-sm text-gray-500 mt-1">{fechaHoy}</p>
        </div>

        {/* ================== SECCIÓN PRODUCTOS ================== */}
        {puedeVerInventario && (
          <div className="mb-8">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Productos</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {canViewCard("inventario", "/products") && (
                <DashboardCard
                  title="Productos"
                  subtitle="En Existencia"
                  value={productosEnExistencia}
                  icon={<CubeIcon className="w-5 h-5 text-green-600" />}
                  onClick={() => navigate("/products")}
                  colorVariant="green"
                  trend="success"
                />
              )}
              {canViewCard("inventario", "/products") && (
                <DashboardCard
                  title="Productos"
                  subtitle="Próximos a Vencer"
                  value={proximosAVencer}
                  icon={<ExclamationTriangleIcon className="w-5 h-5 text-yellow-600" />}
                  onClick={() => navigate("/products")}
                  colorVariant="yellow"
                  trend={proximosAVencer > 0 ? "warning" : "neutral"}
                />
              )}
              {canViewCard("inventario", "/products") && (
                <DashboardCard
                  title="Productos"
                  subtitle="Vencidos"
                  value={vencidos}
                  icon={<ExclamationTriangleIcon className="w-5 h-5 text-red-600" />}
                  onClick={() => navigate("/products")}
                  colorVariant="red"
                  trend={vencidos > 0 ? "danger" : "neutral"}
                />
              )}
              {canViewCard("inventario", "/stock-critico") && (
                <DashboardCard
                  title="Productos"
                  subtitle="Bajas Existencias"
                  value={bajasExistencias}
                  icon={<CubeIcon className="w-5 h-5 text-orange-600" />}
                  onClick={() => navigate("/products")}
                  colorVariant="orange"
                  trend={bajasExistencias > 0 ? "down" : "neutral"}
                />
              )}
            </div>
          </div>
        )}

        {/* ================== SECCIÓN KARDEX ================== */}
        {hasAccessToSection("kardex", ["/KardexPendiente", "/kardex"]) && (
          <div className="mb-8">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Kardex</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {canViewCard("kardex", "/KardexPendiente") && (
                <DashboardCard
                  title="Kardex"
                  subtitle="Solicitudes Pendientes"
                  value={kardexPendientes.length}
                  icon={<DocumentTextIcon className="w-5 h-5 text-indigo-600" />}
                  onClick={() => navigate("/KardexPendiente")}
                  colorVariant="indigo"
                  trend={kardexPendientes.length > 0 ? "up" : "neutral"}
                />
              )}
              {canViewCard("kardex", "/kardex") && (
                <DashboardCard
                  title="Kardex"
                  subtitle="Aprobados"
                  value={kardexAprobados.length}
                  icon={<CheckCircleIcon className="w-5 h-5 text-green-600" />}
                  onClick={() => navigate("/kardex")}
                  colorVariant="green"
                  trend="success"
                />
              )}
            </div>
          </div>
        )}

        {/* ================== SECCIÓN REQUISICIONES ================== */}
        {hasAccessToSection("requisiciones", ["/requisicionPendiente", "/requisicionSeguimiento"]) && (
          <div className="mb-8">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Requisiciones</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {canViewCard("requisiciones", "/requisicionPendiente") && (
                <DashboardCard
                  title="Requisiciones"
                  subtitle="Total"
                  value={totalRequisiciones}
                  icon={<ClipboardDocumentListIcon className="w-5 h-5 text-gray-600" />}
                  onClick={() => navigate("/requisicionPendiente")}
                  colorVariant="gray"
                  trend="neutral"
                />
              )}
              {canViewCard("requisiciones", "/requisicionPendiente") && (
                <DashboardCard
                  title="Requisiciones"
                  subtitle="Pendientes"
                  value={requisicionesPendientes.length}
                  icon={<ClipboardDocumentListIcon className="w-5 h-5 text-purple-600" />}
                  onClick={() => navigate("/requisicionPendiente")}
                  colorVariant="purple"
                  trend={requisicionesPendientes.length > 0 ? "up" : "neutral"}
                />
              )}
              {canViewCard("requisiciones", "/requisicionSeguimiento") && (
                <DashboardCard
                  title="Solicitud de Compras"
                  subtitle="Total"
                  value={totalSolicitudes}
                  icon={<ShoppingCartIcon className="w-5 h-5 text-gray-600" />}
                  onClick={() => navigate("/requisicionSeguimiento")}
                  colorVariant="gray"
                  trend="neutral"
                />
              )}
              {canViewCard("requisiciones", "/requisicionSeguimiento") && (
                <DashboardCard
                  title="Solicitud de Compras"
                  subtitle="Pendientes"
                  value={solicitudesPendientes.length}
                  icon={<ShoppingCartIcon className="w-5 h-5 text-blue-600" />}
                  onClick={() => navigate("/requisicionSeguimiento")}
                  colorVariant="blue"
                  trend={solicitudesPendientes.length > 0 ? "up" : "neutral"}
                />
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default HomePage;
