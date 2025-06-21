import { AxiosInstance } from "axios";
import { ShoppingInterface } from "../interfaces/shopping.interface";



export const GetShoppingService = async (axiosPrivate: AxiosInstance):
Promise<ShoppingInterface[] | null> => {
    try {
        const response = await axiosPrivate.get("/shopping");
        return response.data.shopping;
    } catch (error) {
        console.error("Error fetching shopping data:", error);
        return null;
    }
}

export const GetShoppingByIdService = async (
    id_shopping: string,
    axiosPrivate: AxiosInstance
): Promise<ShoppingInterface | undefined> => {
    try {
        const response = await axiosPrivate.get(`/shopping/${id_shopping}`);
        return response.data.shopping;
    } catch (error) {
      console.error(
        `Error fetching shopping data for ID ${id_shopping}:`, 
        error
        );
        return undefined;
    }
}

export const PostShoppingService = async (
    shopping: ShoppingInterface,
    axiosPrivate: AxiosInstance
): Promise<ShoppingInterface> => {
    const response = await axiosPrivate.post(
        `/shopping`,
        {
            id_shopping: shopping.id_shopping,
            id_scompra: shopping.id_scompra,
            id_vendedor: shopping.id_vendedor,
            fecha_compra: shopping.fecha_compra,
            shopping_order_id: shopping.shopping_order_id,
            numero_cotizacion: shopping.numero_cotizacion,
            numero_pedido: shopping.numero_pedido,
            nombre_unidad: shopping.nombre_unidad,
            lugar_entrega: shopping.lugar_entrega,
            total: shopping.total,
            estado: shopping.estado,
            
        }
    );
    
    return response.data.shopping;
};

export const PutShoppingService = async (
    id_shopping: string,
    shopping: ShoppingInterface,
    axiosPrivate: AxiosInstance
): Promise<void> => {
    await axiosPrivate.put(
        `/shopping/${id_shopping}`,
        {
            id_shopping: shopping.id_shopping,
            id_scompra: shopping.id_scompra,
            id_vendedor: shopping.id_vendedor,
            fecha_compra: shopping.fecha_compra,
            shopping_order_id: shopping.shopping_order_id,
            numero_cotizacion: shopping.numero_cotizacion,
            numero_pedido: shopping.numero_pedido,
            nombre_unidad: shopping.nombre_unidad,
            lugar_entrega: shopping.lugar_entrega,
            total: shopping.total,
            estado: shopping.estado,
        }
    );
}

export const DeleteShoppingService = async (
    id_shopping: string,
    axiosPrivate: AxiosInstance
): Promise<void> => {
    await axiosPrivate.delete(`/shopping/${id_shopping}`);
}   
