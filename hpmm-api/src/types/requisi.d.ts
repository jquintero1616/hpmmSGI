
export interface Requisi {
  id_requisi: string;
  id_employes?: string;
  fecha: Date;
  estado?: "Pendiente" | "Aprobado" | "Rechazado";
  employee_name: string;
  created_at?: Date;
  updated_at?: Date;
}
export interface NewRequisi extends Omit<Requisi, "id_requisi"> {}

export interface RequisiFilter {
  limit?: number;
  offset?: number;
  statuses?: ("Aprobado" | "Rechazado" | "Pendiente" )[];
}

export interface RequisiDetail {
  id_requisi: string;
  id_employes?: string;
  id_product: string;
  employee_name?: string;
  cantidad: number;
  fecha: Date;
  estado?: "Pendiente" | "Aprobado" | "Rechazado";
  created_at?: Date;
  updated_at?: Date;
}