import { Request, Response } from "express";
import * as ScomprasService from "../services/scompras.service";
import { asyncWrapper } from "../utils/errorHandler";
import { NewsScompras } from "../types/scompras";





export const getAllScomprasController = asyncWrapper(
    async (req: Request, res: Response): Promise<void> => {
    const scompras = await ScomprasService.getAllScomprasService();
    res.status(200).json({
        msg: "Scompras buscadas correctamente",
        totalScompras: scompras.length,
        scompras,
    });
})

export const getScomprasByIDController = asyncWrapper 
(async (req: Request, res: Response): Promise<void> => {
    const id_scompras = (req.params.id || "").trim();
    const scompras = await ScomprasService.getScomprasByService(id_scompras);

    if (!scompras) {
        res.status(404).json({ msg: "Scompras no encontrada" });
        return;
    }

    res.status(200).json({ msg: `Scompras encontrada con id_scompras ${id_scompras}`, scompras });
}
);
    

export const createdScomprasController = asyncWrapper (
    async (req: Request, res: Response): Promise<void> => {
    const payload = req.body;
    const newScompras = await ScomprasService.createdScomprasService(payload);
    res.status(201).json({ 
        msg: "Scompras creado correctamente", 
        newScompras 
    });
    }
);


export const updateScompraController = asyncWrapper(
  async (req: Request, res: Response): Promise<void> => {
    const id = (req.params.id || "").trim();
    const payload = req.body as Partial<NewsScompras>;
    const updated = await ScomprasService.updateScomprasService(id, payload);
    if (!updated) {
      res.status(404).json({ message: `No existe solicitud ${id}` });
      return;
    }
    res.status(200).json({ message: "Actualizada correctamente", data: updated });
  }
);