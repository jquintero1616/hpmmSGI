import { Request, Response } from "express";
import * as ReportService from "../services/report.service";
import { asyncWrapper } from "../utils/errorHandler";

export const getProductosStockBajoController = asyncWrapper(
  async (req: Request, res: Response): Promise<void> => {
    const stockMinimo = Number(req.query.stockMinimo) || 10; // valor por defecto
    const productos = await ReportService.getProductosStockBajoService(stockMinimo);
    res.status(200).json({
      msg: "Productos con stock bajo encontrados",
      productos,
    });
  }
);


// ---------------------------------------------------

export const getAllReportsController = asyncWrapper(
  async (req: Request, res: Response): Promise<void> => {
    const reports = await ReportService.getAllReportsService();
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
    const report = await ReportService.getReportByIdService(id_report);
    res.status(200).json({
      msg: "Reporte buscado correctamente",
      report,
    });
  }
);

export const createReportController = asyncWrapper(
    async (req: Request, res: Response): Promise<void> => {
        const { tipo, periodo, fecha, estado } = req.body;
        const newReport = await ReportService.createReportService({
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
   const updatedReport = await ReportService.updateReportService(
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
    const deletedReport = await ReportService.deleteReportService(id_report);
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
