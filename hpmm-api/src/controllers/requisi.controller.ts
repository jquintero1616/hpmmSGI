import { Request, Response } from "express";
import * as RequisiService from "../services/requisi.service";
import { asyncWrapper } from "../utils/errorHandler";
import { Requisi } from "../types/requisi";
import { enviarNotificacionPorRoles, enviarNotificacionAUsuario } from "../services/notificacion.helper.service";
import { REQUISICION_DESTINATARIOS } from "../config/notificacion.destinatarios";
import db from "../db";



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
    const nombreEmpleado = req.user?.employe_name || req.user?.username || "Usuario";
    const userId = req.user?.id_user;
    const requisi = await RequisiService.createRequiService(data);

    // Obtener el nombre de la unidad del solicitante
    let unidadNombre = "";
    if (req.user?.id_employes) {
      const emp = await db("employes as e")
        .join("units as u", "u.id_units", "e.id_units")
        .select("u.name as unit_name")
        .where("e.id_employes", req.user.id_employes)
        .first();
      unidadNombre = emp?.unit_name || "";
    }

    const descripcionMsg = unidadNombre
      ? `La unidad ${unidadNombre} (${nombreEmpleado}) creó una requisición: ${data.descripcion || "Sin descripción"}`
      : `${nombreEmpleado} creó una requisición: ${data.descripcion || "Sin descripción"}`;

    // Notificar a los roles configurados (excluyendo al creador)
    await enviarNotificacionPorRoles(
      [...REQUISICION_DESTINATARIOS.CREADA],
      {
        categoria: "requisicion",
        prioridad: "media",
        titulo: "Nueva requisición",
        mensaje: descripcionMsg,
        accion_requerida: "aprobar",
        entidad_tipo: "requisicion",
        entidad_id: requisi?.id_requisi || String(requisi),
        creador_id: req.user?.id_employes || undefined,
        creador_nombre: nombreEmpleado,
        tipo: "Pendiente",
        estado: true,
      },
      userId
    );
    
    res.status(201).json({
      msg: `Requisicion creada correctamente con id_requisi`,
      requisi,
    });
  }
);

export const UpdateRequisiController = asyncWrapper(
  async (req: Request, res: Response): Promise<void> => {
    const id_requisi = (req.params.id || "").trim();
    const payload = req.body;
    const nombreUsuario = req.user?.employe_name || req.user?.username || "Usuario";
    const userId = req.user?.id_user;
    
    const updatedRequisi = await RequisiService.updateRequisiService(
      id_requisi,
      payload
    );

    if (!updatedRequisi) {
      res.status(404).json({ msg: "Requisicion no encontrada" });
      return;
    }

    // Notificar según el nuevo estado
    if (payload.estado === "Aprobado") {
      // Obtener unidad del solicitante
      let unidadSolicitante = "";
      if (updatedRequisi.id_employes) {
        const empData = await db("employes as e")
          .join("units as u", "u.id_units", "e.id_units")
          .select("e.id_user", "u.name as unit_name")
          .where("e.id_employes", updatedRequisi.id_employes)
          .first();
        unidadSolicitante = empData?.unit_name || "";
        // Notificar al creador
        if (empData?.id_user) {
          await enviarNotificacionAUsuario(empData.id_user, {
            categoria: "requisicion",
            prioridad: "baja",
            titulo: "Requisición aprobada",
            mensaje: `Tu requisición fue aprobada por ${nombreUsuario}`,
            accion_requerida: "informativo",
            entidad_tipo: "requisicion",
            entidad_id: id_requisi,
            creador_id: req.user?.id_employes || undefined,
            creador_nombre: nombreUsuario,
            tipo: "Pendiente",
            estado: true,
          });
        }
      }

      const msgAprobada = unidadSolicitante
        ? `${nombreUsuario} aprobó una requisición de ${unidadSolicitante}: ${updatedRequisi.descripcion || ""}`
        : `${nombreUsuario} aprobó una requisición: ${updatedRequisi.descripcion || ""}`;

      // Notificar a los roles configurados
      await enviarNotificacionPorRoles(
        [...REQUISICION_DESTINATARIOS.APROBADA_ROLES],
        {
          categoria: "requisicion",
          prioridad: "baja",
          titulo: "Requisición aprobada",
          mensaje: msgAprobada,
          accion_requerida: "informativo",
          entidad_tipo: "requisicion",
          entidad_id: id_requisi,
          creador_id: req.user?.id_employes || undefined,
          creador_nombre: nombreUsuario,
          tipo: "Pendiente",
          estado: true,
        },
        userId
      );
    } else if (payload.estado === "Rechazado") {
      // Solo notificar al creador
      if (updatedRequisi.id_employes) {
        const empleado = await db("employes as e")
          .select("e.id_user")
          .where("e.id_employes", updatedRequisi.id_employes)
          .first();
        if (empleado?.id_user) {
          await enviarNotificacionAUsuario(empleado.id_user, {
            categoria: "requisicion",
            prioridad: "alta",
            titulo: "Requisición rechazada",
            mensaje: `Tu requisición fue rechazada por ${nombreUsuario}. Motivo: ${payload.motivo || "No especificado"}`,
            accion_requerida: "revisar",
            entidad_tipo: "requisicion",
            entidad_id: id_requisi,
            creador_id: req.user?.id_employes || "",
            creador_nombre: nombreUsuario,
            tipo: "Pendiente",
            estado: true,
          });
        }
      }
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
