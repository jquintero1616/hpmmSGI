import db from "../db";
import { RequisiFilter, RequisiDetail, Requisi } from "../types/requisi";
import { randomUUID } from "crypto";

const baseRequisiQuery = () => {
  return db("requisitions as r")
    .select(
      "r.id_requisi",
      "r.id_employes",
      "rp.id_product",
      db.raw("COALESCE(u.id_units, sd.id_subdireccion, d.id_direction) AS unit_id"),
      db.raw("COALESCE(u.name, sd.nombre, d.nombre) AS unit_name"),
      "r.fecha",
      "r.estado",
      "r.descripcion",
      "r.motivo",
      "r.created_at",
      "r.updated_at",
      "e.name             as employee_name",
      "rp.cantidad as     cantidad",
      "p.nombre           as product_name"
    )
    .innerJoin("employes as e", "e.id_employes", "r.id_employes")
    .innerJoin("units as u", "u.id_units", "e.id_units")
    .innerJoin("Requi_x_Product as rp", "rp.id_requisi", "r.id_requisi")
    .innerJoin("product as p", "p.id_product", "rp.id_product")
    .innerJoin("direction as d", "d.id_direction", "e.id_direction")
    .innerJoin("subdireccion as sd", "sd.id_subdireccion", "e.id_subdireccion")
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

export const getAllRequiModel = async (): Promise<Requisi[]> => {
  return db("requisitions").select("*");
};

export async function getRequisiByIdModel(
  id_requisi: string
): Promise<Requisi | null> {
  const requi = await knexTableName().where({ id_requisi }).first();
  return requi || null;
}

export const createRequisiModel = async (
  data: Requisi
): Promise<Requisi> => {
  const [newRequi] = await knexTableName()
    .insert({ ...data, id_requisi: data?.id_requisi || randomUUID() })
    .returning("*");
  return newRequi;
};

export async function updateRequisiModel(
  id_requisi: string,
  fecha: Date,
  estado: string,
  descripcion: string,
  motivo: string
): Promise<Requisi | null> {
  const updated_at = new Date();
  const [updatedRequisi] = await knexTableName()
    .update({
      fecha,
      estado,
      descripcion,
      motivo,
      updated_at,
    })
    .where({ id_requisi })
    .returning("*");
  return updatedRequisi || null;
}

export async function deleteRequisiModel(
  id_requisi: string
): Promise<Requisi | null> {
  const updated_at = new Date();
  const [updatedRequisi] = await knexTableName()
    .where({ id_requisi })
    .update({ updated_at })
    .returning("*");
  return updatedRequisi || null;
}

const knexTableName = () => {
  return db("requisitions");
};
