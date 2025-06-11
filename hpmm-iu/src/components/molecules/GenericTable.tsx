import React, { useState, useMemo, useEffect } from "react";
import Button from "../atoms/Buttons/Button";
import Pagination from "../molecules/Pagination";

export interface Column<T> {
  header: string;
  accessor: keyof T | ((row: T) => React.ReactNode);
}

export interface Action<T> {
  header: string;
  label: React.ReactNode;
  onClick: (row: T) => void;
}

interface GenericTableProps<T> {
  columns: Column<T>[];
  data: T[];
  rowKey: (row: T) => string;
  actions?: Action<T>[];
  rowsPerPage?: number;
}

const GenericTable = <T extends Record<string, any>>({
  columns,
  data,
  rowKey,
  actions = [],
  rowsPerPage = 10,
}: GenericTableProps<T>) => {
  const [currentPage, setCurrentPage] = useState(1);

  // ───> Aquí: cada vez que cambie `data`, vuelvo a página 1:
  useEffect(() => {
    setCurrentPage(1);
  }, [data]);

  // Opcional (para forzar que currentPage nunca sea mayor que totalPages):
  useEffect(() => {
    const newTotal = Math.ceil(data.length / rowsPerPage) || 1;
    if (currentPage > newTotal) {
      setCurrentPage(newTotal);
    }
  }, [data, currentPage, rowsPerPage]);

  const totalPages = useMemo(() => {
    return Math.ceil(data.length / rowsPerPage) || 1;
  }, [data.length, rowsPerPage]);

  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * rowsPerPage;
    return data.slice(start, start + rowsPerPage);
  }, [currentPage, data, rowsPerPage]);

  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  return (
    <div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-full table-auto border-collapse text-sm">
          <thead className="text-sm">
            <tr>
              {columns.map((col, idx) => (
                <th
                  key={`column-${idx}`}
                  className="border border-gray-300 px-4 py-2 text-left bg-gray-50 whitespace-nowrap"
                >
                  {col.header}
                </th>
              ))}
              {actions.map((act, idx) => (
                <th
                  key={`action-header-${idx}-${act.header}`}
                  className="border border-gray-300 px-4 py-2 text-left bg-gray-50 whitespace-nowrap"
                >
                  {act.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="text-sm">
            {paginatedData.map((row, rowIndex) => {
              const uniqueRowKey = rowKey(row) || `row-${rowIndex}`;
              return (
                <tr key={uniqueRowKey} className="hover:bg-gray-100">
                  {columns.map((col, idx) => {
                    const cell =
                      typeof col.accessor === "function"
                        ? col.accessor(row)
                        : (row[col.accessor] as React.ReactNode);
                    return (
                      <td
                        key={`${uniqueRowKey}-col-${idx}`}
                        className="border border-gray-200 px-4 py-2 whitespace-nowrap"
                      >
                        {cell}
                      </td>
                    );
                  })}
                  {actions.map((act, idx) => (
                    <td
                      key={`${uniqueRowKey}-action-${idx}`}
                      className="border border-gray-200 px-4 py-2 whitespace-nowrap"
                    >
                      <Button size="medium" onClick={() => act.onClick(row)}>
                        {act.label}
                      </Button>
                    </td>
                  ))}
                </tr>
              );
            })}

            {paginatedData.length === 0 && (
              <tr>
                <td
                  colSpan={columns.length + actions.length}
                  className="text-center py-6"
                >
                  No hay datos disponibles.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      )}
    </div>
  );
};

export default GenericTable;
