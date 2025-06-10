import { Request, Response } from "express";
import * as ShoppingService from "../services/shopping.service";
import { asyncWrapper } from "../utils/errorHandler";
import { NewShopping } from "../types/shopping";

export const getAllShoppingController = asyncWrapper(
    async (req: Request, res: Response): Promise<void> => {
        const shopping = await ShoppingService.getAllShoppingService();
        res.status(200).json({
            msg: "Compras buscadas correctamente",
            totalShopping: shopping.length,
            shopping,
        });
    }
)

export const getByIdShoppingController = asyncWrapper(
    async (req: Request, res: Response): Promise<void> => {
        const id_shopping = (req.params.id || "").trim();
        const shopping = await ShoppingService.getShoppingByIdService(id_shopping);
        if (!shopping) {
            res.status(404).json({ msg: "Compra no encontrada" });
            return;
        }
        res.status(200).json({
            msg: `Compra encontrada con id_shopping ${id_shopping}`,
            shopping,
        });
    }
)

export const createShoppingController = asyncWrapper(
    async (req: Request, res: Response): Promise<void> => {
        const data: NewShopping = req.body;
        const shopping = await ShoppingService.CreateShoppingService(data);
        res.status(201).json({
            msg: "Compra creada correctamente",
            shopping,
        });
    }
)


export const UpdateShoppingController = asyncWrapper(
    async (req: Request, res: Response): Promise<void> => {
        const id_shopping = (req.params.id || "").trim();
        const { id_scompra, id_vendedor, fecha_compra, shopping_order_id, total, estado } = req.body;
        const shopping = await ShoppingService.updateShoppingService(id_shopping, id_scompra, id_vendedor, fecha_compra, shopping_order_id, total, estado);
        if (!shopping) {
            res.status(404).json({ msg: "Compra no encontrada" });
            return;
        }
        res.status(200).json({
            msg: `Compra actualizada con id_shopping ${id_shopping}`,
            shopping,
        });
    }
)

export const deleteController = asyncWrapper(
    async (req: Request, res: Response): Promise<void> => {
        const id_shopping = (req.params.id || "").trim();
        const shopping = await ShoppingService.deleteShoppingService(id_shopping);
        if (!shopping) {
            res.status(404).json({ msg: "Compra no encontrada" });
            return;
        }
        res.status(200).json({
            msg: `Compra eliminada con id_shopping ${id_shopping}`,
            shopping,
        });
    }
)