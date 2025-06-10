import knex from "knex";
import db from "../db";
import { NewUnit } from "../types/units";
import { randomUUID } from "crypto";

export const getAllUnitsModel = async (): Promise<NewUnit[] | []> => {
  return knexTableName().select("*");
}

export async function getUnitByIdModel(id_units: string): Promise<NewUnit | null> {
  const unit = await knexTableName().where({ id_units }).first();
  return unit || null;
}

export const createUnitModel = async (unit: NewUnit): Promise<NewUnit> => {
  const [createdUnit] = await knexTableName()
    .insert({ ...unit, id_units: randomUUID() })
    .returning("*");
  return createdUnit;
};

export async function updateUnitModel(
  id_units: string,
  name: string,
  estado: boolean
): Promise<NewUnit | null> {
  const updated_at = new Date();
  const [updatedUnit] = await knexTableName()
    .where({ id_units })
    .update({
      name,
      estado,
      updated_at,
    })
    .returning("*");

  return updatedUnit || null;
}   

export async function deleteUnitModel(id_units: string): Promise<NewUnit | null> {
  const updated_at = new Date();
  const [updatedUnit] = await knexTableName()
    .where({ id_units })
    .update({ estado: false, updated_at })
    .returning("*");

  return updatedUnit || null;
}   

const knexTableName = () => {
  return db("units");
}




