import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { notificationsInterface } from "../../interfaces/Notifaciones.interface";
import { useAuth } from "../../hooks/use.Auth";
import {
  PackageCheck,
  FileText,
  ShoppingCart,
  PackageSearch,
  Settings,
  Bell,
  Check,
  Clock,
  Trash2,
  MoreVertical,
} from "lucide-react";

// Tiempo relativo en español
const tiempoRelativo = (fecha: Date | string | undefined): string => {
  if (!fecha) return "";
  const ahora = Date.now();
  const diff = ahora - new Date(fecha).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "ahora";
  if (mins < 60) return `hace ${mins} min`;
  const horas = Math.floor(mins / 60);
  if (horas < 24) return `hace ${horas}h`;
  const dias = Math.floor(horas / 24);
  if (dias < 30) return `hace ${dias}d`;
  const meses = Math.floor(dias / 30);
  return `hace ${meses} mes${meses > 1 ? "es" : ""}`;
};

// Icono lucide + color de fondo según categoría
const configCategoria: Record<string, { icon: React.ElementType; bg: string; color: string }> = {
  kardex:           { icon: PackageCheck,  bg: "bg-blue-100",   color: "text-blue-600" },
  requisicion:      { icon: FileText,      bg: "bg-purple-100", color: "text-purple-600" },
  solicitud_compra: { icon: ShoppingCart,  bg: "bg-green-100",  color: "text-green-600" },
  producto:         { icon: PackageSearch, bg: "bg-amber-100",  color: "text-amber-600" },
  sistema:          { icon: Settings,      bg: "bg-gray-200",   color: "text-gray-600" },
};

const defaultConfig = { icon: Bell, bg: "bg-gray-200", color: "text-gray-600" };

// Mapa de rutas según tipo de entidad y acción
const obtenerRuta = (noti: notificationsInterface): string | null => {
  const tipo = noti.entidad_tipo || noti.categoria;
  const accion = noti.accion_requerida;

  switch (tipo) {
    case "kardex":
      if (accion === "aprobar") return "/kardexPendiente";
      if (accion === "revisar") return "/kardexRechazadas";
      return "/kardex";
    case "requisicion":
      if (accion === "aprobar") return "/requisicionPendiente";
      if (accion === "revisar") return "/requisicionRechazado";
      return "/requisicionAprobado";
    case "solicitud_compra":
      return "/solicitud_compras";
    case "producto":
      return "/products";
    default:
      return null;
  }
};

interface NotificacionItemProps {
  noti: notificationsInterface;
  onMarcarLeida: (id_noti: string, noti: notificationsInterface) => void;
  onEliminar: (id_noti: string) => void;
  onRecordarMasTarde?: (id_noti: string, noti: notificationsInterface) => void;
  onNavegar?: () => void;
}

const NotificacionItem: React.FC<NotificacionItemProps> = ({
  noti,
  onMarcarLeida,
  onEliminar,
  onRecordarMasTarde,
  onNavegar,
}) => {
  const navigate = useNavigate();
  const { roleName } = useAuth();
  const esAdmin = roleName === "Administrador" || roleName === "Super Admin";
  const cat = configCategoria[noti.categoria || "sistema"] || defaultConfig;
  const IconoCategoria = cat.icon;
  const noLeida = noti.tipo === "Pendiente" || noti.tipo === "Archivado";
  const [menuAbierto, setMenuAbierto] = useState(false);
  const ruta = obtenerRuta(noti);

  const handleClick = () => {
    // Marcar como leída si no lo está
    if (noLeida) onMarcarLeida(noti.id_noti, noti);
    // Navegar al módulo correspondiente
    if (ruta) {
      onNavegar?.();
      navigate(ruta);
    }
  };

  return (
    <div
      className={`flex items-start gap-3 px-4 py-3 cursor-pointer transition-colors relative group ${
        noLeida ? "bg-blue-50 hover:bg-blue-100/60" : "hover:bg-gray-50"
      }`}
      onClick={handleClick}
    >
      {/* Icono circular */}
      <div
        className={`w-11 h-11 rounded-full flex items-center justify-center flex-shrink-0 ${cat.bg}`}
      >
        <IconoCategoria className={`w-5 h-5 ${cat.color}`} />
      </div>

      {/* Contenido */}
      <div className="flex-1 min-w-0">
        {/* Texto descriptivo estilo FB */}
        <p className={`text-sm leading-snug ${noLeida ? "text-gray-900" : "text-gray-600"}`}>
          {noti.titulo && (
            <span className="font-semibold">{noti.titulo}</span>
          )}
          {noti.titulo && noti.mensaje ? ": " : ""}
          <span>{noti.mensaje}</span>
        </p>

        {/* Descripción detallada si existe */}
        {noti.descripcion_detallada && (
          <p className="text-xs text-gray-500 mt-0.5 truncate">
            {noti.descripcion_detallada}
          </p>
        )}

        {/* Tiempo relativo + creador */}
        <p className={`text-xs mt-0.5 ${noLeida ? "text-blue-600 font-medium" : "text-gray-400"}`}>
          {tiempoRelativo(noti.created_at)}
          {noti.creador_nombre && ` · ${noti.creador_nombre}`}
        </p>

        {/* Badge prioridad urgente/alta */}
        {noti.prioridad === "urgente" && (
          <span className="inline-block mt-1 text-[10px] bg-red-600 text-white px-1.5 py-0.5 rounded font-bold">
            URGENTE
          </span>
        )}
        {noti.prioridad === "alta" && (
          <span className="inline-block mt-1 text-[10px] bg-orange-500 text-white px-1.5 py-0.5 rounded font-bold">
            ALTA
          </span>
        )}
      </div>

      {/* Punto azul de no leída */}
      {noLeida && (
        <div className="flex items-center self-center">
          <span className="h-3 w-3 rounded-full bg-blue-500 flex-shrink-0" />
        </div>
      )}

      {/* Botón menú (3 puntos) — visible en hover */}
      <div className="relative flex-shrink-0 self-center">
        <button
          className="p-1.5 rounded-full hover:bg-gray-200 opacity-0 group-hover:opacity-100 transition-opacity"
          onClick={(e) => {
            e.stopPropagation();
            setMenuAbierto(!menuAbierto);
          }}
        >
          <MoreVertical className="w-4 h-4 text-gray-500" />
        </button>

        {/* Menú desplegable */}
        {menuAbierto && (
          <div
            className="absolute right-0 top-8 bg-white border border-gray-200 rounded-lg shadow-lg py-1 z-50 min-w-[180px]"
            onMouseLeave={() => setMenuAbierto(false)}
          >
            {noLeida && (
              <button
                className="w-full px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                onClick={(e) => {
                  e.stopPropagation();
                  onMarcarLeida(noti.id_noti, noti);
                  setMenuAbierto(false);
                }}
              >
                <Check className="w-4 h-4 text-blue-500" /> Marcar como leída
              </button>
            )}
            {noti.tipo === "Pendiente" && esAdmin && onRecordarMasTarde && (
              <button
                className="w-full px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                onClick={(e) => {
                  e.stopPropagation();
                  onRecordarMasTarde(noti.id_noti, noti);
                  setMenuAbierto(false);
                }}
              >
                <Clock className="w-4 h-4 text-orange-500" /> Recordar más tarde
              </button>
            )}
            <button
              className="w-full px-3 py-2 text-left text-sm text-red-600 hover:bg-gray-100 flex items-center gap-2"
              onClick={(e) => {
                e.stopPropagation();
                onEliminar(noti.id_noti);
                setMenuAbierto(false);
              }}
            >
                <Trash2 className="w-4 h-4" /> Eliminar notificación
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificacionItem;