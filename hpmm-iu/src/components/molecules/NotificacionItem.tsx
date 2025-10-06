import React from "react";
import { notificationsInterface } from "../../interfaces/Notifaciones.interface";
import { useAuth } from "../../hooks/use.Auth";

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

  return (
    <div
      className={`p-3 rounded-lg border ${
        noti.tipo === "Pendiente"
          ? "bg-purple-50 border-purple-200"
          : noti.tipo === "RecordarMasTarde"
          ? "bg-orange-50 border-orange-200"
          : "bg-gray-50 border-gray-100"
      } flex justify-between items-center`}
    >
      <div>
        <div className="font-medium">{noti.mensaje}</div>
        <div className="text-xs text-gray-500">
          {noti.tipo === "RecordarMasTarde" ? "Recordatorio" : noti.tipo} • {new Date(noti.created_at ?? Date.now()).toLocaleString()}
        </div>
      </div>
      <div className="flex flex-col gap-1 ml-2">
        {(noti.tipo === "Pendiente" || noti.tipo === "RecordarMasTarde") && (
          <button
            className="text-xs text-blue-600 hover:underline"
            onClick={() => onMarcarLeida(noti.id_noti, noti)}
          >
            Marcar como leída
          </button>
        )}
        {noti.tipo === "Pendiente" && esAdmin && onRecordarMasTarde && (
          <button
            className="text-xs text-orange-600 hover:underline"
            onClick={() => onRecordarMasTarde(noti.id_noti, noti)}
          >
            Recordar más tarde
          </button>
        )}
        {noti.tipo === "RecordarMasTarde" && esAdmin && onRecordarMasTarde && (
          <button
            className="text-xs text-orange-600 hover:underline"
            onClick={() => onRecordarMasTarde(noti.id_noti, noti)}
          >
            Recordar otra vez
          </button>
        )}
        <button
          className="text-xs text-red-500 hover:underline"
          onClick={() => onEliminar(noti.id_noti)}
        >
          Eliminar
        </button>
      </div>
    </div>
  );
};

export default NotificacionItem;