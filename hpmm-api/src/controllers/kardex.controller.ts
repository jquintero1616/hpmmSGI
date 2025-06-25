import { Request, Response } from "express";
import * as KardexService from "../services/kardex.service";
import { asyncWrapper } from "../utils/errorHandler";
import { KardexDetail, NewKardex } from "../types/kardex";

// Obtener detalles de Kardex con filtros y paginación
export const getKardexDetailsController = asyncWrapper(
  async (req: Request, res: Response): Promise<void> => {
    const { limit, offset } = req.pagination ?? {};
    const raw = req.query.status;
    const statuses = raw
      ? Array.isArray(raw)
        ? (raw as string[])
        : [raw as string]
      : ["Aprobado", "Rechazado", "Pendiente", "Cancelado"];

    const data = await KardexService.getKardexDetailsService({
      limit,
      offset,
      statuses: statuses as any,
    });

    res.status(200).json({
      msg: "Detalles de Kardex obtenidos",
      page: req.pagination?.page,
      limit,
      count: data.length,
      data,
    });
  }
);

// Obtener todos los Kardex
export const getAllKardexController = asyncWrapper(
  async (req: Request, res: Response): Promise<void> => {
    const kardex = await KardexService.getAllKardexService();
    res.status(200).json({
      msg: "Kardex buscados correctamente",
      totalKardex: kardex.length,
      kardex,
    });
  }
);

// Obtener Kardex por ID
export const getByIdController = asyncWrapper(
  async (req: Request, res: Response): Promise<void> => {
    const id_kardex = (req.params.id || "").trim();
    const kardex = await KardexService.getKardexByIdService(id_kardex);

    if (!kardex) {
      res.status(404).json({ msg: "Kardex no encontrado" });
      return;
    }

    res.status(200).json({
      msg: `Kardex encontrado con id_kardex ${id_kardex}`,
      kardex,
    });
  }
);

// Crear nuevo Kardex
export const createKardexController = asyncWrapper(
  async (req: Request, res: Response): Promise<void> => {
    const data: NewKardex = req.body;
    // Auditoría

    data.id_empleado_solicitud_f = req.user?.id_employes || "Desconocido";

    // Validación de datos;

    const kardex = await KardexService.createKardexService(data);
    res.status(201).json({
      msg: `Kardex creado correctamente con id_kardex`,
      kardex,
    });
  }
);

// Actualizar Kardex
export const updateKardexController = asyncWrapper(
  async (req: Request, res: Response): Promise<void> => {
    const id_kardex = (req.params.id || "").trim();

    // Auditoría
    const id_empleado_solicitud_f = req.user?.id_employes || "Desconocido";

    const kardexEdit = {
      ...req.body,
      id_empleado_solicitud_f,
    };

    const updatedKardex = await KardexService.updateKardexService({
      kardexEdit,
      id_kardex,
    });

    if (!updatedKardex) {
      res
        .status(404)
        .json({ msg: `Kardex no encontrado con id_kardex ${id_kardex}` });
      return;
    }

    res.status(200).json({
      msg: `Kardex actualizado con id_kardex ${id_kardex}`,
      updatedKardex,
    });
  }
);

// Eliminar (desactivar) Kardex
export const deleteKardexController = asyncWrapper(
  async (req: Request, res: Response): Promise<void> => {
    const id_kardex = (req.params.id || "").trim();
    const deactivatedKardex =
      await KardexService.deleteKardexService(id_kardex);

    if (!deactivatedKardex) {
      res
        .status(404)
        .json({ msg: `Kardex no encontrado con id_kardex ${id_kardex}` });
      return;
    }

    res.status(200).json({
      msg: `Kardex eliminado con id_kardex ${id_kardex}`,
      deactivatedKardex,
    });
  }
);
