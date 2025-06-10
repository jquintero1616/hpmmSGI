import * as RolModel from "../models/rol.model";
import { NewRol } from "../types/rol";
import logger from "../utils/loggers";

// get all roles
export const getAllRolService = async (): Promise<NewRol[]> => {
  try {
    const roles = await RolModel.getallRolesModel();
    return roles;
  } catch (error) {
    logger.error("Error en la búsqueda de roles", error);
    throw error;
  }
};

// Get role by id_rol
export const getRolByIdService = async (
  id_rol: string
): Promise<NewRol | null> => {
  return RolModel.getRolByIdModel(id_rol);
};

// Create role
export const createRolService = async (data: NewRol) => {
  return RolModel.createRolModel(data);
};

// update role
export const updateRolService = async (
  id_rol: string,
  name: string,
  descripcion: string,
  estado: boolean
) => {
  const updatedRol = await RolModel.updateRolModel(
    id_rol,
    name,
    descripcion,
    estado
  );
  return updatedRol;
};

// Delete role
export async function deleteRolService(id_rol: string): Promise<NewRol | null> {
  // Opcionalmente puedes verificar que exista:
  const existing = await RolModel.getRolByIdModel(id_rol);
  if (!existing) return null;

  // Llamar al modelo de delete
  const deactivatedRol = await RolModel.deleteRolModel(id_rol);
  return deactivatedRol;
}
