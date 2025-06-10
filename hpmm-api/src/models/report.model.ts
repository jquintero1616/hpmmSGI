import db from "../db";
import { NewReport } from "../types/report";
import { randomUUID } from "crypto";


export const getAllreports = async (): Promise<NewReport[]> => {
    return knexTableName().select("*").where({estado: true})
    }

export async function getReportByIdModel(
    id_report: string
): Promise<NewReport | null> {
    const report = await knexTableName().where({ id_report }).first();
    return report || null;
}

export const createReportModel = async (
    data: NewReport
): Promise<NewReport> => {
    const [createdReport] = await knexTableName().insert({ ...data, id_report: randomUUID() }).returning("*");
    return createdReport;

}

export async function updateReportModel(
    id_report: string,
    payload: Partial<NewReport>
): Promise<NewReport> {
    const [updatedReport] = await knexTableName()
      .where({ id_report })
      .update(payload )
      .returning("*");
    return updatedReport;
  }

  export async function deleteReportModel(id_report: string): Promise<NewReport | null> {
    const [deletedReport] = await knexTableName()
    .where({ id_report })
    .delete()
    .returning("*");
    return deletedReport || null;
  }

const knexTableName = () => {
  return db("reports");
};
