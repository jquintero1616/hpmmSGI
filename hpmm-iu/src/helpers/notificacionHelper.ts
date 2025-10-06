import { notificationsInterface } from "../interfaces/Notifaciones.interface";

export interface CreateNotificationParams {
  id_user: string;
  mensaje: string;
  tipo_evento: 'requisicion_pendiente' | 'requisicion_aprobada' | 'requisicion_rechazada' | 'requisicion_cancelada';
  id_referencia?: string; // ID de la requisición o entidad relacionada
  datos_adicionales?: any;
}

export const createNotificationData = ({
  id_user,
  mensaje,
}: CreateNotificationParams): Partial<notificationsInterface> => {
  return {
    id_user,
    mensaje,
    tipo: "Pendiente",
    estado: true,
    created_at: new Date(),
  };
};

// Mensajes predefinidos para diferentes tipos de notificaciones
export const getNotificationMessage = (
  tipo_evento: CreateNotificationParams['tipo_evento'],
  datosAdicionales?: any
) => {
  switch (tipo_evento) {
    case 'requisicion_pendiente':
      return `Nueva requisición pendiente de aprobación: ${datosAdicionales?.producto || 'Producto'} (Cantidad: ${datosAdicionales?.cantidad || 'N/A'})`;
    
    case 'requisicion_aprobada':
      return `Tu requisición ha sido APROBADA: ${datosAdicionales?.producto || 'Producto'} (Cantidad: ${datosAdicionales?.cantidad || 'N/A'})`;
    
    case 'requisicion_rechazada':
      return `Tu requisición ha sido RECHAZADA: ${datosAdicionales?.producto || 'Producto'} (Cantidad: ${datosAdicionales?.cantidad || 'N/A'})`;
    
    case 'requisicion_cancelada':
      return `Tu requisición ha sido CANCELADA: ${datosAdicionales?.producto || 'Producto'} (Cantidad: ${datosAdicionales?.cantidad || 'N/A'})`;
    
    default:
      return 'Nueva notificación disponible';
  }
};
