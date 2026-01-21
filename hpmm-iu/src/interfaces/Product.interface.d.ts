export interface ProductInterface {
  id_product: string;
  id_subcategory: string;
  subcategory_name: string;
  id_category: string;
  category_name: string;
  codigo_objeto: string;
  nombre: string;
  descripcion: string;
  stock_actual: number;
  stock_maximo: number;
  fecha_vencimiento: Date;
  numero_lote: string;
  estado: boolean;
  created_at?: Date;
  updated_at?: Date;
}

export interface ProductDetail {
  id_product: string;
  id_subcategory: string;
  id_category: string;
  subcategory_name: string;
  category_name: string;
  codigo_objeto: string;
  nombre: string;
  descripcion: string;
  stock_actual: number;
  stock_maximo: number;
  fecha_vencimiento: Date;
  numero_lote: string;
  estado: boolean;
  created_at?: Date;
  updated_at?: Date;
}