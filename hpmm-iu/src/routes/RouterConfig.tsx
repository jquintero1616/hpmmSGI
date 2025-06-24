import PrivateRouteValidation from "./PrivateRoute";
import Layout from "../layouts/Layout";
import LoginPage from "../components/pages/Login.page";
import GenericPage from "../components/pages/Generic.page";
import HomePage from "../components/pages/Home.page";
import User from "../components/organisms/User";
import Pacts from "../components/organisms/Pacts";
import Products from "../components/organisms/Product";
import Category from "../components/organisms/Category";
import Suppliers from "../components/organisms/Supplier";
import Roles from "../components/organisms/Role";
import Employe from "../components/organisms/Employes";
import Kardex from "../components/organisms/Kardex";
import Subcategory from "../components/organisms/Subcategory";
import Vendedor from "../components/organisms/Vendedor";
import Subdireccion from "../components/organisms/Subdireccion";
import Unit from "../components/organisms/Unit";
import Direction from "../components/organisms/Direction";
import Shopping from "../components/organisms/Shopping";
import Requisicion from "../components/organisms/Requisicion";
import ProductRequisition from "../components/organisms/Product_requisi";
import Bitacora from "../components/organisms/Bitacora";
import SolicitudCompras from "../components/organisms/SolicitudCompras";
import DetallePactos from "../components/organisms/DetallePactos";
import Report from "../components/organisms/Report";
import { subMenuVisibility } from "../config/permissions";
import SeguimientoTramiteOrganism from "../components/organisms/SeguimientoTramiteOrganism";
import DasboardGraficos from "../components/molecules/DasboardGraficos";
import { ChartPieIcon } from "@heroicons/react/24/outline";

// Utilidad para obtener roles permitidos para una ruta específica
function getRolesForPath(
  menuKey: keyof typeof subMenuVisibility,
  path: string
): string[] {
  return Object.entries(subMenuVisibility[menuKey] || {})
    .filter(([_, paths]) => paths.includes(path))
    .map(([role]) => role);
}

export const routes = [
  // Ruta pública de login
  {
    path: "/",
    element: <LoginPage />,
    private: false,
  },
  // Rutas protegidas dentro del layout
  {
    path: "/",
    element: (
      <PrivateRouteValidation>
        <Layout />
      </PrivateRouteValidation>
    ),
    children: [
      {
        path: "home",
        element: <HomePage />,
        valid: {
          roles: [
            "Administrador",
            "Jefe Almacen",
            "Tecnico Almacen",
            "Super Admin",
            "Jefe de Logistica",
            "Usuario",
          ],
        },
      },
      // Kardex y Pactos (incluye Técnico Almacen)
      {
        path: "kardex",
        element: (
          <GenericPage title="Gestión de Kardex">
            <Kardex status={"Aprobado"} />
          </GenericPage>
        ),
        valid: { roles: getRolesForPath("kardex", "/kardex") },
      },
      {
        path: "kardexPendiente",
        element: (
          <GenericPage title="Gestión de Kardex Pendientes">
            <Kardex status={"Pendiente"} />
          </GenericPage>
        ),
        valid: { roles: getRolesForPath("kardex", "/KardexPendiente") },
      },
      {
        path: "kardexRechazadas",
        element: (
          <GenericPage title="Kardex Rechazadas">
            <Kardex status={"Rechazado"} />
          </GenericPage>
        ),
        valid: { roles: getRolesForPath("kardex", "/KardexRechazadas") },
      },
      {
        path: "kardexHistorico",
        element: (
          <GenericPage title="Kardex Histórico">
            <Kardex status={"Todo"} />
          </GenericPage>
        ),
        valid: { roles: getRolesForPath("kardex", "/KardexHistorico") },
      },
      {
        path: "kardexCancelada",
        element: (
          <GenericPage title="Kardex Canceladas">
            <Kardex status={"Cancelado"} />
          </GenericPage>
        ),
        valid: { roles: getRolesForPath("kardex", "/KardexCancelada") },
      },
      {
        path: "pacts",
        element: (
          <GenericPage title="Gestión de Pactos">
            <Pacts status={"Todo"} />
          </GenericPage>
        ),
        valid: { roles: getRolesForPath("pacts", "/pacts") },
      },
      {
        path: "detalle_pactos",
        element: (
          <GenericPage title="Gestión de Detalles de Pactos">
            <DetallePactos status={"Todo"} />
          </GenericPage>
        ),
        valid: { roles: getRolesForPath("pacts", "/detalle_pactos") },
      },
      // Resto de rutas protegidas (sin sobrescribir los roles)
      {
        path: "users",
        element: (
          <GenericPage title="Gestión de Usuarios">
            <User status={"Todo"} />
          </GenericPage>
        ),
        valid: { roles: getRolesForPath("usersRoles", "/users") },
      },
      {
        path: "products",
        element: (
          <GenericPage title="Gestión de Productos">
            <Products status={"Todo"} />
          </GenericPage>
        ),
        valid: { roles: getRolesForPath("inventario", "/products") },
      },
      {
        path: "category",
        element: (
          <GenericPage title="Gestión de Categorías">
            <Category status={"Todo"} />
          </GenericPage>
        ),
        valid: { roles: getRolesForPath("inventario", "/category") },
      },
      {
        path: "suppliers",
        element: (
          <GenericPage title="Gestión de Proveedores">
            <Suppliers status={"Todo"} />
          </GenericPage>
        ),
        valid: { roles: getRolesForPath("providers", "/suppliers") },
      },
      {
        path: "roles",
        element: (
          <GenericPage title="Gestión de Roles">
            <Roles status={"Todo"} />
          </GenericPage>
        ),
        valid: { roles: getRolesForPath("usersRoles", "/roles") },
      },
      {
        path: "employees",
        element: (
          <GenericPage title="Gestión de Empleados">
            <Employe status={"Todo"} />
          </GenericPage>
        ),
        valid: { roles: getRolesForPath("usersRoles", "/employees") },
      },
      {
        path: "subcategory",
        element: (
          <GenericPage title="Gestión de Subcategorías">
            <Subcategory status={"Todo"} />
          </GenericPage>
        ),
        valid: { roles: getRolesForPath("inventario", "/subcategory") },
      },
      {
        path: "vendedor",
        element: (
          <GenericPage title="Gestión de Vendedores">
            <Vendedor status={"Todo"} />
          </GenericPage>
        ),
        valid: { roles: getRolesForPath("providers", "/vendedor") },
      },
      {
        path: "subdireccion",
        element: (
          <GenericPage title="Gestión de subdirecciones">
            <Subdireccion status={"Todo"} />
          </GenericPage>
        ),
        valid: { roles: getRolesForPath("usersRoles", "/subdireccion") },
      },
      {
        path: "direction",
        element: (
          <GenericPage title="Gestión de Direcciones">
            <Direction status={"Todo"} />
          </GenericPage>
        ),
        valid: { roles: getRolesForPath("usersRoles", "/direction") },
      },
      {
        path: "unit",
        element: (
          <GenericPage title="Gestión de Unidades">
            <Unit status={"Todo"} />
          </GenericPage>
        ),
        valid: { roles: getRolesForPath("usersRoles", "/unit") },
      },
      {
        path: "shopping",
        element: (
          <GenericPage title="Gestión de Compras">
            <Shopping status={"Todo"} />
          </GenericPage>
        ),
        valid: { roles: getRolesForPath("comprasProductos", "/shopping") },
      },
      {
        path: "ProductRequisition",
        element: (
          <GenericPage title="Gestión de Requisiciones de Productos">
            <ProductRequisition status={"Todo"} />
          </GenericPage>
        ),
        valid: {
          roles: getRolesForPath("comprasProductos", "/ProductRequisition"),
        },
      },
      {
        path: "requisicionAprobado",
        element: (
          <GenericPage title="Gestión de Requisiciones Aprobadas">
            <Requisicion status={"Aprobado"} />
          </GenericPage>
        ),
        valid: {
          roles: getRolesForPath("requisiciones", "/requisicionAprobado"),
        },
      },
      {
        path: "requisicionPendiente",
        element: (
          <GenericPage title="Gestión de Requisiciones Pendientes">
            <Requisicion status={"Pendiente"} />
          </GenericPage>
        ),
        valid: {
          roles: getRolesForPath("requisiciones", "/requisicionPendiente"),
        },
      },
      {
        path: "requisicionRechazado",
        element: (
          <GenericPage title="Requisiciones Rechazadas">
            <Requisicion status={"Rechazado"} />
          </GenericPage>
        ),
        valid: {
          roles: getRolesForPath("requisiciones", "/requisicionRechazado"),
        },
      },
      {
        path: "requisicionHistorico",
        element: (
          <GenericPage title="Requisicion Histórico">
            <Requisicion status={"Todo"} />
          </GenericPage>
        ),
        valid: {
          roles: getRolesForPath("requisiciones", "/requisicionHistorico"),
        },
      },
      {
        path: "requisicionSeguimiento",
        element: (
          <GenericPage title="Seguimiento de Trámite">
            <SeguimientoTramiteOrganism />
          </GenericPage>
        ),
        valid: {
          roles: getRolesForPath("requisiciones", "/requisicionSeguimiento"),
        },
      },
      {
        path: "requisicionCancelado",
        element: (
          <GenericPage title="Requisicion Cancelado">
            <Requisicion status={"Cancelado"} />
          </GenericPage>
        ),
        valid: {
          roles: getRolesForPath("requisiciones", "/requisicionCancelado"),
        },
      },
      {
        path: "bitacora",
        element: (
          <GenericPage title="Bitácora del Sistema">
            <Bitacora />
          </GenericPage>
        ),
        valid: { roles: getRolesForPath("bitacora", "/bitacora") },
      },
      {
        path: "solicitud_compras",
        element: (
          <GenericPage title="Gestión de Solicitudes de Compras">
            <SolicitudCompras status={"Todo"} />
          </GenericPage>
        ),
        valid: {
          roles: getRolesForPath("comprasProductos", "/solicitud_compras"),
        },
      },
      {
        path: "report",
        element: (
          <GenericPage title="Gestión de Reportes">
            <Report />
          </GenericPage>
        ),
        valid: { roles: getRolesForPath("report", "/Report") },
      },
      {
        path: "stock-critico",
        element: (
          <GenericPage title="Stock Crítico">
            <Products status={"StockCritico"} />
          </GenericPage>
        ),
        valid: { roles: getRolesForPath("inventario", "/stock-critico") },
      },
      {
        path: "dashboard",
        element: (
          <GenericPage title="Dashboard de Gráficos">
            <DasboardGraficos />
          </GenericPage>
        ),
        valid: { roles: getRolesForPath("report", "/dashboard") },
      },
    ],
  },
];
