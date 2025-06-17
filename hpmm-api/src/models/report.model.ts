import db from "../db";
import { up } from "../db/migrations/20250508171035_create_role";
import { NewReport } from "../types/report";
import { randomUUID } from "crypto";


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
