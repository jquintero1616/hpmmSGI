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
}
export interface NewEmploye extends Omit<Employe, "id_employes"> {}