import { KardexDetail } from "../../interfaces/kardex.interface";

export interface kardex {
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
  create_at: Date;
  update_at: Date;
  usuario_ultimo_movimiento?: string;
  fecha_ultimo_movimiento?: Date;
}

export interface NewKardex extends Omit<kardex, "id_kardex"> {}

export interface KardexFilter {
  limit?: number;
  offset?: number;
  statuses?: ("Aprobado" | "Rechazado" | "Pendiente" | "Cancelado")[];
}

export interface KardexDetail {
  id_kardex: string;
  name: string;               // nombre del empleado
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