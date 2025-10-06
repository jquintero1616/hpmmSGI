import db from "../db";
import { NewSubcategory } from "../types/subcategory";
import { randomUUID } from "crypto";

export const getAllSubcategoryModel = async (): Promise<NewSubcategory[]> => {
  return db("subcategory as sb")
    .join("category as c", "sb.id_category", "c.id_category")
    .select(
      "sb.id_subcategory",
      "sb.nombre as subcategory_name",
      "sb.estado",
      "sb.created_at",
      "sb.updated_at",
      "c.name as category_name",
      "c.id_category as id_category"
    );
};

export async function getSubcategoryByIdModel(
  id_subcategory: string
): Promise<NewSubcategory | null> {
  const subcategory = await db("subcategory as sb")
    .join("category as c", "sb.id_category", "c.id_category")
    .select(
      "sb.id_subcategory",
      "sb.nombre",
      "sb.estado",
      "sb.created_at",
      "sb.updated_at",
      "c.name as category_name"
    )
    .where({ id_subcategory })
    .first();
  return subcategory || null;
}

export const createSubCategoryModel = async (
  subcategory: NewSubcategory
): Promise<NewSubcategory> => {
  const [newSubcategory] = await knexTableName()
    .insert({ ...subcategory, id_subcategory: randomUUID() })
    .returning("*");
  return newSubcategory;
};

export async function updateSubcategoryModel(
  id_subcategory: string,
  nombre: string,
  estado: boolean,
  id_category: string
): Promise<NewSubcategory | null> {
  const updated_at = new Date();
  const [updatedSubcategory] = await knexTableName()
    .where({ id_subcategory })
    .update({
      
      nombre,
      estado,
      id_category,
      updated_at,
    })
    .returning("*");
  return updatedSubcategory || null;
}

export async function deleteSubcategoryModel(
  id_subcategory: string
): Promise<NewSubcategory | null> {
  const updated_at = new Date();
  const [updatedSubcategory] = await knexTableName()
    .where({ id_subcategory })
    .update({ estado: false, updated_at })
    .returning("*");
  return updatedSubcategory || null;
}

const knexTableName = () => {
  return db("subcategory");
};
