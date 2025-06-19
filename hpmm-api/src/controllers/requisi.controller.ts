import { Request, Response } from "express";
import * as RequisiService from "../services/requisi.service";
import { asyncWrapper } from "../utils/errorHandler";
import { Requisi } from "../types/requisi";



export const getRequisiDetailsController = asyncWrapper(
  async (req: Request, res: Response): Promise<void> => {
    const { limit, offset } = req.pagination ?? {};
    const raw = req.query.status;
    const statuses = raw
    ? Array.isArray(raw)
    ? (raw as string[])
    : [raw as string]
    : ["Aprobado", "Rechazado", "Pendiente", "Cancelado"];

    const data = await RequisiService.getRequisiDetailService({
      limit,
      offset,
      statuses: statuses as any,
    });
    res.status(200).json({
      msg: "Detalles de Requisiciones obtenidos",
      page: req.pagination?.page,
      limit,
      count: data.length,
      data,
    });
  }
);


export const getAllRequisiController = asyncWrapper(
  async (req: Request, res: Response): Promise<void> => {
    const requisis = await RequisiService.getAllRequiService();
    res.status(200).json({
      msg: "Requisiciones encontradas correctamente",
      totalRequisis: requisis.length,
      requisis,
    });
  }
);

export const getRequisiByController = asyncWrapper(
  async (req: Request, res: Response): Promise<void> => {
    const id_requisi = (req.params.id || "").trim();
    const requisi = await RequisiService.getRequiByService(id_requisi);

    if (!requisi) {
      res.status(404).json({ msg: "Requisicion no encontradas" });
      return;
    }

    res.status(200).json({
      msg: `Requisicion encontrada con id_requisi ${id_requisi}`,
      requisi,
    });
  }
);

export const createRequisiController = asyncWrapper(
  async (req: Request, res: Response): Promise<void> => {
    const data: Requisi = req.body;
    const requisi = await RequisiService.createRequiService(data);
    res.status(201).json({
      msg: `Requisicion creada correctamente con id_requisi}`,
      requisi,
    });
  }
);

export const UpdateRequisiController = asyncWrapper(
  async (req: Request, res: Response): Promise<void> => {
    const id_requisi = (req.params.id || "").trim();
    const payload = req.body;
    const updatedRequisi = await RequisiService.updateRequisiService(
      id_requisi,
      payload
    );

    if (!updatedRequisi) {
      res.status(404).json({ msg: "Requisicion no encontrada" });
      return;
    }

    res
      .status(200)
      .json({ msg: "Requisicion actualizada correctamente", updatedRequisi });
  }
);

export const deleteRequisiController = asyncWrapper(
    async (req: Request, res: Response): Promise<void> => {
        const id_requisi = (req.params.id || "").trim();
        const deletedRequisi = await RequisiService.deleteRequisiService(id_requisi);
    
        if (!deletedRequisi) {
            res.status(404).json({ msg: "Requisicion no encontrada" });
            return;
        }

        res.status(200).json({ msg: `Requisicion eliminada correctamente con id_requisi ${id_requisi}`,
        deletedRequisi,
        });
    }
);  
