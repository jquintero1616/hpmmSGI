import * as pactsModel from "../models/pacts.model";
import { Pact, NewPact } from "../types/pacts";
import logger from "../utils/loggers";

export const getAllPactsService = async (): Promise<Pact[]> => {
  try {
    return await pactsModel.getAllPactsModel();
  } catch (error) {
    logger.error("Error fetching pacts", error);
    throw error;
  }
};

export const getPactByIdService = async (id_pacts: string): Promise<Pact> => {
  return pactsModel.getPactByIdModel(id_pacts)
};

export const createPactService = async (payload: NewPact): Promise<Pact> => {
  try {
    return await pactsModel.createPactModel(payload);
  } catch (error) {
    logger.error("Error creating pact", error);
    throw error;
  }
};

export const updatePactService = async (
  id_pacts: string,
  payload: Partial<NewPact>
): Promise<Pact> => {
  const updated = await pactsModel.updatePactModel(id_pacts, payload);
  if (!updated) {
    throw new Error(
      `Pacto con id_pacts ${id_pacts} no encontrado o sin cambios`
    );
  }
  return updated;
};

export const deletePactService = async (id_pacts: string): Promise<Pact> => {
  const deleted = await pactsModel.deletePactModel(id_pacts);
  if (!deleted) {
    throw new Error(`Pacto con id_pacts ${id_pacts} no encontrado`);
  }
  return deleted;
};
