import * as ReportModel from "../models/report.model";
import { NewReport } from "../types/report";
import logger from "../utils/loggers";

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
  payload: Partial<NewReport>
): Promise<NewReport | null> => {
  const updateReport = await ReportModel.updateReportModel(id_report, payload);
  if (!updateReport) {
    throw new Error("Report not found or update failed");
  }
  return updateReport;
};

export const deleteReportService = async (
  id_report: string
): Promise<NewReport | null> => {
  try {
    const deletedReport = await ReportModel.deleteReportModel(id_report);
    return deletedReport;
  } catch (error) {
    logger.error("Error deleting report", error);
    throw error;
  }
};
