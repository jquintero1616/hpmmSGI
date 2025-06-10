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
  id: string
): Promise<NewUnitPact | null> => {
  try {
    const UnitPact = await UnitPactModel.getUnitPactByIdModel(id);
    return UnitPact;
  } catch (error) {
    logger.error("Error fetching UnitPact", error);
    throw error;
  }
};

export const createUnitPactService = async (data: NewUnitPact) => {
  return UnitPactModel.createUnitPactModel(data);
};

export const updateUnitPactService = async ( 
    id_units_x_pacts: string,
    data: NewUnitPact
    
) => {
    const updatedUnitPact = await UnitPactModel.updateUnitPactModel(
        id_units_x_pacts,
        data);
    return updatedUnitPact;
}
/*
export async function deleteUnitPactService(
    id_units_x_pacts: string
): Promise<NewUnitPact | null> {

const existing = await UnitPactModel.getUnitPactByIdModel(id_units_x_pacts);
if (!existing) return null;

const deactivatedUnitPact = await UnitPactModel.deleteUnitPactModel(id_units_x_pacts);
return deactivatedUnitPact;
}

*/
