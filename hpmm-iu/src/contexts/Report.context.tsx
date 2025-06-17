import React, { createContext, useEffect, useState} from 'react';

import {
    GetReportsService,
    GetReportByIdService,
    PostCreateReportService,
    PutUpdateReportService,
    DeleteReportService,
} from '../services/Report.service';

import { ReportContextType, ProviderProps } from '../interfaces/Context.interface';
import { useAuth } from '../hooks/use.Auth';
import useAxiosPrivate from "../hooks/axiosPrivateInstance";
import { Reportinterface } from '../interfaces/Report.interface';


export const ReportContext = createContext<ReportContextType>({
    report: [],
    GetReportsContext: async () => [],
    GetReportByIdContext: async () => undefined,
    PostCreateReportContext: async () => { },
    PutUpdateReportContext: async () => { },
    DeleteReportContext: async () => { },
});


export const ReportProvider: React.FC<ProviderProps> = ({ children }) => {  
    const [report, setReport] = useState<Reportinterface[]>([]);
    const axiosPrivate = useAxiosPrivate(); 
    const { isAuthenticated } = useAuth();

    useEffect(() => {
        if (isAuthenticated) {
            GetReportsContext()
                .then((data) => {
                    if (data !== null) {
                        setReport(data);
                    } else {
                        console.error("Error al recuperar los reportes");
                    }
                })
                .catch((error) => {
                    console.error('Error al recuperar los reportes', error);
                });
        }
    }, [isAuthenticated]);


    const GetReportsContext = async (): Promise<Reportinterface[] | null> => {
        try {
            const reports = await GetReportsService(axiosPrivate);
            return reports;
        } catch (error) {
            console.error('Error al recuperar los reportes', error);
            return null;
        }
    };

    const GetReportByIdContext = async (id_report: string): Promise<Reportinterface | undefined> => {
        try {
            const report = await GetReportByIdService(id_report, axiosPrivate);
            return report;
        } catch (error) {
            console.error(`Error al recuperar el reporte con ID: ${id_report}`, error);
            return undefined;
        }
    };

    const PostCreateReportContext = async (
        report: Reportinterface
    ): Promise<Reportinterface> => {
        try {
            const newReport = await PostCreateReportService(report,axiosPrivate);
            setReport((prevReports) => [...prevReports, newReport]);
            return newReport;
        } catch (error) {
            console.error('Error al crear el reporte', error);
            throw error;
        }
    };

    const PutUpdateReportContext = async (
        id_report: string,
        report: Reportinterface
    ): Promise<void> => {
        try {
            await PutUpdateReportService(id_report, report, axiosPrivate);
            setReport((prevReports) =>
                prevReports.map((r) => (r.id_report === id_report ? report : r))
            );
        } catch (error) {
            console.error(`Error al actualizar el reporte con ID: ${id_report}`, error);
            throw error;
        }
    };

    const DeleteReportContext = async (id_report: string): Promise<void> => {
        try {
            await DeleteReportService(id_report, axiosPrivate);
            setReport((prevReports) => prevReports.filter((r) => r.id_report !== id_report));
        } catch (error) {
            console.error(`Error al eliminar el reporte con ID: ${id_report}`, error);
            throw error;
        }
    };

    return (
        <ReportContext.Provider
            value={{
                report,
                GetReportsContext,
                GetReportByIdContext,
                PostCreateReportContext,
                PutUpdateReportContext,
                DeleteReportContext,
            }}
        >
            {children}
        </ReportContext.Provider>
    );
};
