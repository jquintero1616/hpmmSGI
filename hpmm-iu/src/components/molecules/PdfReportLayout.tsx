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
      className="bg-white mx-auto my-2 p-2 rounded-2xl shadow border border-gray-200 flex flex-col"
      style={{
        minHeight: 700, // Puedes ajustar este valor según tu preferencia
        width: "1056px",
        maxWidth: "1056px",
        height: "816px", // Fuerza altura para PDF A4 horizontal
      }}
    >
      {/* Encabezado */}
      <div className="flex flex-row items-start justify-between w-full mb-1">
        {/* Logo */}
        <div className="flex-shrink-0 flex items-center justify-center w-1/5 min-w-[120px]">
          <img src={logoHpmm} alt="Logo HPMM" className="h-14 w-auto" />
        </div>
        {/* Títulos */}
        <div className="flex flex-col justify-center items-center w-3/5 px-1">
          <h1 className="text-lg font-bold" style={{ color: "#800080", lineHeight: "1.1" }}>
            Hospital Psiquiátrico Mario Mendoza
          </h1>
          <h2 className="text-base font-semibold mt-0 mb-0">{title}</h2>
        </div>
        {/* Dirección y fecha */}
        <div className="flex flex-col items-end text-[10px] text-gray-700 w-1/5 min-w-[120px] max-w-[180px] break-words">
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

      <hr className="border-t border-gray-300 my-1" />

      {/* Contenido principal */}
      <div className="flex-1 flex flex-col">
        <div className="mb-1 overflow-x-auto bg-white rounded-lg shadow-sm p-1">
          <GenericReportTable
            columns={columns}
            data={data}
            rowKey={rowKey}
            fontSizeClass="text-[8.5px]"
            headerFontSizeClass="text-[9px]"
          />
        </div>
        {children}
      </div>

      {/* Firmas al fondo */}
      <div className="grid grid-cols-3 gap-10 mt-6 mb-2">
        <div className="flex flex-col items-center">
          <div className="border-b border-gray-400 w-56 mb-1 mx-auto" />
          <span className="w-56 text-center font-bold text-black text-sm">
            Lic. Kenny Guzmán
          </span>
          <span className="w-56 text-center text-black text-xs">
            Sub director de gestión de recursos
          </span>
        </div>
        <div className="flex flex-col items-center">
          <div className="border-b border-gray-400 w-56 mb-1 mx-auto" />
          <span className="w-56 text-center font-bold text-black text-sm">
            Dr. Mario Francisco Aguilar
          </span>
          <span className="w-56 text-center text-black text-xs">
            Director ejecutivo
          </span>
        </div>
        <div className="flex flex-col items-center">
          <div className="border-b border-gray-400 w-56 mb-1 mx-auto" />
          <span className="w-56 text-center font-bold text-black text-sm">
            Lic. Giselle Gomez
          </span>
          <span className="w-56 text-center text-black text-xs">
            Jefe de Logistica y Suministros
          </span>
        </div>
      </div>
    </div>
  );
};

export default PdfReportLayout;