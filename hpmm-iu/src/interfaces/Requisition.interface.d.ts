
export interface RequisiInterface {
  id_requisi: string;
  id_employes?: string;
  fecha: Date;
  estado?: "Pendiente" | "Aprobado" | "Rechazado";
  cantidad: number;
  employee_name: string;
  created_at?: Date;
  updated_at?: Date;
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