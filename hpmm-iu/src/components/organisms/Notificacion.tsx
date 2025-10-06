import React, { useEffect, useRef } from "react";
import { useAuth } from "../../hooks/use.Auth";
import { useNotificacion } from "../../hooks/use.Notificacion";
import NotificacionItem from "../molecules/NotificacionItem";

interface NotificacionProps {
  open: boolean;
  onClose: () => void;
  onUpdatePendientes: (count: number) => void;
  anchorRef?: React.RefObject<HTMLElement>;
}

const Notificacion: React.FC<NotificacionProps> = ({
  open,
  onClose,
  onUpdatePendientes,
  anchorRef,
}) => {
  const { userId } = useAuth();
  const { 
    notificaciones, 
    PutNotificacionContext, 
    DeleteNotificacionContext,
    GetNotificacionesContext 
  } = useNotificacion();
  const panelRef = useRef<HTMLDivElement>(null);

  // Cargar notificaciones al montar el componente
  useEffect(() => {
    GetNotificacionesContext();
  }, [GetNotificacionesContext]);

  // Actualizar notificaciones cada 30 segundos para mostrar las de "RecordarMasTarde"
  useEffect(() => {
    const interval = setInterval(() => {
      // Solo actualizar si hay notificaciones con "RecordarMasTarde"
      const tieneRecordatorios = notificaciones.some(n => n.tipo === "RecordarMasTarde");
      if (tieneRecordatorios) {
        GetNotificacionesContext();
      }
    }, 30000); // cada 30 segundos

    return () => clearInterval(interval);
  }, [GetNotificacionesContext, notificaciones]);

  // Filtrar notificaciones según el rol del usuario
  const userNotis = notificaciones.filter((n) => {
    // Mostrar todas las notificaciones dirigidas al usuario actual
    return n.id_user === userId;
  });

  // Contar solo las notificaciones pendientes
  useEffect(() => {
    const pendientes = userNotis.filter((n) => {
      if (n.tipo === "Pendiente") return true;
      
      // Mostrar las notificaciones "RecordarMasTarde" después de 1 hora
      if (n.tipo === "RecordarMasTarde" && n.updated_at) {
        const horaRecordar = new Date(n.updated_at).getTime() + (60 * 60 * 1000); // 1 hora
        return Date.now() >= horaRecordar;
      }
      
      return false;
    }).length;
    
    onUpdatePendientes(pendientes);
  }, [userNotis, onUpdatePendientes, notificaciones.length, userId]);

  // Marcar como leída
  const marcarComoLeida = async (id: string, n: any) => {
    await PutNotificacionContext(id, { ...n, tipo: "Leido" });
  };

  // Recordar más tarde
  const recordarMasTarde = async (id: string, n: any) => {
    try {
      await PutNotificacionContext(id, { ...n, tipo: "RecordarMasTarde" });
    } catch (error) {
      console.error("Error al marcar como 'RecordarMasTarde':", error);
    }
  };

  // Eliminar
  const eliminar = async (id: string) => {
    await DeleteNotificacionContext(id);
  };

  // Marcar todas como leídas
  const marcarTodasComoLeidas = async () => {
    const pendientes = userNotis.filter((n) => n.tipo === "Pendiente");
    await Promise.all(
      pendientes.map((n) =>
        PutNotificacionContext(n.id_noti, { ...n, tipo: "Leido" })
      )
    );
  };

  // Cerrar al hacer clic fuera
  useEffect(() => {
    function handleClickOutside(ev: MouseEvent) {
      if (
        panelRef.current &&
        !panelRef.current.contains(ev.target as Node) &&
        anchorRef?.current &&
        !anchorRef.current.contains(ev.target as Node)
      ) {
        onClose();
      }
    }
    if (open) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open, onClose, anchorRef]);

  if (!open) return null;

  // Filtrar solo las pendientes para mostrar (incluyendo las que hay que recordar)
  const pendientesList = userNotis.filter((n) => {
    if (n.tipo === "Pendiente") return true;
    
    // Mostrar las notificaciones "RecordarMasTarde" después de 1 hora
    if (n.tipo === "RecordarMasTarde" && n.updated_at) {
      const horaRecordar = new Date(n.updated_at).getTime() + (60 * 60 * 1000); // 1 hora
      const shouldShow = Date.now() >= horaRecordar;
      return shouldShow;
    }
    
    return false;
  });

  return (
    <div
      ref={panelRef}
      className="absolute right-0 mt-2 w-80 max-h-96 bg-white rounded-xl shadow-lg border z-50 overflow-y-auto"
      style={{ top: "100%", minWidth: "320px" }}
    >
      <div className="flex items-center justify-between p-4 border-b">
        <h2 className="font-bold text-lg">Notificaciones</h2>
        <div className="flex gap-2">
          {pendientesList.length > 0 && (
            <button
              onClick={marcarTodasComoLeidas}
              className="text-xs text-blue-600 hover:underline"
            >
              Marcar todas como leídas
            </button>
          )}
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full">
            &times;
          </button>
        </div>
      </div>
      <div className="p-4 space-y-3">
        {pendientesList.length === 0 ? (
          <div className="text-gray-500 text-center">
            No tienes notificaciones pendientes.
          </div>
        ) : (
          pendientesList
            .sort(
              (a, b) =>
                new Date(b.created_at ?? "").getTime() -
                new Date(a.created_at ?? "").getTime()
            )
            .map((n) => (
              <NotificacionItem
                key={n.id_noti}
                noti={n}
                onMarcarLeida={() => marcarComoLeida(n.id_noti, n)}
                onEliminar={() => eliminar(n.id_noti)}
                onRecordarMasTarde={() => recordarMasTarde(n.id_noti, n)}
              />
            ))
        )}
      </div>
    </div>
  );
};

export default Notificacion;
