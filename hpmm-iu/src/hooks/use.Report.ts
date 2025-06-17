import {useContext} from 'react';
import {ReportContext} from '../contexts/Report.context';

export const useReport = () => {
    const {
        report,
        GetReportsContext,
        GetReportByIdContext,
        PostCreateReportContext,
        PutUpdateReportContext,
        DeleteReportContext
    } = useContext(ReportContext);

    if (
        !report ||
        !GetReportsContext ||
        !GetReportByIdContext ||
        !PostCreateReportContext ||
        !PutUpdateReportContext ||
        !DeleteReportContext
    ) {
        throw new Error(`useReport must be used within a ReportProvider ${report}`);
    }

    return {
        report,
        GetReportsContext,
        GetReportByIdContext,
        PostCreateReportContext,
        PutUpdateReportContext,
        DeleteReportContext
    };
}