import { Request, Response } from "express";
import * as KardexService from "../services/kardex.service";
import { asyncWrapper } from "../utils/errorHandler";
import { KardexDetail, NewKardex } from "../types/kardex";
import { enviarNotificacionPorRoles, enviarNotificacionAUsuario } from "../services/notificacion.helper.service";
import db from "../db";

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
    const nombreEmpleado = req.user?.employe_name || req.user?.username || "Usuario";

    // Validación de datos;

    const kardex = await KardexService.createKardexService(data);
    
    // Enviar notificación al Jefe de Almacén
    if (data.tipo === "Pendiente") {
      await enviarNotificacionPorRoles(
        ["Jefe Almacen"],
        {
          categoria: "kardex",
          prioridad: "media",
          titulo: `Nueva ${data.tipo_movimiento} de Kardex`,
          mensaje: `${nombreEmpleado} registró una ${data.tipo_movimiento.toLowerCase()} (Cantidad: ${data.cantidad}). Factura: ${data.numero_factura}`,
          accion_requerida: "aprobar",
          entidad_tipo: "kardex",
          entidad_id: String(kardex),
          creador_id: data.id_empleado_solicitud_f,
          creador_nombre: nombreEmpleado,
          tipo: "Pendiente",
          estado: true,
        }
      );
    }
    
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
    const nombreAprobador = req.user?.employe_name || req.user?.username || "Administrador";

    // Obtener el kardex actual para saber quién lo creó
    const kardexActual = await KardexService.getKardexByIdService(id_kardex);

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

    // Obtener el id_user del empleado que creó el kardex
    let idUsuarioCreador: string | null = null;
    if (kardexActual?.id_empleado_solicitud_f) {
      const empleado = await db("employes as e")
        .select("e.id_user")
        .where("e.id_employes", kardexActual.id_empleado_solicitud_f)
        .first();
      
      idUsuarioCreador = empleado?.id_user || null;
    }

    // Enviar notificación al Técnico de Almacén específico cuando se apruebe o rechace
    if (kardexEdit.tipo === "Aprobado") {
      // Notificar al técnico específico que creó el kardex
      if (idUsuarioCreador) {
        await enviarNotificacionAUsuario(
          idUsuarioCreador,
          {
            categoria: "kardex",
            prioridad: "baja",
            titulo: "Kardex aprobado",
            mensaje: `Tu registro de ${kardexEdit.tipo_movimiento} fue aprobado por ${nombreAprobador}`,
            accion_requerida: "informativo",
            entidad_tipo: "kardex",
            entidad_id: id_kardex,
            creador_id: id_empleado_solicitud_f,
            creador_nombre: nombreAprobador,
            tipo: "Pendiente",
            estado: true,
          }
        );
      }
      
      // También notificar al Administrador
      await enviarNotificacionPorRoles(
        ["Administrador"],
        {
          categoria: "kardex",
          prioridad: "baja",
          titulo: "Kardex aprobado",
          mensaje: `${nombreAprobador} aprobó un registro de ${kardexEdit.tipo_movimiento}`,
          accion_requerida: "informativo",
          entidad_tipo: "kardex",
          entidad_id: id_kardex,
          creador_id: id_empleado_solicitud_f,
          creador_nombre: nombreAprobador,
          tipo: "Pendiente",
          estado: true,
        }
      );
    } else if (kardexEdit.tipo === "Rechazado") {
      // Notificar al técnico específico que creó el kardex
      if (idUsuarioCreador) {
        await enviarNotificacionAUsuario(
          idUsuarioCreador,
          {
            categoria: "kardex",
            prioridad: "alta",
            titulo: "Kardex rechazado",
            mensaje: `Tu registro de ${kardexEdit.tipo_movimiento} fue rechazado. Motivo: ${kardexEdit.observacion || "No especificado"}`,
            accion_requerida: "revisar",
            entidad_tipo: "kardex",
            entidad_id: id_kardex,
            creador_id: id_empleado_solicitud_f,
            creador_nombre: nombreAprobador,
            tipo: "Pendiente",
            estado: true,
          }
        );
      }
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
