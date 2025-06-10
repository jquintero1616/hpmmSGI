import * as UserModel from "../models/user.model";
import { NewUser, User } from "../types/user";
import bcrypt from "bcryptjs";
import logger from "../utils/loggers";
import { randomUUID } from "crypto";



export const getAllUserService = async (): Promise<NewUser[]> => {
  try {
    const users = await UserModel.getAllUsersModel();
    return users;
  } catch (error) {
    logger.error("Error fetching users", error);
    throw error;
  }
};
// Get user by id_user
export const getUserByIdService = async (
  id_user: string
): Promise<NewUser | null> => {
  return UserModel.getUserByIdModel(id_user);
};
// Create user
export const createUserService = async (
  userData: NewUser
): Promise<User> => {
  // 1) Generar salt y hash
  const salt   = await bcrypt.genSalt(10);
  const hash   = await bcrypt.hash(userData.password, salt);

  // 2) Construir payload completo
  const payload: User = {
    id_user:  randomUUID(),
    id_rol:   userData.id_rol,
    username: userData.username,
    email:    userData.email,
    password: hash,
    
    };

  // 3) Devolver el usuario creado
  return UserModel.createUserModel(payload);
};

// Update user
export const updateUserService = async (
  id_user: string,
  updates: Partial<Omit<User, "id_user" | "created_at" | "updated_at">>
): Promise<User | null> => {
  // Si envían password, lo hasheamos
  if (updates.password) {
    const salt = await bcrypt.genSalt(10);
    updates.password = await bcrypt.hash(updates.password, salt);
  }

  return UserModel.updateUserModel(id_user, updates);
};

// delete user
// Eliminar un usuario por id_user
export const removeUserService = async (
  id_user: string
): Promise<User | null> => {
  // Llamamos a updateUserService para cambiar solo el estado
  return await updateUserService(id_user, { estado: false });
};
