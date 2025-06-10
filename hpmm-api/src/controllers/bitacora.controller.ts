import { Request, Response } from "express";
import * as BitacoraService from "../services/bitacora.service";
import { asyncWrapper } from "../utils/errorHandler";

// Listar todas las entradas
export const getAllBitacoraController = asyncWrapper(
  async (req: Request, res: Response) => {
    const logs = await BitacoraService.getAllBitacoraService();
    res.status(200).json({
      msg: "Bitácora obtenida correctamente",
      total: logs.length,
      logs,
    });
  }
);

// Obtener una entrada por ID
export const getBitacoraByIdController = asyncWrapper(
  async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    const log = await BitacoraService.getBitacoraByIdService(id);
    if (!log) {
      res.status(404).json({ msg: `No se encontró bitácora con id ${id}` });
      return;
    }
    res.status(200).json({ msg: `Bitácora ${id}`, log });
  }
);
