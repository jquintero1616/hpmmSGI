import * as ShoppingModel from "../models/suppliers.model";
import { NewSuppliers } from "../types/suppliers";
import logger from "../utils/loggers";



// get all suppliers
export const getAllSuppliersService = async (): Promise<NewSuppliers[]> => {
    try {
        const suppliers = await ShoppingModel.getAllsuppliersModel();
        return suppliers;
    } catch (error) {
        logger.error("Error getting all suppliers", error);
        throw error;
    }
}
// get supplier by id    
export const  getSuppliersByIdService = async (
    id_supplier: string
): Promise<NewSuppliers | null> => {
    try {
        return await ShoppingModel.getsupploersByIdModel(id_supplier);
    } catch (error) {
        logger.error("Error getting supplier by id", error);
        throw error;
    }
}

// create supplier
export const createSuppliersService = async (data: NewSuppliers) => {
    try {
        return await ShoppingModel.createSuppliersModel(data);
    } catch (error) {
        logger.error("Error creating supplier", error);
        throw error;
    }
}
// update supplier
export const updateSuppliersService = async (
    id_supplier: string, 
    id_contacto: string, 
    nombre: string, 
    numero_contacto: string, 
    correo: Date, 
    estado: boolean
): Promise<NewSuppliers> => {
    try {
      const updatedSuppliers = await ShoppingModel.updateSuppliersModel(
        id_supplier,
        id_contacto,
        nombre,
        numero_contacto,
        correo,
        estado
      );

      if (!updatedSuppliers) {
        throw new Error(`supplier with id_supplier ${id_supplier} not found`);
      }
      return updatedSuppliers;
    } catch (error) {
      logger.error(`Error updating supplier ${id_supplier}`, error);
      throw error;
    }
};

// delete supplier
export async function deleteSupplierService (
    id_supplier: string    
): Promise<NewSuppliers | null> {
    const existing = await ShoppingModel.getsupploersByIdModel(id_supplier);
    if (!existing) return null;

    const deactivatedSupplier = await ShoppingModel.deleteSuppliersModel(id_supplier);
    return deactivatedSupplier;
}
