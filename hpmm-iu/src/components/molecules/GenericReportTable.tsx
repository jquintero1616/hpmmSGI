import React from "react";

export interface ReportColumn<T> {
  header: string;
  accessor: keyof T | ((row: T) => React.ReactNode);
  align?: "left" | "right" | "center";
}

interface GenericReportTableProps<T> {
  columns: ReportColumn<T>[];
  data: T[];
  rowKey: (row: T) => string | number;
  emptyText?: string;
  fontSizeClass?: string;
  headerFontSizeClass?: string; // NUEVO
}

const GenericReportTable = <T extends Record<string, any>>({
  columns,
  data,
  rowKey,
  emptyText = "Sin datos para mostrar.",
  fontSizeClass = "text-xs",
  headerFontSizeClass = "text-xs", // NUEVO
}: GenericReportTableProps<T>) => (
  <div className="overflow-x-auto bg-white rounded-lg shadow-sm p-1">
    <table className={`w-full table-auto border-collapse ${fontSizeClass}`}>
      <thead>
        <tr>
          {columns.map((col, idx) => (
            <th
              key={idx}
              className={`px-2 py-1 font-bold uppercase bg-gray-200 border-b border-gray-300 text-gray-900 whitespace-normal text-left ${headerFontSizeClass} ${
                idx !== 0 ? "border-l border-gray-200" : ""
              }`}
              style={{ maxWidth: 110, minWidth: 80 }} // Ajusta según tus datos
            >
              {col.header}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.length === 0 ? (
          <tr>
            <td
              colSpan={columns.length}
              className="text-center py-6 text-gray-500"
            >
              {emptyText}
            </td>
          </tr>
        ) : (
          data.map((row, idx) => (
            <tr
              key={rowKey(row) ?? idx}
              className="hover:bg-gray-50 transition-colors duration-150 even:bg-gray-100"
            >
              {columns.map((col, cidx) => (
                <td
                  key={cidx}
                  className={`px-2 py-1 whitespace-nowrap text-gray-700 overflow-hidden text-ellipsis text-left ${fontSizeClass} ${
                    cidx !== 0 ? "border-l border-gray-200" : ""
                  }`}
                  style={{ maxWidth: 110, minWidth: 90 }} // Igual que en <th>
                  title={
                    typeof col.accessor === "function"
                      ? undefined
                      : String(row[col.accessor])
                  }
                >
                  {typeof col.accessor === "function"
                    ? col.accessor(row)
                    : row[col.accessor]}
                </td>
              ))}
            </tr>
          ))
        )}
      </tbody>
    </table>
  </div>
);

export default GenericReportTable;
