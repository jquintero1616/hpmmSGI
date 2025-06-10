import * as BitacoraModel from "../models/bitacora.model";
import { NewBitacora, Bitacora } from "../types/bitacora";

export const saveBitacora = async (evento: NewBitacora): Promise<Bitacora> =>
  BitacoraModel.saveBitacoraModel(evento);

export const getAllBitacoraService = async (): Promise<Bitacora[]> =>
  BitacoraModel.getAllBitacoraModel();

export const getBitacoraByIdService = async (
  id: number
): Promise<Bitacora | null> =>
  BitacoraModel.getBitacoraByIdModel(id);
