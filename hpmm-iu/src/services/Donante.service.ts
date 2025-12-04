import { AxiosInstance } from "axios";
import { DonanteInterface } from "../interfaces/donante.interface";

// Obtener todos los donantes
export const GetDonantesService = async (
  axiosPrivate: AxiosInstance
): Promise<DonanteInterface[] | null> => {
  try {
    const response = await axiosPrivate.get(`/donantes`);
    return response.data.donantes;
  } catch (error) {
    console.error("Error al recuperar los donantes", error);
    throw error;
  }
};

// Obtener donantes activos (para selects)
export const GetDonantesActivosService = async (
  axiosPrivate: AxiosInstance
): Promise<DonanteInterface[] | null> => {
  try {
    const response = await axiosPrivate.get(`/donantes/activos`);
    return response.data.donantes;
  } catch (error) {
    console.error("Error al recuperar los donantes activos", error);
    throw error;
  }
};

// Obtener donante por ID
export const GetDonanteByIdService = async (
  id_donante: string,
  axiosPrivate: AxiosInstance
): Promise<DonanteInterface | undefined> => {
  try {
    const response = await axiosPrivate.get<{ donante: DonanteInterface }>(
      `/donantes/${id_donante}`
    );
    return response.data.donante;
  } catch (error) {
    console.error("Error al recuperar el donante", error);
    throw error;
  }
};

// Buscar donantes por nombre
export const SearchDonantesService = async (
  nombre: string,
  axiosPrivate: AxiosInstance
): Promise<DonanteInterface[] | null> => {
  try {
    const response = await axiosPrivate.get(`/donantes/buscar?nombre=${encodeURIComponent(nombre)}`);
    return response.data.donantes;
  } catch (error) {
    console.error("Error al buscar donantes", error);
    throw error;
  }
};

// Crear donante
export const PostCreateDonanteService = async (
  donante: DonanteInterface,
  axiosPrivate: AxiosInstance
): Promise<DonanteInterface> => {
  try {
    const response = await axiosPrivate.post(
      `/donantes`,
      {
        nombre: donante.nombre,
        tipo_donante: donante.tipo_donante,
        numero_contacto: donante.numero_contacto,
        correo: donante.correo,
        direccion: donante.direccion,
        rtn: donante.rtn,
        notas: donante.notas,
        estado: donante.estado,
      },
      { headers: { "Content-Type": "application/json" } }
    );
    return response.data.donante;
  } catch (error) {
    console.error("Error al crear el donante", error);
    throw error;
  }
};

// Actualizar donante
export const PutUpdateDonanteService = async (
  id_donante: string,
  donante: DonanteInterface,
  axiosPrivate: AxiosInstance
): Promise<void> => {
  try {
    await axiosPrivate.put(`/donantes/${id_donante}`, {
      nombre: donante.nombre,
      tipo_donante: donante.tipo_donante,
      numero_contacto: donante.numero_contacto,
      correo: donante.correo,
      direccion: donante.direccion,
      rtn: donante.rtn,
      notas: donante.notas,
      estado: donante.estado,
    });
  } catch (error) {
    console.error("Error al actualizar el donante", error);
    throw error;
  }
};

// Eliminar donante (soft delete)
export const DeleteDonanteService = async (
  id_donante: string,
  axiosPrivate: AxiosInstance
): Promise<void> => {
  try {
    await axiosPrivate.delete(`/donantes/${id_donante}`);
  } catch (error) {
    console.error("Error al eliminar el donante", error);
    throw error;
  }
};
