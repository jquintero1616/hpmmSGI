import db from "../db";
import { NewProduct, productDetail, productFilter } from "../types/product";
import { randomUUID } from "crypto";

//get all product
export const baseProductQuery = () => {
  return db("product as p")
    .select(
      "p.id_product        as id_product",
      "p.id_subcategory    as id_subcategory",
      "s.id_category       as id_category",
      "p.nombre            as nombre",
      "p.created_at        as created_at",
      "p.updated_at        as updated_at", 
      "p.descripcion       as descripcion",
      "p.stock_actual      as stock_actual",
      "p.stock_maximo      as stock_maximo",
      "p.fecha_vencimiento as fecha_vencimiento",
      "p.numero_lote       as numero_lote",
      "p.estado            as estado",
      "s.nombre            as subcategory_name",
      "c.name              as category_name"
    )
    .join("subcategory as s", "p.id_subcategory", "s.id_subcategory")
    .join("category    as c", "s.id_category",    "c.id_category")
    .orderBy("p.created_at", "desc");
};




export const getProductDetailModel = async (
   opts: productFilter = {}
): Promise<productDetail[]> => {
  const { limit, offset, statuses } = opts;
  const q = baseProductQuery();
  if (statuses && statuses.length > 0) {
    q.whereIn("p.estado", statuses);
  }
  if (limit !== undefined) {
    q.limit(limit);
  }
  if (offset !== undefined) {
    q.offset(offset);
  }
  return q;
};

export const getAllProductsModel = async (): Promise<NewProduct[]> => {
  return knexTableName().select("*");
};


export async function getProductByIdModel(
    id_product: string):
   Promise<NewProduct | null> {
  const product = await knexTableName().where({ id_product }).first();
  return product || null;
}


export const createProductModel = async (
  product: NewProduct
): Promise<NewProduct> => {
  const [createdProduct] = await knexTableName()
    .insert({ ...product, id_product: randomUUID() })
    .returning("*");
  return createdProduct;
};

export async function updateProductModel (
    id_product: string,
    id_subcategory : string,
    nombre: string,
    descripcion: string,
    stock_actual: number,
    stock_maximo: number,
    fecha_vencimiento: Date,
    numero_lote: string,
    estado: boolean
): Promise<NewProduct | null> {
    const updated_at = new Date();
    const [updatedProduct] = await knexTableName()
    .where({ id_product })
    .update({
        nombre,
        id_subcategory,
        descripcion,
        stock_actual,
        stock_maximo,
        fecha_vencimiento,
        numero_lote,
        estado,
        updated_at,
    })
    .returning("*");
    return updatedProduct || null;
}      

export async function deletePrudctModel(
    id_product: string)
    : Promise<NewProduct | null> {
    const updated_at = new Date();
    const [updatedProduct] = await knexTableName()
    .where({ id_product })
    .update({ estado: false, updated_at })
    .returning("*");
    return updatedProduct || null;
}



const knexTableName = () => {
  return db("product");
};
