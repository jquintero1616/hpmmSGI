import { AxiosInstance } from "axios";
import { ScomprasInterface } from "../interfaces/SolicitudCompras.inteface";

export const GetSolicitudesComprasService = async (
  axiosPrivate: AxiosInstance
): Promise<ScomprasInterface[] | null> => {
  try {
    const response = await axiosPrivate.get("/scompras");
    return response.data.scompras;
  } catch (error) {
    console.error("error en solicitudes de compras:", error);
    return null;
  }
};

export const GetSolicitudCompraByIdService = async (
  id_scompra: string,
  axiosPrivate: AxiosInstance
): Promise<ScomprasInterface | undefined> => {
  try {
    const response = await axiosPrivate.get(`/scompras/${id_scompra}`);
    return response.data.scompras;
  } catch (error) {
    console.error("error en solicitud de compra:", error);
    return undefined;
  }
};

export const PostCreateSolicitudCompraService = async (
  scompra: ScomprasInterface,
    axiosPrivate: AxiosInstance
): Promise<ScomprasInterface> => {
  const response = await axiosPrivate.post(
    `/scompras`,
    {
      id_scompra: scompra.id_scompra,
      id_requisi: scompra.id_requisi,
      estado: scompra.estado,
    },
    { headers: { "Content-Type": "application/json" } }
  );

  return response.data.scompras;
}

export const PutUpdateSolicitudCompraService = async (
  id_scompra: string,   
    scompra: ScomprasInterface,
    axiosPrivate: AxiosInstance
): Promise<void> => {
  const { id_requisi, estado } = scompra;
  await axiosPrivate.put(
    `/scompras/${id_scompra}`,
    {
      id_requisi,
      estado
    },
    { headers: { "Content-Type": "application/json" } }
  );
}

export const DeleteSolicitudCompraService = async (
    id_scompra: string,
    axiosPrivate: AxiosInstance
    ): Promise<void> => {
    await axiosPrivate.delete(`/scompras/${id_scompra}`);
    }