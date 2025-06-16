import * as UnitPactModel from "../models/units.x.pacts.model";
import { NewUnitPact } from "../types/units_x_pacts";
import logger from "../utils/loggers";

export const getUnitPactService = async (): Promise<NewUnitPact[]> => {
  try {
    const UnitPact = await UnitPactModel.getallUnitsPactsModel();
    return UnitPact;
  } catch (error) {
    logger.error("Error fetching UnitPact", error);
    throw error;
  }
};

export const getUnitPactByIdService = async (
  id_units_x_pacts: string
): Promise<NewUnitPact | null> => {
  try {
    const UnitPact = await UnitPactModel.getUnitPactByIdModel(id_units_x_pacts);
    return UnitPact;
  } catch (error) {
    logger.error("Error fetching UnitPact", error);
    throw error;
  }
};

export const createUnitPactService = async (
  data: NewUnitPact
): Promise<NewUnitPact> => {
  try {
    const newUnitPact = await UnitPactModel.createUnitPactModel(data);
    return newUnitPact;
  } catch (error) {
    logger.error("Error creating UnitPact", error);
    throw error;
  }
};

export const updateUnitPactService = async (
  id_units_x_pacts: string,
  data: NewUnitPact,
  estado: boolean
) => {
  const updatedUnitPact = await UnitPactModel.updateUnitPactModel(
    id_units_x_pacts,
    data,
    estado
  );
  return updatedUnitPact;
};

export async function deleteUnitPactService(
  id_units_x_pacts: string
): Promise<NewUnitPact | null> {
  const existing = await UnitPactModel.getUnitPactByIdModel(id_units_x_pacts);
  if (!existing) return null;

  const deactivatedUnitPact =
    await UnitPactModel.deleteUnitPactModel(id_units_x_pacts);
  return deactivatedUnitPact;
}
