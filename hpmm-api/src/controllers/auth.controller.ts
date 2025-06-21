// src/controllers/auth.controller.ts
import { Request, Response } from "express";
import { authenticateUser } from "../services/auth.service";
import { asyncWrapper } from "../utils/errorHandler";

// Nota: ahora no retornamos el res.json(), solo lo invocamos y salimos.
export const login = asyncWrapper(async (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400).json({ msg: "Correo y contraseña requeridos" });
    return;
  }

  const auth = await authenticateUser(email, password);

  if (!auth) {
    res.status(401).json({ msg: "Credenciales inválidas" });
    return;
  }

  (req.session as any).user = {
    id_user: auth.id_user,
    id_rol: auth.id_rol,
    id_employes: auth.id_employes,
    username: auth.username,
    role_name: auth.role_name,
    employe_name: auth.employe_name,
  };

  res.json({
    msg: "Inicio de sesión exitoso",
    id_user: auth.id_user,
    id_rol: auth.id_rol,
    id_employes: auth.id_employes,
    username: auth.username,
    role_name: auth.role_name,
    employe_name: auth.employe_name,
  });
  // no return aquí
});

export const checkSession = asyncWrapper(
  async (req: Request, res: Response) => {
    // Si llegamos aquí, el token ya fue validado por el middleware
    res.json({
      authenticated: true,
      id_user: req.user?.id_user,
      id_rol: req.user?.id_rol,
      id_employes: req.user?.id_employes,
      username: req.user?.username,
      role_name: req.user?.role_name,
      employe_name: req.user?.employe_name,
      msg: "Sesión válida",
    });
  }
);

export const logout = asyncWrapper(async (req: Request, res: Response) => {
  req.session.destroy((err) => {
    if (err) {
      console.error("Error destruyendo sesión:", err);
      return res.status(500).json({ msg: "No se pudo cerrar sesión" });
    }
    res.json({ msg: "Sesión cerrada exitosamente" });
  });
});
