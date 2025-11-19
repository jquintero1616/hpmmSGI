import { Request, Response } from "express";
import * as RequisiService from "../services/requisi.service";
import { asyncWrapper } from "../utils/errorHandler";
import { Requisi } from "../types/requisi";
import { enviarNotificacionPorRoles, enviarNotificacionAUsuario } from "../services/notificacion.helper.service";
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
    const nombreUsuario = req.user?.employe_name || req.user?.username || "Usuario";
    const idUsuario = req.user?.id_employes || "Desconocido";
    
    const requisi = await RequisiService.createRequiService(data);
    
    // Obtener información adicional del empleado para notificación más detallada
    let infoEmpleado: any = null;
    if (idUsuario && idUsuario !== "Desconocido") {
      infoEmpleado = await db("employes as e")
        .select(
          "e.name as nombre_empleado",
          "u.name as nombre_unidad",
          "d.name as nombre_direccion",
          "sd.name as nombre_subdireccion"
        )
        .leftJoin("units as u", "u.id_unit", "e.id_unit")
        .leftJoin("direction as d", "d.id_direction", "u.id_direction")
        .leftJoin("subdireccion as sd", "sd.id_subdireccion", "d.id_subdireccion")
        .where("e.id_employes", idUsuario)
        .first();
    }
    
    // Enviar notificación solo al Administrador con información detallada
    if (data.estado === "Pendiente" || !data.estado) {
      const unidadInfo = infoEmpleado?.nombre_unidad || "Unidad no especificada";
      const direccionInfo = infoEmpleado?.nombre_direccion || "";
      const subdireccionInfo = infoEmpleado?.nombre_subdireccion || "";
      
      // Construir mensaje detallado
      let mensajeDetallado = `${nombreUsuario} (${unidadInfo}`;
      if (direccionInfo) mensajeDetallado += ` - ${direccionInfo}`;
      if (subdireccionInfo) mensajeDetallado += ` / ${subdireccionInfo}`;
      mensajeDetallado += `) solicitó una requisición.`;
      
      await enviarNotificacionPorRoles(
        ["Administrador"],
        {
          categoria: "requisicion",
          prioridad: "alta",
          titulo: "Nueva requisición pendiente",
          mensaje: mensajeDetallado,
          descripcion_detallada: `Requisición ID: ${requisi}. Solicitante: ${nombreUsuario}. Unidad: ${unidadInfo}. Fecha: ${new Date().toLocaleString('es-HN')}`,
          accion_requerida: "aprobar",
          entidad_tipo: "requisicion",
          entidad_id: String(requisi),
          creador_id: idUsuario,
          creador_nombre: nombreUsuario,
          tipo: "Pendiente",
          estado: true,
        }
      );
    }
    
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
    const nombreAprobador = req.user?.employe_name || req.user?.username || "Administrador";
    const idAprobador = req.user?.id_employes || "Desconocido";
    
    // Obtener la requisición para saber quién la creó
    const requisiActual = await RequisiService.getRequiByService(id_requisi);
    
    const updatedRequisi = await RequisiService.updateRequisiService(
      id_requisi,
      payload
    );

    if (!updatedRequisi) {
      res.status(404).json({ msg: "Requisicion no encontrada" });
      return;
    }

    // Obtener el id_user del empleado que creó la requisición
    let idUsuarioCreador: string | null = null;
    if (requisiActual?.id_employes) {
      const empleado = await db("employes as e")
        .select("e.id_user")
        .where("e.id_employes", requisiActual.id_employes)
        .first();
      
      idUsuarioCreador = empleado?.id_user || null;
    }

    // Enviar notificaciones según el estado
    if (payload.estado === "Aprobado") {
      // Notificar al usuario específico que creó la requisición
      if (idUsuarioCreador) {
        await enviarNotificacionAUsuario(
          idUsuarioCreador,
          {
            categoria: "requisicion",
            prioridad: "media",
            titulo: "✅ Requisición aprobada",
            mensaje: `Tu requisición (ID: ${id_requisi}) fue APROBADA por ${nombreAprobador}.`,
            descripcion_detallada: `Estado: Aprobado. Aprobado por: ${nombreAprobador}. Fecha: ${new Date().toLocaleString('es-HN')}. Los productos serán preparados por el Jefe de Almacén.`,
            accion_requerida: "informativo",
            entidad_tipo: "requisicion",
            entidad_id: id_requisi,
            creador_id: idAprobador,
            creador_nombre: nombreAprobador,
            tipo: "Pendiente",
            estado: true,
          }
        );
      }
      
      // Notificar al Jefe de Almacén para preparar productos
      await enviarNotificacionPorRoles(
        ["Jefe Almacen"],
        {
          categoria: "requisicion",
          prioridad: "media",
          titulo: "Requisición aprobada - Preparar productos",
          mensaje: `${nombreAprobador} aprobó la requisición (ID: ${id_requisi}). Preparar productos para entrega.`,
          descripcion_detallada: `Aprobada por: ${nombreAprobador}. Fecha: ${new Date().toLocaleString('es-HN')}. Acción requerida: Preparar y entregar productos al solicitante.`,
          accion_requerida: "revisar",
          entidad_tipo: "requisicion",
          entidad_id: id_requisi,
          creador_id: idAprobador,
          creador_nombre: nombreAprobador,
          tipo: "Pendiente",
          estado: true,
        }
      );
    } else if (payload.estado === "Rechazado") {
      // Notificar al usuario específico que creó la requisición
      if (idUsuarioCreador) {
        await enviarNotificacionAUsuario(
          idUsuarioCreador,
          {
            categoria: "requisicion",
            prioridad: "alta",
            titulo: "❌ Requisición rechazada",
            mensaje: `Tu requisición (ID: ${id_requisi}) fue RECHAZADA por ${nombreAprobador}.`,
            descripcion_detallada: `Motivo del rechazo: ${payload.descripcion || "No especificado"}. Rechazada por: ${nombreAprobador}. Fecha: ${new Date().toLocaleString('es-HN')}`,
            accion_requerida: "revisar",
            entidad_tipo: "requisicion",
            entidad_id: id_requisi,
            creador_id: idAprobador,
            creador_nombre: nombreAprobador,
            tipo: "Pendiente",
            estado: true,
          }
        );
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
