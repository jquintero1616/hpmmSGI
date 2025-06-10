import db from "../db";
import { NewSubdireccion } from "../types/subdireccion";
import { randomUUID } from "crypto";


export const getAllSubdireccionesModel = async (): Promise<NewSubdireccion[] | []> => {
  return knexTableName().select("*");
}


export async function getSubdireccionByIdModel(
  id_subdireccion: string
): Promise<NewSubdireccion | null> {
  const subdireccion = await knexTableName().where({ id_subdireccion }).first();
  return subdireccion || null;
}

export const createSubdireccionModel = async (
  subdireccion: NewSubdireccion
): Promise<NewSubdireccion> => {  
  const [createdSubdireccion] = await knexTableName()
    .insert({ ...subdireccion, id_subdireccion: randomUUID() })
    .returning("*");
  return createdSubdireccion;
}   

export async function updateSubdireccionModel(
  id_subdireccion: string,
  nombre: string,
  estado: boolean
): Promise<NewSubdireccion | null> {
  const updated_at = new Date();
  const [updatedSubdireccion] = await knexTableName()
    .where({ id_subdireccion })
    .update({
      nombre,
      estado,
      
      updated_at,
    })
    .returning("*");

  return updatedSubdireccion || null;
}   

export async function deleteSubdireccionModel(id_subdireccion: string): Promise<NewSubdireccion | null> {
  const updated_at = new Date();
  const [updatedSubdireccion] = await knexTableName()
    .where({ id_subdireccion })
    .update({ estado: false, updated_at })
    .returning("*");

  return updatedSubdireccion || null;
}

const knexTableName = () => {
  return db("subdireccion");
}   
