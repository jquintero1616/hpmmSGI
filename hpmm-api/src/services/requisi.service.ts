import * as RequiModel from "../models/requisi.model";
import { RequisiFilter, RequisiDetail, Requisi } from "../types/requisi";
import logger from "../utils/loggers";



export const getRequisiDetailService = async (
    filter: RequisiFilter
  ): Promise <RequisiDetail[]> => {
    try {
        return await RequiModel.getRequisiDetailsModel(filter);
    } catch (error) {
        logger.error("Error getting requisition details", error);
        throw error;
    }
  }

export const getAllRequiService = async (): Promise<Requisi[]> => {
    try {
        return await RequiModel.getAllRequiModel();
    } catch (error) {
        logger.error("Error creating notificacion", error);
        throw error;
    }
}

export const getRequiByService = async (
  id_requisi: string
): Promise<Requisi | null> => {
  return RequiModel.getRequisiByIdModel(id_requisi);
};


export const createRequiService = async (data: Requisi) => {
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
    estado?: "Pendiente" | "Aprobado" | "Rechazado" | "Cancelado";
    descripcion?: string;
  }
): Promise<Requisi | null> => {
  // intentamos actualizar; si no existe devolvemos null
  const updatedRequisi = await RequiModel.updateRequisiModel(
    id_requisi,
    data.fecha!,
    data.estado!,
    data.descripcion!
  );

  // si no hubo fila, lanzamos error de requisición
  if (!updatedRequisi) {
    throw new Error(`Requisición con id_requisi ${id_requisi} no encontrada`);
  }

  return updatedRequisi;
};

  export async function deleteRequisiService(
    id_requisi: string
  ): Promise<Requisi | null> {
    const deletedRequisi = await RequiModel.deleteRequisiModel(id_requisi);
    if (!deletedRequisi) return null;
  
    const desactivatedRequisi = await RequiModel.deleteRequisiModel(id_requisi);
    return desactivatedRequisi;        
  }

  