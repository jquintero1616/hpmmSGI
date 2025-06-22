export interface Shopping {
  id_shopping: string;
  id_scompra: string;
  id_vendedor: string;
  fecha_compra: Date;

  numero_cotizacion: string;
  numero_pedido: string;
  nombre_unidad: string;
  lugar_entrega?: string;
  ISV: boolean
  
  vendedor_nombre: string;
  shopping_order_id: string;
  total: number;
  estado: boolean;
  created_at?: Date;
  updated_at?: Date;
}
export interface NewShopping extends Omit<Shopping, "id_shopping"> {}