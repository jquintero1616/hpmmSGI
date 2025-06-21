import React, { useState, useMemo, useEffect, useRef } from "react";
import Button from "../atoms/Buttons/Button";
import Pagination from "../molecules/Pagination";
import { FaSort, FaSortUp, FaSortDown, FaSearch } from "react-icons/fa";
import { useAuth } from "../../hooks/use.Auth";

type SortDirection = "asc" | "desc" | null;

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
  rowClassName?: (row: T) => string; // <-- Agregado aquí
}

const GenericTable = <T extends Record<string, any>>({
  columns,
  data,
  rowKey,
  actions = [],
  rowsPerPage = 10,
  rowClassName,
}: GenericTableProps<T>) => {
  const [currentPage, setCurrentPage] = useState(1);

  // Estado para filtros y ordenamiento
  const [filters, setFilters] = useState<Record<string, string>>({});
  const [showFilter, setShowFilter] = useState<Record<string, boolean>>({});
  const [sortBy, setSortBy] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>(null);
  const filterRefs = useRef<Record<string, HTMLInputElement | null>>({});

  const { roleName } = useAuth();

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

  // Cerrar input de filtro al hacer click fuera
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      Object.entries(filterRefs.current).forEach(([key, ref]) => {
        if (ref && showFilter[key] && !ref.contains(event.target as Node)) {
          setShowFilter((prev) => ({ ...prev, [key]: false }));
        }
      });
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showFilter]);

  // Filtrado
  const filteredData = useMemo(() => {
    return data.filter((row) =>
      columns.every((col) => {
        const key =
          typeof col.accessor === "string" ? col.accessor : col.header;
        const filterValue = filters[key as string];
        if (!filterValue) return true;
        let cellValue =
          typeof col.accessor === "function"
            ? col.accessor(row)
            : row[col.accessor];
        if (typeof cellValue === "object" && cellValue !== null) return true;
        return String(cellValue ?? "")
          .toLowerCase()
          .includes(filterValue.toLowerCase());
      })
    );
  }, [data, columns, filters]);

  // Ordenamiento
  const sortedData = useMemo(() => {
    if (!sortBy || !sortDirection) return filteredData;
    const col = columns.find(
      (c) =>
        (typeof c.accessor === "string" && c.accessor === sortBy) ||
        (typeof c.accessor === "function" && c.header === sortBy)
    );
    if (!col) return filteredData;
    return [...filteredData].sort((a, b) => {
      let aValue =
        typeof col.accessor === "function" ? col.accessor(a) : a[col.accessor];
      let bValue =
        typeof col.accessor === "function" ? col.accessor(b) : b[col.accessor];
      // Convertir a string para comparar
      aValue = aValue ?? "";
      bValue = bValue ?? "";
      if (typeof aValue === "object" || typeof bValue === "object") return 0;
      if (sortDirection === "asc") {
        return String(aValue).localeCompare(String(bValue), undefined, {
          numeric: true,
        });
      } else {
        return String(bValue).localeCompare(String(aValue), undefined, {
          numeric: true,
        });
      }
    });
  }, [filteredData, sortBy, sortDirection, columns]);

  // Paginación
  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * rowsPerPage;
    return sortedData.slice(start, start + rowsPerPage);
  }, [currentPage, sortedData, rowsPerPage]);

  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  // Manejar click en header para ordenar y mostrar filtro
  const handleHeaderClick = (col: Column<T>) => {
    const key = typeof col.accessor === "string" ? col.accessor : col.header;
    setShowFilter((prev) => ({
      ...prev,
      [key as string]: !prev[key as string],
    }));
    if (sortBy === key) {
      setSortDirection((prev) =>
        prev === "asc" ? "desc" : prev === "desc" ? null : "asc"
      );
      if (sortDirection === "desc") setSortBy(null);
    } else {
      setSortBy(key as string);
      setSortDirection("asc");
    }
  };

  // Manejar cambio en input de filtro
  const handleFilterChange = (colKey: string, value: string) => {
    setFilters((prev) => ({
      ...prev,
      [colKey]: value,
    }));
    setCurrentPage(1);
  };

  const totalPages = useMemo(() => {
    return Math.ceil(data.length / rowsPerPage) || 1;
  }, [data.length, rowsPerPage]);

  return (
    <div className="overflow-x-auto bg-white dark:bg-gray-900 rounded-lg shadow-sm p-4">
      <div className="relative overflow-x-auto max-w-full">
        <table className="min-w-max w-full" aria-label="Lista de requisiciones">
          <thead className="sticky top-0 bg-gray-50 dark:bg-gray-800">
            <tr className="divide-x divide-gray-100 dark:divide-gray-700">
              {columns.map((col, idx) => {
                const key =
                  typeof col.accessor === "string" ? col.accessor : col.header;
                const isSorted = sortBy === key;
                const isFiltered = !!filters[key as string];
                // Ejemplo de ocultar columna en móvil:
                // const thClass = idx === 2 ? "hidden sm:table-cell" : "";
                return (
                  <th
                    key={`column-${idx}`}
                    className={`px-4 py-3 text-left text-xs font-bold text-gray-900 dark:text-white uppercase bg-gray-200 dark:bg-gray-700 border-b border-gray-300 dark:border-gray-600 relative`}
                    // className={`px-4 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase ${thClass}`}
                  >
                    <div className="flex items-center gap-1">
                      <span
                        className="flex items-center cursor-pointer select-none"
                        onClick={() => {
                          const key =
                            typeof col.accessor === "string"
                              ? col.accessor
                              : col.header;
                          if (sortBy === key) {
                            setSortDirection((prev) =>
                              prev === "asc"
                                ? "desc"
                                : prev === "desc"
                                ? null
                                : "asc"
                            );
                            if (sortDirection === "desc") setSortBy(null);
                          } else {
                            setSortBy(key as string);
                            setSortDirection("asc");
                          }
                        }}
                      >
                        {isSorted ? (
                          sortDirection === "asc" ? (
                            <FaSortUp className="inline" />
                          ) : sortDirection === "desc" ? (
                            <FaSortDown className="inline" />
                          ) : (
                            <FaSort className="inline" />
                          )
                        ) : (
                          <FaSort className="inline" />
                        )}
                        {col.header}
                      </span>
                      <span className="relative">
                        <FaSearch
                          className={`inline ml-1 cursor-pointer ${
                            isFiltered ? "text-blue-600" : "text-gray-400"
                          }`}
                          onClick={(e) => {
                            e.stopPropagation();
                            setShowFilter((prev) => ({
                              ...prev,
                              [key as string]: !prev[key as string],
                            }));
                          }}
                        />
                        {isFiltered && (
                          <span
                            className="absolute top-0 right-0 block w-2 h-2 rounded-full bg-blue-600"
                            style={{ transform: "translate(60%,-60%)" }}
                          />
                        )}
                      </span>
                    </div>
                    {showFilter[key as string] && (
                      <div
                        className="flex items-center mt-1 w-full absolute left-0 z-10 bg-white dark:bg-gray-900"
                        style={{ minWidth: "120px" }}
                      >
                        <input
                          ref={(el) => (filterRefs.current[key as string] = el)}
                          type="text"
                          className="border border-gray-300 dark:border-gray-700 rounded-l px-2 py-1 text-xs w-full bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-200"
                          placeholder={`Filtrar...`}
                          value={filters[key as string] || ""}
                          onChange={(e) =>
                            handleFilterChange(key as string, e.target.value)
                          }
                          onClick={(e) => e.stopPropagation()}
                          autoFocus
                          style={{ borderRight: "none" }}
                        />
                        <button
                          type="button"
                          className="h-full px-3 border border-gray-300 dark:border-gray-700 border-l-0 rounded-r text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 text-lg flex items-center justify-center transition-colors duration-150"
                          onClick={() => {
                            handleFilterChange(key as string, "");
                          }}
                          tabIndex={-1}
                          aria-label="Limpiar filtro"
                          style={{ minHeight: "32px" }}
                        >
                          ×
                        </button>
                      </div>
                    )}
                  </th>
                );
              })}

              <th className="px-4 py-3 text-left text-xs font-bold text-gray-900 dark:text-white uppercase bg-gray-200 dark:bg-gray-700 border-b border-gray-300 dark:border-gray-600">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
            {paginatedData.map((row, rowIndex) => {
              const uniqueRowKey = rowKey(row) || `row-${rowIndex}`;
              const customRowClass = rowClassName ? rowClassName(row) : "";
              return (
                <tr
                  key={uniqueRowKey}
                  className={`hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors duration-150 even:bg-gray-100 dark:even:bg-gray-850 ${customRowClass}`}
                >
                  {columns.map((col, idx) => {
                    const cell =
                      typeof col.accessor === "function"
                        ? col.accessor(row)
                        : (row[col.accessor] as React.ReactNode);

                    const isEstadoCol =
                      (typeof col.accessor === "string" &&
                        col.accessor.toLowerCase().includes("estado")) ||
                      (typeof col.header === "string" &&
                        col.header.toLowerCase().includes("estado"));

                    if (isEstadoCol) {
                      // Normaliza el valor para comparar
                      const cellValue = String(cell).trim().toLowerCase();
                      let bg = "bg-gray-100 text-gray-700";

                      if (
                        cellValue === "activo" ||
                        cellValue === "active" ||
                        cellValue === "true" ||
                        cell === true
                      ) {
                        bg = "bg-green-300 text-white";
                      } else if (
                        cellValue === "inactivo" ||
                        cellValue === "inactive" ||
                        cellValue === "false" ||
                        cell === false
                      ) {
                        bg = "bg-red-300 text-white";
                      } else if (
                        cellValue === "pendiente" ||
                        cellValue === "pending"
                      ) {
                        bg = "bg-purple-300 text-white";
                      } else if (
                        cellValue === "aprobado" ||
                        cellValue === "approved"
                      ) {
                        bg = "bg-green-300 text-white";
                      } else if (
                        cellValue === "cancelado" ||
                        cellValue === "canceled"
                      ) {
                        bg = "bg-red-300 text-white";
                      }

                      return (
                        <td
                          key={`${uniqueRowKey}-col-${idx}`}
                          className="px-4 py-3 whitespace-nowrap text-center"
                        >
                          <span
                            className={`px-3 py-1 rounded-full font-semibold text-xs ${bg}`}
                          >
                            {cell}
                          </span>
                        </td>
                      );
                    }

                    // ...resto de columnas normales
                    const isNumeric =
                      typeof cell === "number" ||
                      (typeof cell === "string" && !isNaN(Number(cell)));
                    return (
                      <td
                        key={`${uniqueRowKey}-col-${idx}`}
                        className={`px-4 py-3 whitespace-nowrap text-sm ${
                          isNumeric
                            ? "text-right text-gray-700 dark:text-gray-300"
                            : "text-left text-gray-700 dark:text-gray-300"
                        }`}
                      >
                        {cell}
                      </td>
                    );
                  })}

                  <td className="px-4 py-3">
                    <div
                      className="flex space-x-2"
                      role="group"
                      aria-label="Acciones sobre la fila"
                    >
                      {actions.map((act, idx) => (
                        <Button
                          key={`${uniqueRowKey}-action-${idx}`}
                          className={`size-small ${
                            act.label === "Eliminar"
                              ? "bg-hpmm-rojo-claro text-white hover:bg-hpmm-rojo-oscuro"
                              : "bg-hpmm-azul-claro text-white hover:bg-hpmm-azul-oscuro"
                          }`}
                          onClick={() => act.onClick(row)}
                        >
                          {act.label}
                        </Button>
                      ))}
                    </div>
                  </td>
                </tr>
              );
            })}

            {paginatedData.length === 0 && (
              <tr>
                <td
                  colSpan={
                    columns.length +
                    (roleName === "Jefe Almacen" || roleName === "Super Admin"
                      ? 1
                      : 0)
                  }
                  className="text-center py-6 text-gray-500 dark:text-gray-400"
                >
                  Sin datos para mostrar.
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
