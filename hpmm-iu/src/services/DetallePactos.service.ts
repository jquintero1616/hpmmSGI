import { AxiosInstance } from "axios";
import { DetallePactInterface  } from "../interfaces/DetallePactos.intefaces"; 


export const GetDetallePactosService = async (
  axiosPrivate: AxiosInstance): Promise<DetallePactInterface[] | null> => {
  try {
    const response = await axiosPrivate.get("/unitPacts");
    return response.data.unitPacts;
  } catch (error) {
    console.error("Error fetching detalle_pactos:", error);
    return null;
  }

}
export const GetDetallePactosByIdService = async (
  axiosPrivate: AxiosInstance,
  id: string
): Promise<DetallePactInterface | undefined> => {
  try {
    const response = await axiosPrivate.get(`/unitPacts/${id}`);
    return response.data.unitPact;
  } catch (error) {
    console.error("Error fetching detalle_pacto:", error);
    return undefined;
  }
};

export const PostCreateDetallePactosService = async (
  detalleUnitsPactos: DetallePactInterface,
  axiosPrivate: AxiosInstance
): Promise<void> => {
  const response = await axiosPrivate.post(
    `/unitPacts`,
    {
      id_units_x_pacts: detalleUnitsPactos.id_units_x_pacts,
      id_pacts: detalleUnitsPactos.id_pacts,
      id_units: detalleUnitsPactos.id_units,
      id_product: detalleUnitsPactos.id_product,
      cantidad: detalleUnitsPactos.cantidad,
      estado: detalleUnitsPactos.estado
    },
    { headers: { "Content-Type": "application/json" } }
  );
  return response.data.newUnitPact;
};
    

export const PutUpdateDetallePactosService = async (
  id_units_x_pacts: string,
  detallePactos: DetallePactInterface,
  axiosPrivate: AxiosInstance
): Promise<void> => {
  try {
    const { id_pacts, id_units, id_product, cantidad, estado } = detallePactos;
    await axiosPrivate.put(`/unitPacts/${id_units_x_pacts}`, {
      id_units_x_pacts,
      id_pacts,
      id_units,
      id_product,
      cantidad,
      estado,
    });
  } catch (error) {
    console.error(`Error updating detalle_pactos with id ${id_units_x_pacts}:`, error);
    throw error;
  }
};

export const DeleteDetallePactosService = async (
  id_units_x_pacts: string,
  axiosPrivate: AxiosInstance
): Promise<void> => {
  await axiosPrivate.delete(`/unitPacts/${id_units_x_pacts}`);
}
