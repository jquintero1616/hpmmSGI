import * as UnitModel from "../models/unit.model";
import { NewUnit } from "../types/units";
import bcrypt from "bcryptjs";
import logger from "../utils/loggers";


// Get all units
export const getAllUnitsService = async (): Promise<NewUnit[]> => {
  try {
    const units = await UnitModel.getAllUnitsModel();
    return units;
  } catch (error) {
    logger.error("Error fetching units", error);
    throw error;
  }
}
// Get unit by id_units
export const getUnitByIdService = async (id_units: string): Promise<NewUnit | null> => {
  return UnitModel.getUnitByIdModel(id_units);
}

// Create unit
export const createUnitService = async (data: NewUnit) => {
    return UnitModel.createUnitModel(data);
}

// Update unit
export const updateUnitService = async (
  id_units: string,
  name: string,
  estado: boolean
) => {
  const updatedUnit = await UnitModel.updateUnitModel(
    id_units,
    name,
    estado
  );
  return updatedUnit;
};

// Delete unit
export async function deleteUnitService(id_units: string): Promise<NewUnit | null> {
    // Opcionalmente puedes verificar que exista:
    const existing = await UnitModel.getUnitByIdModel(id_units);
    if (!existing) return null;
    
    // Llamar al modelo de delete
    const deactivatedUnit = await UnitModel.deleteUnitModel(id_units);
    return deactivatedUnit;
    }
