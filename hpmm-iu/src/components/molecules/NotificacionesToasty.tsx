import { useEffect } from "react";
import { toast } from "react-toastify";
import { useAuth } from "../../hooks/use.Auth";
import { useNotificacion } from "../../hooks/use.Notificacion";

const NotificacionesToasty = () => {
  const { userId, roleName } = useAuth();
  const { notificaciones, PutNotificacionContext } = useNotificacion();

  useEffect(() => {
    notificaciones
      .filter(n => n.estado && n.id_user === userId && n.tipo !== "Leido")
      .forEach(noti => {
        toast.info(
          <div>
            <div>{noti.mensaje}</div>
            <div style={{ marginTop: 8 }}>
              <button
                style={{ marginRight: 8 }}
                onClick={() =>
                  PutNotificacionContext(noti.id_noti, { ...noti, tipo: "Pendiente" })
                }
              >
                Recordar más tarde
              </button>
              <button
                onClick={() =>
                  PutNotificacionContext(noti.id_noti, { ...noti, estado: false })
                }
              >
                Cerrar
              </button>
            </div>
          </div>,
          { toastId: noti.id_noti }
        );
      });
  }, [notificaciones, userId, PutNotificacionContext]);

  // Solo notificaciones pendientes y solo para Administrador
  const pendientesNotis = notificaciones.filter(
    n => n.tipo === "Pendiente" && roleName === "Administrador"
  );

  return null;
};

export default NotificacionesToasty;