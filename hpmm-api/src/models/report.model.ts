import db from "../db";
import { NewReport } from "../types/report";
import { randomUUID } from "crypto";


// Ejemplo: productos con stock bajo
export const getProductosStockBajoModel = async (stockMinimo: number) => {
  return db("product")
    .select("id_product", "nombre", "stock_actual", "stock_maximo")
    .where("stock_actual", "<=", stockMinimo)
    .andWhere("estado", true)
    .orderBy("stock_actual", "asc");
};



export const getAllreports = async (): Promise<NewReport[]> => {
    return knexTableName().select("*").where({estado: true})
    }


export const createReportModel = async (
    data: NewReport
): Promise<NewReport> => {
    const [createdReport] = await knexTableName().insert({ ...data, id_report: randomUUID() }).returning("*");
    return createdReport;

}


export async function getReportByIdModel(
    id_report: string
): Promise<NewReport | null> {
    const report = await knexTableName().where({ id_report }).first();
    return report || null;
}



export async function updateReportModel(
    id_report: string,
    tipo: string, 
    periodo: string,
    fecha: Date,
    estado: boolean,
    
): Promise<NewReport | null> {
  const updated_at = new Date();
    const [updatedReport] = await knexTableName()
      .where({ id_report })
      .update({ tipo, periodo, fecha, estado, updated_at })
      .returning("*");
    return updatedReport || null;
  }

  export async function deleteReportModel(
    id_report: string
  ): Promise<NewReport | null> {
    const updated_at = new Date();
    const [deletedReport] = await knexTableName()
    .where({ id_report })
    .update( { estado: false, updated_at})
    .returning("*");
    return deletedReport || null;
  }

const knexTableName = () => {
  return db("reports");
};
