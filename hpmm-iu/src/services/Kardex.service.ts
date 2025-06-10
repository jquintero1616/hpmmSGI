import { KardexDetail, kardexInterface } from "../interfaces/kardex.interface";
import { AxiosInstance } from "axios";


export const GetKardexDetailsService = async (axiosPrivate: AxiosInstance): Promise<KardexDetail[] | null> => {
    try {

        const response = await axiosPrivate.get(`/kardex/detail`);
        return response.data.data;

    } catch (error) {
        console.error("Error al obtener el kardex:", error);
        return null;
    }
};

export const GetKardexService = async (axiosPrivate: AxiosInstance): Promise<kardexInterface[] | null> => {
    try {

        const response = await axiosPrivate.get(`/kardex`);
        return response.data.kardex;

    } catch (error) {
        console.error("Error al obtener el kardex:", error);
        return null;
    }
};



export const GetKardexByIdService = async (id_kardex: string, axiosPrivate: AxiosInstance): Promise<kardexInterface | undefined> => {
    try {
        const response = await axiosPrivate.get<kardexInterface>(`kardex/${id_kardex}`);
        return response.data;
    } catch (error) {
        console.error(`Error al obtener el kardex por ID: ${id_kardex}`, error);
        return undefined;
    }
};

export const PostCreateKardexService = async (
    kardexs: kardexInterface, 
    axiosPrivate: AxiosInstance
): Promise<kardexInterface> => {
    try {
        const response = await axiosPrivate.post<kardexInterface>(`kardex`, {
            id_kardex: kardexs.id_kardex,
            id_product: kardexs.id_product,
            id_shopping: kardexs.id_shopping,
            anio_creacion: kardexs.anio_creacion,
            tipo_movimiento: kardexs.tipo_movimiento,
            fecha_movimiento: kardexs.fecha_movimiento,
            numero_factura: kardexs.numero_factura,
            cantidad: kardexs.cantidad,
            precio_unitario: kardexs.precio_unitario,
            tipo_solicitud: kardexs.tipo_solicitud,
            requisicion_numero: kardexs.requisicion_numero,
            tipo: kardexs.tipo,
            observacion: kardexs.observacion,
            estado: kardexs.estado,
        }, {
            headers: {
                "Content-Type": "application/json",
            },
        });
        return response.data;
    } catch (error) {
        console.error("Error al crear el kardex:", error);
        throw error;
    }
}

export const PutUpdateKardexService = async (
    id_kardex: string, 
    kardex: kardexInterface,
    axiosPrivate: AxiosInstance
    ): Promise<void> => {    
    try {
        await axiosPrivate.put(`kardex/${id_kardex}`, kardex);
    } catch (error) {
        console.error(`Error al actualizar el kardex con ID: ${id_kardex}`, error);
        throw error;    
    }
}

export const DeleteKardexService = async (id_kardex: string, axiosPrivate: AxiosInstance): Promise<void> => {
    try {
        await axiosPrivate.delete(`/kardex/${id_kardex}`);
    } catch (error) {
        console.error(`Error al eliminar el kardex con ID: ${id_kardex}`, error);
        throw error;
    }
}




