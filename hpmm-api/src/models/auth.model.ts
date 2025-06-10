// src/models/auth.model.ts
import db from "../db";

interface UserData {
  email: string;
  password: string;
  username?: string;
  nombre?: string;
  id_user?: string;
}

// Obtener usuario por email
export const getUserByEmail = async (email: string): Promise<UserData | null> => {
  try {
    const user = await knexTableName()
      .select("*")
      .where({ email })
      .first();
    
    return user || null;
  } catch (error) {
    console.error("Error al buscar usuario por email:", error);
    throw error;
  }
};

// Obtener usuario por id
export const getUserById = async (id: string): Promise<UserData | null> => {
  try {
    const user = await knexTableName()
      .select("*")
      .where({ id_user: id })
      .first();
    
    return user || null;
  } catch (error) {
    console.error("Error al buscar usuario por ID:", error);
    throw error;
  }
};

// Crear nuevo usuario
export const createUser = async (userData: {
  email: string;
  password: string;
  username?: string;
}): Promise<string> => {
  try {
    const [id] = await knexTableName()
      .insert({
        email: userData.email,
        password: userData.password,
        username: userData.username || null,
        fecha_creacion: new Date(),
        estado: 'activo'
      })
      .returning("id_user");
    
    return id;
  } catch (error) {
    console.error("Error al crear usuario:", error);
    throw error;
  }
};

// Actualizar datos de usuario
export const updateUser = async (
  userId: string,
  updateData: Partial<UserData>
): Promise<boolean> => {
  try {
    const result = await knexTableName()
      .where({ id_user: userId })
      .update({
        ...updateData,
        fecha_actualizacion: new Date()
      });
    
    return result > 0;
  } catch (error) {
    console.error("Error al actualizar usuario:", error);
    throw error;
  }
};

// Función para construir la consulta a la tabla
const knexTableName = () => {
  return db("users");
};