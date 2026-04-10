import { Request, Response } from "express";
import * as ScomprasService from "../services/scompras.service";
import { asyncWrapper } from "../utils/errorHandler";
import { NewsScompras } from "../types/scompras";
import { enviarNotificacionPorRoles } from "../services/notificacion.helper.service";
import { SCOMPRA_DESTINATARIOS } from "../config/notificacion.destinatarios";





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
    const nombreEmpleado = req.user?.employe_name || req.user?.username || "Usuario";
    const userId = req.user?.id_user;
    const newScompras = await ScomprasService.createdScomprasService(payload);

    // Notificar a los roles configurados (excluyendo al creador)
    await enviarNotificacionPorRoles(
      [...SCOMPRA_DESTINATARIOS.CREADA],
      {
        categoria: "solicitud_compra",
        prioridad: "media",
        titulo: "Nueva solicitud de compra",
        mensaje: `${nombreEmpleado} generó una solicitud de compra: ${payload.descripcion || "Sin descripción"} (Cantidad: ${payload.cantidad || 0})`,
        accion_requerida: "aprobar",
        entidad_tipo: "solicitud_compra",
        entidad_id: String(newScompras),
        creador_id: req.user?.id_employes || undefined,
        creador_nombre: nombreEmpleado,
        tipo: "Pendiente",
        estado: true,
      },
      userId
    );

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
    const nombreUsuario = req.user?.employe_name || req.user?.username || "Usuario";
    const userId = req.user?.id_user;
    const updated = await ScomprasService.updateScomprasService(id, payload);
    if (!updated) {
      res.status(404).json({ message: `No existe solicitud ${id}` });
      return;
    }

    // Notificar según el nuevo estado
    if (payload.estado === "Comprado") {
      await enviarNotificacionPorRoles(
        [...SCOMPRA_DESTINATARIOS.COMPRADA_ROLES],
        {
          categoria: "solicitud_compra",
          prioridad: "baja",
          titulo: "Solicitud de compra completada",
          mensaje: `${nombreUsuario} marcó como comprada la solicitud: ${updated.descripcion || ""}`,
          accion_requerida: "informativo",
          entidad_tipo: "solicitud_compra",
          entidad_id: id,
          creador_id: req.user?.id_employes || undefined,
          creador_nombre: nombreUsuario,
          tipo: "Pendiente",
          estado: true,
        },
        userId
      );
    } else if (payload.estado === "Cancelado") {
      await enviarNotificacionPorRoles(
        [...SCOMPRA_DESTINATARIOS.CANCELADA_ROLES],
        {
          categoria: "solicitud_compra",
          prioridad: "alta",
          titulo: "Solicitud de compra cancelada",
          mensaje: `${nombreUsuario} canceló la solicitud de compra: ${updated.descripcion || ""}`,
          accion_requerida: "informativo",
          entidad_tipo: "solicitud_compra",
          entidad_id: id,
          creador_id: req.user?.id_employes || undefined,
          creador_nombre: nombreUsuario,
          tipo: "Pendiente",
          estado: true,
        },
        userId
      );
    }

    res.status(200).json({ message: "Actualizada correctamente", data: updated });
  }
);

export const deleteScomprasController = asyncWrapper(
  async (req: Request, res: Response): Promise<void> => {
    const id = (req.params.id || "").trim();
    const deleted = await ScomprasService.deleteScomprasService(id);
    if (!deleted) {
      res.status(404).json({ message: `No existe solicitud ${id}` });
      return;
    }
    res.status(200).json({ message: "Solicitud eliminada correctamente", data: deleted });
  }
);  
