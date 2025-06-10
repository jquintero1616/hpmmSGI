import { Request, Response } from "express";
import * as RequisiProductServie from "../services/requisi.x.product.service";
import { asyncWrapper } from "../utils/errorHandler";
import { NewRequisiXProduct } from "../types/requisi_x_product";


export const getAllRequisiProductController = asyncWrapper(
    async (req: Request, res: Response): Promise<void> => {
        const requisis = await RequisiProductServie.getAllRequisiProdctService();
        res.status(200).json({
            msg: "Requisiciones y productos encontradas correctamente",
            totalRequisis: requisis.length,
            requisis,
        });
    }
);

export const getByIdController = asyncWrapper(
  async (req: Request, res: Response): Promise<void> => {
    const id_requisi = (req.params.id || "").trim();
    const requisi = await RequisiProductServie.getRequisiProductByIdService(id_requisi);

    if (!requisi) {
      res.status(404).json({ msg: "Requisicion y producto no encontrado" });
      return;
    }

    res
      .status(200)
      .json({
        msg: `Requisicion y producto encontrada correctamente ${id_requisi}`,
        requisi,
      });
  }
);



export const createRequisiProductController = asyncWrapper(
  async (req: Request, res: Response): Promise<void> => {
    const payload: NewRequisiXProduct = req.body;
    const newRequisiProduct = await RequisiProductServie.createRequisiProductService(payload);
    res.status(201).json({
      msg: "Requisicion y producto creada correctamente",
      newRequisiProduct,
    });
  }
);


export const UpdateRequisiProductController = asyncWrapper(
  async (req: Request, res: Response): Promise<void> => {
    const id_requisi = (req.params.id || "").trim();
    const { cantidad } = req.body;
    const updatedRequisiProduct =
      await RequisiProductServie.updateRequisiProductService(
        id_requisi,
        cantidad
     );

    if (!updatedRequisiProduct) {
      res.status(404).json({ msg: "Requisicion y producto no encontrada" });
      return;
    }

    res.status(200).json({
      msg: `Requisicion y producto actualizada correctamente ${id_requisi}`,
      updatedRequisiProduct,
    });
  } 
);