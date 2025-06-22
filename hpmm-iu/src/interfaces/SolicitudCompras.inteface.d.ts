export interface ScomprasInterface {
  id_scompra: string;
  id_requisi: string;
  id_employes: string;
  id_units: string;
  id_product: string;
  nombre_empleado: string;
  nombre_unidad?: string;
  nombre_producto?: string;
  descripcion?: string;
  
  cantidad: number;
  estado?: "Pendiente" | "Comprado" | "Cancelado";
  created_at?: Date;
  updated_at?: Date;
}