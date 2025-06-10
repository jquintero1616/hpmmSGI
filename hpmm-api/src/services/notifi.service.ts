import * as notiModel from "../models/notifications.model";
import { NewNoti } from "../types/notification";
import logger from "../utils/loggers";


export const  getAllNotiService = async (): Promise<NewNoti[]> => {
    try {
        return await notiModel.getAllNotiModel();
    } catch (error) {
        logger.error("Error fetching notificaciones", error);
        throw error;    
    }
}
 
export const getNotiBYService = async (
  id_noti: string 
): Promise<NewNoti> => {
    const notification = await notiModel.getNotiByIdModel(id_noti);
    if (!Notification) {
        throw new Error(`Notificacion con id_notifications ${id_noti} no encontrado`);
    }
    return notification;
}

export const createNotiService = async (data: NewNoti) => {
    try {

        return await notiModel.createNotiModel(data);
    } catch (error) {
        logger.error("Error creating notificacion", error);
        throw error;
    }
}

export const updateNotiService = async (
  id_noti: string,
  data: {
    mensaje: string;
    tipo?: "Pendiente" | "Enviado" | "Leido";
    estado: boolean;
  }
): Promise<NewNoti> => {
  try {
    const updatedNoti = await notiModel.updateNotiModel(
      id_noti,
      data.mensaje!,
      data.tipo!,
      data.estado!
    );
    if (!updatedNoti) {
        throw new Error(`Notificación con id_notifications ${id_noti} no encontrada`);
    }
    return updatedNoti;
  } catch (error) {
    logger.error(`Error updating notificación ${id_noti}`, error);
    throw error;
  }
};
export async function deleteNotiService(
    id_noti: string
): Promise<NewNoti | null> {
    const deletedNoti = await notiModel.deleteNotiModel(id_noti);
    if (!deletedNoti) return null;

    const desactivatedNoti = await notiModel.deleteNotiModel(id_noti);
    return desactivatedNoti;        
} 
