export interface ShoppingInterface {
  id_shopping: string;
  id_scompra: string;
  id_vendedor: string;
  vendedor_nombre?: string; // Optional, as it may not be present in all contexts
  fecha_compra: Date;
  shopping_order_id: string;

  numero_cotizacion: string;
  numero_pedido: string;
  nombre_unidad: string;
  lugar_entrega?: string;
  
  total: number;
  estado: boolean;
  created_at?: Date;
  updated_at?: Date;
}