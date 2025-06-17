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
import Report from "../components/organisms/report";
export const routes = [
  // Ruta pública de login
  {
    path: "/",
    element: <LoginPage />,
    private: false,
  },
  // Rutas “dentro” del layout y protegidas
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
          ],
        },
      },
      // Solo para Técnico Almacen: Kardex y Pactos
      {
        path: "kardex",
        element: (
          <GenericPage title="Gestión de Kardex">
            <Kardex status={"Aprobado"} />
          </GenericPage>
        ),
        valid: { roles: ["Administrador", "Jefe Almacen", "Tecnico Almacen", "Super Admin", "Jefe de Logistica"] },
      },
      {
        path: "kardexPendiente",
        element: (
          <GenericPage title="Gestión de Kardex Pendientes">
            <Kardex status={"Pendiente"} />
          </GenericPage>
        ),
        valid: { roles: ["Administrador", "Jefe Almacen", "Tecnico Almacen", "Super Admin", "Jefe de Logistica"] },
      },
      {
        path: "kardexRechazadas",
        element: (
          <GenericPage title="Kardex Rechazadas">
            <Kardex status={"Rechazado"} />
          </GenericPage>
        ),
        valid: { roles: ["Administrador", "Jefe Almacen", "Tecnico Almacen", "Super Admin", "Jefe de Logistica"] },
      },
      {
        path: "kardexHistorico",
        element: (
          <GenericPage title="Kardex Histórico">
            <Kardex status={"Todo"} />
          </GenericPage>
        ),
        valid: { roles: ["Administrador", "Jefe Almacen", "Tecnico Almacen", "Super Admin", "Jefe de Logistica"] },
      },
      {
        path: "kardexCancelada",
        element: (
          <GenericPage title="Kardex Canceladas">
            <Kardex status={"Cancelado"} />
          </GenericPage>
        ),
        valid: { roles: ["Administrador", "Jefe Almacen", "Tecnico Almacen", "Super Admin", "Jefe de Logistica"] },
      },
      {
        path: "pacts",
        element: (
          <GenericPage title="Gestión de Pactos">
            <Pacts status={"Todo"} />
          </GenericPage>
        ),
        valid: { roles: ["Administrador", "Jefe Almacen", "Tecnico Almacen", "Super Admin", "Jefe de Logistica"] },
      },
      // El resto de rutas solo para roles distintos a "Tecnico Almacen"
      ...[
        {
          path: "users",
          element: (
            <GenericPage title="Gestión de Usuarios">
              {<User status={"Todo"} />}
            </GenericPage>
          ),
        },
        {
          path: "products",
          element: (
            <GenericPage title="Gestión de Productos">
              <Products status={"Todo"} />
            </GenericPage>
          ),
        },
        {
          path: "category",
          element: (
            <GenericPage title="Gestión de Categorías">
              <Category status={"Todo"} />
            </GenericPage>
          ),
        },
        {
          path: "suppliers",
          element: (
            <GenericPage title="Gestión de Proveedores">
              <Suppliers status={"Todo"} />
            </GenericPage>
          ),
        },
        {
          path: "roles",
          element: (
            <GenericPage title="Gestión de Roles">
              <Roles status={"Todo"} />
            </GenericPage>
          ),
        },
        {
          path: "employees",
          element: (
            <GenericPage title="Gestión de Empleados">
              <Employe status={"Todo"} />
            </GenericPage>
          ),
        },
        {
          path: "subcategory",
          element: (
            <GenericPage title="Gestión de Subcategorías">
              <Subcategory status={"Todo"} />
            </GenericPage>
          ),
        },
        {
          path: "vendedor",
          element: (
            <GenericPage title="Gestión de Vendedores">
              <Vendedor status={"Todo"} />
            </GenericPage>
          ),
        },
        {
          path: "subdireccion",
          element: (
            <GenericPage title="Gestión de subdirecciones">
              <Subdireccion status={"Todo"} />
            </GenericPage>
          ),
        },
        {
          path: "direction",
          element: (
            <GenericPage title="Gestión de Direcciones">
              <Direction status={"Todo"} />
            </GenericPage>
          ),
        },
        {
          path: "unit",
          element: (
            <GenericPage title="Gestión de Unidades">
              <Unit status={"Todo"} />
            </GenericPage>
          ),
        },
        {
          path: "shopping",
          element: (
            <GenericPage title="Gestión de Compras">
              <Shopping status={"Todo"} />
            </GenericPage>
          ),
        },
        {
          path: "ProductRequisition",
          element: (
            <GenericPage title="Gestión de Requisiciones de Productos">
              <ProductRequisition status={"Todo"} />
            </GenericPage>
          ),
        },
        {
          path: "requisicionAprobado",
          element: (
            <GenericPage title="Gestión de Kardex">
              <Requisicion status={"Aprobado"} />
            </GenericPage>
          ),
        },
        {
          path: "requisicionPendiente",
          element: (
            <GenericPage title="Gestión de Requisiciones Pendientes">
              <Requisicion status={"Pendiente"} />
            </GenericPage>
          ),
        },
        {
          path: "requisicionRechazado",
          element: (
            <GenericPage title="Requisiciones Rechazadas">
              <Requisicion status={"Rechazado"} />
            </GenericPage>
          ),
        },
        {
          path: "requisicionHistorico",
          element: (
            <GenericPage title="Requisicion Histórico">
              <Requisicion status={"Todo"} />
            </GenericPage>
          ),
        },
        {
          path: "bitacora",
          element: (
            <GenericPage title="Bitácora del Sistema">
              <Bitacora />
            </GenericPage>
          ),
        },
        {
          path: "solicitud_compras",
          element: (
            <GenericPage title="Gestión de Solicitudes de Compras">
              <SolicitudCompras status={"Todo"} />
            </GenericPage>
          ),
        },
        {
          path: "detalle_pactos",
          element: (
            <GenericPage title="Gestión de Detalles de Pactos">
              <DetallePactos status={"Todo"} />
            </GenericPage>
          ),
        },

        {

          path: "report",
          element: (
            <GenericPage title="Gestión de Reportes">
              <Report  />
            </GenericPage>
          ),
        }

      ].map((route) => ({
        ...route,
        valid: {
          roles: [
            "Administrador",
            "Jefe Almacen",
            "Super Admin",
            "Jefe de Logistica",
          ], // OJO: excluye "Tecnico Almacen"
        },
      })),
    ],
  },
];
