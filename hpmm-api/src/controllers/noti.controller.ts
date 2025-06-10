import { Request, Response } from "express";
import * as NotiService from "../services/notifi.service";
import { asyncWrapper } from "../utils/errorHandler";

// Listar todas las notificaciones
export const getAllNotiController = asyncWrapper(
  async (req: Request, res: Response): Promise<void> => {
    const notis = await NotiService.getAllNotiService();
    res.status(200).json({
      msg: "Notificaciones buscadas correctamente",
      totalNotis: notis.length,
      notis,
    });
  }
);
// Obtener una notificacion por ID
export const getNotiByIdController = asyncWrapper(
  async (req: Request, res: Response): Promise<void> => {
    const id_noti = (req.params.id || "").trim();
    const notification = await NotiService.getNotiBYService(id_noti);

    if (!notification) {
      res.status(404).json({ msg: "Notificacion no encontrada" });
      return;
    }

    res
      .status(200)
      .json({
        msg: `Notificacion encontrada con id_noti ${id_noti}`,
        notification,
      });
  }
);
// Crear una notificacion
export const createNotiController = asyncWrapper(
  async (req: Request, res: Response): Promise<void> => {
    const payload = req.body;
    const newNoti = await NotiService.createNotiService(payload);

    res.status(201).json({ msg: "Notificacion creada correctamente", newNoti });
  }
);

// Actualizar una notificacion
export const updateNotiController = asyncWrapper(
  async (req: Request, res: Response): Promise<void> => {
    const id_noti = (req.params.id || "").trim();
    const payload = req.body;
    const updatedNoti = await NotiService.updateNotiService(id_noti, payload);

    if (!updatedNoti) {
      res.status(404).json({ msg: "Notificacion no encontrada" });
      return;
    }

    res
      .status(200)
      .json({ msg: "Notificacion actualizada correctamente", updatedNoti });
  }
);

// Eliminar una notificacion
export const deleteNotiController = asyncWrapper(
  async (req: Request, res: Response): Promise<void> => {
    const id_noti = (req.params.id || "").trim();
    const deletedNoti = await NotiService.deleteNotiService(id_noti);

    if (!deletedNoti) {
      res.status(404).json({ msg: "Notificacion no encontrada" });
      return;
    }

    res
      .status(200)
      .json({ msg: "Notificacion eliminada correctamente", deletedNoti });
  }
);
