import * as EmployeModel from "../models/employes.model";
import { NewEmploye } from "../types/employes";
import logger from "../utils/loggers";

// get all employes
export const getAllEmployesService = async (): Promise<NewEmploye[]> => {
  try {
    const employes = await EmployeModel.getallEmployesModel();
    return employes;
  } catch (error) {
    logger.error("Error fetching employes", error);
    throw error;
  }
};

// Get employe by id_employes
export const getEmployeByIdService = async (
  id_employes: string
): Promise<NewEmploye | null> => {
  return EmployeModel.getEmployeByIdModel(id_employes);
};

// Create employe
export const createEmployeService = async (data: NewEmploye) => {
  return EmployeModel.createEmployeModel(data);
};
//  update employe
export const updateEmployeService = async (
  id_employes: string,
  name: string,
  puesto: string,
  email: string,
  telefono: string,
  estado: boolean
) => {
  const updatedEmploye = await EmployeModel.updateEmployeModel(
    id_employes,
    name,
    puesto,
    email,
    telefono,
    estado
  );
  return updatedEmploye;
};
// Delete employe
export async function deleteEmployeService(
  id_employes: string
): Promise<NewEmploye | null> {
  // Opcionalmente puedes verificar que exista:
  const existing = await EmployeModel.getEmployeByIdModel(id_employes);
  if (!existing) return null;

  // Llamar al modelo de delete
  const deactivatedEmploye = await EmployeModel.deleteEmployeModel(id_employes);
  return deactivatedEmploye;
}
