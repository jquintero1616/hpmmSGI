export interface Requi_x_Product {
  id_requisi_x_product: string;
  id_requisi?: string;
  id_product?: string;
  cantidad: number;
  created_at?: Date;
  updated_at?: Date;
}
export interface NewRequisiXProduct extends Omit<Requi_x_Product, "id_units_x_pacts"> {}