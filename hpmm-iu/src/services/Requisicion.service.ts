import  { AxiosInstance } from "axios";
import { RequisiDetail, RequisiInterface } from "../interfaces/Requisition.interface";



export const GetRequisiDetailsService = async (
  axiosPrivate: AxiosInstance
): Promise<RequisiDetail[] | null> => {
  try {
    const response = await axiosPrivate.get("/requisi/detail");
    return response.data.data;
  } catch (error) {
    console.error("Error fetching requisition details:", error);
    return null;
  }
};

export const GetRequisicionesService = async (
  axiosPrivate: AxiosInstance
): Promise<RequisiInterface[] | null> => {
  try {
    const response = await axiosPrivate.get("/requisi");
    return response.data.requisis;
  } catch (error) {
    console.error("Error fetching requisitions:", error);
    return null;
  }
};

export const GetRequisicionByIdService = async (
  id_requisi: string,
  axiosPrivate: AxiosInstance
): Promise<RequisiInterface | undefined> => {
  try {
    const response = await axiosPrivate.get(`/requisi/${id_requisi}`);

    return response.data.requisi;
  } catch (error) {
    console.error("Error fetching requisition by ID:", error);
    return undefined;
  }
};

export const PostRequisicionService = async (
  requisicion: RequisiInterface,
  axiosPrivate: AxiosInstance
): Promise<RequisiInterface> => {
  const response = await axiosPrivate.post(
    "/requisi",
    {
      id_requisi: requisicion.id_requisi,
      id_employes: requisicion.id_employes,
      fecha: requisicion.fecha,
      descripcion: requisicion.descripcion,
      estado: requisicion.estado,
    },
    { headers: { "Content-Type": "application/json" } }
  );
  return response.data.newRequisi;
};

export const PutRequisicionService = async (
  id_requisi: string,
    requisicion: RequisiInterface,
    axiosPrivate: AxiosInstance
): Promise<void> => {
    await axiosPrivate.put(
      `/requisi/${id_requisi}`,
      {
        id_producto: requisicion.id_product,
        id_requisi: requisicion.id_requisi,
        id_employes: requisicion.id_employes,
        fecha: requisicion.fecha,
        descripcion: requisicion.descripcion,
        estado: requisicion.estado,
      },
      {
        headers: { "Content-Type": "application/json" },
      }
    );
};
export const DeleteRequisicionService = async (
  id_requisi: string,
  axiosPrivate: AxiosInstance
): Promise<void> => {
  await axiosPrivate.delete(`/requisi/${id_requisi}`);
};


