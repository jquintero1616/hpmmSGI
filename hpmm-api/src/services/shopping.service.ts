import * as ShoppingModel from "../models/shopping.model";
import { NewShopping } from "../types/shopping";
import logger from "../utils/loggers";


export const getAllShoppingService = async (): Promise<NewShopping[]> => {
    try {
        const shopping = await ShoppingModel.getAllshoppingModel();
        return shopping;

    } catch (error) {
        logger.error("Error getting all shopping", error);
        throw error;
    }

}
    

export const getShoppingByIdService = async (
    id_shopping: string
): Promise<NewShopping | null> => {
    return ShoppingModel.getShoppingByIdModel(id_shopping);
}


export const CreateShoppingService = async (data: NewShopping) => {
    try {
        return await ShoppingModel.createShoppingModel(data);
    } catch (error) {
        logger.error("Error creating shopping", error);
        throw error;
    }
}

export const updateShoppingService = async (
  id_shopping: string,
  id_scompra: string,
  id_vendedor: string,
  fecha_compra: Date,
  lugar_entrega: string,
  numero_cotizacion: string,
  numero_pedido: string,
  nombre_unidad: string,
  shopping_order_id: string,
  total: number,
  estado: boolean
): Promise<NewShopping> => {
  try {
    const updatedShopping = await ShoppingModel.updateShoppingModel(
      id_shopping,
      id_scompra,
      id_vendedor,
      numero_cotizacion,
      numero_pedido,
      nombre_unidad,
      fecha_compra,
      lugar_entrega,
      shopping_order_id,
      total,
      estado
    );
    if (!updatedShopping) {
      throw new Error(`shopping with id_shopping ${id_shopping} not found`);
    }
    return updatedShopping;
  } catch (error) {
    logger.error(`Error updating shopping ${id_shopping}`, error);
    throw error;
  }
};

export async function deleteShoppingService(
    id_shopping: string
): Promise<NewShopping | null> {
    const existing = await ShoppingModel.getShoppingByIdModel(id_shopping);
    if (!existing) return null;

    const deactivatedShopping = await ShoppingModel.deleteShoppingModel(id_shopping);
    return deactivatedShopping;
}