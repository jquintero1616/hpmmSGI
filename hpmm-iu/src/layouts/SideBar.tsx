import { useEffect, useMemo, useCallback, useReducer } from "react";
import { useNavigate, useLocation } from "react-router-dom";

import {
  HomeIcon,
  ArchiveBoxIcon,
  CubeIcon,
  TagIcon,
  ExclamationTriangleIcon,
  ArrowsRightLeftIcon,
  ClipboardDocumentListIcon,
  ShoppingCartIcon,
  CreditCardIcon,
  BuildingStorefrontIcon,
  DocumentDuplicateIcon,
  UserGroupIcon,
  ShieldCheckIcon,
  IdentificationIcon,
  BanknotesIcon,
  ArrowsUpDownIcon,
  ClockIcon,
  ChartPieIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from "@heroicons/react/24/solid";
import {
  ChevronDownIcon,

} from "@heroicons/react/24/outline";
// import { useAuth } from "../hooks/use.Auth";



// function getRoleAbbrev(role: string) {
//   switch (role) {
//     case "Super Admin":
//       return "Super Admin";
//     case "Jefe Almacén":
//       return "Jefe Alm.";
//     case "Técnico Almacén":
//       return "Técnico .Alm.";
//     case "Administrador":
//       return "Administrador.";
//     case "Jefe Logística":
//       return "Jefe Log.";
//     default:
//       return role;
//   }


interface MenuItemProps {
  icon: React.ComponentType<any>;
  label: string;
  path?: string;
  isCollapsed: boolean;
  hasSubmenu?: boolean;
  isOpen?: boolean;
  onClick: () => void;
}

const MenuItem: React.FC<MenuItemProps> = ({
  icon: Icon,
  label,
  isCollapsed,
  hasSubmenu,
  isOpen,
  onClick,
}) => {
  const ITEM_STYLES = `flex items-center gap-2 px-2 py-2 rounded-md cursor-pointer hover:bg-gray-100 transition text-gray-700 text-sm ${
    isCollapsed ? "justify-center" : ""
  }`;
  const ICON_CLASS = "h-5 w-5 text-purple-700 flex-shrink-0";

  return (
    <li className={ITEM_STYLES} onClick={onClick}>
      <Icon className={ICON_CLASS} />
      {!isCollapsed && <span>{label}</span>}
      {hasSubmenu && !isCollapsed && (
        <ChevronDownIcon
          className={`h-4 w-4 ml-auto transition-transform ${
            isOpen ? "rotate-180" : ""
          } text-purple-700`}
        />
      )}
    </li>
  );
};

interface SubMenuProps {
  items: Array<{ label: string; path: string; icon: React.ComponentType<any> }>;
  onNavigate: (path: string) => void;
}

const SubMenu: React.FC<SubMenuProps> = ({ items, onNavigate }) => {
  const SUBITEM_STYLES =
    "flex items-center gap-2 px-4 py-1 rounded-md cursor-pointer hover:bg-gray-100 transition text-gray-600 text-xs ml-2";

  return (
    <div className="ml-2 space-y-1">
      {items.map((item, idx) => (
        <li
          key={idx}
          className={SUBITEM_STYLES}
          onClick={() => onNavigate(item.path)}
        >
          <item.icon className="h-4 w-4 text-purple-600" />
          <span>{item.label}</span>
        </li>
      ))}
    </div>
  );
};

interface SidebarState {
  open: number;
  collapsed: boolean;
}

// Reducer para manejar el estado del sidebar
const sidebarReducer = (
  state: SidebarState,
  action: { type: string; payload?: any }
) => {
  switch (action.type) {
    case "TOGGLE_COLLAPSED":
      return { ...state, collapsed: !state.collapsed, open: 0 };
    case "SET_OPEN":
      return { ...state, open: action.payload };
    case "EXPAND_AND_OPEN":
      return { collapsed: false, open: action.payload };
    default:
      return state;
  }
};

export function Sidebar() {
  const location = useLocation();
  const [{ open, collapsed }, dispatch] = useReducer(sidebarReducer, {
    open: 0,
    collapsed: false,
  });
 
  const navigate = useNavigate();

  // Memoizar los arrays de elementos para evitar re-renders innecesarios
  const menuItems = useMemo(
    () => ({
      inventario: [
        { label: "Productos", path: "/products", icon: CubeIcon },
        { label: "Categorías", path: "/category", icon: TagIcon },
        { label: "Subcategorías", path: "/subcategory", icon: TagIcon },
        {
          label: "Stock Crítico",
          path: "/stock-critico",
          icon: ExclamationTriangleIcon,
        },
      ],
      kardex: [
        {
          label: "Fusiones Aprobadas",
          path: "/kardex",
          icon: ArrowsRightLeftIcon,
        },
        {
          label: "Fusiones Rechazadas",
          path: "/KardexRechazadas",
          icon: ArrowsRightLeftIcon,
        },
        {
          label: "Solicitudes de Fusiones",
          path: "/KardexPendiente",
          icon: ArrowsRightLeftIcon,
        },
        {
          label: "Fusiones Canceladas",
          path: "/KardexCancelada",
          icon: ArrowsRightLeftIcon,
        },
        {
          label: "Histórico de Fusiones",
          path: "/KardexHistorico",
          icon: ArrowsRightLeftIcon,
        },
      ],
      requisitions: [
        {
          label: "Pendientes",
          path: "/requisiciones/pendientes",
          icon: ClipboardDocumentListIcon,
        },
        {
          label: "Aprobadas",
          path: "/requisiciones/aprobadas",
          icon: ClipboardDocumentListIcon,
        },
        {
          label: "Rechazadas",
          path: "/requisiciones/rechazadas",
          icon: ClipboardDocumentListIcon,
        },
        {
          label: "Solicitudes",
          path: "/solicitudes-compra",
          icon: ShoppingCartIcon,
        },
        { label: "Compras", path: "/compras", icon: CreditCardIcon },
      ],
      providers: [
        {
          label: "Lista de Proveedores",
          path: "/suppliers",
          icon: BuildingStorefrontIcon,
        },
        { label: "Vendedores", path: "/vendedor", icon: IdentificationIcon },
      ],
      pacts: [
        {
          label: "Lista de Pactos",
          path: "/pacts",
          icon: DocumentDuplicateIcon,
        },
        {
          label: "Detalle",
          path: "/pacts/detalle",
          icon: DocumentDuplicateIcon,
        },
      ],
      usersRoles: [
        { label: "Usuarios", path: "/users", icon: UserGroupIcon },
        { label: "Roles", path: "/roles", icon: ShieldCheckIcon },
        { label: "Empleados", path: "/employees", icon: IdentificationIcon },
        { label: "Direcciones", path: "/direction", icon: IdentificationIcon },
        {
          label: "Subdirecciones",
          path: "/subdireccion",
          icon: IdentificationIcon,
        },
        { label: "Unidades", path: "/unit", icon: IdentificationIcon },
      ],
      finance: [
        { label: "Caja General", path: "/caja", icon: BanknotesIcon },
        {
          label: "Transacciones",
          path: "/transacciones",
          icon: ArrowsUpDownIcon,
        },
        { label: "Histórico", path: "/historial-caja", icon: ClockIcon },
      ],
    }),
    []
  );

  // Actualizar CSS variable cuando cambie el estado collapsed
  useEffect(() => {
    const sidebarWidth = collapsed ? "64px" : "256px";
    document.documentElement.style.setProperty("--sidebar-width", sidebarWidth);
  }, [collapsed]);

  // Usar useCallback para las funciones que se pasan como props
  const handleOpen = useCallback(
    (value: number) => {
      if (collapsed) {
        dispatch({ type: "EXPAND_AND_OPEN", payload: value });
      } else {
        dispatch({ type: "SET_OPEN", payload: open === value ? 0 : value });
      }
    },
    [collapsed, open]
  );

  // const handleLogout = useCallback(() => {
  //   logout();
  //   navigate("/");
  // }, [logout, navigate]);

  const toggleCollapsed = useCallback(
    () => dispatch({ type: "TOGGLE_COLLAPSED" }),
    []
  );

  // Ajustamos ancho según collapsed
  const containerWidth = collapsed ? "w-16" : "w-64";
  const textHidden = collapsed ? "hidden" : "block";

  // Cambiamos los estilos del contenedor para que ocupe toda la altura
  const CONTAINER_STYLES = `h-full ${containerWidth} flex-shrink-0 p-2 shadow-lg bg-white flex flex-col overflow-y-auto transition-all duration-300 border-r border-gray-200 min-h-screen`;

  const isActiveRoute = useCallback(
    (path: string) => {
      return location.pathname === path;
    },
    [location.pathname]
  );

  // Actualizar ITEM_STYLES para incluir estado activo
  const getItemStyles = useCallback(
    (path?: string) => {
      const isActive = path && isActiveRoute(path);
      const baseStyles = `flex items-center gap-2 px-2 py-2 rounded-md cursor-pointer transition text-sm ${
        collapsed ? "justify-center" : ""
      }`;

      return isActive
        ? `${baseStyles} bg-purple-100 text-purple-700 border-r-2 border-purple-700`
        : `${baseStyles} hover:bg-gray-100 text-gray-700`;
    },
    [collapsed, isActiveRoute]
  );

  return (
    <div className={CONTAINER_STYLES}>
      {/* Botón para colapsar/expandir */}
      <div
        className={`flex ${collapsed ? "justify-center" : "justify-end"} mb-2`}
      >
        <button
          onClick={toggleCollapsed}
          className="p-1 hover:bg-gray-200 rounded transition-colors"
          title={collapsed ? "Expandir sidebar" : "Contraer sidebar"}
        >
          {collapsed ? (
            <ChevronRightIcon className="h-5 w-5 text-gray-600" />
          ) : (
            <ChevronLeftIcon className="h-5 w-5 text-gray-600" />
          )}
        </button>
      </div>

      <hr className="my-1 border-gray-300" />

      <ul className="flex-1 space-y-1">
        {/* Inicio */}
        <MenuItem
          icon={HomeIcon}
          label="Inicio"
          isCollapsed={collapsed}
          onClick={() => navigate("/home")}
        />

        {/* Inventario */}
        <MenuItem
          icon={ArchiveBoxIcon}
          label="Inventario"
          isCollapsed={collapsed}
          hasSubmenu={true}
          isOpen={open === 2}
          onClick={() => handleOpen(2)}
        />
        {open === 2 && !collapsed && (
          <SubMenu items={menuItems.inventario} onNavigate={navigate} />
        )}

        {/* Kardex */}
        <MenuItem
          icon={ArrowsRightLeftIcon}
          label="Kardex"
          isCollapsed={collapsed}
          hasSubmenu={true}
          isOpen={open === 3}
          onClick={() => handleOpen(3)}
        />
        {open === 3 && !collapsed && (
          <SubMenu items={menuItems.kardex} onNavigate={navigate} />
        )}

        {/* Requisiciones & Compras */}
        <MenuItem
          icon={ClipboardDocumentListIcon}
          label="Requisiciones & Compras"
          isCollapsed={collapsed}
          hasSubmenu={true}
          isOpen={open === 4}
          onClick={() => handleOpen(4)}
        />
        {open === 4 && !collapsed && (
          <SubMenu items={menuItems.requisitions} onNavigate={navigate} />
        )}

        {/* Proveedores */}
        <MenuItem
          icon={BuildingStorefrontIcon}
          label="Proveedores"
          isCollapsed={collapsed}
          hasSubmenu={true}
          isOpen={open === 5}
          onClick={() => handleOpen(5)}
        />
        {open === 5 && !collapsed && (
          <SubMenu items={menuItems.providers} onNavigate={navigate} />
        )}

        {/* Pactos */}
        <MenuItem
          icon={DocumentDuplicateIcon}
          label="Pactos"
          isCollapsed={collapsed}
          hasSubmenu={true}
          isOpen={open === 6}
          onClick={() => handleOpen(6)}
        />
        {open === 6 && !collapsed && (
          <SubMenu items={menuItems.pacts} onNavigate={navigate} />
        )}

        {/* Usuarios & Roles */}
        <MenuItem
          icon={UserGroupIcon}
          label="Usuarios & Roles"
          isCollapsed={collapsed}
          hasSubmenu={true}
          isOpen={open === 7}
          onClick={() => handleOpen(7)}
        />
        {open === 7 && !collapsed && (
          <SubMenu items={menuItems.usersRoles} onNavigate={navigate} />
        )}

        {/* Caja & Finanzas */}
        <MenuItem
          icon={BanknotesIcon}
          label="Caja & Finanzas"
          isCollapsed={collapsed}
          hasSubmenu={true}
          isOpen={open === 8}
          onClick={() => handleOpen(8)}
        />
        {open === 8 && !collapsed && (
          <SubMenu items={menuItems.finance} onNavigate={navigate} />
        )}

        {/* Reportes */}
        <MenuItem
          icon={ChartPieIcon}
          label="Reportes"
          isCollapsed={collapsed}
          onClick={() => navigate("/reportes")}
        />
      </ul>
    </div>
  );
}
