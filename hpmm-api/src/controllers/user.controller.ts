import { Request, Response } from "express";
import * as UserService from "../services/user.service";
import { asyncWrapper } from "../utils/errorHandler";
import { NewUser } from "../types/user";

// Listar todos los usuarios
export const fetchAllUsersController = asyncWrapper(
  async (req: Request, res: Response): Promise<void> => {
    const users = await UserService.getAllUserService();
    res.status(200).json({
      msg: "Usuarios buscados correctamente",
      totalUsers: users.length,
      users,
    });
  }
);

// Obtener un usuario por ID
export const fetchUserByIdController = asyncWrapper(
  async (req: Request, res: Response): Promise<void> => {
    const id_user = (req.params.id || "").trim();

    const user = await UserService.getUserByIdService(id_user);

    if (!user) {
      res.status(404).json({
        msg: `No se encontro el usuario con la clave id_user ${id_user}`,
        user,
      });
      return;
    }

    res.status(200).json({
      msg: `Usuario encontrado con la clave id_user ${id_user}`,
      user,
    });
  }
);

export const registerUserController = asyncWrapper(
  async (req: Request, res: Response) => {
    const body = req.body as NewUser;
    // Validar campos obligatorios
    const required = [
      "id_rol",
      "username",
      "email",
      "password",
     
    ] as const;
    for (const key of required) {
      if (body[key] === undefined) {
        return res.status(400).json({ msg: `Falta el campo ${key}` });
      }
      const allRoles = await UserService.getAllUserService();
      if (allRoles.find((user) => user.username === body.username)) {
        res.status(403).json({ msg: "El usuario ya existe", body });
        return;
      }
    }
    const user = await UserService.createUserService(body);
    res.status(201).json({ msg: "Usuario creado", user });
  }
);

// Editar un usuario existente
export const editUserController = asyncWrapper(
  async (req: Request, res: Response) => {
    const id_user = req.params.id.trim();
    const updates = req.body as Partial<NewUser>;
    const updatedUser = await UserService.updateUserService(id_user, updates);
    if (!updatedUser) {
      return res.status(404).json({ msg: "Usuario no encontrado" });
    }
    res.status(200).json({ msg: "Usuario actualizado", updatedUser });
  }
);

// Eliminar un usuario
export const removeUserController = asyncWrapper(
  async (req: Request, res: Response): Promise<void> => {
    const id_user = (req.params.id || "").trim();
    const user = await UserService.removeUserService(id_user);

    if (!user) {
      res.status(404).json({ msg: "Usuario no encontrado" });
      return;
    }

    res.status(200).json({
      message: "Usuario eliminado correctamente",
      user,
    });
  }
);
