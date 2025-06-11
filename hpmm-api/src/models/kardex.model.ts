// src/models/kardex.model.ts
import db from "../db";
import { KardexDetail, KardexFilter, NewKardex } from "../types/kardex";
import { randomUUID } from "crypto";

const baseKardexQuery = () =>
  db("Kardex as k")
    .select(
      "k.id_kardex",
      "e_sc.id_employes as id_empleado_sc",
      "k.id_empleado_solicitud_f as id_empleado_sf",
      "e_sc.name as nombre_empleado_sc",
      "e_sf.name as nombre_empleado_sf",
      "k.fecha_movimiento",
      "k.tipo_movimiento",
      "k.tipo_solicitud",
      "k.numero_factura",
      "k.cantidad",
      "k.precio_unitario",
      "p.nombre",
      "p.descripcion",
      "p.stock_actual",
      "p.stock_maximo",
      "p.fecha_vencimiento",
      "p.numero_lote",
      "k.tipo",
      "v.nombre_contacto as nombre_contacto_vendedor",
      "s.shopping_order_id",
      "sup.nombre as nombre_proveedor",
      "k.created_at"
    )
    .join("shopping as s", "s.id_shopping", "k.id_shopping")
    .join("solicitud_compras as sc", "sc.id_scompra", "s.id_scompra")
    .join("requisitions as r", "r.id_requisi", "sc.id_requisi")
    .join("employes as e_sf", "e_sf.id_employes", "k.id_empleado_solicitud_f")
    .join("employes as e_sc", "e_sc.id_employes", "r.id_employes")
    .join("product as p", "p.id_product", "k.id_product")
    .join("vendedor as v", "v.id_vendedor", "s.id_vendedor")
    .join("suppliers as sup", "sup.id_supplier", "v.id_supplier")
    .orderBy("p.created_at", "desc");

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
  estado: boolean,
  id_empleado_solicitud_f: string,
): Promise<NewKardex | null> {
  const updated_at = new Date();
  const [updatedKardex] = await knexTableName()
    .where({ id_kardex })
    .update({
      id_product,
      id_shopping,
      anio_creacion,
      tipo_movimiento,
      fecha_movimiento,
      numero_factura,
      cantidad,
      precio_unitario,
      tipo_solicitud,
      requisicion_numero,
      tipo,
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
