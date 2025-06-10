import { Request, Response } from "express";
import * as RolService from "../services/rol.service";
import { asyncWrapper } from "../utils/errorHandler";
import { NewRol } from "../types/rol";

// Listar todos los roles
export const getAllController = asyncWrapper(
  async (req: Request, res: Response): Promise<void> => {
    const roles = await RolService.getAllRolService();
    res.status(200).json({
      msg: "Roles buscados correctamente",
      totalRoles: roles.length,
      roles,
    });
  }
);

// Obtener un rol por ID
export const getByIdController = asyncWrapper(
  async (req: Request, res: Response): Promise<void> => {
    const id_rol = (req.params.id || "").trim();
    const rol = await RolService.getRolByIdService(id_rol);

    if (!rol) {
      res.status(404).json({ msg: "Rol no encontrado" });
      return;
    }

    res.status(200).json({ msg: `Rol encontrado con id_rol ${id_rol}`, rol });
  }
);

// Registrar un nuevo rol
export const registerRolesController = asyncWrapper(
  async (req: Request, res: Response): Promise<void> => {
    const { name, ...rest } = req.body;

    const AllRoles = await RolService.getAllRolService();
    if (AllRoles.some((rol) => rol.name === name)) {
      res
        .status(403)
        .json({
          msg: `El rol creado del nombre ${name} ya existe`,
          conflictName: name,
        });
      return;
    }
    const NewRol = await RolService.createRolService({ name, ...rest });
    res.status(201).json({
      msg: `Info: Rol creado correctamente`,
      newRol: NewRol,
    });
  }
);
// Editar un rol existente
export const editRolController = asyncWrapper(
  async (req: Request, res: Response): Promise<void> => {
    const id_rol = (req.params.id || "").trim();
    const { name, descripcion, estado } = req.body;
    const updatedRol = await RolService.updateRolService(
      id_rol,
      name,
      descripcion,
      estado
    );

    if (!updatedRol) {
      res.status(404).json({ msg: "Rol no encontrado" });
      return;
    }

    res.status(200).json({ msg: "Rol actualizado correctamente", updatedRol });
  }
);

// Eliminar un rol existente
export const deleteRolController = asyncWrapper(
  async (req: Request, res: Response): Promise<void> => {
    const id_rol = (req.params.id || "").trim();
    const deletedRol = await RolService.deleteRolService(id_rol);

    if (!deletedRol) {
      res.status(404).json({ msg: "Rol no encontrado" });
      return;
    }

    res.status(200).json({ msg: "Rol eliminado correctamente", deletedRol });
  }
);
