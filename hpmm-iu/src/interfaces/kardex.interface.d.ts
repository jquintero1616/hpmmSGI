export interface kardexInterface {
  id_kardex: string;
  id_product: string;
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
  estado: boolean;
  created_at: Date;
  updated_at: Date;

}

export interface KardexDetail {
  id_kardex: string;
  shopping_order_id: string; // ID de la orden de compra
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
  nombre: string;             // nombre del producto
  descripcion: string;
  stock_actual: number;
  stock_maximo: number;
  fecha_vencimiento: Date;
  numero_lote: string;
  nombre_proveedor: string; // nombre del proveedor
  tipo: "Aprobado" | "Rechazado" | "Pendiente" | "Cancelado";
  created_at: Date;
}