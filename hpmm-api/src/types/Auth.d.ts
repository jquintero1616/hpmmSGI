import { Request } from "express";

export interface AuthResponse {
  id_user: string;
  username: string;
  id_rol: string;
  id_employes?: string;
  role_name?: string;
  employe_name?: string;
  state?: boolean;  
}

export interface CustomRequest extends Request {
  user?: {
    id_user: string;
    username: string;
    id_rol: string;
    id_employes?: string;
    role_name: string;
    employe_name: string;
    state?: boolean;
  };
}

declare global {
  namespace Express {
    interface Request {
      user?: { id_user: string; username: string, id_rol: string, id_employes?: string, role_name: string, employe_name: string };
    }
  }
}
