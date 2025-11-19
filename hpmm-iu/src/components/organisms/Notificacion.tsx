import React, { useEffect, useRef, useState } from "react";
import { useAuth } from "../../hooks/use.Auth";
import { useNotificacion } from "../../hooks/use.Notificacion";
import { notificationsInterface } from "../../interfaces/Notifaciones.interface";
import NotificacionItem from "../molecules/NotificacionItem";

interface NotificacionProps {
  open: boolean;
  onClose: () => void;
  onUpdatePendientes: (count: number) => void;
  anchorRef?: React.RefObject<HTMLElement>;
}

type TabType = "todas" | "no-leidas" | "archivadas";
type CategoriaType = "todas" | "kardex" | "requisicion" | "producto" | "compra" | "proveedor" | "sistema";

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
  const [tabActiva, setTabActiva] = useState<TabType>("no-leidas");
  const [categoriaFiltro, setCategoriaFiltro] = useState<CategoriaType>("todas");

  // Cargar notificaciones al montar el componente
  useEffect(() => {
    GetNotificacionesContext();
  }, [GetNotificacionesContext]);

  // Actualizar notificaciones cada 30 segundos para mostrar las de "Archivado"
  useEffect(() => {
    const interval = setInterval(() => {
      // Solo actualizar si hay notificaciones con "Archivado"
      const tieneArchivados = notificaciones.some(n => n.tipo === "Archivado");
      if (tieneArchivados) {
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
      
      // Mostrar las notificaciones "Archivado" después de 1 hora
      if (n.tipo === "Archivado" && n.updated_at) {
        const horaRecordar = new Date(n.updated_at).getTime() + (60 * 60 * 1000); // 1 hora
        return Date.now() >= horaRecordar;
      }
      
      return false;
    }).length;
    
    onUpdatePendientes(pendientes);
  }, [userNotis, onUpdatePendientes, notificaciones.length, userId]);

  // Marcar como leída
  const marcarComoLeida = async (id: string, n: notificationsInterface) => {
    await PutNotificacionContext(id, { ...n, tipo: "Leido" });
  };

  // Recordar más tarde
  const recordarMasTarde = async (id: string, n: notificationsInterface) => {
    try {
      await PutNotificacionContext(id, { ...n, tipo: "Archivado" });
    } catch (error) {
      console.error("Error al marcar como 'Archivado':", error);
    }
  };

  // Eliminar
  const eliminar = async (id: string) => {
    await DeleteNotificacionContext(id);
  };

  // Marcar todas como leídas
  const marcarTodasComoLeidas = async () => {
    const pendientes = notificacionesFiltradas.filter((n) => n.tipo === "Pendiente");
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

  // Filtrar notificaciones según tab y categoría
  const notificacionesFiltradas = userNotis.filter((n) => {
    // Filtro por tab
    if (tabActiva === "no-leidas") {
      const esPendiente = n.tipo === "Pendiente";
      const esArchivadoVencido = n.tipo === "Archivado" && n.updated_at && 
        (Date.now() >= new Date(n.updated_at).getTime() + (60 * 60 * 1000));
      if (!esPendiente && !esArchivadoVencido) return false;
    } else if (tabActiva === "archivadas") {
      if (n.tipo !== "Leido") return false;
    }
    // tabActiva === "todas" no filtra por tipo

    // Filtro por categoría
    if (categoriaFiltro !== "todas" && n.categoria !== categoriaFiltro) {
      return false;
    }

    return true;
  });

  // Ordenar por prioridad y fecha
  const notificacionesOrdenadas = notificacionesFiltradas.sort((a, b) => {
    // Primero por prioridad
    const prioridadOrden: Record<string, number> = { urgente: 0, alta: 1, media: 2, baja: 3 };
    const prioA = prioridadOrden[a.prioridad || "media"] ?? 2;
    const prioB = prioridadOrden[b.prioridad || "media"] ?? 2;
    if (prioA !== prioB) return prioA - prioB;
    
    // Luego por fecha (más reciente primero)
    return new Date(b.created_at ?? "").getTime() - new Date(a.created_at ?? "").getTime();
  });

  return (
    <div
      ref={panelRef}
      className="absolute right-0 mt-2 w-96 max-h-[600px] bg-white rounded-xl shadow-lg border z-50 flex flex-col"
      style={{ top: "100%", minWidth: "400px" }}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b">
        <h2 className="font-bold text-lg">Notificaciones</h2>
        <div className="flex gap-2 items-center">
          {notificacionesFiltradas.filter(n => n.tipo === "Pendiente").length > 0 && (
            <button
              onClick={marcarTodasComoLeidas}
              className="text-xs text-blue-600 hover:underline"
              title="Marcar todas como leídas"
            >
              ✓ Todas
            </button>
          )}
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-full text-xl">
            ✕
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b">
        <button
          onClick={() => setTabActiva("no-leidas")}
          className={`flex-1 py-2 text-sm font-medium ${
            tabActiva === "no-leidas"
              ? "border-b-2 border-blue-600 text-blue-600"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          No leídas ({userNotis.filter(n => n.tipo === "Pendiente" || (n.tipo === "Archivado" && n.updated_at && Date.now() >= new Date(n.updated_at).getTime() + (60 * 60 * 1000))).length})
        </button>
        <button
          onClick={() => setTabActiva("todas")}
          className={`flex-1 py-2 text-sm font-medium ${
            tabActiva === "todas"
              ? "border-b-2 border-blue-600 text-blue-600"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          Todas ({userNotis.length})
        </button>
        <button
          onClick={() => setTabActiva("archivadas")}
          className={`flex-1 py-2 text-sm font-medium ${
            tabActiva === "archivadas"
              ? "border-b-2 border-blue-600 text-blue-600"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          Leídas ({userNotis.filter(n => n.tipo === "Leido").length})
        </button>
      </div>

      {/* Filtros por categoría */}
      <div className="px-4 py-2 border-b bg-gray-50">
        <select
          value={categoriaFiltro}
          onChange={(e) => setCategoriaFiltro(e.target.value as CategoriaType)}
          className="w-full text-xs border rounded px-2 py-1"
        >
          <option value="todas">🔍 Todas las categorías</option>
          <option value="kardex">📦 Kardex</option>
          <option value="requisicion">📋 Requisiciones</option>
          <option value="producto">🏷️ Productos</option>
          <option value="compra">🛒 Compras</option>
          <option value="proveedor">🏢 Proveedores</option>
          <option value="sistema">⚙️ Sistema</option>
        </select>
      </div>

      {/* Lista de notificaciones */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {notificacionesOrdenadas.length === 0 ? (
          <div className="text-gray-500 text-center py-8">
            {tabActiva === "no-leidas" && "No tienes notificaciones sin leer."}
            {tabActiva === "archivadas" && "No hay notificaciones archivadas."}
            {tabActiva === "todas" && categoriaFiltro !== "todas" && `No hay notificaciones de ${categoriaFiltro}.`}
            {tabActiva === "todas" && categoriaFiltro === "todas" && "No tienes notificaciones."}
          </div>
        ) : (
          notificacionesOrdenadas.map((n) => (
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
