export interface Unit {
  id_units: string;
  id_subdireccion: string;
  name: string;
  estado: boolean;
  created_at?: Date;
  updated_at?: Date;
}
export interface NewUnit extends Omit<Unit, "id_units"> {}
