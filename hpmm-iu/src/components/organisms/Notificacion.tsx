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
  const { userId, roleName } = useAuth();
  const { notificaciones, PutNotificacionContext, DeleteNotificacionContext } =
    useNotificacion();
  const panelRef = useRef<HTMLDivElement>(null);

  // 1) Filtra solo las notis de este user
  const userNotis = notificaciones.filter((n) => n.id_user === userId);

  // 2) Informa al Header cuántas pendientes hay
  useEffect(() => {
    const pendientes = userNotis.filter((n) => n.tipo === "Pendiente").length;
    onUpdatePendientes(pendientes);
  }, [userNotis, onUpdatePendientes]);

  // 3) Marcar como leída
  const marcarComoLeida = async (id: string, n: any) => {
    await PutNotificacionContext(id, { ...n, tipo: "Leido" });
  };

  // 4) Eliminar
  const eliminar = async (id: string) => {
    await DeleteNotificacionContext(id);
  };

  // 5) Marcar todas
  const marcarTodasComoLeidas = async () => {
    const pendientes = userNotis.filter((n) => n.tipo === "Pendiente");
    await Promise.all(
      pendientes.map((n) =>
        PutNotificacionContext(n.id_noti, { ...n, tipo: "Leido" })
      )
    );
  };

  // 6) cerrar al clic fuera
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

  // 7) solo admin ve la lista
  const pendientesList = userNotis.filter(
    (n) => n.tipo === "Pendiente" && roleName === "Administrador"
  );

  return (
    <div
      ref={panelRef}
      className="absolute right-0 mt-2 w-80 max-h-96 bg-white rounded-xl shadow-lg border z-50 overflow-y-auto"
      style={{ top: "100%", minWidth: "320px" }}
    >
      <div className="flex items-center justify-between p-4 border-b">
        <h2 className="font-bold text-lg">Notificaciones</h2>
        <div className="flex gap-2">
          <button
            onClick={marcarTodasComoLeidas}
            className="text-xs text-blue-600 hover:underline"
            disabled={pendientesList.length === 0}
          >
            Marcar todas como leídas
          </button>
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
              />
            ))
        )}
      </div>
    </div>
  );
};

export default Notificacion;
