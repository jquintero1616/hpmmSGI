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
}

const GenericReportTable = <T extends Record<string, any>>({
  columns,
  data,
  rowKey,
  emptyText = "Sin datos para mostrar.",
}: GenericReportTableProps<T>) => (
  <div className="overflow-x-auto bg-white rounded-lg shadow-sm p-4">
    <table className="w-full min-w-[600px] table-auto border-collapse text-sm">
      <thead>
        <tr>
          {columns.map((col, idx) => (
            <th
              key={idx}
              className={`px-4 py-3 text-xs font-bold uppercase bg-gray-200 border-b border-gray-300 text-gray-900 text-center`}
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
                  className={`px-4 py-3 whitespace-nowrap text-gray-700 ${
                    col.align === "right"
                      ? "text-right"
                      : col.align === "center"
                      ? "text-center"
                      : "text-left"
                  }`}
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