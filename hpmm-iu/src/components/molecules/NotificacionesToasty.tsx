import { useEffect } from "react";
import { toast } from "react-toastify";
import { useAuth } from "../../hooks/use.Auth";
import { useNotificacion } from "../../hooks/use.Notificacion";
import { obtenerConfigToast, obtenerIconoCategoria } from "../../helpers/notificacionHelper";

const NotificacionesToasty = () => {
  const { userId } = useAuth();
  const { notificaciones, PutNotificacionContext, GetNotificacionesContext } = useNotificacion();

  // Cargar notificaciones al montar el componente
  useEffect(() => {
    GetNotificacionesContext();
  }, [GetNotificacionesContext]);

  useEffect(() => {
    // Filtrar notificaciones activas, pendientes y del usuario actual
    const notificacionesParaMostrar = notificaciones.filter(
      n => n.estado && 
           n.id_user === userId && 
           n.tipo === "Pendiente"
    );

    // Mostrar cada notificación como toast
    notificacionesParaMostrar.forEach(noti => {
      // Verificar si el toast ya existe para evitar duplicados
      if (!toast.isActive(noti.id_noti)) {
        const config = obtenerConfigToast(noti.prioridad || "media");
        const icono = obtenerIconoCategoria(noti.categoria || "sistema");
        
        toast(
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-2xl">{icono}</span>
              <div className="font-bold text-sm">{noti.titulo || "Notificación"}</div>
            </div>
            <div className="text-sm">{noti.mensaje}</div>
            <div className="mt-2 flex gap-2">
              <button
                className="text-xs bg-blue-500 hover:bg-blue-600 text-white px-2 py-1 rounded"
                onClick={() => {
                  PutNotificacionContext(noti.id_noti, { ...noti, tipo: "Leido" });
                  toast.dismiss(noti.id_noti);
                }}
              >
                ✓ Leída
              </button>
              <button
                className="text-xs bg-gray-500 hover:bg-gray-600 text-white px-2 py-1 rounded"
                onClick={() => {
                  toast.dismiss(noti.id_noti);
                }}
              >
                ✕ Cerrar
              </button>
            </div>
          </div>,
          { 
            toastId: noti.id_noti,
            ...config, // Aplica configuración de prioridad (autoClose, type, etc.)
          }
        );
      }
    });
  }, [notificaciones, userId, PutNotificacionContext]);

  return null;
};

export default NotificacionesToasty;