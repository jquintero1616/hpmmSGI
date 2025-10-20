export interface vendedorInterface {
  id_vendedor: string;
  id_supplier: string;
  nombre_contacto: string;
  supplier_name?: string;
  correo: string;
  telefono: string;
  identidad: string;
  estado: boolean;
  created_at?: Date;
  updated_at?: Date;
}