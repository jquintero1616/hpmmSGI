import knex from "knex";
import db from "../db";
import { NewRequisi, RequisiFilter, RequisiDetail } from "../types/requisi";
import { randomUUID } from "crypto";

const baseRequisiQuery = () => {
  return db("requisitions as r")
  .select(
    "r.id_requisi",
    "r.id_employes",
    "r.fecha",
    "r.estado",
    "r.created_at",
    "r.updated_at",
    "e.name as employee_name",
    "rp.cantidad",
    "p.nombre as product_name"
  )
  .join("employes as e", "e.id_employes", "r.id_employes")
  .join("Requi_x_Product as rp", "rp.id_requisi", "r.id_requisi")
  .join("product as p", "p.id_product", "rp.id_product")
  .orderBy("r.created_at", "desc");
};

export const getRequisiDetailsModel = async (
  opts: RequisiFilter = {}
): Promise<RequisiDetail[]> => {
  const { limit, offset, statuses } = opts;
  const q = baseRequisiQuery();

  if (statuses && statuses.length > 0) {
    q.whereIn("r.estado", statuses);
  }
  if (limit !== undefined) {
    q.limit(limit);
  }
  if (offset !== undefined) {
    q.offset(offset);
  }

  return q;
};

export const getAllRequiModel = async (): Promise<NewRequisi[]> => {
  return db("requisitions").select("*");
};

export async function getRequisiByIdModel(
  id_requisi: string
): Promise<NewRequisi | null> {
  const requi = await knexTableName().where({ id_requisi }).first();
  return requi || null;
}

export const createRequisiModel = async (
  data: NewRequisi
): Promise<NewRequisi> => {
  const [newRequi] = await knexTableName()
    .insert({ ...data, id_requisi: randomUUID() })
    .returning("*");
  return newRequi;
};

export async function updateRequisiModel(
  id_requisi: string,
  fecha: Date,
  estado: string
): Promise<NewRequisi | null> {
  const updated_at = new Date();
  const [updatedRequisi] = await knexTableName()
    .update({
      fecha,
      estado,
      updated_at,
    })
    .where({ id_requisi })
    .returning("*");
  return updatedRequisi || null;
}

export async function deleteRequisiModel(
  id_requisi: string
): Promise<NewRequisi | null> {
  const updated_at = new Date();
  const [updatedRequisi] = await knexTableName()
    .where({ id_requisi })
    .update({ estado: false, updated_at })
    .returning("*");
  return updatedRequisi || null;
}

const knexTableName = () => {
  return db("requisitions");
};
