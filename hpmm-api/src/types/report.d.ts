
export interface Report {
  id_report: string;
  tipo?: "Producto Adquirido" | "Consumo" | "Pactos" | "Existencia" | "Vencimientos";
  periodo?: "Semanal" | "Mensual" | "Trimestral" | "Anual";
  fecha: Date;
  estado: boolean;
  created_at?: Date;
  updated_at?: Date;
}
export interface NewReport extends Omit<Report, "id_report"> {}