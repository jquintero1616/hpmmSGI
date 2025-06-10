export interface subcategory {
  id_subcategory: string;
  id_category: string;
  nombre: string;
  estado: boolean;
  created_at?: Date;
  updated_at?: Date;
}
export interface NewSubcategory extends Omit<subcategory, "id_subcategory"> {}