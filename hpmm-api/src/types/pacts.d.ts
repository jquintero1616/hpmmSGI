export interface Pact {
  id_pacts: string;
  name: string;
  tipo: "Diario" | "Quincenal" | "Mensual" | "Trimestral";
  estado: boolean;
  create_at: Date;
  update_at: Date;
}

export interface NewPact extends Omit<Pact, "id_pacts"> {}