import { KardexDetail } from "../../interfaces/kardex.interface";

export interface kardex {
  id_kardex: string;
  id_product?: string;
  id_shopping?: string;
  id_units_x_pacts?: string;
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
  cantidad: number,
  cantidad_solicitada: number,
  id_scompra: string,
  nombre_producto: string,
  isv: number,
  total: number,
  id_vendedor: string,
  rfid: string
  // nuevos
  descripcion: string;
  fecha_vencimiento: Date;
  numero_lote: string;
  // -----
  estado: boolean;
  create_at: Date;
  update_at: Date;
  id_empleado_solicitud_f: string; // ID del empleado que solicita en el sistema de facturación
}

export interface NewKardex extends Omit<kardex, "id_kardex"> {}

export interface KardexFilter {
  limit?: number;
  offset?: number;
  statuses?: ("Aprobado" | "Rechazado" | "Pendiente" | "Cancelado")[];
}

export interface KardexDetail {
  id_kardex: string;
  id_product: string;
  id_units_x_pacts?: string;
  id_shopping?: string;
  name: string;               // nombre del empleado
  nombre_empleado_sf: string; // nombre del empleado que registró en el sistema
  fecha_movimiento: Date;
  tipo_movimiento: "Entrada" | "Salida";
  tipo_solicitud: "Requisicion" | "Pacto";
  numero_factura: string;
  cantidad: number;
  precio_unitario: number;
  nombre: string;             // nombre del producto
  descripcion: string;
  stock_actual: number;
  stock_maximo: number;
  fecha_vencimiento: Date;
  numero_lote: string;
  tipo: "Aprobado" | "Rechazado" | "Pendiente"  | "Cancelado";
}

const [itemToEdit, setItemToEdit] = useState<KardexDetail | null>(null);