import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/use.Auth';
import { toast } from 'react-toastify';
import LogoUrl from "../assets/logoBlancoHPMM.png";

const Header: React.FC = () => {
  const navigate = useNavigate();
  const { logout, username, roleName } = useAuth();
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [profileModalOpen, setProfileModalOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const avatarUrl = "https://www.material-tailwind.com/img/avatar1.jpg";
  

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
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [userMenuOpen]);

  // Cerrar modal con Escape
  useEffect(() => {
    function handleEscape(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setProfileModalOpen(false);
      }
    }
    if (profileModalOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden'; // Prevenir scroll
    } else {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [profileModalOpen]);

  function getRoleAbbrev(role: string) {
    switch (role) {
      case "Super Admin":
        return "Super Admin";
      case "Jefe Almacén":
        return "J.Alm.";
      case "Técnico Almacén":
        return "Téc.Alm.";
      case "Administrador":
        return "Adm.";
      case "Jefe Logística":
        return "J.Log.";
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
      <header className="bg-gradient-to-r from-purple-600 via-purple-700 to-blue-800 shadow-lg sticky top-0 z-30">
        <div className="flex items-center justify-between py-3 px-4 sm:py-4 sm:px-6 lg:px-8">
          {/* Logo responsive minimalista */}
          <div 
            className="flex items-center gap-3 sm:gap-4 cursor-pointer group min-w-0"
            onClick={() => navigate('/home')}
          >
            {/* Logo directo sin contenedores extras */}
            <img 
              src={LogoUrl} 
              alt="Logo HPMM"
              className="w-14 h-14 sm:w-16 sm:h-16 lg:w-20 lg:h-20 object-contain drop-shadow-md group-hover:drop-shadow-lg group-hover:scale-110 transition-all duration-300 filter brightness-100 group-hover:brightness-110 scale-125 -my-2"
            />
            
            <div className="flex flex-col">
              <h1 className="text-sm sm:text-base lg:text-lg font-bold text-white tracking-tight select-none group-hover:text-white/90 transition-all duration-200 truncate leading-tight">
                <span className="hidden sm:inline">Sistema de Gestión de Inventario</span>
                <span className="sm:hidden">HPMM</span>
              </h1>
              <span className="hidden lg:block text-xs text-white/70 font-medium">
                Hospital Psiaquiatrico Mario Mendoza
              </span>
            </div>
          </div>

          {/* Menú derecho responsive */}
          <div className="flex items-center gap-2 sm:gap-4">
            {/* Notificaciones - oculto en móvil muy pequeño */}
            <button
              className="hidden xs:block relative p-2 text-white/80 hover:text-white hover:bg-white/10 rounded-full transition-all duration-200 group"
              title="Notificaciones"
            >
              <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
              {/* Indicador de notificación */}
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 sm:w-3 sm:h-3 bg-red-400 rounded-full border-2 border-white/50"></span>
            </button>

            {/* Perfil de usuario responsive */}
            <div className="relative" ref={userMenuRef}>
              <button
                className="flex items-center gap-2 sm:gap-3 cursor-pointer hover:bg-white/10 rounded-lg px-2 py-1 transition-all duration-200"
                onClick={() => setUserMenuOpen((open) => !open)}
              >
                {/* Info usuario - solo visible en pantallas medianas+ */}
                <div className="hidden md:flex flex-col items-end">
                  <span className="text-sm font-semibold text-white truncate max-w-[120px] lg:max-w-none">{username}</span>
                  <span className="text-xs text-white/80 font-medium bg-white/20 px-2 py-0.5 rounded-full truncate max-w-[100px] lg:max-w-none backdrop-blur-sm">
                    {getRoleAbbrev(roleName || "Usuario")}
                  </span>
                </div>
                
                {/* Avatar */}
                <div className="relative">
                  <img
                    src={avatarUrl}
                    alt={username}
                    className="w-8 h-8 sm:w-9 sm:h-9 lg:w-10 lg:h-10 rounded-full object-cover border-2 border-white/30 shadow-lg hover:shadow-xl hover:border-white/50 transition-all duration-200"
                  />
                  {/* Indicador de estado online */}
                  <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 sm:w-3 sm:h-3 lg:w-3.5 lg:h-3.5 bg-green-400 border-2 border-white rounded-full shadow-sm"></div>
                </div>
                
                {/* Chevron - oculto en móvil muy pequeño */}
                <svg 
                  className={`hidden sm:block w-3 h-3 sm:w-4 sm:h-4 text-white/80 transform transition-transform duration-300 ${
                    userMenuOpen ? "rotate-180" : "rotate-0"
                  }`} 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth={2} 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {/* Menú desplegable optimizado */}
              {userMenuOpen && (
                <div className="absolute top-[110%] right-0 w-[180px] sm:w-[200px] bg-white border border-gray-100 rounded-xl shadow-xl z-50 py-2 animate-fade-in backdrop-blur-sm">
                  {/* Mi perfil - ahora abre modal */}
                  <button
                    className="flex items-center gap-2 sm:gap-3 w-full px-3 sm:px-4 py-2 sm:py-2.5 text-gray-700 hover:bg-gray-50 hover:text-purple-600 transition-all duration-200 text-xs sm:text-sm group"
                    onClick={openProfileModal}
                  >
                    <div className="w-6 h-6 sm:w-8 sm:h-8 bg-purple-100 rounded-lg flex items-center justify-center group-hover:bg-purple-200 transition-colors duration-200 flex-shrink-0">
                      <svg className="w-3 h-3 sm:w-4 sm:h-4 text-purple-600" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                    <span className="font-medium truncate">Mi perfil</span>
                  </button>

                  {/* Separador */}
                  <div className="border-t border-gray-100 my-2 mx-2"></div>

                  {/* Cerrar sesión */}
                  <button
                    className="flex items-center gap-2 sm:gap-3 w-full px-3 sm:px-4 py-2 sm:py-2.5 text-red-600 hover:bg-red-50 transition-all duration-200 text-xs sm:text-sm group"
                    onClick={() => {
                      logout();
                      setUserMenuOpen(false);
                      toast.success("Sesión cerrada correctamente. ¡Hasta pronto!", {
                        position: "top-right",
                        autoClose: 3000,
                        
                      });
                    }}
                  >
                    <div className="w-6 h-6 sm:w-8 sm:h-8 bg-red-100 rounded-lg flex items-center justify-center group-hover:bg-red-200 transition-colors duration-200 flex-shrink-0">
                      <svg className="w-3 h-3 sm:w-4 sm:h-4 text-red-600" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 11-6 0v-1" />
                      </svg>
                    </div>
                    <span className="font-medium truncate">Cerrar sesión</span>
                  </button>
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
                <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Contenido del Modal */}
            <div className="p-6 space-y-6">
              {/* Avatar y nombre */}
              <div className="flex flex-col items-center">
                <div className="relative">
                  <img
                    src={avatarUrl}
                    alt={username}
                    className="w-20 h-20 rounded-full object-cover border-4 border-purple-100 shadow-lg"
                  />
                  <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-400 border-3 border-white rounded-full"></div>
                </div>
                <h3 className="mt-4 text-lg font-semibold text-gray-800">{username}</h3>
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-800">
                  {roleName || "Usuario"}
                </span>
              </div>

              {/* Información del usuario */}
              <div className="space-y-4">
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                    <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-800">Usuario</p>
                    <p className="text-sm text-gray-600">{username}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                    <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.031 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-800">Rol</p>
                    <p className="text-sm text-gray-600">{roleName || "Usuario"}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                    <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
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
                  className="flex-1 bg-purple-600 hover:bg-purple-700 text-white font-medium py-2.5 px-4 rounded-lg transition-colors duration-200 text-sm"
                  onClick={() => {
                    // Aquí podrías abrir un modal de edición o navegar a una página de edición
                    setProfileModalOpen(false);
                  }}
                >
                  Editar Perfil
                </button>
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