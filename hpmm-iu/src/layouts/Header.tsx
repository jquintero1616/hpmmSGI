import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/use.Auth';


const Header: React.FC = () => {
  const navigate = useNavigate();
  const { logout, username, id_rol } = useAuth();
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
      <div className="flex items-center justify-between py-4 px-6">
        {/* Logo */}
        <h1
          className="text-2xl font-bold cursor-pointer text-purple-800"
          onClick={() => navigate('/home')}
        >
          Almacen
        </h1>

        {/* Menú derecho */}
        <div className="flex items-center gap-4">
          {/* Notificaciones */}
          <button
            className="hidden md:inline-flex text-purple-700 hover:text-purple-900 transition"
            title="Notificaciones"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
          </button>

          {/* Perfil de usuario */}
          <div className="relative" ref={userMenuRef}>
            <button
              className="flex items-center gap-3 px-2 py-1 rounded-md hover:bg-purple-50 transition"
              onClick={() => setUserMenuOpen((open) => !open)}
            >
              <span className="hidden md:flex flex-col items-end">
                <span className="text-sm font-medium text-gray-700 leading-tight">{username}</span>
                <span className="w-full border-t border-gray-200 my-0.5"></span>
                <span className="text-[10px] text-purple-700 font-semibold">
                  {getRoleAbbrev(id_rol || "Usuario")}
                </span>
              </span>
              <img
                src={avatarUrl}
                alt={username}
                className="w-8 h-8 rounded-full object-cover border border-purple-200"
              />
              <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {/* Menú desplegable usuario */}
            {userMenuOpen && (
              <div className="absolute top-[100%] right-0 min-w-full bg-white border-x border-b rounded-b-md shadow-lg z-50">
                <button
                  className="w-full text-left px-4 py-2 text-gray-700 hover:bg-purple-50"
                  onClick={() => {
                    logout();
                    setUserMenuOpen(false);
                  }}
                >
                  Cerrar sesión
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