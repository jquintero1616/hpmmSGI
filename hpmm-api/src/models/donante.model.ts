import db from "../db";
import { Donante, NewDonante, DonanteFilter } from "../types/donante";
import { randomUUID } from "crypto";

const knexTableName = () => {
  return db("donantes");
};

// Obtener todos los donantes
export const getAllDonantesModel = async (): Promise<Donante[]> => {
  return knexTableName().select("*").orderBy("created_at", "desc");
};

// Obtener donantes con filtros
export const getDonantesFilteredModel = async (
  opts: DonanteFilter = {}
): Promise<Donante[]> => {
  const { limit, offset, tipo_donante, estado } = opts;
  const query = knexTableName().select("*");

  if (tipo_donante) {
    query.where("tipo_donante", tipo_donante);
  }

  if (estado !== undefined) {
    query.where("estado", estado);
  }

  if (limit !== undefined) {
    query.limit(limit);
  }

  if (offset !== undefined) {
    query.offset(offset);
  }

  return query.orderBy("created_at", "desc");
};

// Obtener donante por ID
export async function getDonanteByIdModel(
  id_donante: string
): Promise<Donante | null> {
  const donante = await knexTableName().where({ id_donante }).first();
  return donante || null;
}

// Crear donante
export const createDonanteModel = async (
  donante: NewDonante
): Promise<Donante> => {
  const [createdDonante] = await knexTableName()
    .insert({ ...donante, id_donante: randomUUID() })
    .returning("*");
  return createdDonante;
};

// Actualizar donante
export async function updateDonanteModel(
  id_donante: string,
  data: Partial<NewDonante>
): Promise<Donante | null> {
  const updated_at = new Date();
  const [updatedDonante] = await knexTableName()
    .where({ id_donante })
    .update({ ...data, updated_at })
    .returning("*");
  return updatedDonante || null;
}

// Eliminar donante (soft delete)
export async function deleteDonanteModel(
  id_donante: string
): Promise<Donante | null> {
  const updated_at = new Date();
  const [deletedDonante] = await knexTableName()
    .where({ id_donante })
    .update({ estado: false, updated_at })
    .returning("*");
  return deletedDonante || null;
}

// Buscar donantes por nombre
export async function searchDonantesByNameModel(
  nombre: string
): Promise<Donante[]> {
  return knexTableName()
    .where("nombre", "ilike", `%${nombre}%`)
    .andWhere("estado", true)
    .orderBy("nombre", "asc");
}

// Obtener donantes activos
export async function getDonantesActivosModel(): Promise<Donante[]> {
  return knexTableName()
    .where("estado", true)
    .orderBy("nombre", "asc");
}
