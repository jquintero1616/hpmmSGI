export interface SubcategoryInterface {
  id_subcategory: string;
  nombre: string;
  subcategory_name: string;
  estado: boolean;
  created_at?: Date;
  updated_at?: Date;
  id_category: string; 
  category_name?: string; 
}

