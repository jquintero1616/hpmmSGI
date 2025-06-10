import knex from "knex";
import db from "../db";
import { Direction, NewDirection } from "../types/direction";
import { randomUUID } from "crypto";

export const getAllDirectionsModel = async (): Promise<NewDirection[]> => {
  return knexTableName().select("*");
};

export async function getDirectionByIdModel(
  id_direction: string
): Promise<NewDirection[]> {
  const direction: Direction[] = await knexTableName()
    .where({ id_direction });
  return direction;
}

export const createDirectionModel = async (
  direction: NewDirection
): Promise<NewDirection> => {
  const [createdDirection] = await knexTableName()
    .insert({ ...direction, id_direction: randomUUID() })
    .returning("*");
  return createdDirection;
};

export async function updateDirectionModel(
  id_direction: string,
  nombre: string,
  estado: boolean
): Promise<NewDirection | null> {
  const updated_at = new Date();
  const [updatedDirection] = await knexTableName()
    .where({ id_direction })
    .update({
      nombre,
      estado,
      updated_at,
    })
    .returning("*");

  return updatedDirection || null;
}

export async function deleteDirectionModel(
  id_direction: string
): Promise<NewDirection | null> {
  const updated_at = new Date();
  const [updatedDirection] = await knexTableName()
    .where({ id_direction })
    .update({ estado: false, updated_at })
    .returning("*");
  return updatedDirection || null;
}

const knexTableName = () => {
  return db("direction");
};
