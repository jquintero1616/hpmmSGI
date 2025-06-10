export interface Direction {
  id_direction: string;
  nombre: string;
  estado: boolean;
  created_at?: Date;
  updated_at?: Date;
}
export interface NewDirection extends Omit<Direction, "id_direction"> {}

