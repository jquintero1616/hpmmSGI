import knex from "knex";
import db from "../db";
import { NewRol } from "../types/rol";
import { randomUUID } from "crypto";


// get all roles model
export const getallRolesModel = async (): Promise<NewRol[]> => {
  return knexTableName().select("*");
};

// Get by id_rol model
export async function getRolByIdModel(
  id_rol: string
): Promise<NewRol | null> {
  const rol = await knexTableName().where({ id_rol }).first();
  return rol || null;
}

// Create rol
export const createRolModel = async (
  rol: NewRol
): Promise<NewRol> => {
  const [createdRol] = await knexTableName()
    .insert({ ...rol, id_rol: randomUUID() })
    .returning("*");
  return createdRol;
};

// Update rol
export async function updateRolModel(
  id_rol: string,
  name: string,
  descripcion: string,
  estado: boolean
): Promise<NewRol | null> {
  const updated_at = new Date();
  const [updatedRol] = await knexTableName()
    .where({ id_rol })
    .update({
      name,
      descripcion,
      estado,
      updated_at,
    })
    .returning("*");

  return updatedRol || null;
}

// Delete rol

export async function deleteRolModel(
  id_rol: string
): Promise<NewRol | null> {
  const updated_at = new Date();
  const [updatedRol] = await knexTableName()
    .where({ id_rol })
    .update({ estado: false, updated_at })
    .returning("*");
  return updatedRol || null;
}

const knexTableName = () => {
  return db("roles");
};
