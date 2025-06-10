export interface PactInterface {
  id_pacts: string;
  name: string;
  tipo?: "Diario" | "Quincenal" | "Mensual" | "Trimestral";
  estado: boolean;
  created_at: Date;
  updated_at: Date;
}
