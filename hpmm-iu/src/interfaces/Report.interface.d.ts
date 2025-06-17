
export interface Reportinterface {
  id_report: string;
  tipo?: "Producto Adquirido" | "Consumo" | "Pactos" | "Existencia" | "Vencimientos";
  periodo?: "Semanal" | "Mensual" | "Trimestral" | "Anual";
  fecha: Date;
  estado: boolean;
  created_at?: Date;
  updated_at?: Date;
}