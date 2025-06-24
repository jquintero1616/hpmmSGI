import React from "react";
import { notificationsInterface } from "../../interfaces/Notifaciones.interface";

interface NotificacionItemProps {
  noti: notificationsInterface;
  onMarcarLeida: (id_noti: string, noti: notificationsInterface) => void;
  onEliminar: (id_noti: string) => void;
}

const NotificacionItem: React.FC<NotificacionItemProps> = ({
  noti,
  onMarcarLeida,
  onEliminar,
}) => (
  <div
    className={`p-3 rounded-lg border ${
      noti.tipo === "Pendiente"
        ? "bg-purple-50 border-purple-200"
        : "bg-gray-50 border-gray-100"
    } flex justify-between items-center`}
  >
    <div>
      <div className="font-medium">{noti.mensaje}</div>
      <div className="text-xs text-gray-500">
        {noti.tipo} • {new Date(noti.created_at ?? Date.now()).toLocaleString()}
      </div>
    </div>
    <div className="flex flex-col gap-1 ml-2">
      {noti.tipo === "Pendiente" && (
        <button
          className="text-xs text-blue-600 hover:underline"
          onClick={() => onMarcarLeida(noti.id_noti, noti)}
        >
          Marcar como leída
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

export default NotificacionItem;