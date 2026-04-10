/**
 * Configuración centralizada de destinatarios de notificaciones.
 *
 * Para cambiar quién recibe cada notificación basta con editar este archivo.
 * Los nombres de roles deben coincidir EXACTAMENTE con la columna `name`
 * de la tabla `roles` en la base de datos.
 */

// ─── Roles del sistema (deben coincidir con BD) ────────────────────────
export const ROLES = {
  ADMIN: "Administrador",
  SUPER_ADMIN: "Super Admin",
  JEFE_ALMACEN: "Jefe Almacen",
  TECNICO_ALMACEN: "Tecnico Almacen",
  JEFE_LOGISTICA: "Jefe de Logistica",
} as const;

// ─── Destinatarios por acción ──────────────────────────────────────────

/** KARDEX */
export const KARDEX_DESTINATARIOS = {
  /** Cuando un técnico crea una entrada/salida pendiente de aprobación */
  CREADO: [ROLES.JEFE_ALMACEN],
  /** Cuando se aprueba → notificar al creador (usuario específico) + estos roles */
  APROBADO_ROLES: [ROLES.ADMIN],
  /** Cuando se rechaza solo se notifica al creador (usuario específico) */
} as const;

/** REQUISICIONES */
export const REQUISICION_DESTINATARIOS = {
  /** Cuando una unidad crea una requisición nueva */
  CREADA: [ROLES.ADMIN, ROLES.SUPER_ADMIN, ROLES.JEFE_ALMACEN],
  /** Cuando se aprueba la requisición */
  APROBADA_ROLES: [ROLES.JEFE_LOGISTICA, ROLES.JEFE_ALMACEN],
  /** Cuando se rechaza solo se notifica al creador (usuario específico) */
} as const;

/** SOLICITUDES DE COMPRA */
export const SCOMPRA_DESTINATARIOS = {
  /** Cuando se genera una solicitud de compra */
  CREADA: [ROLES.ADMIN, ROLES.JEFE_LOGISTICA],
  /** Cuando se marca como comprada */
  COMPRADA_ROLES: [ROLES.JEFE_ALMACEN, ROLES.ADMIN],
  /** Cuando se cancela */
  CANCELADA_ROLES: [ROLES.JEFE_ALMACEN],
} as const;

/** PRODUCTOS (alertas) */
export const PRODUCTO_DESTINATARIOS = {
  /** Stock por debajo del mínimo */
  STOCK_CRITICO: [ROLES.JEFE_ALMACEN, ROLES.JEFE_LOGISTICA, ROLES.ADMIN],
} as const;
