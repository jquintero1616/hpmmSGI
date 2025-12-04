export type TipoDonante = "Persona" | "Empresa" | "ONG" | "Gobierno" | "Otro";

export interface Donante {
  id_donante: string;
  nombre: string;
  tipo_donante: TipoDonante;
  numero_contacto?: string;
  correo?: string;
  direccion?: string;
  rtn?: string;
  notas?: string;
  estado: boolean;
  created_at?: Date;
  updated_at?: Date;
}

export interface NewDonante extends Omit<Donante, "id_donante"> {}

export interface DonanteFilter {
  limit?: number;
  offset?: number;
  tipo_donante?: TipoDonante;
  estado?: boolean;
}
