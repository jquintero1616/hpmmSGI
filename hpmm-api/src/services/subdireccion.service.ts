import * as SubdireccionModel from "../models/subdireccion.model";
import { NewSubdireccion } from "../types/subdireccion";
import logger from "../utils/loggers";


export const getAllSubdireccionesService = async (): Promise<NewSubdireccion[]> => {
    try {
        const subdirecciones = await SubdireccionModel.getAllSubdireccionesModel();
        return subdirecciones;
    } catch (error) {
        logger.error("Error fetching subdirecciones", error);
        throw error;
    }
    }

    export const getSubdireccionByIdService = async (
        id_subdireccion: string
    ): Promise<NewSubdireccion | null> => {
        return SubdireccionModel.getSubdireccionByIdModel(id_subdireccion);
    }   

   export const createSubdireccionService = async (data: NewSubdireccion) => {
        return SubdireccionModel.createSubdireccionModel(data);
    }

    export const updateSubdireccionService = async (
        id_subdireccion: string,
        nombre: string,
        estado: boolean
        
    ) => {
        const updatedSubdireccion = await SubdireccionModel.updateSubdireccionModel(
            id_subdireccion,
            nombre,
            estado

            
        );
        return updatedSubdireccion;
    };

    export async function deleteSubdireccionService(id_subdireccion: string): Promise<NewSubdireccion | null> {
        // Opcionalmente puedes verificar que exista:
        const existing = await SubdireccionModel.getSubdireccionByIdModel(id_subdireccion);
        if (!existing) return null;
        
        // Llamar al modelo de delete
        const deactivatedSubdireccion = await SubdireccionModel.deleteSubdireccionModel(id_subdireccion);
        return deactivatedSubdireccion;
    }
   