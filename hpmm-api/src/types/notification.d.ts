
export interface notifications {
  id_noti: string;
  id_user: string;
  id_rol?: string; // Rol del destinatario
  
  // Categorización
  categoria: "kardex" | "requisicion" | "solicitud_compra" | "producto" | "sistema";
  prioridad: "baja" | "media" | "alta" | "urgente";
  
  // Contenido
  titulo: string;
  mensaje: string;
  descripcion_detallada?: string;
  
  // Contexto para navegación
  entidad_tipo?: string; // "kardex", "requisicion", etc.
  entidad_id?: string;
  accion_requerida?: "aprobar" | "revisar" | "informativo";
  
  // Metadata del creador
  creador_id?: string;
  creador_nombre?: string;
  
  // Estado
  tipo: "Pendiente" | "Leido" | "Archivado" | "Accionado";
  estado: boolean;
  created_at?: Date;
  updated_at?: Date;
  leido_at?: Date;
}

export interface NewNoti extends Omit<notifications, "id_noti"> {}
