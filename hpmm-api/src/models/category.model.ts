import knex from "knex";
import db from "../db";
import { NewCategory } from "../types/category";
import { randomUUID } from "crypto";

export const getAllCategoryModel = async (): Promise<NewCategory[]> => {
  return knexTableName().select("*");
};

export async function getCategoryByIdModel(
  id_category: string
): Promise<NewCategory[]> {
  const category: NewCategory[] = await knexTableName().where({ id_category });
  return category;
}

export const createCategoryModel = async (
  category: NewCategory
): Promise<NewCategory> => {
  const [newCategory] = await knexTableName()
    .insert({ ...category, id_category: randomUUID() })
    .returning("*");
  return newCategory;
};

export async function updateCategoryModel(
  id_category: string,
  name: string,
  descripcion: string,
  estado: boolean
): Promise<NewCategory | null> {
  const updated_at = new Date();
  const [updatedCategory] = await knexTableName()
    .where({ id_category })
    .update({
      name,
      descripcion,
      estado,
      updated_at,
    })
    .returning("*");
  return updatedCategory || null;
}

export async function deleteCategoryModel(
  id_category: string
): Promise<NewCategory | null> {
  const updated_at = new Date();
  const [updatedCategory] = await knexTableName()
    .where({ id_category })
    .update({ estado: false, updated_at })
    .returning("*");
  return updatedCategory || null;
}

const knexTableName = () => {
  return db("category");
};
