export interface UnitPact {
  id_units_x_pacts: string;
  id_units?: string;
  id_pacts?: string;
  created_at?: Date;
  updated_at?: Date;
}
export interface NewUnitPact extends Omit<UnitPact, "id_units_x_pacts"> {}