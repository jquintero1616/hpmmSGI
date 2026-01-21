import * as KardexModel from "../models/kardex.model";
import { KardexDetail, KardexFilter, NewKardex } from "../types/kardex";

import logger from "../utils/loggers";

export const getAllKardexService = async (): Promise<NewKardex[]> => {
  try {
    return await KardexModel.getallKardexModel();
  } catch (error) {
    logger.error("Error fetching kardex", error);
    throw error;
  }
};

export const getKardexByIdService = async (
  id: string
): Promise<NewKardex | null> => {
  try {
    return await KardexModel.getKardexByIdModel(id);
  } catch (error) {
    logger.error("Error fetching kardex by id", error);
    throw error;
  }
};

export const createKardexService = async (
  data: NewKardex
): Promise<NewKardex> => {
  try {
    return await KardexModel.createKardexModel(data);
  } catch (error) {
    logger.error("Error creating kardex", error);
    throw error;
  }
};

export const updateKardexService = async ({kardexEdit, id_kardex}: {kardexEdit: NewKardex, id_kardex: string}): Promise<NewKardex | null> => {
  try {
    return await KardexModel.updateKardexModel({ kardexEdit, id_kardex });
  } catch (error) {
    logger.error("Error updating kardex", error);
    throw error;
  }
};

export const deleteKardexService = async (
  id_kardex: string
): Promise<NewKardex | null> => {
  try {
    const existing = await KardexModel.getKardexByIdModel(id_kardex);
    if (!existing) return null;
    return await KardexModel.deleteKardexModel(id_kardex);
  } catch (error) {
    logger.error("Error deleting (deactivating) kardex", error);
    throw error;
  }
};

export const getKardexDetailsService = async (
  filter: KardexFilter
): Promise<KardexDetail[]> => {
  try {
    return await KardexModel.getKardexDetailsModel(filter);
  } catch (error) {
    logger.error("Error fetching filtered kardex detail", error);
    throw error;
  }
};

// Obtener solo donaciones del kardex
export const getDonacionesKardexService = async (
  filter: KardexFilter
): Promise<KardexDetail[]> => {
  try {
    return await KardexModel.getDonacionesKardexModel(filter);
  } catch (error) {
    logger.error("Error fetching donaciones kardex", error);
    throw error;
  }
};
