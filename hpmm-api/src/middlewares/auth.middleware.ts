// src/middlewares/auth.middleware.ts
import { Request, Response, NextFunction } from "express";

export const authenticateSession = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Verifica si la sesión existe y si el usuario está autenticado
  if (!req.session || !(req.session as any).user) {
    res.status(401).json({ message: "Usuario no autenticado" });
    return;
  }

  // Extrae los datos del usuario de la sesión
  const { id_user, id_role, id_employes, employe_name, role_name, username } = (req.session as any).user;
  (req as any).user = { id_user, id_role, id_employes, employe_name, role_name, username };

  next();
};
