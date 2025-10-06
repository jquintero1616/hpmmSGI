import * as SubcategoryModel from "../models/subcategory.model";
import { NewSubcategory } from "../types/subcategory";
import logger from "../utils/loggers";

export const getAllsubcategoryService = async (): Promise<NewSubcategory[]> => {
  try {
    const subcategory = await SubcategoryModel.getAllSubcategoryModel();
    return subcategory;
  } catch (error) {
    logger.error("error fetching subcategoryd", error);
    throw error;
  }
};

export const getSubcategoryByIdService = async (
  id_subcategory: string
): Promise<NewSubcategory | null> => {
  try {
    const subcategory =
      await SubcategoryModel.getSubcategoryByIdModel(id_subcategory);
    return subcategory;
  } catch (error) {
    logger.error("error fetching subcategoryd", error);
    throw error;
  }
};

export const createSubcategoryService = async (
  data: NewSubcategory) => {
  try {
    return await SubcategoryModel.createSubCategoryModel(data);
  } catch (error) {
    logger.error("error creating subcategory", error);
    throw error;
  }
};

export const updateSubcategoryService = async (
  id_subcategory: string,
  nombre: string,
  estado: boolean,
  id_category: string
) => {
  const updatedSubcategory = await SubcategoryModel.updateSubcategoryModel(
    id_subcategory,
    nombre,
    estado,
    id_category
  );
  return updatedSubcategory;
};

export async function deleteSubcategoryService(
  id_subcategory: string
): Promise<NewSubcategory | null> {
  const existing =
    await SubcategoryModel.getSubcategoryByIdModel(id_subcategory);
  if (!existing) return null;

  const deactivatedSubcategory =
    await SubcategoryModel.deleteSubcategoryModel(id_subcategory);
  return deactivatedSubcategory;
}
