import db from "../db";
import { NewUnitPact } from "../types/units_x_pacts";
import { randomUUID } from "crypto";

export const getallUnitsPactsModel = async (): Promise<NewUnitPact[]> => {
  return db("units_x_pacts as up")
    .join("units as u", "up.id_units", "u.id_units")
    .join("pacts as p", "up.id_pacts", "p.id_pacts")
    .join("subcategory as sc", "up.id_subcategory", "sc.id_subcategory")
    .select(
      "up.*",
      "u.name as unit_name",
      "p.name as pact_name",
      "sc.nombre as subcategory_name"
    );
};

export async function getUnitPactByIdModel(
  id_units_x_pacts: string
): Promise<NewUnitPact | null> {
  const UnitPact = await db("units_x_pacts as up")
    .where({ "up.id_units_x_pacts": id_units_x_pacts })
    .join("units as u", "up.id_units", "u.id_units")
    .join("pacts as p", "up.id_pacts", "p.id_pacts")
    .join("subcategory as sc", "up.id_subcategory", "sc.id_subcategory")
    .select(
      "up.*",
      "u.name as unit_name",
      "p.name as pact_name",
      "sc.nombre as subcategory_name"
    )
    .first();
  return UnitPact || null;
}

export const createUnitPactModel = async (
  data: NewUnitPact
): Promise<NewUnitPact> => {
  const [newUnitPact] = await knexTableName()
    .insert({ ...data, id_units_x_pacts: randomUUID() })
    .returning("*");
  return newUnitPact;
};

export async function updateUnitPactModel(
  id_units_x_pacts: string,
  data: NewUnitPact,
  estado: boolean
): Promise<NewUnitPact | null> {
  const updated_at = new Date();
  const [updatedUnitPact] = await knexTableName()
    .where({ id_units_x_pacts })
    .update({
      data,
      estado,
      updated_at,
    })
    .returning("*");
  return updatedUnitPact || null;
}


export async function deleteUnitPactModel(
  id_units_x_pacts: string
): Promise<NewUnitPact | null> {
  const updated_at = new Date();
  const [deletedUnitPact] = await knexTableName()
    .where({ id_units_x_pacts })
    .update({ estado: false, updated_at })
    .returning("*");
  return deletedUnitPact || null;
}

const knexTableName = () => {
  return db("units_x_pacts");
};
