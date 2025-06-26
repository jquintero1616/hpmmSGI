
export interface RequisiInterface {
  id_requisi: string;
  id_employes?: string;
  id_product: string;
  stock_actual: string;
  fecha: Date;
  descripcion: string;
  estado?: "Pendiente" | "Aprobado" | "Rechazado" | "Cancelado";
  cantidad: number;
  employee_name: string;
  created_at?: Date;
  updated_at?: Date;
}


export interface RequisiDetail {
  id_requisi: string;
  id_employes?: string;
  id_product: string;
  id_requi_x_product?: string;
  // nuevos
  unit_id?: string;
  unit_name?: string;
  descripcion:  string;
  //
  product_name?: string;
  employee_name?: string;
  cantidad: number;

  fecha: Date;
  estado?: "Pendiente" | "Aprobado" | "Rechazado" | "Cancelado";
  created_at?: Date;
  updated_at?: Date;
}