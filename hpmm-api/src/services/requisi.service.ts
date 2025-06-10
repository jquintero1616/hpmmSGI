import * as RequiModel from "../models/requisi.model";
import { NewRequisi } from "../types/requisi";
import logger from "../utils/loggers";

export const getAllRequiService = async (): Promise<NewRequisi[]> => {
    try {
        return await RequiModel.getAllRequiModel();
    } catch (error) {
        logger.error("Error creating notificacion", error);
        throw error;
    }
}

export const getRequiByService = async (
  id_requisi: string
): Promise<NewRequisi | null> => {
  return RequiModel.getRequisiByIdModel(id_requisi);
};


export const createRequiService = async (data: NewRequisi) => {
    try {
        return await RequiModel.createRequisiModel(data);
    } catch (error) {
        logger.error("Error creating notificacion", error);
        throw error;
    }
}   

export const updateRequisiService = async (
  id_requisi: string,
  data: {
    fecha: Date;
    estado?: "Pendiente" | "Aprobado" | "Rechazada";
  }
): Promise<NewRequisi | null> => {
  // intentamos actualizar; si no existe devolvemos null
  const updatedRequisi = await RequiModel.updateRequisiModel(
    id_requisi,
    data.fecha!,
    data.estado!
  );

  // si no hubo fila, lanzamos error de requisición
  if (!updatedRequisi) {
    throw new Error(`Requisición con id_requisi ${id_requisi} no encontrada`);
  }

  return updatedRequisi;
};
;    

  export async function deleteRequisiService(
    id_requisi: string
  ): Promise<NewRequisi | null> {
    const deletedRequisi = await RequiModel.deleteRequisiModel(id_requisi);
    if (!deletedRequisi) return null;
  
    const desactivatedRequisi = await RequiModel.deleteRequisiModel(id_requisi);
    return desactivatedRequisi;        
  }
