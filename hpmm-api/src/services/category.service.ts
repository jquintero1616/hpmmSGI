import * as SubdireccionModel from "../models/category.model";
import { NewCategory } from "../types/category";
import logger from "../utils/loggers";


export const getAllCategoryService = async (): Promise<NewCategory[]> => {
    try {
        const category = await SubdireccionModel.getAllCategoryModel();
        return category;
    } catch (error) {
        logger.error("Error fetching category", error);
        throw error;
    }
    }



export const getCategoryByIdService = async ( id_category: string): Promise<NewCategory[]> => {
    return SubdireccionModel.getCategoryByIdModel(id_category);
};


export const createCategoryService = async (data: NewCategory) => {
    return SubdireccionModel.createCategoryModel(data);
};

export const updateCategoryService = async (
    id_category: string,
    name: string,
    descripcion: string,
    estado: boolean
) => {
    const updatedCategory = await SubdireccionModel.updateCategoryModel(
        id_category,
        name,
        descripcion,
        estado
    );
    return updatedCategory;
}

export async function deleteCategoryService(
    id_category: string
): Promise<NewCategory | null> {
    // Opcionalmente puedes verificar que exista:
    const existing = await SubdireccionModel.getCategoryByIdModel(id_category);
    if (!existing) return null;
    
    // Llamar al modelo de delete
    const deactivatedCategory = await SubdireccionModel.deleteCategoryModel(id_category);
    return deactivatedCategory;
}