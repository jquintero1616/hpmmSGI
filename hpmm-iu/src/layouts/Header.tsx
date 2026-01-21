import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/use.Auth";
import { toast } from "react-toastify";
import LogoUrl from "../assets/logoBlancoHPMM.png";
import UsuarioIcon from "../assets/usuario.svg";
import Notificacion from "../components/organisms/Notificacion";
import NotificacionesToasty from "../components/molecules/NotificacionesToasty";
import { 
  Package, 
  ClipboardList, 
  FileText, 
  Bell, 
  ChevronDown, 
  User, 
  LogOut, 
  X, 
  Shield, 
  CheckCircle 
} from "lucide-react";

const Header: React.FC = () => {
  const navigate = useNavigate();
  const { logout, username, roleName } = useAuth();
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [profileModalOpen, setProfileModalOpen] = useState(false);
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [pendientesCount, setPendientesCount] = useState(0);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const notificationRef = useRef<HTMLButtonElement>(null);

  // Accesos directos a módulos
  const quickAccess = [
    { name: 'Productos', path: '/products', icon: Package },
    { name: 'Kardex', path: '/kardex', icon: ClipboardList },
    { name: 'Requisiciones', path: '/requisicionPendiente', icon: FileText },
  ];

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        userMenuRef.current &&
        !userMenuRef.current.contains(event.target as Node)
      ) {
        setUserMenuOpen(false);
      }
    }
    if (userMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [userMenuOpen]);

  // Cerrar modal con Escape
  useEffect(() => {
    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setProfileModalOpen(false);
      }
    }
    if (profileModalOpen) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden"; // Prevenir scroll
    } else {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    }
    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [profileModalOpen]);

  function getRoleAbbrev(role: string) {
    switch (role) {
      case "Super Admin":
        return "Super Admin";
      case "Jefe Almacén":
        return "Jefe de Almacén";
      case "Técnico Almacén":
        return "Técnico Almacén";
      case "Administrador":
        return "Administrador";
      case "Jefe Logística":
        return "Jefe de Logística";
      case "Usuario":
        return "Usuario";

      default:
        return role;
    }
  }

  const openProfileModal = () => {
    setUserMenuOpen(false);
    setProfileModalOpen(true);
  };

  return (
    <>
      {/* Componente para mostrar notificaciones como toasts */}
      <NotificacionesToasty />
      
      <header className="bg-gradient-to-r from-purple-600 via-purple-700 to-blue-800 shadow-lg sticky top-0 z-30">
        <div className="flex items-center justify-between py-3 px-4 sm:py-4 sm:px-6 lg:px-8">
          {/* Logo + Nombre del sistema */}
          <div
            className="flex items-center gap-3 sm:gap-4 cursor-pointer group min-w-0"
            onClick={() => navigate("/home")}
            title="Ir al inicio"
          >
            {/* Logo */}
            <img
              src={LogoUrl}
              alt="Logo HPMM"
              className="w-14 h-14 sm:w-16 sm:h-16 lg:w-20 lg:h-20 object-contain drop-shadow-md group-hover:drop-shadow-lg group-hover:scale-105 transition-all duration-300 filter brightness-100 group-hover:brightness-110 scale-125 -my-2"
            />
            
            {/* Nombre del sistema - visible en tablets y desktop */}
            <div className="hidden sm:flex flex-col">
              <span className="text-white font-bold text-lg lg:text-xl tracking-tight leading-tight">
                Sistema de Gestión de Inventario
              </span>
              <span className="text-white/70 text-xs lg:text-sm font-medium">
                Hospital Psiquiatrico Mario Mendoza
              </span>
            </div>
          </div>

          {/* Menú derecho responsive */}
          <div className="flex items-center gap-1 sm:gap-3">
            {/* Accesos directos - visible solo en desktop */}
            <div className="hidden lg:flex items-center gap-1">
              {quickAccess.map((item) => (
                <button
                  key={item.path}
                  onClick={() => navigate(item.path)}
                  className="p-2 text-white/70 hover:text-white hover:bg-white/10 rounded-lg transition-all duration-200 group"
                  title={item.name}
                >
                  <item.icon className="w-5 h-5 group-hover:scale-110 transition-transform" />
                </button>
              ))}
            </div>

            {/* Separador */}
            <div className="hidden lg:block w-px h-6 bg-white/20"></div>

            {/* Notificaciones */}
            <div className="relative">
              <button
                ref={notificationRef}
                className="relative p-2.5 text-white/80 hover:text-white hover:bg-white/10 rounded-xl transition-all duration-200 group"
                title="Notificaciones"
                onClick={() => setNotificationOpen(!notificationOpen)}
              >
                <Bell className="w-5 h-5 sm:w-6 sm:h-6 transition-transform group-hover:scale-110" />
                {/* Badge de notificaciones */}
                {pendientesCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 min-w-[20px] h-[20px] bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center border-2 border-purple-700 shadow-lg animate-pulse">
                    {pendientesCount > 99 ? '99+' : pendientesCount}
                  </span>
                )}
              </button>
              
              <Notificacion
                open={notificationOpen}
                onClose={() => setNotificationOpen(false)}
                onUpdatePendientes={setPendientesCount}
                anchorRef={notificationRef}
              />
            </div>

            {/* Separador vertical */}
            <div className="hidden sm:block w-px h-8 bg-white/20 mx-1"></div>

            {/* Perfil de usuario */}
            <div className="relative" ref={userMenuRef}>
              <button
                className="flex items-center gap-2 sm:gap-3 cursor-pointer hover:bg-white/10 rounded-xl px-2 sm:px-3 py-1.5 sm:py-2 transition-all duration-200 border border-transparent hover:border-white/20"
                onClick={() => setUserMenuOpen((open) => !open)}
              >
                {/* Info usuario - solo visible en pantallas medianas+ */}
                <div className="hidden md:flex flex-col items-end">
                  <span className="text-sm font-semibold text-white truncate max-w-[120px] lg:max-w-none">
                    {username}
                  </span>
                  <span className="text-xs text-white/70 font-medium">
                    {getRoleAbbrev(roleName || "Usuario")}
                  </span>
                </div>

                {/* Avatar */}
                <div className="relative">
                  <img
                    src={UsuarioIcon}
                    alt={username}
                    className="w-8 h-8 sm:w-9 sm:h-9 lg:w-10 lg:h-10 rounded-xl object-cover border-2 border-white/30 shadow-lg hover:shadow-xl hover:border-white/50 transition-all duration-200 bg-white p-1"
                  />
                  {/* Indicador online */}
                  <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-400 border-2 border-purple-700 rounded-full shadow-sm"></div>
                </div>

                {/* Chevron */}
                <ChevronDown 
                  className={`hidden sm:block w-4 h-4 text-white/70 transform transition-transform duration-300 ${
                    userMenuOpen ? "rotate-180" : "rotate-0"
                  }`}
                />
              </button>

              {/* Menú desplegable mejorado */}
              {userMenuOpen && (
                <div className="absolute top-[calc(100%+8px)] right-0 w-56 bg-white/95 backdrop-blur-md border border-gray-200/50 rounded-2xl shadow-2xl z-50 py-2 animate-in fade-in slide-in-from-top-2 duration-200">
                  {/* Header del menú con info del usuario */}
                  <div className="px-4 py-3 border-b border-gray-100">
                    
                  </div>

                  {/* Opciones */}
                  <div className="py-1">
                    {/* Mi perfil */}
                    <button
                      className="flex items-center gap-3 w-full px-4 py-2.5 text-gray-700 hover:bg-purple-50 hover:text-purple-700 transition-all duration-200 text-sm group"
                      onClick={openProfileModal}
                    >
                      <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center group-hover:bg-purple-200 transition-colors duration-200">
                        <User className="w-4 h-4 text-purple-600" />
                      </div>
                      <span className="font-medium">Mi perfil</span>
                    </button>

                    {/* Cerrar sesión */}
                    <button
                      className="flex items-center gap-3 w-full px-4 py-2.5 text-red-600 hover:bg-red-50 transition-all duration-200 text-sm group"
                      onClick={() => {
                        logout();
                        setUserMenuOpen(false);
                        toast.success(
                          "Sesión cerrada correctamente. ¡Hasta pronto!",
                          {
                            position: "top-right",
                            autoClose: 3000,
                          }
                        );
                      }}
                    >
                      <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center group-hover:bg-red-200 transition-colors duration-200">
                        <LogOut className="w-4 h-4 text-red-600" />
                      </div>
                      <span className="font-medium">Cerrar sesión</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Modal de Perfil */}
      {profileModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-auto transform transition-all duration-300 scale-100">
            {/* Header del Modal */}
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <h2 className="text-xl font-bold text-gray-800">Mi Perfil</h2>
              <button
                onClick={() => setProfileModalOpen(false)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            {/* Contenido del Modal */}
            <div className="p-6 space-y-6">
              {/* Avatar y nombre */}
              <div className="flex flex-col items-center">
                <div className="relative">
                  <img
                    src={UsuarioIcon}
                    alt={username}
                    className="w-14 h-14 rounded-full object-cover border-4 border-purple-100 shadow-lg bg-white p-2"
                  />
                  <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-400 border-3 border-white rounded-full"></div>
                </div>
                <h3 className="mt-4 text-lg font-semibold text-gray-800">
                  {username}
                </h3>
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-800">
                  {roleName || "Usuario"}
                </span>
              </div>

              {/* Información del usuario */}
              <div className="space-y-4">
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                    <User className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-800">Usuario</p>
                    <p className="text-sm text-gray-600">{username}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                    <Shield className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-800">Rol</p>
                    <p className="text-sm text-gray-600">
                      {roleName || "Usuario"}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-800">Estado</p>
                    <p className="text-sm text-green-600 font-medium">Activo</p>
                  </div>
                </div>
              </div>

              {/* Botones de acción */}
              <div className="flex gap-3 pt-4">
                <button
                  className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-2.5 px-4 rounded-lg transition-colors duration-200 text-sm"
                  onClick={() => setProfileModalOpen(false)}
                >
                  Cerrar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Header;
