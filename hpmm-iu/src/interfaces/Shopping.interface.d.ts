import { RequisiDetail } from "./Requisition.interface";

export interface ShoppingInterface extends Partial<RequisiDetail> {
  id_shopping: string;
  cantidad_recepcionada?: number;
  id_scompra: string;
  id_vendedor: string;
  vendedor_nombre?: string; 
  fecha_compra: Date | string;
  shopping_order_id: string;
  numero_cotizacion: string;
  numero_pedido: string;
  nombre_producto: string;
  nombre_unidad: string;
  lugar_entrega?: string;
  cantidad_comprada: number;
  precio_unitario: number;
  ISV: boolean;
  
  tipo_compra: string;
  financiamiento: string;

  total: number;
  estado: boolean;
  created_at?: Date;
  updated_at?: Date;
  nombre_contacto: string;
  cantidad_solicitada: number;
}

export interface ShoppingEditInterface {
  id_scompra: string;
  id_vendedor: string;
  fecha_compra: string;
  shopping_order_id: string;
  numero_cotizacion: string;
  numero_pedido: string;
}