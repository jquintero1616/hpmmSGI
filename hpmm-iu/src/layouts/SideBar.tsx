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
import { ChevronDownIcon } from "@heroicons/react/24/outline";
import { useAuth } from "../hooks/use.Auth";

interface MenuItemProps {
  icon: React.ComponentType<any>;
  label: string;
  path?: string;
  isCollapsed: boolean;
  hasSubmenu?: boolean;
  isOpen?: boolean;
  onClick: () => void;
  isActive?: boolean;
}

const MenuItem: React.FC<MenuItemProps> = ({
  icon: Icon,
  label,
  isCollapsed,
  hasSubmenu,
  isOpen,
  onClick,
  isActive = false,
}) => {
  // Definir colores por sección
  const getSectionColors = (label: string) => {
    const colorMap: { [key: string]: { icon: string; active: string; bg: string } } = {
      'Inicio': { 
        icon: 'text-blue-600', 
        active: 'text-blue-700', 
        bg: 'bg-blue-50' 
      },
      'Inventario': { 
        icon: 'text-green-600', 
        active: 'text-green-700', 
        bg: 'bg-green-50' 
      },
      'Kardex': { 
        icon: 'text-orange-600', 
        active: 'text-orange-700', 
        bg: 'bg-orange-50' 
      },
      'Requisiciones & Compras': { 
        icon: 'text-indigo-600', 
        active: 'text-indigo-700', 
        bg: 'bg-indigo-50' 
      },
      'Proveedores': { 
        icon: 'text-cyan-600', 
        active: 'text-cyan-700', 
        bg: 'bg-cyan-50' 
      },
      'Pactos': { 
        icon: 'text-emerald-600', 
        active: 'text-emerald-700', 
        bg: 'bg-emerald-50' 
      },
      'Usuarios & Roles': { 
        icon: 'text-violet-600', 
        active: 'text-violet-700', 
        bg: 'bg-violet-50' 
      },
      'Reportes': { 
        icon: 'text-pink-600', 
        active: 'text-pink-700', 
        bg: 'bg-pink-50' 
      },
      'Auditoría': { 
        icon: 'text-red-600', 
        active: 'text-red-700', 
        bg: 'bg-red-50' 
      }
    };
    
    return colorMap[label] || { 
      icon: 'text-gray-600', 
      active: 'text-gray-700', 
      bg: 'bg-gray-50' 
    };
  };

  const colors = getSectionColors(label);
  
  const ITEM_STYLES = `relative flex items-center gap-2 py-3 px-4 rounded-md cursor-pointer hover:bg-gray-100 transition-colors duration-200 text-gray-700 text-sm ${
    isCollapsed ? "justify-center" : ""
  } ${isActive ? `${colors.bg} ${colors.active}` : ""}`;
  
  const ICON_CLASS = `h-5 w-5 ${isActive ? colors.active : colors.icon} flex-shrink-0`;

  return (
    <li className={ITEM_STYLES} onClick={onClick}>
      {/* Indicador de sección activa */}
      {isActive && (
        <div className={`absolute left-0 top-0 bottom-0 w-1 rounded-r-sm ${colors.active.replace('text-', 'bg-')}`} />
      )}
      <Icon className={ICON_CLASS} />
      {!isCollapsed && <span className="truncate">{label}</span>}
      {hasSubmenu && !isCollapsed && (
        <ChevronDownIcon
          className={`h-4 w-4 ml-auto transition-transform duration-200 flex-shrink-0 ${
            isOpen ? "rotate-180" : ""
          } ${colors.icon}`}
        />
      )}
    </li>
  );
};

interface SubMenuProps {
  items: Array<{ label: string; path: string; icon: React.ComponentType<any> }>;
  onNavigate: (path: string) => void;
  isOpen: boolean;
  currentPath: string;
}

const SubMenu: React.FC<SubMenuProps> = ({ items, onNavigate, isOpen, currentPath }) => {
  
  const getSubMenuColors = (path: string) => {
    if (path.includes('/products') || path.includes('/category') || path.includes('/subcategory') || path.includes('/stock-critico')) {
      return { icon: 'text-green-500', active: 'text-green-600', bg: 'bg-green-50' };
    }
    if (path.includes('/kardex') || path.includes('/Kardex')) {
      return { icon: 'text-orange-500', active: 'text-orange-600', bg: 'bg-orange-50' };
    }
    if (path.includes('/requisicion') || path.includes('/solicitudes') || path.includes('/shopping')) {
      return { icon: 'text-indigo-500', active: 'text-indigo-600', bg: 'bg-indigo-50' };
    }
    if (path.includes('/suppliers') || path.includes('/vendedor')) {
      return { icon: 'text-cyan-500', active: 'text-cyan-600', bg: 'bg-cyan-50' };
    }
    if (path.includes('/pacts')) {
      return { icon: 'text-emerald-500', active: 'text-emerald-600', bg: 'bg-emerald-50' };
    }
    if (path.includes('/users') || path.includes('/roles') || path.includes('/employees') || path.includes('/direction') || path.includes('/subdireccion') || path.includes('/unit')) {
      return { icon: 'text-violet-500', active: 'text-violet-600', bg: 'bg-violet-50' };
    }
    if (path.includes('/bitacora')) {
      return { icon: 'text-red-500', active: 'text-red-600', bg: 'bg-red-50' };
    }
    return { icon: 'text-gray-500', active: 'text-gray-600', bg: 'bg-gray-50' };
  };

  const SUBITEM_STYLES = (isActive: boolean, colors: any) =>
    `relative flex items-center gap-2 py-3 px-4 rounded-md cursor-pointer hover:bg-gray-100 transition-colors duration-200 text-gray-600 text-xs ml-2 ${
      isActive ? `${colors.bg} ${colors.active}` : ""
    }`;

  return (
    <div
      className={`ml-2 space-y-1 overflow-hidden transition-[max-height] duration-300 ease-in-out ${
        isOpen ? "max-h-96" : "max-h-0"
      }`}
    >
      {items.map((item, idx) => {
        const isActive = currentPath === item.path;
        const colors = getSubMenuColors(item.path);
        
        return (
          <li
            key={idx}
            className={SUBITEM_STYLES(isActive, colors)}
            onClick={() => onNavigate(item.path)}
          >
            {/* Indicador de sección activa para submenús */}
            {isActive && (
              <div className={`absolute left-0 top-0 bottom-0 w-1 rounded-r-sm ${colors.active.replace('text-', 'bg-')}`} />
            )}
            <item.icon className={`h-4 w-4 flex-shrink-0 ${isActive ? colors.active : colors.icon}`} />
            <span className="truncate">{item.label}</span>
          </li>
        );
      })}
    </div>
  );
};

interface SidebarState {
  open: number;
  collapsed: boolean;
}

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
  const { roleName } = useAuth();

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
          label: "Pendiente",
          path: "/requisicionPendiente",
          icon: ClipboardDocumentListIcon,
        },
        {
          label: "Aprobado",
          path: "/requisicionAprobado",
          icon: ClipboardDocumentListIcon,
        },
        {
          label: "Rechazado",
          path: "/requisicionRechazado",
          icon: ClipboardDocumentListIcon,
        },
        {
          label: "Solicitudes",
          path: "/solicitud_compras",
          icon: ShoppingCartIcon,
        },
        { label: "Compras", path: "/shopping", icon: CreditCardIcon },
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
      audit: [{ label: "Bitácora", path: "/bitacora", icon: ArchiveBoxIcon }],
    }),
    []
  );

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

  const toggleCollapsed = useCallback(
    () => dispatch({ type: "TOGGLE_COLLAPSED" }),
    []
  );

  const containerWidth = collapsed ? "w-16" : "w-64";
  
  const isActiveRoute = useCallback(
    (path: string) => location.pathname === path,
    [location.pathname]
  );

  // Función para verificar si una sección tiene rutas activas
  const isActiveSection = useCallback(
    (items: Array<{ path: string }>) => {
      return items.some(item => location.pathname === item.path);
    },
    [location.pathname]
  );

  const isTecnicoAlmacen = roleName === "Tecnico Almacen";

  return (
    <div className={`${containerWidth} h-screen bg-white border-r border-gray-200 transition-all duration-300 shadow-lg flex flex-col overflow-hidden`}>
      {/* Header del sidebar */}
      <div className="p-2 border-b border-gray-200">
        <div className={`flex ${collapsed ? "justify-center" : "justify-end"}`}>
          <button
            onClick={toggleCollapsed}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200 border border-gray-200 hover:border-gray-300"
            title={collapsed ? "Expandir sidebar" : "Contraer sidebar"}
          >
            {collapsed ? (
              <ChevronRightIcon className="h-4 w-4 text-gray-600 hover:text-gray-800 transition-colors duration-150" />
            ) : (
              <ChevronLeftIcon className="h-4 w-4 text-gray-600 hover:text-gray-800 transition-colors duration-150" />
            )}
          </button>
        </div>
      </div>

      {/* Contenido del sidebar con scroll */}
      <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
        <div className="p-2">
          <ul className="space-y-1">
            {!isTecnicoAlmacen && (
              <>
                <MenuItem
                  icon={HomeIcon}
                  label="Inicio"
                  isCollapsed={collapsed}
                  onClick={() => navigate("/home")}
                  isActive={isActiveRoute("/home")}
                />
                
                <MenuItem
                  icon={ArchiveBoxIcon}
                  label="Inventario"
                  isCollapsed={collapsed}
                  hasSubmenu
                  isOpen={open === 2}
                  onClick={() => handleOpen(2)}
                  isActive={isActiveSection(menuItems.inventario)}
                />
                <SubMenu 
                  items={menuItems.inventario} 
                  onNavigate={navigate} 
                  isOpen={open === 2 && !collapsed}
                  currentPath={location.pathname}
                />

                <MenuItem
                  icon={ClipboardDocumentListIcon}
                  label="Requisiciones & Compras"
                  isCollapsed={collapsed}
                  hasSubmenu
                  isOpen={open === 4}
                  onClick={() => handleOpen(4)}
                  isActive={isActiveSection(menuItems.requisitions)}
                />
                <SubMenu 
                  items={menuItems.requisitions} 
                  onNavigate={navigate} 
                  isOpen={open === 4 && !collapsed}
                  currentPath={location.pathname}
                />

                <MenuItem
                  icon={BuildingStorefrontIcon}
                  label="Proveedores"
                  isCollapsed={collapsed}
                  hasSubmenu
                  isOpen={open === 5}
                  onClick={() => handleOpen(5)}
                  isActive={isActiveSection(menuItems.providers)}
                />
                <SubMenu 
                  items={menuItems.providers} 
                  onNavigate={navigate} 
                  isOpen={open === 5 && !collapsed}
                  currentPath={location.pathname}
                />

                <MenuItem
                  icon={UserGroupIcon}
                  label="Usuarios & Roles"
                  isCollapsed={collapsed}
                  hasSubmenu
                  isOpen={open === 7}
                  onClick={() => handleOpen(7)}
                  isActive={isActiveSection(menuItems.usersRoles)}
                />
                <SubMenu 
                  items={menuItems.usersRoles} 
                  onNavigate={navigate} 
                  isOpen={open === 7 && !collapsed}
                  currentPath={location.pathname}
                />

                <MenuItem
                  icon={ChartPieIcon}
                  label="Reportes"
                  isCollapsed={collapsed}
                  onClick={() => navigate("/reportes")}
                  isActive={isActiveRoute("/reportes")}
                />

                <MenuItem
                  icon={ArchiveBoxIcon}
                  label="Auditoría"
                  isCollapsed={collapsed}
                  hasSubmenu
                  isOpen={open === 9}
                  onClick={() => handleOpen(9)}
                  isActive={isActiveSection(menuItems.audit)}
                />
                <SubMenu 
                  items={menuItems.audit} 
                  onNavigate={navigate} 
                  isOpen={open === 9 && !collapsed}
                  currentPath={location.pathname}
                />
              </>
            )}

            {/* Siempre mostrar Kardex y Pactos para Técnico Almacén */}
            <MenuItem
              icon={ArrowsRightLeftIcon}
              label="Kardex"
              isCollapsed={collapsed}
              hasSubmenu
              isOpen={open === 3}
              onClick={() => handleOpen(3)}
              isActive={isActiveSection(menuItems.kardex)}
            />
            <SubMenu 
              items={menuItems.kardex} 
              onNavigate={navigate} 
              isOpen={open === 3 && !collapsed}
              currentPath={location.pathname}
            />

            <MenuItem
              icon={DocumentDuplicateIcon}
              label="Pactos"
              isCollapsed={collapsed}
              hasSubmenu
              isOpen={open === 6}
              onClick={() => handleOpen(6)}
              isActive={isActiveSection(menuItems.pacts)}
            />
            <SubMenu 
              items={menuItems.pacts} 
              onNavigate={navigate} 
              isOpen={open === 6 && !collapsed}
              currentPath={location.pathname}
            />
          </ul>
        </div>
      </div>
    </div>
  );
}
