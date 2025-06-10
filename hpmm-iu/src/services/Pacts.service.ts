import { AxiosInstance } from "axios";
import { PactInterface } from "../interfaces/pacts.interface";

export const GetPactsService = async (axiosPrivate: AxiosInstance): Promise<PactInterface[] | null> => {
  try {
    const response = await axiosPrivate.get(`/pacts`);
    return response.data.pacts;
  } catch (error) {
    console.error("Error al recuperar los pacts", error);
    throw error;
  }
};

export const GetPactByIdService = async (
  id_pacts: string,
  axiosPrivate: AxiosInstance
): Promise<PactInterface | undefined> => {
  try {
    const response = await axiosPrivate.get<PactInterface>(
      `pacts/${id_pacts}`
    );
    return response.data;
  } catch (error) {
    console.error("Error al recuperar el pacto", error);
    throw error;
  }
};

export const PostCreatePactService = async (
  pact: PactInterface,
  axiosPrivate: AxiosInstance
): Promise<PactInterface> => {
  const response = await axiosPrivate.post(
    `pact`,
    {
      name: pact.name,
      tipo: pact.tipo,
      estado: pact.estado,
    },
    { headers: { "Content-Type": "application/json" } }
  );

  return response.data.pacts;
};

export const PutUpdatePactService = async (
  id_pacts: string,
  pact: PactInterface,
  axiosPrivate: AxiosInstance
): Promise<void> => {
  await axiosPrivate.put(
    `pacts/${id_pacts}`,
    {
      name: pact.name,
      tipo: pact.tipo,
      estado: pact.estado,
    },
    { headers: { "Content-Type": "application/json" } }
  );
};
export const DeletePactService = async (id_pacts: string, axiosPrivate: AxiosInstance): Promise<void> => {
  await axiosPrivate.delete(`/pacts/${id_pacts}`);
};
