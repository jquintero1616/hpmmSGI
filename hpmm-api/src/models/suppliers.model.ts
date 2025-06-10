import knex from "knex";
import db from "../db";
import { NewSuppliers } from "../types/suppliers";
import { randomUUID } from "crypto";


// get all suppliers
export const getAllsuppliersModel = async () => {
    const suppliers = await db("suppliers").select("*");
    return suppliers;
};


// get suppliers by id
export async function getsupploersByIdModel(
    id_supplier: string
): Promise<NewSuppliers | null> {
    const suppliers = await knexTableName().where({ id_supplier }).first();
    return suppliers || null;   
}

// create suppliers
export const createSuppliersModel = async (
    suppliers: NewSuppliers
): Promise<NewSuppliers> => {
    const [createdSuppliers] = await knexTableName()
        .insert({ ...suppliers, id_supplier: randomUUID() })
        .returning("*");
    return createdSuppliers;
};


export async function updateSuppliersModel(
    id_supplier: string,
    id_contacto: string,
    nombre: string,
    numero_contacto: string,
    correo: Date,
    estado: boolean
): Promise<NewSuppliers> {
    const [updatedSuppliers] = await knexTableName()
        .where({ id_supplier })
        .update({ id_contacto, nombre, numero_contacto, correo, estado })
        .returning("*");
    return updatedSuppliers;
}   

export async function deleteSuppliersModel(id_supplier: string): Promise<NewSuppliers | null> {
    const updated_at = new Date();
    const [updatedSuppliers] = await knexTableName()
        .where({ id_supplier })
        .update({ estado: false, updated_at })
        .returning("*");
    return updatedSuppliers || null;
}

const knexTableName = () => {
  return db("suppliers");
};
