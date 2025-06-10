import knex from "knex";
import db from "../db";
import { NewRequisi } from "../types/requisi";
import { randomUUID } from "crypto";


export const getAllRequiModel = async (): Promise<NewRequisi[]> => {
    return db("requisitions").select("*");

}

export  async function getRequisiByIdModel  (
    id_requisi: string
   ): Promise<NewRequisi | null> {
    const requi = await knexTableName().where({ id_requisi }).first();
    return requi || null;
}

export const createRequisiModel = async (
    data: NewRequisi
): Promise<NewRequisi> => {
    const [newRequi] = await knexTableName()
    .insert({...data, id_requisi: randomUUID()})
    .returning("*");
    return newRequi;
}

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


export async function deleteRequisiModel(id_requisi: string): Promise<NewRequisi | null> {
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
