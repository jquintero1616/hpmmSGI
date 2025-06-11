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

export const updateKardexService = async (
  id: string,
  id_product: string,
  id_shopping: string,
  anio_creacion: string,
  tipo_movimiento: "Entrada" | "Salida",
  fecha_movimiento: Date,
  numero_factura: string,
  cantidad: number,
  precio_unitario: number,
  tipo_solicitud: "Requisicion" | "Pacto",
  requisicion_numero: string,
  tipo: "Aprobado" | "Rechazado" | "Pendiente"  | "Cancelado",
  observacion: string,
  estado: boolean,
  id_empleado_solicitud_f: string
): Promise<NewKardex | null> => {
  try {
    return await KardexModel.updateKardexModel(
      id,
      id_product,
      id_shopping,
      anio_creacion,
      tipo_movimiento,
      fecha_movimiento,
      numero_factura,
      cantidad,
      precio_unitario,
      tipo_solicitud,
      requisicion_numero,
      tipo,
      observacion,
      estado,
      id_empleado_solicitud_f
    );
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
