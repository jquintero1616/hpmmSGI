import db from "../db";
import { up } from "../db/migrations/20250508171035_create_role";
import { NewsScompras } from "../types/scompras";
import { randomUUID } from "crypto";

export const getAllScomprasModel = async (): Promise<NewsScompras[]> => {
  return db("solicitud_compras as sc")
    .select(
      "sc.id_scompra",
      "sc.id_requisi",
      "r.id_employes",
      "e.name as nombre_empleado",
      "e.id_units",
      "u.name as nombre_unidad",
      "dr.id_product",
      "p.nombre as nombre_producto",
      "dr.cantidad",
      "sc.estado",
      "sc.created_at",
      "sc.updated_at",
      "r.descripcion"
    )
    .join("requisitions as r", "sc.id_requisi", "r.id_requisi")
    .join("employes as e", "r.id_employes", "e.id_employes")
    .join("units as u", "e.id_units", "u.id_units")
    .join("Requi_x_Product as dr", "dr.id_requisi", "r.id_requisi")
    .join("product as p", "dr.id_product", "p.id_product")
    .orderBy("sc.id_scompra", "asc")
    .orderBy("dr.id_product", "asc");
};

export const getScomprasByIdModel = async (
  id_scompra: string
): Promise<NewsScompras> => {
  const scompras = await db("solicitud_compras")
    .select("*")
    .where({ id_scompra })
    .first();
  return scompras || null;
};

export const createScomprasModel = async (
  scompras: NewsScompras
): Promise<NewsScompras> => {
  const [createdScompras] = await db("solicitud_compras")
    .insert({ ...scompras, id_scompra: randomUUID() })
    .returning("*");
  return createdScompras;
};

export async function updateScomprasModel(
  id_scompra: string,
  estado: string
): Promise<NewsScompras | null> {
  const updated_at = new Date();
  const [updatedScompras] = await knexTableName()
    .where({ id_scompra })
    .update({
      estado,
      updated_at,
    })
    .returning("*");
  return updatedScompras || null;
}

export async function deleteScomprasModel(
  id_scompra: string
): Promise<NewsScompras | null> {
  const updated_at = new Date();
  const [deletedScompras] = await knexTableName()
    .where({ id_scompra })
    .update({ estado: false, updated_at })
    .returning("*");
  return deletedScompras || null;
}

const knexTableName = () => {
  return db("solicitud_compras");
};
