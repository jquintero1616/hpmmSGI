// src/middlewares/bitacora.middleware.ts
import { Request, Response, NextFunction } from "express";
import * as BitacoraService from "../services/bitacora.service";
import db from "../db";
import requestIp from "request-ip";


/** Opciones de configuración por tabla */
export interface BitacoraOptions {
  tabla?: string;      // nombre de la tabla en BD
  idColumn: string;    // columna PK en BD
  idParam?: string;    // parámetro de ruta (por defecto "id")
  modulo?: string;     // nombre lógico del módulo
  fields?: string[];   // lista de campos a guardar
}

export const bitacoraInterceptor = (options?: BitacoraOptions) => {
  // Defaults seguros incluso si llamas sin options
  const {
    tabla        = "tabla_desconocida",
    idColumn     = "id",
    idParam      = "id",
    modulo       = tabla,
    fields,
  } = options || {};

  // Helper para quedarnos solo con las keys deseadas
  const pick = (obj: any, keys: string[]) =>
    keys.reduce((acc, k) => {
      if (obj[k] !== undefined) acc[k] = obj[k];
      return acc;
    }, {} as Record<string, any>);

  return async (req: Request, res: Response, next: NextFunction) => {
    // Solo intercepta CREATE / UPDATE / DELETE
    if (!["POST", "PUT", "DELETE"].includes(req.method)) {
      return next();
    }

    const fecha_evento   = new Date();
    const id_usuario     = (req.user as any)?.id_user   ?? null;
    const nombre_usuario = (req.user as any)?.username ?? null;
    const accion         =
      req.method === "POST"   ? "CREATE" :
      req.method === "PUT"    ? "UPDATE" : "DELETE";

    // 1) Extraer ID del registro
    const registro_id = String(
      req.params[idParam] ??
      req.body[idParam]   ??
      res.locals.newId    ??
      ""
    ).trim();

    // 2) Capturar valores anteriores (PUT o DELETE)
    let valores_anterior: string | null = null;
    if ((req.method === "PUT" || req.method === "DELETE") && registro_id) {
      const before = await db(tabla).where(idColumn, registro_id).first();
      if (before) {
        valores_anterior = JSON.stringify(
          fields ? pick(before, fields) : before
        );
      }
    }

    // 3) Al terminar la respuesta…
    res.once("finish", async () => {
      // Solo si fue 2xx
      if (res.statusCode < 200 || res.statusCode >= 300) return;

      // 4) Capturar valores nuevos (POST/PUT/DELETE lógicos)
      let valores_nuevos: string | null = null;
      if (registro_id) {
        const after = await db(tabla).where(idColumn, registro_id).first();
        if (after) {
          const keys = fields ?? Object.keys(req.body);
          valores_nuevos = JSON.stringify(pick(after, keys));
        }
      }

      // 5) Obtener IP pública real
      const ip_origin = requestIp.getClientIp(req) || req.ip;

      // 6) Guardar en bitácora
      try {
        await BitacoraService.saveBitacora({
          id_usuario,
          nombre_usuario,
          accion,
          tabla_afectada: tabla,
          registro_id,
          valores_anterior,
          valores_nuevos,
          fecha_evento,
          ip_origin,
          descripcion_evento: `${accion} en ${tabla}`,
          modulo_afecto: modulo,
        });
      } catch (err) {
        console.error("INFO: Error guardando bitácora:", err);
      }
    });

    next();
  };
};
