import db from "../db";
import { Pact, NewPact } from "../types/pacts";

export const getAllPactsModel = async (): Promise<Pact[]> => {
  return db("pacts as p")
  .select(
    "p.id_pacts",           
    "p.name", 
    "p.estado",
    "p.tipo",             
    "p.created_at",
    "p.updated_at"
  );

};

export const getPactByIdModel = async (id_pacts: string): Promise<Pact> => {
  const pact = await db("pacts").where({ id_pacts }).first();
  return pact;
};

export const createPactModel = async (payload: NewPact): Promise<Pact> => {
  const [newPact] = await db("pacts")
    .insert(payload)
    .returning("*");
  return newPact;
};

export const updatePactModel = async (
  id_pacts: string,
  payload: Partial<NewPact>
): Promise<Pact | null> => {
  const [updatedPact] = await db("pacts")
    .where({ id_pacts })
    .update({
      ...payload,
      updated_at: new Date(), // <-- Esto actualiza la fecha correctamente
    })
    .returning("*");
  return updatedPact || null;
};

export const deletePactModel = async (id_pacts: string): Promise<Pact | null> => {
  const [deletedPact] = await db("pacts")
    .where({ id_pacts })
    .update({ estado: false })
    .returning("*");
  return deletedPact || null;
};