export interface userInterface {
  id_user: string;
  username: string;
  email: string;
  password: string;
  estado: boolean;
  id_rol: string;
  role_name?: string;
  created_at?: Date;
  updated_at?: Date;
}
