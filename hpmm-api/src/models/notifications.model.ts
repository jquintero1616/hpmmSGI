import db from "../db";
import { NewNoti } from "../types/notification";
import { randomUUID } from "crypto";


export const getAllNotiModel = async (): Promise<NewNoti[]> => {
    return db("notifications").select("*").where({ estado: true });
};

export const getNotiByIdModel = async (
    id_noti: string): 
    Promise<NewNoti> => {
    const notification = await db("notifications").select("*").where({ id_noti }).first();
    return notification || null;
}

export const createNotiModel = async (
    Noti: NewNoti
): Promise<NewNoti> => {
    const [CreatedNoti] = await knexTableName()
        .insert({...Noti, id_noti: randomUUID()})
        .returning("*");
    return CreatedNoti;
};

export async function updateNotiModel(
    id_noti: string,
    mensaje: string,
    tipo: string,
    estado: boolean
): Promise<NewNoti | null> {
    const updated_at = new Date();
    const [updatedNoti] = await knexTableName()
        .where({ id_noti })
        .update({
            mensaje,
            tipo,
            estado,
            updated_at,
        })
        .returning("*");
    return updatedNoti || null;
}

export async function deleteNotiModel(
    id_noti: string):
     Promise<NewNoti | null> {
    const updated_at = new Date();
    const [updatedNoti] = await knexTableName()
        .where({ id_noti })
        .update({ estado: false, updated_at })
        .returning("*");
    return updatedNoti || null;
    
}

const knexTableName = () => {
  return db("notifications");
};
