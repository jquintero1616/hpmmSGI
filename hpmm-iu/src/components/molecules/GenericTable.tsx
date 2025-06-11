import React, { useState, useMemo, useEffect, useRef } from "react";
import Button from "../atoms/Buttons/Button";
import Pagination from "../molecules/Pagination";
import { FaSort, FaSortUp, FaSortDown, FaSearch } from "react-icons/fa"; // Instala react-icons si no lo tienes

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
        if (
          ref &&
          showFilter[key] &&
          !ref.contains(event.target as Node)
        ) {
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
    <div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-full table-auto border-collapse text-sm">
          <thead className="text-sm">
            <tr>
              {columns.map((col, idx) => {
                const key =
                  typeof col.accessor === "string" ? col.accessor : col.header;
                const isSorted = sortBy === key;
                const isFiltered = !!filters[key as string];
                return (
                  <th
                    key={`column-${idx}`}
                    className="border border-gray-300 px-4 py-2 text-left bg-gray-50 whitespace-nowrap relative cursor-pointer"
                    onClick={() => handleHeaderClick(col)}
                  >
                    <div className="flex items-center gap-1">
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
                      <span className="relative">
                        <FaSearch
                          className={`inline ml-1 ${isFiltered ? "text-blue-600" : "text-gray-400"}`}
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
                      <input
                        ref={el => (filterRefs.current[key as string] = el)}
                        type="text"
                        className="mt-1 w-full border border-gray-300 rounded px-2 py-1 text-xs absolute left-0 z-10 bg-white"
                        style={{ minWidth: "120px" }}
                        placeholder={`Filtrar...`}
                        value={filters[key as string] || ""}
                        onChange={(e) =>
                          handleFilterChange(key as string, e.target.value)
                        }
                        onClick={(e) => e.stopPropagation()}
                        autoFocus
                      />
                    )}
                  </th>
                );
              })}
              <th className="border border-gray-300 px-4 py-2 text-left bg-gray-50 whitespace-nowrap">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="text-sm">
            {paginatedData.map((row, rowIndex) => {
              const uniqueRowKey = rowKey(row) || `row-${rowIndex}`;
              const customRowClass = rowClassName ? rowClassName(row) : "";
              return (
                <tr
                  key={uniqueRowKey}
                  className={`hover:bg-gray-100 ${customRowClass}`}
                >
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
                  <td className="border border-gray-200 px-4 py-2 whitespace-nowrap gap-2 flex">
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
                  </td>
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
