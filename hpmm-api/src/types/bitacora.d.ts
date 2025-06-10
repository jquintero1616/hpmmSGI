export interface Bitacora {
  id: number;
  id_usuario: string | null;
  nombre_usuario: string | null;
  accion: string;
  tabla_afectada: string;
  registro_id: string;
  valores_anterior: string | null;
  valores_nuevos: string | null;
  fecha_evento: Date;
  ip_origin?: varchar | null;
  descripcion_evento: string | null;
  modulo_afecto: string | null;
  created_at: Date;
  updated_at: Date;
}

// src/types/bitacora.ts
export interface BitacoraOptions {
  tabla: string;
  idColumn: string;
  idParam?: string;
  modulo?: string;
  fields?: string[];
}

export type NewBitacora = Omit<Bitacora, "id" | "created_at" | "updated_at">;
