import * as ScomprasModel from "../models/scompras.model";
import { NewsScompras } from "../types/scompras";
import logger from "../utils/loggers";


export const getAllScomprasService = async (): Promise<NewsScompras[]> => {
    try {
        return await ScomprasModel.getAllScomprasModel();
    } catch (error) {
        logger.error("Error fetching scompras", error);
        throw error;
    }
};

export const getScomprasByService = async (id_scompra: string): Promise<NewsScompras> => {

        const scompras = await ScomprasModel.getScomprasByIdModel(id_scompra);
        if (!scompras) {
            throw new Error(`scompras with id_scompra ${id_scompra} not found`);
        }
        return scompras;

}

export const createdScomprasService = async (scompras: NewsScompras): Promise<NewsScompras> => {
    try {
        return await ScomprasModel.createScomprasModel(scompras);
    } catch (error) {
        logger.error("Error creating scompras", error);
        throw error;
    }
};

export const updateScomprasService = async (
    id_scompra: string, 
    data: {
        estado?: "Pendiente" | "Comprado" | "Cancelada";
    }
): Promise<NewsScompras> => {
    try {
        const updatedScompras = await ScomprasModel.updateScomprasModel(
            id_scompra,
            data.estado!,
        );
        if (!updatedScompras) {
            throw new Error(`scompras with id_scompra ${id_scompra} not found`);
        }
        return updatedScompras;
    } catch (error) {
        logger.error(`Error updating scompras ${id_scompra}`, error);
        throw error;
    }
};

