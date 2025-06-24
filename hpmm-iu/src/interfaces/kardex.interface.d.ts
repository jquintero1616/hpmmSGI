export interface kardexInterface {
  id_kardex: string;
  id_scompra?: string; // ID de la orden de compra
  id_vendedor?: string; // ID del vendedor
  fecha_compra?: Date; // Fecha de la orden de compra
  shopping_order_id?: string; // ID de la orden de compra
  numero_cotizacion?: string; // Número de la cotización
  numero_pedido?: string; // Número del pedido
  id_product?: string;
  id_shopping: string;
  anio_creacion: string;
  tipo_movimiento: "Entrada" | "Salida";
  fecha_movimiento: Date;
  numero_factura: string;
  cantidad: number;
  precio_unitario: number;
  tipo_solicitud: "Requisicion" | "Pacto";
  requisicion_numero: string;
  tipo: "Aprobado" | "Rechazado" | "Pendiente" | "Cancelado";
  observacion: string;
  // nuevos
  descripcion: string;
  fecha_vencimiento: Date;
  numero_lote: string;
  // -----
  estado: boolean;
  created_at: Date;
  updated_at: Date;
}

export interface KardexEdit {
  id_scompra: string;
  id_vendedor: string;
  fecha_compra: Date;
  shopping_order_id: string;
  numero_cotizacion: string;
  numero_pedido: string;
}

export interface KardexDetail extends ShoppingInterface {
  id_kardex: string;
  id_product?: string;  
  shopping_order_id?: string; // ID de la orden de compra
  cantidad_comprada: number; // Cantidad comprada
  total: number; // Total de la compra
  vendedor_nombre?: string; // Nombre del vendedor
  fecha_compra: Date; // Fecha de la compra
  id_shopping: string; // ID de la orden de compra
  estado: boolean; // Estado del movimiento
  id_supplier?: string; // ID del proveedor
  nombre: string      // ID del producto
  id_units_x_pacts: string; // ID de las unidades por pacto
  nombre_unidad: string;         // nombre de la unidad
  nombre_de_factura: string; // ID de la orden de compra
  name: string;               // nombre del empleado
  fecha_movimiento: Date;
  nombre_empleado_sf: string; // nombre del empleado en el sistema
  nombre_empleado_sc: string; // nombre del empleado en el sistema de compras
  username: string;            // nombre del usuario que hizo el movimiento
  tipo_movimiento: "Entrada" | "Salida";
  tipo_solicitud: "Requisicion" | "Pacto";
  nombre_contacto_vendedor: string;          // nombre del vendedor
  numero_factura: string;
  cantidad: number;
  precio_unitario: number;
  nombre_producto: string;             // nombre del producto
  descripcion: string;
  stock_actual: number;
  stock_maximo: number;
  fecha_vencimiento: Date;
  numero_lote: string;
  nombre_proveedor: string; // nombre del proveedor
  tipo: "Aprobado" | "Rechazado" | "Pendiente" | "Cancelado";
  created_at: Date;
  calculado_stock?: number 
  cantidad_recepcionada?: number; // cantidad que se ha recibido en la orden de compra
  observacion: string; // observación del movimiento
  descripcion_producto?: string; // descripción del producto
  RFID?: string; // RFID del producto
}