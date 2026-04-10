import { notificationsInterface } from "../interfaces/Notifaciones.interface";

// ============================================
// CONFIGURACIÓN DE DESTINATARIOS POR ACCIÓN
// ============================================
const DESTINATARIOS_POR_ACCION: Record<string, string[]> = {
  // KARDEX
  "kardex_entrada_creada": ["Jefe Almacen"],
  "kardex_salida_creada": ["Jefe Almacen"],
  "kardex_aprobado": ["Tecnico Almacen", "Administrador"],
  "kardex_rechazado": ["Tecnico Almacen"],
  
  // REQUISICIONES
  "requisicion_creada": ["Administrador", "Jefe de Logistica"],
  "requisicion_aprobada": ["Usuario", "Jefe Almacen"],
  "requisicion_rechazada": ["Usuario"],
  
  // SOLICITUDES DE COMPRA
  "solicitud_compra_creada": ["Administrador"],
  "solicitud_compra_aprobada": ["Jefe de Logistica", "Jefe Almacen"],
  
  // PRODUCTOS
  "producto_stock_critico": ["Jefe Almacen", "Jefe de Logistica", "Administrador"],
  "producto_proximo_vencer": ["Jefe Almacen", "Administrador"],
  "producto_vencido": ["Jefe Almacen"],
};

// ============================================
// CONFIGURACIÓN DE NOTIFICACIONES POR TIPO
// ============================================
interface ConfigNotificacion {
  categoria: notificationsInterface["categoria"];
  prioridad: notificationsInterface["prioridad"];
  accion_requerida?: notificationsInterface["accion_requerida"];
  titulo: string;
  mensajeTemplate: (datos: any) => string;
}

const CONFIG_NOTIFICACIONES: Record<string, ConfigNotificacion> = {
  // ============ KARDEX ============
  kardex_entrada_creada: {
    categoria: "kardex",
    prioridad: "media",
    accion_requerida: "aprobar",
    titulo: "Nueva entrada de Kardex",
    mensajeTemplate: (d) => 
      `${d.creador} registró una entrada de ${d.producto} (Cant: ${d.cantidad}). Factura: ${d.factura}`,
  },
  kardex_salida_creada: {
    categoria: "kardex",
    prioridad: "media",
    accion_requerida: "aprobar",
    titulo: "Nueva salida de Kardex",
    mensajeTemplate: (d) => 
      `${d.creador} registró una salida de ${d.producto} (Cant: ${d.cantidad}). Factura: ${d.factura}`,
  },
  kardex_aprobado: {
    categoria: "kardex",
    prioridad: "baja",
    accion_requerida: "informativo",
    titulo: "Kardex aprobado",
    mensajeTemplate: (d) => 
      `Tu registro de ${d.tipo_movimiento} para ${d.producto} fue aprobado por ${d.aprobador}`,
  },
  kardex_rechazado: {
    categoria: "kardex",
    prioridad: "alta",
    accion_requerida: "revisar",
    titulo: "Kardex rechazado",
    mensajeTemplate: (d) => 
      `Tu registro de ${d.tipo_movimiento} para ${d.producto} fue rechazado. Motivo: ${d.motivo || "No especificado"}`,
  },
  
  // ============ REQUISICIONES ============
  requisicion_creada: {
    categoria: "requisicion",
    prioridad: "alta",
    accion_requerida: "aprobar",
    titulo: "Nueva requisición",
    mensajeTemplate: (d) => 
      `${d.creador} creó una requisición con ${d.cantidad_productos} producto(s). Unidad: ${d.unidad}`,
  },
  requisicion_aprobada: {
    categoria: "requisicion",
    prioridad: "media",
    accion_requerida: "informativo",
    titulo: "Requisición aprobada",
    mensajeTemplate: (d) => 
      `Tu requisición ${d.numero_requisicion} fue aprobada por ${d.aprobador}`,
  },
  requisicion_rechazada: {
    categoria: "requisicion",
    prioridad: "alta",
    accion_requerida: "revisar",
    titulo: "Requisición rechazada",
    mensajeTemplate: (d) => 
      `Tu requisición ${d.numero_requisicion} fue rechazada. Motivo: ${d.motivo || "No especificado"}`,
  },
  
  // ============ SOLICITUDES DE COMPRA ============
  solicitud_compra_creada: {
    categoria: "solicitud_compra",
    prioridad: "alta",
    accion_requerida: "aprobar",
    titulo: "Nueva solicitud de compra",
    mensajeTemplate: (d) => 
      `${d.creador} creó una solicitud de compra por L.${d.total}`,
  },
  solicitud_compra_aprobada: {
    categoria: "solicitud_compra",
    prioridad: "media",
    accion_requerida: "informativo",
    titulo: "Solicitud de compra aprobada",
    mensajeTemplate: (d) => 
      `La solicitud de compra ${d.numero} fue aprobada`,
  },
  
  // ============ PRODUCTOS ============
  producto_stock_critico: {
    categoria: "producto",
    prioridad: "urgente",
    accion_requerida: "revisar",
    titulo: "Stock crítico",
    mensajeTemplate: (d) => 
      `⚠️ ${d.producto} tiene stock crítico: ${d.stock_actual}/${d.stock_maximo} (${d.porcentaje}%)`,
  },
  producto_proximo_vencer: {
    categoria: "producto",
    prioridad: "alta",
    accion_requerida: "revisar",
    titulo: "Producto próximo a vencer",
    mensajeTemplate: (d) => 
      `⏰ ${d.producto} vence el ${d.fecha_vencimiento} (${d.dias_restantes} días)`,
  },
  producto_vencido: {
    categoria: "producto",
    prioridad: "urgente",
    accion_requerida: "revisar",
    titulo: "Producto vencido",
    mensajeTemplate: (d) => 
      `🚨 ${d.producto} venció el ${d.fecha_vencimiento}. Stock: ${d.stock_actual}`,
  },
};

// ============================================
// FUNCIONES PÚBLICAS
// ============================================

/**
 * Genera una notificación basada en el tipo de acción
 */
export const generarNotificacion = (
  tipoAccion: string,
  datos: any,
  creadorId: string,
  creadorNombre: string
): Partial<notificationsInterface> => {
  const config = CONFIG_NOTIFICACIONES[tipoAccion];
  
  if (!config) {
    console.error(`Tipo de acción no encontrado: ${tipoAccion}`);
    return {};
  }

  return {
    categoria: config.categoria,
    prioridad: config.prioridad,
    titulo: config.titulo,
    mensaje: config.mensajeTemplate(datos),
    accion_requerida: config.accion_requerida,
    entidad_tipo: datos.entidad_tipo || config.categoria,
    entidad_id: datos.entidad_id || datos.id,
    creador_id: creadorId,
    creador_nombre: creadorNombre,
    tipo: "Pendiente",
    estado: true,
  };
};

/**
 * Obtiene los roles que deben recibir la notificación
 */
export const obtenerDestinatarios = (tipoAccion: string): string[] => {
  return DESTINATARIOS_POR_ACCION[tipoAccion] || [];
};

/**
 * Helper para obtener icono según categoría
 */
export const obtenerIconoCategoria = (categoria: string): string => {
  const iconos: Record<string, string> = {
    kardex: "📦",
    requisicion: "📋",
    solicitud_compra: "🛒",
    producto: "⚠️",
    sistema: "ℹ️",
  };
  return iconos[categoria] || "🔔";
};

/**
 * Helper para obtener color según prioridad
 */
export const obtenerColorPrioridad = (prioridad: string): string => {
  const colores: Record<string, string> = {
    baja: "bg-gray-100 text-gray-700 border-gray-300",
    media: "bg-blue-50 text-blue-700 border-blue-300",
    alta: "bg-orange-50 text-orange-700 border-orange-300",
    urgente: "bg-red-50 text-red-700 border-red-300",
  };
  return colores[prioridad] || colores.media;
};

/**
 * Configuración para toasts según prioridad
 */
export const obtenerConfigToast = (prioridad: string) => {
  const configs: Record<string, any> = {
    baja: {
      autoClose: 4000,
      type: "default" as const,
    },
    media: {
      autoClose: 6000,
      type: "default" as const,
    },
    alta: {
      autoClose: 8000,
      type: "default" as const,
    },
    urgente: {
      autoClose: false,
      type: "default" as const,
    },
  };
  return configs[prioridad] || configs.media;
};

// ============================================
// FUNCIONES LEGACY (Retrocompatibilidad)
// ============================================
export interface CreateNotificationParams {
  id_user: string;
  mensaje: string;
  tipo_evento?: 'requisicion_pendiente' | 'requisicion_aprobada' | 'requisicion_rechazada' | 'requisicion_cancelada';
  id_referencia?: string;
  datos_adicionales?: any;
}

export const createNotificationData = ({
  id_user,
  mensaje,
}: CreateNotificationParams): Partial<notificationsInterface> => {
  return {
    id_user,
    mensaje,
    titulo: "Notificación",
    categoria: "sistema",
    prioridad: "media",
    tipo: "Pendiente",
    estado: true,
    created_at: new Date(),
  };
};

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
