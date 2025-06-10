import * as UnitPactModel from "../models/requisi.x.product_model";
import { NewRequisiXProduct } from "../types/requisi_x_product";
import logger from "../utils/loggers";


export const getAllRequisiProdctService = async (): Promise<NewRequisiXProduct[]> => {
    try {
        const UnitPact = await UnitPactModel.getAllRequiProductModel();
        return UnitPact;
    } catch (error) {
        logger.error("Error fetching UnitPact", error);
        throw error;
    }
}

export const getRequisiProductByIdService = async (id_requisi_x_product: string): Promise<NewRequisiXProduct | null> => {
    try {
        const UnitPact = await UnitPactModel.getRequiProductByIdModel(id_requisi_x_product);
        return UnitPact;
    } catch (error) {
        logger.error("Error fetching UnitPact", error);
        throw error;
    }
}


export const createRequisiProductService = async (data: NewRequisiXProduct) => {
    try {
        return await UnitPactModel.createRequiProductModel(data);
    } catch (error) {
        logger.error("Error creating UnitPact", error);
        throw error;
    }
}

export const updateRequisiProductService = async (id_requisi_x_product: string, cantidad: number) => {
    try {
        return await UnitPactModel.updateRequiProductModel(id_requisi_x_product, cantidad);
    } catch (error) {
        logger.error("Error updating UnitPact", error);
        throw error;
    }
}