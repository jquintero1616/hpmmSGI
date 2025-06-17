export interface product {
  id_product: string;
  id_subcategory: string;
  nombre: string;
  stock_actual: number;
  stock_maximo: number;
  estado: boolean;
  created_at?: Date;
  updated_at?: Date;
}
export interface NewProduct extends Omit<product, "id_product"> {}

export interface productFilter {
  limit?: number;
  offset?: number;
  statuses?: (boolean | "true" | "false")[];
  search?: string;
}

export interface productDetail {
  
  id_product: string;
  id_subcategory: string;
  id_category: string;
  subcategory_name: string;
  category_name: string;
  nombre: string;
  stock_actual: number;
  stock_maximo: number;
  estado: boolean;
  created_at?: Date;
  updated_at?: Date;
}

const [itemToEdit, setItemToEdit] = useState<ProductDetail | null>(null);