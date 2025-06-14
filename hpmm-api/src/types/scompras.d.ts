
export interface Scompras {
  id_scompra: string;
  id_requisi: string;
  estado: "Pendiente" | "Comprado" | "Cancelado";
  created_at?: Date;
  updated_at?: Date;
}
export interface NewsScompras extends Omit<Scompras, "id_scompra"> {}