export interface DetallePactInterface {
  id_units_x_pacts: string;
  name: string;
  id_units?: string;
  id_pacts?: string;
  id_product?: string;
  // names
  nombre: string;
  unit_name: string;
  pact_name: string;
  cantidad?: number;
  created_at?: Date;
  updated_at?: Date;
  estado?: boolean;
}