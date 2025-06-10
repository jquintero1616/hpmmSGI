import { AxiosInstance } from "axios";
import { RolesInterface } from "../interfaces/role.interface";

export const GetRolesService = async (
  axiosPrivate: AxiosInstance
): Promise<RolesInterface[] | null> => {
  try {
    const response = await axiosPrivate.get(`/roles`);
    return response.data.roles;
  } catch (error) {
    console.error("Error al obtener los roles:", error);
    return null;
  }
};

export const GetRoleByIdService = async (
  id_rol: string,
  axiosPrivate: AxiosInstance
): Promise<RolesInterface | undefined> => {
  try {
    const response = await axiosPrivate.get<RolesInterface>(`roles/${id_rol}`);
    return response.data;
  } catch (error) {
    console.error(`Error al obtener el rol por ID: ${id_rol}`, error);
    return undefined;
  }
};

export const PostCreateRoleService = async (
  role: RolesInterface,
  axiosPrivate: AxiosInstance
): Promise<RolesInterface> => {
  try {
    const response = await axiosPrivate.post<RolesInterface>(
      `roles`,
      {
        id_rol: role.id_rol,
        name: role.name,
        descripcion: role.descripcion,
        estado: role.estado,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error al crear el rol:", error);
    throw error;
  }
};
export const PutUpdateRoleService = async (
  id_rol: string,
  roles: RolesInterface,
  axiosPrivate: AxiosInstance
): Promise<void> => {
  try {
    await axiosPrivate.put<RolesInterface>(`roles/${id_rol}`, roles);
  } catch (error) {
    console.error(`Error al actualizar el rol: ${error}`);
    throw error;
  }
};

export const DeleteRoleService = async (
  id_rol: string,
  axiosPrivate: AxiosInstance
): Promise<void> => {
  try {
    await axiosPrivate.delete(`/roles/${id_rol}`);
  } catch (error) {
    console.error(`Error al eliminar el rol con ID: ${id_rol}`, error);
    throw error;
  }
};
