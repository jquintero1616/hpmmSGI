export interface Subdireccion {
  id_subdireccion: string;
  id_direction: string;
  nombre: string;
  estado: boolean;
  created_at?: Date;
  updated_at?: Date;
}
export interface NewSubdireccion extends Omit<Subdireccion, "id_subdireccion"> {}