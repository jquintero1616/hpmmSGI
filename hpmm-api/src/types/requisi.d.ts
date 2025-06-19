
export interface Requisi {
  id_requisi: string;
  id_employes?: string;
  fecha: Date;
  estado?: "Pendiente" | "Aprobado" | "Rechazado" | "Cancelado";
  employee_name: string;
  descripcion: string;
  created_at?: Date;
  updated_at?: Date;
}

export interface RequisiFilter {
  limit?: number;
  offset?: number;
  statuses?: ("Aprobado" | "Rechazado" | "Pendiente" | "Cancelado")[];
}

export interface RequisiDetail {
  id_requisi: string;
  id_employes?: string;
  id_product: string;
  employee_name?: string;
  // - nuevos
  unit_id?: string;
  unit_name?: string;
  
  descripcion: string;
  cantidad: number;
  fecha: Date;
  estado?: "Pendiente" | "Aprobado" | "Rechazado" | "Cancelado";
  created_at?: Date;
  updated_at?: Date;
}