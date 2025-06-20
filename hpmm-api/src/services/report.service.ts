import * as ReportModel from "../models/report.model";
import { NewReport } from "../types/report";
import logger from "../utils/loggers";


import { getProductosStockBajoModel } from "../models/report.model";

export const getProductosStockBajoService = async (stockMinimo: number) => {
  return getProductosStockBajoModel(stockMinimo);
};

export const getAllReportsService = async (): Promise<NewReport[]> => {
  try {
    return await ReportModel.getAllreports();
  } catch (error) {
    logger.error("Error fetching reports", error);
    throw error;
  }
};

export const getReportByIdService = async (
  id_report: string
): Promise<NewReport | null> => {
  try {
    const report = await ReportModel.getReportByIdModel(id_report);
    return report;
  } catch (error) {
    logger.error("Error fetching report by ID", error);
    throw error;
  }
};

export const createReportService = async ( data : NewReport) => {
  try {
    return await ReportModel.createReportModel(data);
  } catch (error) {
    logger.error("Error creating report", error);
    throw error;
  }
};

export const updateReportService = async (
  id_report: string,
  tipo: string,
  periodo: string,
  fecha: Date,
  estado: boolean,
  
) => {
  const updateReport = await ReportModel.updateReportModel(
    id_report, 
    tipo, 
    periodo, 
    fecha, 
    estado
  );

  return updateReport;
};

export const deleteReportService = async (
  id_report: string
): Promise<NewReport | null> => {
   const existing = await ReportModel.getReportByIdModel(id_report);
  if (!existing) return null;
  const deletedReport = await ReportModel.deleteReportModel(id_report);
  return deletedReport; 
}
