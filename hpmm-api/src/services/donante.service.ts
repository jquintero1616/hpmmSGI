import * as DonanteModel from "../models/donante.model";
import { Donante, NewDonante, DonanteFilter } from "../types/donante";
import logger from "../utils/loggers";

// Obtener todos los donantes
export const getAllDonantesService = async (): Promise<Donante[]> => {
  try {
    const donantes = await DonanteModel.getAllDonantesModel();
    return donantes;
  } catch (error) {
    logger.error("Error getting all donantes", error);
    throw error;
  }
};

// Obtener donantes con filtros
export const getDonantesFilteredService = async (
  opts: DonanteFilter = {}
): Promise<Donante[]> => {
  try {
    const donantes = await DonanteModel.getDonantesFilteredModel(opts);
    return donantes;
  } catch (error) {
    logger.error("Error getting filtered donantes", error);
    throw error;
  }
};

// Obtener donante por ID
export const getDonanteByIdService = async (
  id_donante: string
): Promise<Donante | null> => {
  try {
    return await DonanteModel.getDonanteByIdModel(id_donante);
  } catch (error) {
    logger.error("Error getting donante by id", error);
    throw error;
  }
};

// Crear donante
export const createDonanteService = async (
  data: NewDonante
): Promise<Donante> => {
  try {
    return await DonanteModel.createDonanteModel(data);
  } catch (error) {
    logger.error("Error creating donante", error);
    throw error;
  }
};

// Actualizar donante
export const updateDonanteService = async (
  id_donante: string,
  data: Partial<NewDonante>
): Promise<Donante | null> => {
  try {
    const updatedDonante = await DonanteModel.updateDonanteModel(
      id_donante,
      data
    );

    if (!updatedDonante) {
      throw new Error(`Donante with id_donante ${id_donante} not found`);
    }

    return updatedDonante;
  } catch (error) {
    logger.error("Error updating donante", error);
    throw error;
  }
};

// Eliminar donante (soft delete)
export const deleteDonanteService = async (
  id_donante: string
): Promise<Donante | null> => {
  try {
    return await DonanteModel.deleteDonanteModel(id_donante);
  } catch (error) {
    logger.error("Error deleting donante", error);
    throw error;
  }
};

// Buscar donantes por nombre
export const searchDonantesByNameService = async (
  nombre: string
): Promise<Donante[]> => {
  try {
    return await DonanteModel.searchDonantesByNameModel(nombre);
  } catch (error) {
    logger.error("Error searching donantes by name", error);
    throw error;
  }
};

// Obtener donantes activos
export const getDonantesActivosService = async (): Promise<Donante[]> => {
  try {
    return await DonanteModel.getDonantesActivosModel();
  } catch (error) {
    logger.error("Error getting active donantes", error);
    throw error;
  }
};
