export interface Roles {
  id_rol: string;
  name: string;
  descripcion: string;
  estado: boolean;
  created_at?: Date;
  updated_at?: Date;
}
  export interface NewRol extends Omit<Roles, "id_rol"> {}