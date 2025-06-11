import db from "../db";
import { NewShopping } from "../types/shopping";
import { randomUUID } from "crypto";


export const getAllshoppingModel = async (): Promise<NewShopping[]> => {
       return db("shopping as s")
        .join("vendedor as v", "s.id_vendedor", "v.id_vendedor")
        .select(
            "s.id_shopping",
            "s.id_scompra",
            "s.id_vendedor",
            "v.nombre_contacto as vendedor_nombre",
            "s.fecha_compra",
            "s.shopping_order_id",
            "s.total",
            "s.estado",
            "s.created_at",
            "s.updated_at"
        );
};



export async function getShoppingByIdModel(
    id_shopping: string
): Promise<NewShopping | null> {
    const shopping = await knexTableName().where({ id_shopping }).first();
    return shopping || null;
}


export const createShoppingModel = async (
    data: NewShopping
): Promise<NewShopping> => {
    const [createdShopping] = await knexTableName().insert({ 
        ...data, 
        id_shopping: randomUUID() })
        .returning("*");
    return createdShopping;
}

export async function updateShoppingModel(
    id_shopping: string,
    id_scompra: string,
    id_vendedor: string,
    fecha_compra: Date,
    shopping_order_id: string,
    total: number,
    estado: boolean
): Promise<NewShopping> {
    const [updatedShopping] = await knexTableName()
      .where({
        id_shopping,
      })
      .update({ fecha_compra, total, id_scompra, id_vendedor, shopping_order_id, estado })
      .returning("*");
    return updatedShopping;
}

export async function deleteShoppingModel(
    id_shopping: string
): Promise<NewShopping | null> {
    const updated_at = new Date();
    const [deletedShopping] = await knexTableName()
    .where({ id_shopping })
    .update({ estado: false, updated_at })
    .returning("*");
    return deletedShopping || null;
}   

const knexTableName = () => {
  return db("shopping");
};
