export interface Employe {
  id_employes: string;
  id_user: string;
  id_units: string;
  id_subdireccion: string;
  id_direction: string;
  name: string;
  email: string;
  telefono: string;
  puesto?: string;
  estado: boolean;
  created_at?: Date;
  updated_at?: Date;
  // Campos adicionales del JOIN
  usuario?: string;
  unidad?: string;
  subdireccion?: string;
  direccion?: string;
  role_name?: string;
}
export interface NewEmploye extends Omit<Employe, "id_employes"> {}