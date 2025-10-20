export interface Shopping {
  id_shopping: string;
  id_scompra: string;
  id_vendedor: string;
  fecha_compra: Date;
  numero_cotizacion: string;
  numero_pedido: string;
  nombre_unidad: string;
  lugar_entrega: string;
  shopping_order_id: string;
  precio_unitario: number;        
  cantidad_comprada: number;

  tipo_compra: string;
  financiamiento: string;
  
  ISV: boolean;
  total: number;
  cantidad_solicitada: number;    
  nombre_producto: string;        
  estado: boolean;
  id_product: string;
  vendedor_nombre?: string;       // Este viene del JOIN, debe ser opcional
  created_at?: Date;
  updated_at?: Date;
}
export interface NewShopping extends Omit<Shopping, "id_shopping"> {}