import * as VendedorModel from "../models/vendedor.model";
import { NewVendedor } from "../types/vendedor";
import logger from "../utils/loggers";


export const getAllVendedorService = async (): Promise<NewVendedor[]> => {
    try {
        const vendedor = await VendedorModel.getAllVendedorModel();
        return vendedor;
    } catch (error) {
        logger.error("Error fetching vendedor", error);
        throw error;
    }
};


export const getVendedorByService = async (
    id_vendedor: string
): Promise<NewVendedor | null> => {
    try {
        const vendedor = await VendedorModel.getVendedorByIdModel(id_vendedor);
        return vendedor;
    } catch (error) {
        logger.error("Error fetching vendedor", error);
        throw error;
    }
};

export const createVendedorService = async (data: NewVendedor) => {
    try {
        return await VendedorModel.createVendedorModel(data);
    } catch (error) {
        logger.error("Error creating vendedor", error);
        throw error;
    }
};

export const updateVendedorService = async (
    id_vendedor: string,
    id_proveedor: string,
    nombre_contacto: string, 
    correo:string,
    identidad: string,
    telefono: string,
    estado: boolean

): Promise<NewVendedor> => {
    try{
    const updatedVendedor = await VendedorModel.updateVendedorModel(
        id_vendedor,
        id_proveedor,
        nombre_contacto,
        correo,
        identidad,
        telefono,
        estado
    );
    

    if (!updatedVendedor) {
        throw new Error(`vendedor with id_vendedor ${id_vendedor} not found`);
    }
    return updatedVendedor;
    } catch (error) {
        logger.error(`Error updating vendedor ${id_vendedor}`, error);
        throw error;
    }
};  

export async function deleteVendedorService(
    id_vendedor: string
): Promise<NewVendedor | null> {
    const existing =
    await VendedorModel.getVendedorByIdModel(id_vendedor);
    if (!existing)  return null;

    const desactivatedVendedor =
    await VendedorModel.deleteVendedorModel(id_vendedor);
    return desactivatedVendedor;
}