
export interface User {
  id_user: string;   
  username: string;
  email: string;
  password: string;
  id_rol?: string;
  estado?: boolean;
  created_at?: Date;
  updated_at?: Date;


  
}
export interface NewUser extends Omit<User, "id_user"> {}
