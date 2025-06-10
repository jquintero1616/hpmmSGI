export interface category {
  id_category: string;
  name: string;
  descripcion: string;
  estado: boolean;
  created_at?: Date;
  updated_at?: Date;
}
export interface NewCategory extends Omit<category, "id_category"> {}