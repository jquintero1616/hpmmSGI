import { AxiosInstance } from "axios";
import { Reportinterface } from "../interfaces/Report.interface";




export const GetReportsService = async (
  axiosPrivate: AxiosInstance
): Promise<Reportinterface[] | null> => {
  try {
    const response = await axiosPrivate.get(`/reports`);
    return response.data.reports;
  } catch (error) {
    console.error("Error al recuperar los reportes", error);
    throw error;
  }
};

export const GetReportByIdService = async (
  id_report: string,
  axiosPrivate: AxiosInstance
): Promise<Reportinterface | undefined> => {
  try {
    const response = await axiosPrivate.get(`/reports/${id_report}`);
    return response.data.report;
  } catch (error) {
    console.error(`Error al recuperar el reporte con ID: ${id_report}`, error);
    throw error;
  }
};

export const PostCreateReportService = async (
  report: Reportinterface,
    axiosPrivate: AxiosInstance
): Promise<Reportinterface> => {
  const response = await axiosPrivate.post(
    `/reports`,
    {
      id_report: report.id_report,
      tipo: report.tipo,
      periodo: report.periodo,
      fecha: report.fecha,
      estado: report.estado,
    },
    { headers: { "Content-Type": "application/json" } }
  );

  return response.data.newReport;
}

export const PutUpdateReportService = async (
  id_report: string,    
    report: Reportinterface,
    axiosPrivate: AxiosInstance
): Promise<void> => {
  await axiosPrivate.put(
    `/reports/${id_report}`,
    {
      id_report: report.id_report,
      tipo: report.tipo,
      periodo: report.periodo,
      fecha: report.fecha,
      estado: report.estado,
    },
    { headers: { "Content-Type": "application/json" } }
  );
}

export const DeleteReportService = async (
  id_report: string,
  axiosPrivate: AxiosInstance
): Promise<void> => {
  await axiosPrivate.delete(`/reports/${id_report}`);
};
