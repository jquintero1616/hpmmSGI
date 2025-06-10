
export interface Requisi {
  id_requisi: string;
  id_employes?: string;
  fecha: Date;
  estado?: "Pendiente" | "Aprobado" | "Rechazado";
  created_at?: Date;
  updated_at?: Date;
}
export interface NewRequisi extends Omit<Requisi, "id_requisi"> {}