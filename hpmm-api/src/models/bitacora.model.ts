import db from "../db";
import { Bitacora, NewBitacora } from "../types/bitacora";

export const saveBitacoraModel = async (
  evento: NewBitacora
): Promise<Bitacora> => {
  const [created] = await db<Bitacora>("bitacora")
    .insert(evento)
    .returning("*");
  return created;
};

export const getAllBitacoraModel = async (): Promise<Bitacora[]> =>
  db<Bitacora>("bitacora").orderBy("fecha_evento", "desc");

export const getBitacoraByIdModel = async (
  id: number
): Promise<Bitacora | null> => {
  const record = await db<Bitacora>("bitacora").where({ id }).first();
  return record || null;
};
