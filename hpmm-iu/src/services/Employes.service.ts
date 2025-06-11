import { AxiosInstance } from "axios";
import { EmployesInterface } from "../interfaces/Employe.interface";

export const GetEmployesService = async (
  axiosPrivate: AxiosInstance
): Promise<EmployesInterface[] | null> => {
  try {
    const response = await axiosPrivate.get(`/employes`);
    return response.data.employes;
  } catch (error) {
    console.error("Error al obtener los empleados:", error);
    return null;
  }
};

export const GetEmployeByIdService = async (
  id_employes: string,
  axiosPrivate: AxiosInstance
): Promise<EmployesInterface | undefined> => {
  try {
    const response = await axiosPrivate.get<EmployesInterface>(
      `employes/${id_employes}`
    );
    return response.data;
  } catch (error) {
    console.error(`Error al obtener el empleado por ID: ${id_employes}`, error);
    return undefined;
  }
};

export const PostCreateEmployeService = async (
  employe: EmployesInterface,
  axiosPrivate: AxiosInstance
): Promise<EmployesInterface> => {
  try {
    const response = await axiosPrivate.post<EmployesInterface>(
      `employes`,
      {
        usuario: employe.usuario,
        unidad: employe.unidad,
        subdireccion: employe.subdireccion,
        direccion: employe.direccion,
        name: employe.name,
        email: employe.email,
        telefono: employe.telefono,
        puesto: employe.puesto,
        estado: employe.estado,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error al crear el empleado:", error);
    throw error;
  }
};
export const PutUpdateEmployeService = async (
  id_employes: string,
  employe: EmployesInterface,
  axiosPrivate: AxiosInstance
): Promise<void> => {
  try {
    await axiosPrivate.put<EmployesInterface>(
      `employes/${id_employes}`,
      employe
    );
  } catch (error) {
    console.error(`Error al actualizar el empleado: ${error}`);
    throw error;
  }
};

export const DeleteEmployeService = async (
  id_employes: string,
  axiosPrivate: AxiosInstance
): Promise<void> => {
  try {
    await axiosPrivate.delete(`/employes/${id_employes}`);
  } catch (error) {
    console.error(`Error al eliminar el empleado: ${error}`);
    throw error;
  }
};
