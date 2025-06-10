import { AxiosInstance } from "axios";
import { SubdireccionInterface } from "../interfaces/subdireccion.interface";

export const GetSubdireccionesService = async (axiosPrivate: AxiosInstance): Promise<
    SubdireccionInterface[] | null
> => {
    try {
        const response = await axiosPrivate.get("/subdireccion");
        return response.data.subdirecciones;
    } catch (error) {
        console.error("Error fetching subdirecciones:", error);
        return null;
    }
}

export const GetSubdireccionByIdService = async (
    id_subdireccion: string,
    axiosPrivate: AxiosInstance
): Promise<SubdireccionInterface | undefined> => {
    try {
        const response = await axiosPrivate.get
        (`/subdireccion/${id_subdireccion}`);
        return response.data.subdireccion;
    } catch (error) {
        console.error("Error fetching subdireccion:", error);
        return undefined;
    }
}

export const PostCreateSubdireccionService = async (
    subdireccion: SubdireccionInterface,
    axiosPrivate: AxiosInstance
): Promise<SubdireccionInterface> => {
    const response = await axiosPrivate.post(
        "/subdireccion",
        {
            id_subdireccion: subdireccion.id_subdireccion,
            nombre: subdireccion.nombre,
            estado: subdireccion.estado,
            id_direction: subdireccion.id_direction,
        },
        { headers: { "Content-Type": "application/json" } }
    );
    return response.data.NewSubdireccion;
}
export const PutUpdateSubdireccionService = async (
    id_subdireccion: string,
    subdireccion: SubdireccionInterface,
    axiosPrivate: AxiosInstance
): Promise<SubdireccionInterface | null> => {
    try {
        const response = await axiosPrivate.put(
            `/subdireccion/${id_subdireccion}`,
            {
                id_subdireccion: subdireccion.id_subdireccion,
                id_direction: subdireccion.id_direction,
                nombre: subdireccion.nombre,
                estado: subdireccion.estado
            },
            { headers: { "Content-Type": "application/json" } }
        );
        return response.data.updatedSubdireccion;
    } catch (error) {
        console.error("Error updating subdireccion:", error);
        return null;
    }
}

export const DeleteSubdireccionService = async (
    id_subdireccion: string,
    axiosPrivate: AxiosInstance
): Promise<void> => {
    await axiosPrivate.delete(`/subdireccion/${id_subdireccion}`)
    .catch((error) => {
        console.error("Error deleting subdireccion:", error);
    });
};
