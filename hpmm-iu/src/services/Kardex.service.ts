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
    console.log("kardexs", kardexs);
    try {
        const response = await axiosPrivate.post<kardexInterface>(
          `kardex`,
          {
            id_kardex: kardexs.id_kardex,
            id_product: kardexs.id_product,
            id_shopping: kardexs.id_shopping || null, // Puede ser null para donaciones
            id_donante: kardexs.id_donante || null, // ID del donante para donaciones
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
            cantidad_solicitada: kardexs.cantidad_solicitada,
            id_scompra: kardexs.id_scompra,
            nombre_producto: kardexs.nombre_producto,
            isv: kardexs.isv ? 0.15 : 0, // Asumiendo que isv es un booleano
            total: kardexs.total,
            id_vendedor: kardexs.id_vendedor,
            rfid: kardexs.rfid,
            cantidad_recepcionada: kardexs.cantidad_recepcionada,
            //- nuevos
            descripcion: kardexs.descripcion,
            fecha_vencimiento: kardexs.fecha_vencimiento,
            numero_lote: kardexs.numero_lote,
            //-----
            estado: kardexs.estado,
          },
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
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

// ===================== DONACIONES =====================

// Obtener solo donaciones del Kardex
export const GetDonacionesKardexService = async (
    axiosPrivate: AxiosInstance
): Promise<KardexDetail[] | null> => {
    try {
        const response = await axiosPrivate.get(`/kardex/donaciones/detail`);
        return response.data.data;
    } catch (error) {
        console.error("Error al obtener las donaciones del kardex:", error);
        return null;
    }
};

// Crear donación directamente en Kardex
export const PostCreateDonacionKardexService = async (
    donacion: kardexInterface,
    axiosPrivate: AxiosInstance
): Promise<kardexInterface> => {
    try {
        const response = await axiosPrivate.post<kardexInterface>(
            `/kardex/donaciones`,
            {
                id_product: donacion.id_product,
                id_donante: donacion.id_donante,
                anio_creacion: donacion.anio_creacion || new Date().getFullYear().toString(),
                tipo_movimiento: donacion.tipo_movimiento,
                fecha_movimiento: donacion.fecha_movimiento,
                numero_factura: donacion.numero_factura || "",
                cantidad: donacion.cantidad,
                precio_unitario: donacion.precio_unitario || 0,
                tipo_solicitud: "Donacion",
                requisicion_numero: donacion.requisicion_numero || "DON-" + Date.now(),
                tipo: donacion.tipo || "Pendiente",
                observacion: donacion.observacion,
                descripcion: donacion.descripcion,
                fecha_vencimiento: donacion.fecha_vencimiento,
                numero_lote: donacion.numero_lote,
                estado: donacion.estado ?? true,
            },
            {
                headers: {
                    "Content-Type": "application/json",
                },
            }
        );
        return response.data;
    } catch (error) {
        console.error("Error al crear la donación:", error);
        throw error;
    }
};





