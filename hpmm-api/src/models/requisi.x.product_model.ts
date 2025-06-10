import knex from "knex";
import db from "../db";
import { NewRequisiXProduct } from "../types/requisi_x_product";
import { randomUUID } from "crypto";

export const getAllRequiProductModel = async (): Promise<NewRequisiXProduct[]> => {
  return knexTableName().select("*");
};

export async function getRequiProductByIdModel(
  id_requisi_x_product: string
): Promise<NewRequisiXProduct | null> {
  const Requi_x_Product = await knexTableName()
    .where({ id_requisi_x_product })
    .first();
  return Requi_x_Product || null;
}

export async function createRequiProductModel(
  data: NewRequisiXProduct
): Promise<NewRequisiXProduct> {
  const [newRequiProduct] = await knexTableName()
    .insert({ ...data, id_requisi_x_product: randomUUID() })
    .returning("*");
  return newRequiProduct;
}

export async function updateRequiProductModel(
  id_requisi_x_product: string,
  cantidad: number
): Promise<NewRequisiXProduct | null> {
  const updated_at = new Date();
  const [updatedRequiProduct] = await knexTableName()
    .where({ id_requisi_x_product })
    .update({
      cantidad,
      updated_at,
    })
    .returning("*");
  return updatedRequiProduct || null;
}

const knexTableName = () => {
  return db("Requi_x_Product");
};
