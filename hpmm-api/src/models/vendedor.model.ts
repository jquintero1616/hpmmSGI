import db from "../db";
import { NewVendedor } from "../types/vendedor";
import { randomUUID } from "crypto";


export const getAllVendedorModel = async (): Promise<NewVendedor[]> => {
  return db("vendedor as sb")
    .join("suppliers as c", "sb.id_supplier", "c.id_supplier")
    .select(
      "sb.id_vendedor",
      "sb.nombre_contacto",
      "sb.correo",
      "sb.identidad",
      "sb.estado",
      "sb.created_at",
      "sb.updated_at",
      "c.nombre as supplier_name"
    );
};

export async function getVendedorByIdModel(
    id_vendedor: string
): Promise<NewVendedor | null> {
    const vendedor = await knexTableName().where({ id_vendedor }).first();
    return vendedor || null;
}

export const createVendedorModel = async (
    data: NewVendedor
     
): Promise<NewVendedor> => {
    const [createdVendedor] = await knexTableName().insert({ ...data, id_vendedor: randomUUID() }).returning("*");
    return createdVendedor; 
}

export async function updateVendedorModel(
    id_vendedor: string,
    id_proveedor: string,
    nombre_contacto: string, 
    correo:string,
    identidad: string,
    estado: boolean
): Promise<NewVendedor> {
    const [updatedVendedor] = await knexTableName()
      .where({ id_vendedor })
      .update({ id_proveedor, 
        nombre_contacto, 
        correo, 
        identidad,
        estado })
      .returning("*");
    return updatedVendedor;
  }

  export async function deleteVendedorModel(
    id_vendedor: string
  ): Promise<NewVendedor | null> {
    const updated_at = new Date();
    const [deletedVendedor] = await knexTableName()
      .where({ id_vendedor })
      .update({ estado: false, updated_at })
      .returning("*");
    return deletedVendedor || null;
  }

const knexTableName = () => {
  return db("vendedor");
};
