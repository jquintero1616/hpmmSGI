import db from "../db";
import { NewsScompras } from "../types/scompras";
import { randomUUID } from "crypto";



export const getAllScomprasModel = async (): Promise<NewsScompras[]> => {
    return db("solicitud_compras").select("*");
};

export const  getScomprasByIdModel = async (id_scompra: string): Promise<NewsScompras> => {
    const scompras = await db("solicitud_compras").select("*").where({ id_scompra }).first();
    return scompras || null;
};

export const createScomprasModel = async (scompras: NewsScompras): Promise<NewsScompras> => {
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
            updated_at 
        })
        .returning("*");
    return updatedScompras || null;
}


const knexTableName = () => {
  return db("solicitud_compras");
};
