import PrivateRouteValidation from "./PrivateRoute";
// Path: src/routes/RouterConfig.tsx
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
import Product_requisi from "../components/organisms/Product_requisi";

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
      // Rutas de usuarios con diferentes estados
      {
        path: "users",
        element: (
          <GenericPage title="Gestión de Usuarios">
            {<User status={"Todo"} />}
          </GenericPage>
        ),
      },
      // Rutas de pactos con diferentes estados
      {
        path: "pacts",
        element: (
          <GenericPage title="Gestión de Pactos">
            <Pacts status={"Todo"} />
          </GenericPage>
        ),
      },
      // Rutas de productos con diferentes estados
      {
        path: "products",
        element: (
          <GenericPage title="Gestión de Productos">
            <Products status={"Todo"} />
          </GenericPage>
        ),
      },
      // Rutas de categorías con diferentes estados
      {
        path: "category",
        element: (
          <GenericPage title="Gestión de Categorías">
            <Category status={"Todo"} />
          </GenericPage>
        ),
      },
      // Rutas de proveedores con diferentes estados
      {
        path: "suppliers",
        element: (
          <GenericPage title="Gestión de Proveedores">
            <Suppliers status={"Todo"} />
          </GenericPage>
        ),
      },
      // Rutas de empleados con diferentes estados
      {
        path: "roles",
        element: (
          <GenericPage title="Gestión de Roles">
            <Roles status={"Todo"} />
          </GenericPage>
        ),
      },
      // Rutas de empleados con diferentes estados
      {
        path: "employees",
        element: (
          <GenericPage title="Gestión de Empleados">
            <Employe status={"Todo"} />
          </GenericPage>
        ),
      },
      //------------------------------------------------------------------------------
      // Rutas de Kardex con diferentes estados
      {
        path: "kardex",
        element: (
          <GenericPage title="Gestión de Kardex">
            <Kardex status={"Aprobado"} />
          </GenericPage>
        ),
      },
      {
        path: "kardexPendiente",
        element: (
          <GenericPage title="Gestión de Kardex Pendientes">
            <Kardex status={"Pendiente"} />
          </GenericPage>
        ),
      },
      {
        path: "kardexRechazadas",
        element: (
          <GenericPage title="Kardex Rechazadas">
            <Kardex status={"Rechazado"} />
          </GenericPage>
        ),
      },
      {
        path: "kardexHistorico",
        element: (
          <GenericPage title="Kardex Histórico">
            <Kardex status={"Todo"} />
          </GenericPage>
        ),
      },
      {
        path: "kardexCancelada",
        element: (
          <GenericPage title="Kardex Canceladas">
            <Kardex status={"Cancelado"} />
          </GenericPage>
        ),
      },
      //------------------------------------------------------------------------------
      {
        path: "subcategory",
        element: (
          <GenericPage title="Gestión de Subcategorías">
            <Subcategory status={"Todo"} />
          </GenericPage>
        ),
      },

      // ----------------------------------------------------------------------------------

      {
        path: "vendedor",
        element: (
          <GenericPage title="Gestión de Vendedores">
            <Vendedor status={"Todo"} />
          </GenericPage>
        ),
      },
      // ----------------------------------------------------------------------------------
      {
        path: "subdireccion",
        element: (
          <GenericPage title="Gestión de subdirecciones">
            <Subdireccion status={"Todo"} />
          </GenericPage>
        ),
      },
      //-----------------------------------------------------------------------------------

      {
        path: "direction",
        element: (
          <GenericPage title="Gestión de Direcciones">
            <Direction status={"Todo"} />
          </GenericPage>
        ),
      },
      // ----------------------------------------------------------------------------------
      {
        path: "unit",
        element: (
          <GenericPage title="Gestión de Unidades">
            <Unit status={"Todo"} />
          </GenericPage>
        ),
      },
      // ----------------------------------------------------------------------------------
      {
        path: "shopping",
        element: (
          <GenericPage title="Gestión de Compras">
            <Shopping status={"Todo"} />
          </GenericPage>
        ),
      },
      // ----------------------------------------------------------------------------------
      {
        path: "product_requisi",
        element: (
          <GenericPage title="Gestión de Requisiciones de Productos">
            <Product_requisi status={"Todo"} />
          </GenericPage>
        ),
      },

      // ----------------------------------------------------------------------------------
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
     
    ],
  },
];
