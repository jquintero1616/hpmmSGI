import { Request, Response } from "express";
import * as reportService from "../services/report.service";
import { asyncWrapper } from "../utils/errorHandler";

export const getAllReportsController = asyncWrapper(
  async (req: Request, res: Response): Promise<void> => {
    const reports = await reportService.getAllReportsService();
    res.status(200).json({
      msg: "Reportes buscados correctamente",
      totalReport: reports.length,
      reports,
    });
  }
);

export const getReportByIdController = asyncWrapper(
  async (req: Request, res: Response): Promise<void> => {
    const id_report = (req.params.id || "").trim();
    const report = await reportService.getReportByIdService(id_report);
    res.status(200).json({
      msg: "Reporte buscado correctamente",
      report,
    });
  }
);

export const createReportController = asyncWrapper(
    async (req: Request, res: Response): Promise<void> => {
        const { tipo, periodo, fecha, estado } = req.body;
        const newReport = await reportService.createReportService({
            tipo,
            periodo,
            fecha,
            estado,
        });
        res.status(201).json({
            msg: "Reporte creado correctamente",
            newReport,
        });
    }
);

export const updateReportController = asyncWrapper(
  async (req: Request, res: Response): Promise<void> => {
    const id_report = (req.params.id || "").trim();
    const { tipo, periodo, fecha, estado } = req.body;
   const updatedReport = await reportService.updateReportService(
    id_report,
    tipo,
    periodo,
    fecha,
    estado
   );
   if (!updatedReport) {
      res.status(404).json({
        msg: "Reporte no encontrado",
      });
      return;
    }
    res.status(200).json({
      msg: "Reporte actualizado correctamente",
      updatedReport,
    });
  }
);
export const deleteReportController = asyncWrapper(
  async (req: Request, res: Response): Promise<void> => {
    const id_report = (req.params.id || "").trim();
    const deletedReport = await reportService.deleteReportService(id_report);
    if (!deletedReport) {
      res.status(404).json({
        msg: "Reporte no encontrado",
      });
      return;
    }
    res.status(200).json({
      msg: "Reporte eliminado correctamente",
      deletedReport,
    });
  }
);