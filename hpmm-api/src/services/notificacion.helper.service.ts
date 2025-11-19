import db from "../db";
import { NewNoti } from "../types/notification";
import { createNotiModel } from "../models/notifications.model";
import logger from "../utils/loggers";

/**
 * Obtiene todos los usuarios que tienen un rol específico
 */
export const getUsersByRole = async (roleName: string): Promise<string[]> => {
  try {
    const users = await db("users as u")
      .select("u.id_user")
      .join("roles as r", "r.id_rol", "u.id_rol")
      .where("r.name", roleName)
      .andWhere("u.estado", true);
    
    return users.map(user => user.id_user);
  } catch (error) {
    logger.error(`Error obteniendo usuarios por rol ${roleName}`, error);
    return [];
  }
};

/**
 * Envía una notificación a múltiples usuarios por rol
 */
export const enviarNotificacionPorRoles = async (
  roles: string[],
  notificacionData: Omit<NewNoti, "id_user">
): Promise<void> => {
  try {
    // Obtener todos los usuarios de los roles especificados
    const userIds: string[] = [];
    
    for (const rol of roles) {
      const usersDeRol = await getUsersByRole(rol);
      logger.info(`Rol "${rol}" tiene ${usersDeRol.length} usuarios: ${usersDeRol.join(", ")}`);
      userIds.push(...usersDeRol);
    }
    
    // Eliminar duplicados
    const uniqueUserIds = [...new Set(userIds)];
    
    logger.info(`Total usuarios únicos a notificar: ${uniqueUserIds.length} - IDs: ${uniqueUserIds.join(", ")}`);
    
    // Crear una notificación para cada usuario
    const notificaciones = uniqueUserIds.map(id_user => ({
      ...notificacionData,
      id_user,
      id_rol: roles.join(","), // Guardar los roles para referencia
    }));
    
    // Insertar todas las notificaciones
    for (const noti of notificaciones) {
      await createNotiModel(noti as NewNoti);
      logger.info(`Notificación creada para usuario ${noti.id_user}`);
    }
    
    logger.info(`Notificaciones enviadas a ${uniqueUserIds.length} usuarios de roles: ${roles.join(", ")}`);
  } catch (error) {
    logger.error("Error enviando notificaciones por roles", error);
    throw error;
  }
};

/**
 * Envía una notificación a un usuario específico
 */
export const enviarNotificacionAUsuario = async (
  id_user: string,
  notificacionData: Omit<NewNoti, "id_user">
): Promise<void> => {
  try {
    await createNotiModel({
      ...notificacionData,
      id_user,
    } as NewNoti);
    
    logger.info(`Notificación enviada al usuario ${id_user}`);
  } catch (error) {
    logger.error(`Error enviando notificación al usuario ${id_user}`, error);
    throw error;
  }
};
