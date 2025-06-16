import { AxiosInstance } from "axios";
import { DetallePactInterface  } from "../interfaces/DetallePactos.intefaces"; 


export const GetDetallePactosService = async (
  axiosPrivate: AxiosInstance): Promise<DetallePactInterface[] | null> => {
  try {
    const response = await axiosPrivate.get("/detalle_pactos");
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
    const response = await axiosPrivate.get(`/detalle_pactos/${id}`);
    return response.data.unitPact;
  } catch (error) {
    console.error("Error fetching detalle_pacto:", error);
    return undefined;
  }
};

export const PostCreateDetallePactosService = async (
    
