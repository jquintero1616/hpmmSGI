import { useEffect, useRef, useCallback } from "react";
import { toast } from "react-toastify";
import { useAuth } from "../../hooks/use.Auth";
import { useNotificacion } from "../../hooks/use.Notificacion";
import { obtenerConfigToast } from "../../helpers/notificacionHelper";
import {
  PackageCheck,
  FileText,
  ShoppingCart,
  PackageSearch,
  Settings,
  Bell,
  Check,
} from "lucide-react";

const STORAGE_KEY = "hpmm_toasts_mostrados";

// Icono + color según categoría
const iconosPorCategoria: Record<string, { icon: React.ElementType; color: string }> = {
  kardex:           { icon: PackageCheck,  color: "text-blue-600" },
  requisicion:      { icon: FileText,      color: "text-purple-600" },
  solicitud_compra: { icon: ShoppingCart,  color: "text-green-600" },
  producto:         { icon: PackageSearch, color: "text-amber-600" },
  sistema:          { icon: Settings,      color: "text-gray-500" },
};

const defaultIcono = { icon: Bell, color: "text-gray-500" };

/** IDs de notificaciones que ya se mostraron como toast */
const obtenerMostrados = (): string[] => {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
  } catch {
    return [];
  }
};

const guardarMostrado = (id: string) => {
  const lista = obtenerMostrados();
  if (!lista.includes(id)) {
    lista.push(id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(lista));
  }
};

const limpiarMostrados = (idsPendientes: string[]) => {
  const lista = obtenerMostrados().filter((id) => idsPendientes.includes(id));
  localStorage.setItem(STORAGE_KEY, JSON.stringify(lista));
};

const NotificacionesToasty = () => {
  const { userId } = useAuth();
  const { notificaciones, PutNotificacionContext, GetNotificacionesContext } = useNotificacion();
  const inicializado = useRef(false);

  useEffect(() => {
    GetNotificacionesContext();
  }, [GetNotificacionesContext]);

  const mostrarToast = useCallback(
    (noti: typeof notificaciones[number]) => {
      const config = obtenerConfigToast(noti.prioridad || "media");
      const { icon: Icono, color } =
        iconosPorCategoria[noti.categoria || "sistema"] || defaultIcono;

      toast(
        <div className="flex items-start gap-3">
          <Icono className={`w-5 h-5 mt-0.5 flex-shrink-0 ${color}`} />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 leading-tight">
              {noti.titulo || "Notificación"}
            </p>
            <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">{noti.mensaje}</p>
            <button
              className="mt-1.5 inline-flex items-center gap-1 text-xs text-blue-600 hover:text-blue-800 font-medium"
              onClick={() => {
                PutNotificacionContext(noti.id_noti, { ...noti, tipo: "Leido" });
                toast.dismiss(noti.id_noti);
              }}
            >
              <Check className="w-3.5 h-3.5" /> Marcar como leída
            </button>
          </div>
        </div>,
        {
          toastId: noti.id_noti,
          ...config,
          icon: false,
          closeButton: true,
          style: { padding: "12px 16px" },
          progressStyle: { background: "#3b82f6" },
        }
      );

      guardarMostrado(noti.id_noti);
    },
    [PutNotificacionContext]
  );

  useEffect(() => {
    const pendientes = notificaciones.filter(
      (n) => n.estado && n.id_user === userId && n.tipo === "Pendiente"
    );

    const idsPendientes = pendientes.map((n) => n.id_noti);
    const yaMostrados = obtenerMostrados();

    // Primera carga: registrar las pendientes existentes sin mostrar toast
    if (!inicializado.current) {
      inicializado.current = true;
      idsPendientes.forEach(guardarMostrado);
      limpiarMostrados(idsPendientes);
      return;
    }

    // Mostrar toast solo para notificaciones NUEVAS (no vistas antes)
    pendientes.forEach((noti) => {
      if (!yaMostrados.includes(noti.id_noti) && !toast.isActive(noti.id_noti)) {
        mostrarToast(noti);
      }
    });

    // Limpiar IDs de notificaciones que ya no son pendientes
    limpiarMostrados(idsPendientes);
  }, [notificaciones, userId, mostrarToast]);

  return null;
};

export default NotificacionesToasty;