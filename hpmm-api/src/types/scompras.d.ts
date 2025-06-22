
export interface Scompras {
  id_scompra: string;
  id_requisi: string;

  id_employes: string;
  id_units: string;
  id_product: string;
  cantidad: number;
  nombre_empleado: string;
  nombre_unidad?: string;
  nombre_producto?: string;

  descripcion?: string;

  estado: "Pendiente" | "Comprado" | "Cancelado";
  created_at?: Date;
  updated_at?: Date;
}
export interface NewsScompras extends Omit<Scompras, "id_scompra"> {}