export interface suppliers {
  id_supplier: string;
  nombre: string;
  numero_contacto?: string;
  correo: Date;
  rtn: string;
  estado: boolean;
  created_at?: Date;
  updated_at?: Date;
}
export interface NewSuppliers extends Omit<suppliers, "id_supplier"> {}