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
    <header className="bg-white border-b shadow-sm sticky top-0 z-30">
      <div className="flex items-center justify-between py-3 px-6">
        {/* Logo */}
        <h1
          className="text-xl font-semibold cursor-pointer text-purple-700 tracking-tight select-none transition hover:text-gray-900"
          onClick={() => navigate('/home')}
        >
          Sistema de Gestión de Inventario
        </h1>

        {/* Menú derecho */}
        <div className="flex items-center gap-3">
          {/* Notificaciones */}
          <button
            className="hidden md:inline-flex text-purple-600 hover:bg-gray-50 p-2 transition"
            title="Notificaciones"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
          </button>

          {/* Perfil de usuario */}
          <div className="relative" ref={userMenuRef}>
            <button
              className="flex items-center gap-2 px-2 py-1 hover:bg-gray-50 transition focus:outline-none"
              onClick={() => setUserMenuOpen((open) => !open)}
            >
              <span className="hidden md:flex flex-col items-end mr-1">
                <span className="text-sm font-medium text-gray-700">{username}</span>
                <span className="text-[11px] text-purple-600 font-semibold">{getRoleAbbrev(roleName || "Usuario")}</span>
              </span>
              <img
                src={avatarUrl}
                alt={username}
                className="w-8 h-8 rounded-full object-cover border border-purple-100 shadow-sm"
              />
              <svg className={`w-4 h-4 text-gray-400 transition-transform ${userMenuOpen ? "rotate-180" : ""}`} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {/* Menú desplegable usuario */}
            {userMenuOpen && (
              <div className="absolute top-[110%] right-0 min-w-[160px] bg-white border border-gray-100  shadow-lg z-50 py-1 animate-fade-in">
                <button
                  className="flex items-center gap-2 w-full px-4 py-2 text-gray-700 hover:bg-gray-50 transition text-xs"
                  onClick={() => {
                    logout();
                    setUserMenuOpen(false);
                  }}
                >
                  <svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 11-6 0v-1" />
                  </svg>
                  <span>Cerrar sesión</span>
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