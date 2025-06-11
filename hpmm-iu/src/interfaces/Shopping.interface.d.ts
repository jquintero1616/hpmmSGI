export interface ShoppingInterface {
  id_shopping: string;
  id_scompra: string;
  id_vendedor: string;
  vendedor_nombre?: string; // Optional, as it may not be present in all contexts
  fecha_compra: Date;
  shopping_order_id: string;
  total: number;
  estado: boolean;
  created_at?: Date;
  updated_at?: Date;
}