import React from "react";
import { notificationsInterface } from "../../interfaces/Notifaciones.interface";
import { useAuth } from "../../hooks/use.Auth";
import { obtenerIconoCategoria, obtenerColorPrioridad } from "../../helpers/notificacionHelper";

interface NotificacionItemProps {
  noti: notificationsInterface;
  onMarcarLeida: (id_noti: string, noti: notificationsInterface) => void;
  onEliminar: (id_noti: string) => void;
  onRecordarMasTarde?: (id_noti: string, noti: notificationsInterface) => void;
}

const NotificacionItem: React.FC<NotificacionItemProps> = ({
  noti,
  onMarcarLeida,
  onEliminar,
  onRecordarMasTarde,
}) => {
  const { roleName } = useAuth();
  const esAdmin = roleName === "Administrador" || roleName === "Super Admin";
  const icono = obtenerIconoCategoria(noti.categoria || "sistema");
  const colorClasses = obtenerColorPrioridad(noti.prioridad || "media");

  return (
    <div
      className={`p-3 rounded-lg border ${colorClasses} flex items-start gap-3 hover:shadow-md transition-shadow`}
    >
      {/* Icono de categoría */}
      <div className="text-2xl flex-shrink-0 mt-1">
        {icono}
      </div>
      
      <div className="flex-1 min-w-0">
        {/* Título y prioridad */}
        <div className="flex items-center gap-2 mb-1">
          <div className="font-semibold text-sm">{noti.titulo || "Notificación"}</div>
          {noti.prioridad === "urgente" && (
            <span className="text-xs bg-red-600 text-white px-2 py-0.5 rounded-full font-bold">
              ¡URGENTE!
            </span>
          )}
          {noti.prioridad === "alta" && (
            <span className="text-xs bg-orange-600 text-white px-2 py-0.5 rounded-full font-bold">
              ALTA
            </span>
          )}
        </div>
        
        {/* Mensaje */}
        <div className="text-sm text-gray-700 mb-1">{noti.mensaje}</div>
        
        {/* Descripción detallada si existe */}
        {noti.descripcion_detallada && (
          <div className="text-xs text-gray-600 bg-gray-50 p-2 rounded mb-2 border-l-2 border-blue-400">
            {noti.descripcion_detallada}
          </div>
        )}
        
        {/* Metadata */}
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <span className="capitalize">{noti.categoria}</span>
          <span>•</span>
          <span>{noti.tipo}</span>
          {noti.creador_nombre && (
            <>
              <span>•</span>
              <span>Por: {noti.creador_nombre}</span>
            </>
          )}
          <span>•</span>
          <span>{new Date(noti.created_at ?? Date.now()).toLocaleString('es-HN')}</span>
        </div>
      </div>
      
      {/* Acciones */}
      <div className="flex flex-col gap-1 ml-2 flex-shrink-0">
        {(noti.tipo === "Pendiente" || noti.tipo === "Archivado") && (
          <button
            className="text-xs text-blue-600 hover:underline whitespace-nowrap"
            onClick={() => onMarcarLeida(noti.id_noti, noti)}
          >
            ✓ Marcar leída
          </button>
        )}
        {noti.tipo === "Pendiente" && esAdmin && onRecordarMasTarde && (
          <button
            className="text-xs text-orange-600 hover:underline whitespace-nowrap"
            onClick={() => onRecordarMasTarde(noti.id_noti, noti)}
          >
            ⏰ Más tarde
          </button>
        )}
        <button
          className="text-xs text-red-500 hover:underline whitespace-nowrap"
          onClick={() => onEliminar(noti.id_noti)}
        >
          ✕ Eliminar
        </button>
      </div>
    </div>
  );
};

export default NotificacionItem;