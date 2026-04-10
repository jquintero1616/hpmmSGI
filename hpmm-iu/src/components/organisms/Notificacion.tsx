import React, { useEffect, useMemo, useRef, useState } from "react";
import { useAuth } from "../../hooks/use.Auth";
import { useNotificacion } from "../../hooks/use.Notificacion";
import { notificationsInterface } from "../../interfaces/Notifaciones.interface";
import NotificacionItem from "../molecules/NotificacionItem";
import { X } from "lucide-react";

interface NotificacionProps {
  open: boolean;
  onClose: () => void;
  onUpdatePendientes: (count: number) => void;
  anchorRef?: React.RefObject<HTMLElement>;
}

type VistaType = "todas" | "no-leidas";

// Umbral: notificaciones con menos de 24h son "Nuevas"
const UMBRAL_NUEVAS_MS = 24 * 60 * 60 * 1000;

const esNoLeida = (n: notificationsInterface): boolean => {
  if (n.tipo === "Pendiente") return true;
  if (n.tipo === "Archivado" && n.updated_at) {
    return Date.now() >= new Date(n.updated_at).getTime() + 60 * 60 * 1000;
  }
  return false;
};

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
    GetNotificacionesContext,
  } = useNotificacion();
  const panelRef = useRef<HTMLDivElement>(null);
  const [vista, setVista] = useState<VistaType>("todas");

  // Cargar notificaciones al montar
  useEffect(() => {
    GetNotificacionesContext();
  }, [GetNotificacionesContext]);

  // Refrescar cada 30 segundos
  useEffect(() => {
    const interval = setInterval(() => {
      GetNotificacionesContext();
    }, 30000);
    return () => clearInterval(interval);
  }, [GetNotificacionesContext]);

  // Notificaciones del usuario
  const userNotis = useMemo(
    () => notificaciones.filter((n) => n.id_user === userId),
    [notificaciones, userId]
  );

  // Contar pendientes para badge
  useEffect(() => {
    const pendientes = userNotis.filter(esNoLeida).length;
    onUpdatePendientes(pendientes);
  }, [userNotis, onUpdatePendientes]);

  // Handlers
  const marcarComoLeida = async (id: string, n: notificationsInterface) => {
    await PutNotificacionContext(id, { ...n, tipo: "Leido" });
  };

  const recordarMasTarde = async (id: string, n: notificationsInterface) => {
    try {
      await PutNotificacionContext(id, { ...n, tipo: "Archivado" });
    } catch (error) {
      console.error("Error al archivar:", error);
    }
  };

  const eliminar = async (id: string) => {
    await DeleteNotificacionContext(id);
  };

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

  // Separar en "Nuevas" y "Anteriores"
  const { nuevas, anteriores } = useMemo(() => {
    const ahora = Date.now();
    // Filtrar según vista
    const base =
      vista === "no-leidas" ? userNotis.filter(esNoLeida) : userNotis;

    // Ordenar por prioridad + fecha
    const ordenar = (arr: notificationsInterface[]) => {
      const prio: Record<string, number> = { urgente: 0, alta: 1, media: 2, baja: 3 };
      return [...arr].sort((a, b) => {
        const pa = prio[a.prioridad || "media"] ?? 2;
        const pb = prio[b.prioridad || "media"] ?? 2;
        if (pa !== pb) return pa - pb;
        return new Date(b.created_at ?? "").getTime() - new Date(a.created_at ?? "").getTime();
      });
    };

    const n: notificationsInterface[] = [];
    const a: notificationsInterface[] = [];

    for (const noti of base) {
      const creada = new Date(noti.created_at ?? "").getTime();
      if (ahora - creada < UMBRAL_NUEVAS_MS) {
        n.push(noti);
      } else {
        a.push(noti);
      }
    }

    return { nuevas: ordenar(n), anteriores: ordenar(a) };
  }, [userNotis, vista]);

  if (!open) return null;

  const totalNoLeidas = userNotis.filter(esNoLeida).length;

  return (
    <div
      ref={panelRef}
      className="absolute right-0 mt-2 w-[420px] max-h-[600px] bg-white rounded-xl shadow-2xl border border-gray-200 z-50 flex flex-col"
      style={{ top: "100%" }}
    >
      {/* Header */}
      <div className="px-4 pt-4 pb-2">
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-bold text-xl text-gray-900">Notificaciones</h2>
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-gray-100 rounded-full text-gray-500 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tabs estilo FB */}
        <div className="flex gap-2">
          <button
            onClick={() => setVista("todas")}
            className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
              vista === "todas"
                ? "bg-blue-100 text-blue-700"
                : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            Todas
          </button>
          <button
            onClick={() => setVista("no-leidas")}
            className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
              vista === "no-leidas"
                ? "bg-blue-100 text-blue-700"
                : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            No leídas
          </button>
        </div>
      </div>

      {/* Contenido scrollable */}
      <div className="flex-1 overflow-y-auto">
        {/* Sin notificaciones */}
        {nuevas.length === 0 && anteriores.length === 0 && (
          <div className="text-gray-400 text-center py-12 text-sm">
            {vista === "no-leidas"
              ? "No tienes notificaciones sin leer."
              : "No tienes notificaciones."}
          </div>
        )}

        {/* Sección NUEVAS */}
        {nuevas.length > 0 && (
          <div>
            <div className="flex items-center justify-between px-4 pt-3 pb-1">
              <h3 className="font-semibold text-sm text-gray-900">Nuevas</h3>
              {totalNoLeidas > 0 && (
                <button
                  onClick={marcarTodasComoLeidas}
                  className="text-xs text-blue-600 hover:text-blue-800 font-medium"
                >
                  Marcar todas como leídas
                </button>
              )}
            </div>
            {nuevas.map((n) => (
              <NotificacionItem
                key={n.id_noti}
                noti={n}
                onMarcarLeida={() => marcarComoLeida(n.id_noti, n)}
                onEliminar={() => eliminar(n.id_noti)}
                onRecordarMasTarde={() => recordarMasTarde(n.id_noti, n)}
                onNavegar={onClose}
              />
            ))}
          </div>
        )}

        {/* Sección ANTERIORES */}
        {anteriores.length > 0 && (
          <div>
            <div className="flex items-center justify-between px-4 pt-3 pb-1">
              <h3 className="font-semibold text-sm text-gray-900">Anteriores</h3>
              {nuevas.length === 0 && totalNoLeidas > 0 && (
                <button
                  onClick={marcarTodasComoLeidas}
                  className="text-xs text-blue-600 hover:text-blue-800 font-medium"
                >
                  Marcar todas como leídas
                </button>
              )}
            </div>
            {anteriores.map((n) => (
              <NotificacionItem
                key={n.id_noti}
                noti={n}
                onMarcarLeida={() => marcarComoLeida(n.id_noti, n)}
                onEliminar={() => eliminar(n.id_noti)}
                onRecordarMasTarde={() => recordarMasTarde(n.id_noti, n)}
                onNavegar={onClose}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Notificacion;
