import { AxiosInstance } from "axios";
import { Bitacorainterface } from "../interfaces/Bitacora.interface";

export const GetBitacorasService = async (
  axiosPrivate: AxiosInstance
): Promise<Bitacorainterface[] | null> => {
  try {
    const response = await axiosPrivate.get(`/bitacora`);
    return response.data.logs;
  } catch (error) {
    console.error("Error al recuperar las bitácoras", error);
    throw error;
  }
};

export const GetBitacoraByIdService = async (
  id_bitacora: string,
  axiosPrivate: AxiosInstance
): Promise<Bitacorainterface | undefined> => {
  try {
    const response = await axiosPrivate.get(`/bitacora/${id_bitacora}`);
    return response.data.logs;
  } catch (error) {
    console.error(`Error al recuperar la bitácora con ID: ${id_bitacora}`, error);
    throw error;
  }
};
