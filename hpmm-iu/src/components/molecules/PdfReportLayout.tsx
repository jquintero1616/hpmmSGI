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
}: PdfReportLayoutProps<T>) => {
  return (
    <div
      className="bg-white mx-auto my-8 p-2 rounded-2xl shadow border border-gray-200"
      style={{
        minHeight: 816,
        width: "1056px",
        maxWidth: "1056px",
      }}
    >
      {/* Encabezado compacto */}
      <div className="flex flex-row justify-between items-center mb-1 w-full">
        {/* Logo */}
        <div className="flex-shrink-0 flex items-center justify-center w-1/6 min-w-[120px]">
    <img src={logoHpmm} alt="Logo HPMM" className="h-16 w-auto" />
  </div>
        {/* Títulos */}
        <div className="flex flex-col justify-center items-center w-4/6 px-1">
          <h1 className="text-lg font-bold" style={{ color: "#800080", lineHeight: "1.1" }}>
            Hospital Psiquiátrico Mario Mendoza
          </h1>
          <h2 className="text-base font-semibold mt-0 mb-0">{title}</h2>
        </div>
        {/* Dirección y fecha */}
        <div className="flex flex-col items-end text-[10px] text-gray-700 w-1/6 min-w-[120px] max-w-[180px] break-words">
          <div className="w-full">
            <b>Dirección:</b> Colonia Miramontes, Calle de la Salud, contiguo a
            la Facultad de Ciencias Médicas Tegucigalpa, Honduras
            <br />
            <b>Teléfono:</b> 2239-7128
          </div>
          <div className="mt-1 w-full">
            <b>Fecha:</b> {date || new Date().toLocaleDateString("es-HN")}
          </div>
        </div>
      </div>

      {/* Línea divisoria */}
      <hr className="border-t border-gray-300 my-2" />

      {/* Tabla de datos con letra más pequeña solo en PDF */}
      <div className="mb-2 overflow-x-auto bg-white rounded-lg shadow-sm p-1">
        <GenericReportTable
          columns={columns}
          data={data}
          rowKey={rowKey}
          fontSizeClass="text-[8.5px]"
          headerFontSizeClass="text-[9px]"
        />
      </div>

      {children}

      {/* Firmas */}
      <div className="grid grid-cols-3 gap-10 mt-10">
        <div className="flex flex-col items-center">
          <div className="border-b border-gray-400 w-40 mb-1" />
          <span className="w-40 text-center font-semibold text-gray-800 text-xs">
            Dr. Aguilar Mendoza
          </span>
        </div>
        <div className="flex flex-col items-center">
          <div className="border-b border-gray-400 w-40 mb-1" />
          <span className="w-40 text-center font-semibold text-gray-800 text-xs">
            Nombre Subdirección
          </span>
        </div>
        <div className="flex flex-col items-center">
          <div className="border-b border-gray-400 w-40 mb-1" />
          <span className="w-40 text-center font-semibold text-gray-800 text-xs">
            Nombre Logística
          </span>
        </div>
      </div>
    </div>
  );
};

export default PdfReportLayout;