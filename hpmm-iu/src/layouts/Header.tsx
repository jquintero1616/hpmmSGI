import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/use.Auth';

const Header: React.FC = () => {
  const navigate = useNavigate();
  const { logout, username, roleName } = useAuth();
  const [userMenuOpen, setUserMenuOpen] = useState(false);
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

  return (
    <header className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-30 backdrop-blur-sm">
      <div className="flex items-center justify-between py-3 px-4 sm:py-4 sm:px-6 lg:px-8">
        {/* Logo responsive */}
        <div 
          className="flex items-center gap-2 sm:gap-3 cursor-pointer group min-w-0"
          onClick={() => navigate('/home')}
        >
          <div className="w-7 h-7 sm:w-8 sm:h-8 bg-gradient-to-br from-purple-600 to-purple-800 rounded-lg flex items-center justify-center shadow-md group-hover:shadow-lg transition-shadow duration-200 flex-shrink-0">
            <svg className="w-4 h-4 sm:w-5 sm:h-5 text-white" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
          </div>
          <h1 className="text-base sm:text-lg lg:text-xl font-bold bg-gradient-to-r from-purple-700 to-purple-900 bg-clip-text text-transparent tracking-tight select-none group-hover:from-purple-600 group-hover:to-purple-800 transition-all duration-200 truncate">
            <span className="hidden sm:inline">Sistema de Gestión de Inventario</span>
            <span className="sm:hidden">HPMM</span>
          </h1>
        </div>

        {/* Menú derecho responsive */}
        <div className="flex items-center gap-2 sm:gap-4">
          {/* Notificaciones - oculto en móvil muy pequeño */}
          <button
            className="hidden xs:block relative p-2 text-gray-600 hover:text-purple-600 hover:bg-purple-50 rounded-full transition-all duration-200 group"
            title="Notificaciones"
          >
            <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
            {/* Indicador de notificación */}
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 sm:w-3 sm:h-3 bg-red-500 rounded-full border-2 border-white"></span>
          </button>

          {/* Perfil de usuario responsive */}
          <div className="relative" ref={userMenuRef}>
            <button
              className="flex items-center gap-2 sm:gap-3 cursor-pointer"
              onClick={() => setUserMenuOpen((open) => !open)}
            >
              {/* Info usuario - solo visible en pantallas medianas+ */}
              <div className="hidden md:flex flex-col items-end">
                <span className="text-sm font-semibold text-gray-800 truncate max-w-[120px] lg:max-w-none">{username}</span>
                <span className="text-xs text-purple-600 font-medium bg-purple-50 px-2 py-0.5 rounded-full truncate max-w-[100px] lg:max-w-none">
                  {getRoleAbbrev(roleName || "Usuario")}
                </span>
              </div>
              
              {/* Avatar */}
              <div className="relative">
                <img
                  src={avatarUrl}
                  alt={username}
                  className="w-8 h-8 sm:w-9 sm:h-9 lg:w-10 lg:h-10 rounded-full object-cover border-2 border-gray-200 shadow-lg hover:shadow-xl transition-shadow duration-200"
                />
                {/* Indicador de estado online */}
                <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 sm:w-3 sm:h-3 lg:w-3.5 lg:h-3.5 bg-green-400 border-2 border-white rounded-full shadow-sm"></div>
              </div>
              
              {/* Chevron - oculto en móvil muy pequeño */}
              <svg 
                className={`hidden sm:block w-3 h-3 sm:w-4 sm:h-4 text-gray-400 transform transition-transform duration-300 ${
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

            {/* Menú desplegable optimizado - SIN duplicación de info */}
            {userMenuOpen && (
              <div className="absolute top-[110%] right-0 w-[180px] sm:w-[200px] bg-white border border-gray-100 rounded-xl shadow-xl z-50 py-2 animate-fade-in backdrop-blur-sm">
                {/* Opciones del menú - directamente sin header duplicado */}
                <button
                  className="flex items-center gap-2 sm:gap-3 w-full px-3 sm:px-4 py-2 sm:py-2.5 text-gray-700 hover:bg-gray-50 hover:text-purple-600 transition-all duration-200 text-xs sm:text-sm group"
                  onClick={() => {
                    setUserMenuOpen(false);
                  }}
                >
                  <div className="w-6 h-6 sm:w-8 sm:h-8 bg-purple-100 rounded-lg flex items-center justify-center group-hover:bg-purple-200 transition-colors duration-200 flex-shrink-0">
                    <svg className="w-3 h-3 sm:w-4 sm:h-4 text-purple-600" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <span className="font-medium truncate">Mi perfil</span>
                </button>

                <button
                  className="flex items-center gap-2 sm:gap-3 w-full px-3 sm:px-4 py-2 sm:py-2.5 text-gray-700 hover:bg-gray-50 hover:text-purple-600 transition-all duration-200 text-xs sm:text-sm group"
                  onClick={() => {
                    setUserMenuOpen(false);
                  }}
                >
                  <div className="w-6 h-6 sm:w-8 sm:h-8 bg-purple-100 rounded-lg flex items-center justify-center group-hover:bg-purple-200 transition-colors duration-200 flex-shrink-0">
                    <svg className="w-3 h-3 sm:w-4 sm:h-4 text-purple-600" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <span className="font-medium truncate">Configuración</span>
                </button>

                {/* Separador */}
                <div className="border-t border-gray-100 my-2 mx-2"></div>

                {/* Cerrar sesión */}
                <button
                  className="flex items-center gap-2 sm:gap-3 w-full px-3 sm:px-4 py-2 sm:py-2.5 text-red-600 hover:bg-red-50 transition-all duration-200 text-xs sm:text-sm group"
                  onClick={() => {
                    logout();
                    setUserMenuOpen(false);
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
  );
};

export default Header;