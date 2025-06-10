import { Request } from "express";

export interface AuthResponse {
  userId: string;
  username: string;
  id_role: string;
}

export interface CustomRequest extends Request {
  user?: {
    id_user: string;
    username: string;
    id_role: string;
  };
}

declare global {
  namespace Express {
    interface Request {
      user?: { id_user: string; username: string, id_role: string };
    }
  }
}
