// src/models/kardex.model.ts
import db from "../db";
import { KardexDetail, KardexFilter, NewKardex } from "../types/kardex";
import { randomUUID } from "crypto";

const baseKardexQuery = () =>
 db('Kardex as k')
    .select(
      'k.id_kardex',
      'k.id_product as id_producto',
      'e_sc.id_employes as id_empleado_sc',
      'pa.id_units_x_pacts as id_units_x_pacts',
      'k.id_empleado_solicitud_f as id_empleado_sf',
      // Unificamos nombre_empleado_sc: si no hay e_sc, cae en u
      db.raw('COALESCE(??, ??) as ??', [
        'e_sc.name',
        'u.name',
        'nombre_empleado_sc',
      ]),
      // Unificamos nombre_unidad: viene de pa->u o de e_sc->u_sc
      db.raw('COALESCE(??, ??) as ??', [
        'u.name',
        'u_sc.name',
        'nombre_unidad',
      ]),
      'e_sf.name as nombre_empleado_sf',
      'k.fecha_movimiento',
      'k.tipo_movimiento',
      'k.tipo_solicitud',
      'k.numero_factura',
      'k.cantidad',
      'k.precio_unitario',
      'p.nombre as nombre_producto',
      'k.descripcion',
      'p.stock_actual',
      'p.stock_maximo',
      'k.fecha_vencimiento',
      'k.numero_lote',
      'k.tipo',
      'v.nombre_contacto as nombre_contacto_vendedor',
      's.shopping_order_id as nombre_de_factura',
      'sup.nombre as nombre_proveedor',
      'k.created_at'
    )
    .leftJoin('units_x_pacts as pa', 'pa.id_units_x_pacts', 'k.id_units_x_pacts')
    .leftJoin('shopping as s', 's.id_shopping', 'k.id_shopping')
    .leftJoin(
      'solicitud_compras as sc',
      'sc.id_scompra',
      's.id_scompra'
    )
    .leftJoin('requisitions as r', 'r.id_requisi', 'sc.id_requisi')
    .leftJoin(
      'employes as e_sf',
      'e_sf.id_employes',
      'k.id_empleado_solicitud_f'
    )
    .leftJoin('employes as e_sc', 'e_sc.id_employes', 'r.id_employes')
    .leftJoin('units as u', 'u.id_units', 'pa.id_units')
    .leftJoin('units as u_sc', 'u_sc.id_units', 'e_sc.id_units')
    .leftJoin('product as p', 'p.id_product', 'k.id_product')
    .leftJoin('vendedor as v', 'v.id_vendedor', 's.id_vendedor')
    .leftJoin('suppliers as sup', 'sup.id_supplier', 'v.id_supplier')
    .orderBy('p.created_at', 'desc');
    
export const getKardexDetailsModel = async (
  opts: KardexFilter = {}
): Promise<KardexDetail[]> => {
  const { limit, offset, statuses } = opts;
  const q = baseKardexQuery();

  if (statuses && statuses.length > 0) {
    q.whereIn("k.tipo", statuses);
  }
  if (limit !== undefined) {
    q.limit(limit);
  }
  if (offset !== undefined) {
    q.offset(offset);
  }

  return q;
};


export const getallKardexModel = async (): Promise<NewKardex[]> => {
  return knexTableName().select("*");
};

export async function getKardexByIdModel(
  id_kardex: string
): Promise<NewKardex | null> {
  const kardex = await knexTableName().where({ id_kardex }).first();
  return kardex || null;
}

export const createKardexModel = async (
  kardex: NewKardex
): Promise<NewKardex> => {
  const [createdKardex] = await knexTableName()
    .insert({ ...kardex, id_kardex: randomUUID() })
    .returning("*");
  return createdKardex;
};

export async function updateKardexModel(
  id_kardex: string,
  id_product: string,
  id_units_x_pacts: string,
  id_shopping: string,
  anio_creacion: string,
  tipo_movimiento: "Entrada" | "Salida",
  fecha_movimiento: Date,
  numero_factura: string,
  cantidad: number,
  precio_unitario: number,
  tipo_solicitud: "Requisicion" | "Pacto",
  requisicion_numero: string,
  tipo: "Aprobado" | "Rechazado" | "Pendiente"  | "Cancelado",
  observacion: string,
  //--
  descripcion: string,
  fecha_vencimiento: Date,
  numero_lote: string,
  //-----
  estado: boolean,
  id_empleado_solicitud_f: string,
): Promise<NewKardex | null> {
  const updated_at = new Date();
  const [updatedKardex] = await knexTableName()
    .where({ id_kardex })
    .update({
      id_product,
      id_shopping,
      id_units_x_pacts,
      anio_creacion,
      tipo_movimiento,
      fecha_movimiento,
      numero_factura,
      cantidad,
      precio_unitario,
      tipo_solicitud,
      requisicion_numero,
      tipo,
      // Nuevos campos
      descripcion,
      fecha_vencimiento,
      numero_lote,

      observacion,
      estado,
      updated_at,
      id_empleado_solicitud_f
    })
    .returning("*");
  return updatedKardex || null;
}

export async function deleteKardexModel(
  id_kardex: string
): Promise<NewKardex | null> {
  const updated_at = new Date();
  const [updatedKardex] = await knexTableName()
    .where({ id_kardex })
    .update({ estado: false, updated_at })
    .returning("*");
  return updatedKardex || null;
}

const knexTableName = () => db("Kardex");
