export interface EmployesInterface {
  id_employes: string;   
     
  id_direction: string;
  id_subdireccion: string;
  id_units: string;
  id_user: string;

  usuario: string;
  unidad: string;
  subdireccion: string;
  direccion: string;
  
  name: string;
  email: string;
  telefono: string;
  puesto: string;
  estado: boolean;         
  created_at?: string;
  updated_at?: string;
}