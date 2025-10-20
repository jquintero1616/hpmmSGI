import { AxiosInstance } from "axios";
import { vendedorInterface } from "../interfaces/vendedor.interface";


export const GetVendedoresService = async (
    axiosPrivate: AxiosInstance
): Promise<vendedorInterface[] | null> => {
    try {
        const response = await axiosPrivate.get(`/vendedor`);
        return response.data.vendedor;
    } catch (error) {
        console.error("Error al obtener los vendedores:", error);
        return null;
    }
};

export const GetVendedorByIdService = async (
    id_vendedor: string,
    axiosPrivate: AxiosInstance
): Promise<vendedorInterface | undefined> => {
    try {
        const response = await axiosPrivate.get(
            `vendedor/${id_vendedor}`
        );
        return response.data.vendedor;
    } catch (error) {
        console.error(`Error al obtener el vendedor por ID: ${id_vendedor}`, error);
        return undefined;
    }
};

export const PostCreateVendedorService = async (
    vendedor: vendedorInterface,
    axiosPrivate: AxiosInstance
): Promise<vendedorInterface> => {
    try {
        const response = await axiosPrivate.post(
            `/vendedor`,
            {
                id_supplier: vendedor.id_supplier,
                nombre_contacto: vendedor.nombre_contacto,
                correo: vendedor.correo,
                telefono: vendedor.telefono,
                identidad: vendedor.identidad,
                estado: vendedor.estado,
            },
            { headers: { "Content-Type": "application/json" }}
        );
        return response.data.vendedor;
    } catch (error) {
        console.error(`Error al crear el vendedor: ${error}`);
        throw error;
    }
};

export const PutUpdateVendedorService = async (
    id_vendedor: string,
    vendedor: vendedorInterface,
    axiosPrivate: AxiosInstance
): Promise<void> => {
    try {
        await axiosPrivate.put<vendedorInterface>(
            `vendedor/${id_vendedor}`,
            vendedor
        );
    } catch (error) {
        console.error(`Error al actualizar el vendedor: ${error}`);
        throw error;
    }
};

export const DeleteVendedorService = async (
    id_vendedor: string,
    axiosPrivate: AxiosInstance
): Promise<void> => {
    try {
        await axiosPrivate.delete(`vendedor/${id_vendedor}`);
    } catch (error) {
        console.error(`Error al eliminar el vendedor: ${error}`);
        throw error;
    }
};
