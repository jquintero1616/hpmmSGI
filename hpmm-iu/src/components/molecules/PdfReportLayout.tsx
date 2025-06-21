import React from "react";
import GenericReportTable, { ReportColumn } from "./GenericReportTable";
import logoHpmm from "../../assets/hpmm2.png";

interface PdfReportLayoutProps<T> {
  columns: ReportColumn<T>[];
  data: T[];
  rowKey: (row: T) => string | number;
  title?: string;
  date?: string;
  children?: React.ReactNode;
}

const PdfReportLayout = <T extends Record<string, any>>({
  columns,
  data,
  rowKey,
  title = "Reporte Kardex",
  date,
  children,
}: PdfReportLayoutProps<T>) => (
  <div className="bg-white mx-auto my-12 p-12 rounded-2xl shadow max-w-6xl border border-gray-200" style={{ minHeight: 1000 }}>
    {/* Encabezado */}
    <div className="flex flex-row items-center justify-between mb-12">
      <img src={logoHpmm} alt="Logo HPMM" className="h-20 w-auto" />
      <div className="flex-1 text-center">
        <h1 className="text-3xl font-bold text-hpmm-morado-claro mb-2">Hospital Psiquiátrico Mario Mendoza</h1>
        <h2 className="text-xl font-semibold mb-2">{title}</h2>
        <p className="text-base text-gray-600">
          Fecha: {date || new Date().toLocaleDateString("es-HN", { year: "numeric", month: "long", day: "numeric" })}
        </p>
      </div>
      <div className="w-20" />
    </div>

    {/* Tabla de datos */}
    <div className="mb-10">
      <GenericReportTable columns={columns} data={data} rowKey={rowKey} />
    </div>

    {/* Extras (firmas, total, etc) */}
    {children}
  </div>
);

export default PdfReportLayout;