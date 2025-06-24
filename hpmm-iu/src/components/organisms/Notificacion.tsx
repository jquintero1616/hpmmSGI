import React, { useEffect, useState } from "react";
import { GetNotificacionesService, PutNotificacionService, DeleteNotificacionService } from "../../services/Notificacion.service";
import { useAuth } from "../../hooks/use.Auth";
import useAxiosPrivate from "../../hooks/axiosPrivateInstance";
import { notificationsInterface } from "../../interfaces/Notifaciones.interface";
import NotificacionItem from "../molecules/NotificacionItem";

interface NotificacionProps {
  open: boolean;
  onClose: () => void;
  onUpdatePendientes: (pendientes: notificationsInterface[]) => void;
}

const Notificacion: React.FC<NotificacionProps> = ({ open, onClose, onUpdatePendientes }) => {
  const { userId } = useAuth();
  const axiosPrivate = useAxiosPrivate();
  const [notificaciones, setNotificaciones] = useState<notificationsInterface[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (open) fetchNotificaciones();
    // eslint-disable-next-line
  }, [open]);

  const fetchNotificaciones = async () => {
    setLoading(true);
    try {
      const data = await GetNotificacionesService(axiosPrivate);
      const userNotis = data?.filter(n => n.id_user === userId) || [];
      setNotificaciones(userNotis);
      onUpdatePendientes(userNotis.filter(noti => noti.tipo === "Pendiente"));
    } catch (e) {
      setNotificaciones([]);
      onUpdatePendientes([]);
    }
    setLoading(false);
  };

  const marcarComoLeida = async (id_noti: string, noti: notificationsInterface) => {
    await PutNotificacionService(id_noti, { ...noti, tipo: "Leido" }, axiosPrivate);
    fetchNotificaciones();
  };

  const eliminarNotificacion = async (id_noti: string) => {
    await DeleteNotificacionService(id_noti, axiosPrivate);
    fetchNotificaciones();
  };

  if (!open) return null;

  return (
    <div className="absolute right-0 mt-2 w-80 max-h-96 bg-white rounded-xl shadow-lg border z-50 overflow-y-auto">
      <div className="flex items-center justify-between p-4 border-b">
        <h2 className="font-bold text-lg">Notificaciones</h2>
        <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full">
          <span>&times;</span>
        </button>
      </div>
      <div className="p-4 space-y-3">
        {loading ? (
          <div>Cargando...</div>
        ) : notificaciones.length === 0 ? (
          <div className="text-gray-500 text-center">No tienes notificaciones.</div>
        ) : (
          notificaciones
            .sort((a, b) => new Date(b.created_at ?? Date.now()).getTime() - new Date(a.created_at ?? Date.now()).getTime())
            .map((noti) => (
              <NotificacionItem
                key={noti.id_noti}
                noti={noti}
                onMarcarLeida={marcarComoLeida}
                onEliminar={eliminarNotificacion}
              />
            ))
        )}
      </div>
    </div>
  );
};

export default Notificacion;