import React from "react";
import GenericReportTable, { ReportColumn } from "./GenericReportTable";
import logoHpmm from "../../assets/hpmm2.png";

interface PdfReportLayoutProps<T> {
  columns: ReportColumn<T>[];
  data: T[];
  rowKey: (row: T) => string | number;
  title?: string;
  subtitle?: string;
  date?: string;
  children?: React.ReactNode;
  orientation?: "landscape" | "portrait";
  showSummary?: boolean;
  summaryData?: { label: string; value: string | number }[];
}

const PdfReportLayout = <T extends Record<string, unknown>>({
  columns,
  data,
  rowKey,
  title = "Reporte",
  subtitle,
  date,
  children,
  orientation = "landscape",
  showSummary = false,
  summaryData = [],
}: PdfReportLayoutProps<T>) => {
  const isLandscape = orientation === "landscape";
  const width = isLandscape ? "1056px" : "816px";
  const height = isLandscape ? "816px" : "1056px";

  return (
    <div
      className="bg-white mx-auto flex flex-col"
      style={{
        width,
        maxWidth: width,
        minHeight: height,
        fontFamily: "Arial, sans-serif",
      }}
    >
      {/* Encabezado */}
      <div className="px-8 pt-6 pb-4">
        <div className="flex items-center justify-between border-b-2 border-black pb-4">
          {/* Logo e institución */}
          <div className="flex items-center gap-4">
            <img src={logoHpmm} alt="Logo" className="h-14 w-auto" />
            <div>
              <h1 className="text-sm font-bold text-black uppercase tracking-wide">
                Hospital Psiquiátrico Mario Mendoza
              </h1>
              <p className="text-[10px] text-gray-700">
                Tegucigalpa, M.D.C., Honduras
              </p>
            </div>
          </div>

          {/* Fecha y hora */}
          <div className="text-right text-[10px] text-black">
            <p><span className="font-semibold">Fecha:</span> {date || new Date().toLocaleDateString("es-HN")}</p>
            <p><span className="font-semibold">Hora:</span> {new Date().toLocaleTimeString("es-HN", { hour: "2-digit", minute: "2-digit" })}</p>
          </div>
        </div>

        {/* Título del reporte */}
        <div className="text-center mt-4">
          <h2 className="text-base font-bold text-black uppercase">{title}</h2>
          {subtitle && <p className="text-[10px] text-gray-600 mt-1">{subtitle}</p>}
        </div>
      </div>

      {/* Resumen opcional */}
      {showSummary && summaryData.length > 0 && (
        <div className="px-8 pb-2">
          <div className="flex gap-6 text-[10px]">
            {summaryData.map((item, idx) => (
              <div key={idx}>
                <span className="font-semibold">{item.label}:</span> {item.value}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tabla */}
      <div className="flex-1 px-8 py-2 overflow-hidden">
        <GenericReportTable
          columns={columns}
          data={data}
          rowKey={rowKey}
          fontSizeClass="text-[9px]"
          headerFontSizeClass="text-[9px]"
        />
        {children}
      </div>

      {/* Firmas */}
      <div className="px-8 pb-6 mt-auto">
        <div className="border-t border-black pt-6">
          <div className="grid grid-cols-3 gap-12">
            <div className="text-center">
              <div className="border-b border-black w-40 mx-auto mb-1" />
              <p className="text-[10px] font-semibold">Lic. Kenny Guzmán</p>
              <p className="text-[8px] text-gray-600">Sub Director de Gestión de Recursos</p>
            </div>
            <div className="text-center">
              <div className="border-b border-black w-40 mx-auto mb-1" />
              <p className="text-[10px] font-semibold">Dr. Mario Francisco Aguilar</p>
              <p className="text-[8px] text-gray-600">Director Ejecutivo</p>
            </div>
            <div className="text-center">
              <div className="border-b border-black w-40 mx-auto mb-1" />
              <p className="text-[10px] font-semibold">Lic. Giselle Gómez</p>
              <p className="text-[8px] text-gray-600">Jefe de Logística y Suministros</p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-4 pt-2 border-t border-gray-300 text-center">
          <p className="text-[8px] text-gray-500">
            Colonia Miramontes, Calle de la Salud • Tel: 2239-7128 • Tegucigalpa, Honduras
          </p>
        </div>
      </div>
    </div>
  );
};

export default PdfReportLayout;