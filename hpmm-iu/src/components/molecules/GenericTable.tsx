import React, { useState, useMemo, useEffect, useRef, useCallback } from "react";
import Button from "../atoms/Buttons/Button";
import Pagination from "../molecules/Pagination";
import { FaSort, FaSortUp, FaSortDown, FaSearch, FaTimes, FaFileExcel } from "react-icons/fa";
import ActionButton, { ActionButtonGroup, type ActionType } from "../atoms/Buttons/ActionButton";

type SortDirection = "asc" | "desc" | null;

// Componente para celdas con texto truncado y tooltip
const TruncatedCell: React.FC<{
  content: React.ReactNode;
  maxWidth?: string;
}> = ({ content, maxWidth = "200px" }) => {
  const [showTooltip, setShowTooltip] = useState(false);
  const [isOverflowing, setIsOverflowing] = useState(false);
  const textRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (textRef.current) {
      setIsOverflowing(textRef.current.scrollWidth > textRef.current.clientWidth);
    }
  }, [content]);

  const contentString = typeof content === "string" || typeof content === "number" 
    ? String(content) 
    : null;

  return (
    <div className="relative">
      <span
        ref={textRef}
        className="block truncate"
        style={{ maxWidth }}
        onMouseEnter={() => isOverflowing && setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
      >
        {content}
      </span>
      {showTooltip && contentString && (
        <div className="absolute z-50 left-0 bottom-full mb-2 px-3 py-2 text-sm
          bg-gray-900 dark:bg-gray-700 text-white rounded-lg shadow-lg
          max-w-xs break-words whitespace-normal
          animate-in fade-in duration-200">
          {contentString}
          <div className="absolute left-4 top-full w-0 h-0 
            border-l-4 border-r-4 border-t-4 
            border-l-transparent border-r-transparent border-t-gray-900 dark:border-t-gray-700" />
        </div>
      )}
    </div>
  );
};

export interface Column<T> {
  header: string;
  accessor: keyof T | ((row: T) => React.ReactNode);
  /** Campo a editar cuando accessor es una función */
  editField?: keyof T;
  editable?: boolean;
  editType?: "text" | "number" | "select" | "checkbox" | "date";
  editOptions?: { label: string; value: any }[];
  editProps?: React.InputHTMLAttributes<HTMLInputElement | HTMLSelectElement>;
  hide?: boolean;
  /** Ancho máximo de la columna (ej: "200px", "15rem") */
  maxWidth?: string;
  /** Ancho mínimo de la columna (ej: "100px", "8rem") */
  minWidth?: string;
  /** Si es true, trunca el texto largo con "..." y muestra tooltip */
  truncate?: boolean;
  /** Si es true, permite que el texto se divida en múltiples líneas */
  wrap?: boolean;
  /** Alineación del contenido: "left" | "center" | "right" */
  align?: "left" | "center" | "right";
}

export interface Action<T> {
  header: string;
  label: React.ReactNode;
  onClick: (row: T) => void;
  disabled?: (row: T) => boolean; 
  show?: (row: T) => boolean;
  /** Tipo de acción para usar icono en lugar de texto */
  actionType?: ActionType;
  /** Tooltip personalizado para el botón de icono */
  tooltip?: string;
}

interface GenericTableProps<T> {
  columns: Column<T>[];
  data: T[];
  rowKey: (row: T) => string;
  actions?: Action<T>[];
  rowsPerPage?: number;
  rowClassName?: (row: T) => string;
  editable?: boolean;
  onEditRow?: (rowKey: string, newValues: Partial<T>) => void;
  fullScreen?: boolean; 
  inputProps_?: React.InputHTMLAttributes<HTMLInputElement>; 
  showIndex?: boolean;
  // NUEVAS PROPS
  showGlobalSearch?: boolean; // Mostrar búsqueda global
  showExport?: boolean; // Mostrar botón exportar CSV
  showRowsPerPageSelector?: boolean; // Mostrar selector de filas por página
  rowsPerPageOptions?: number[]; // Opciones para el selector
  loading?: boolean; // Estado de carga
  title?: string; // Título de la tabla
  emptyMessage?: string; // Mensaje cuando no hay datos
}

// Componente Skeleton para loading
const TableSkeleton = ({ columns, rows = 5 }: { columns: number; rows?: number }) => (
  <>
    {Array.from({ length: rows }).map((_, rowIdx) => (
      <tr key={`skeleton-row-${rowIdx}`} className="animate-pulse">
        {Array.from({ length: columns }).map((_, colIdx) => (
          <td key={`skeleton-col-${colIdx}`} className="px-4 py-3">
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
          </td>
        ))}
        <td className="px-4 py-3">
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-20"></div>
        </td>
      </tr>
    ))}
  </>
);

const GenericTable = <T extends Record<string, any>>({
  columns,
  data,
  rowKey,
  actions = [],
  rowsPerPage: initialRowsPerPage = 10,
  rowClassName,
  editable = false,
  onEditRow,
  fullScreen = false,
  showIndex = false,
  // NUEVAS PROPS con defaults
  showGlobalSearch = true,
  showExport = true,
  showRowsPerPageSelector = true,
  rowsPerPageOptions = [10, 25, 50, 100],
  loading = false,
  title,
  emptyMessage = "Sin datos para mostrar.",
}: GenericTableProps<T>) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(initialRowsPerPage);

  // Estado para filtros y ordenamiento
  const [globalSearch, setGlobalSearch] = useState(""); // Búsqueda global
  const [sortBy, setSortBy] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>(null);
  const globalSearchRef = useRef<HTMLInputElement | null>(null);


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

  // Filtrado global
  const filteredData = useMemo(() => {
    if (!globalSearch) return data;
    
    const searchLower = globalSearch.toLowerCase();
    return data.filter((row) => {
      return columns.some((col) => {
        const cellValue =
          typeof col.accessor === "function"
            ? col.accessor(row)
            : row[col.accessor];
        if (typeof cellValue === "object" && cellValue !== null) return false;
        return String(cellValue ?? "")
          .toLowerCase()
          .includes(searchLower);
      });
    });
  }, [data, columns, globalSearch]);

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



  // NUEVO: Exportar a CSV
  const exportToCSV = useCallback(() => {
    // Obtener headers
    const headers = columns
      .filter(col => !col.hide)
      .map(col => col.header);
    
    // Obtener datos
    const csvData = sortedData.map(row => {
      return columns
        .filter(col => !col.hide)
        .map(col => {
          const value = typeof col.accessor === "function"
            ? col.accessor(row)
            : row[col.accessor];
          // Escapar comillas y manejar valores especiales
          const stringValue = String(value ?? "").replace(/"/g, '""');
          return `"${stringValue}"`;
        })
        .join(",");
    });

    // Crear contenido CSV
    const csvContent = [headers.join(","), ...csvData].join("\n");
    
    // Crear y descargar archivo
    const blob = new Blob(["\ufeff" + csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `Lista_${new Date().toISOString().slice(0,10)}.csv`);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }, [columns, sortedData]);

  // Limpiar búsqueda
  const clearSearch = useCallback(() => {
    setGlobalSearch("");
    setCurrentPage(1);
  }, []);

  // Verificar si hay búsqueda activa
  const hasActiveSearch = useMemo(() => {
    return globalSearch !== "";
  }, [globalSearch]);

  // NUEVO: Estado para edición
  const [editingRowKey, setEditingRowKey] = useState<string | null>(null);
  const [editValues, setEditValues] = useState<Partial<T>>({});

  // NUEVO: Guardar cambios
  const handleSaveEdit = (row: T) => {
    if (onEditRow && editingRowKey) {
      onEditRow(editingRowKey, editValues);
    }
    setEditingRowKey(null);
    setEditValues({});
  };

  // NUEVO: Cancelar edición
  const handleCancelEdit = () => {
    setEditingRowKey(null);
    setEditValues({});
  };

  const totalPages = useMemo(() => {
    return Math.ceil(filteredData.length / rowsPerPage) || 1;
  }, [filteredData.length, rowsPerPage]);

  // NUEVO: Calcular rango de resultados mostrados
  const resultsRange = useMemo(() => {
    const start = (currentPage - 1) * rowsPerPage + 1;
    const end = Math.min(currentPage * rowsPerPage, filteredData.length);
    return { start, end, total: filteredData.length, originalTotal: data.length };
  }, [currentPage, rowsPerPage, filteredData.length, data.length]);

  return (
    <div
      className={`overflow-x-auto bg-white dark:bg-gray-900 rounded-lg shadow-sm ${
        fullScreen ? "w-full max-w-[95vw]" : ""
      }`}
    >
      {/* NUEVO: Toolbar superior */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        {/* Título y controles */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          {/* Lado izquierdo: Título y contador */}
          <div className="flex items-center gap-4">
            {title && (
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                {title}
              </h3>
            )}
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {filteredData.length !== data.length ? (
                <>
                  Mostrando <span className="font-medium">{resultsRange.start}-{resultsRange.end}</span> de{" "}
                  <span className="font-medium">{resultsRange.total}</span> resultados
                  <span className="text-gray-400"> (filtrado de {resultsRange.originalTotal})</span>
                </>
              ) : (
                <>
                  Mostrando <span className="font-medium">{resultsRange.start}-{resultsRange.end}</span> de{" "}
                  <span className="font-medium">{resultsRange.total}</span> resultados
                </>
              )}
            </span>
          </div>

          {/* Lado derecho: Controles */}
          <div className="flex items-center gap-3 flex-wrap">
            {/* Búsqueda global */}
            {showGlobalSearch && (
              <div className="relative">
                <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  ref={globalSearchRef}
                  type="text"
                  placeholder="Buscar en todo..."
                  value={globalSearch}
                  onChange={(e) => {
                    setGlobalSearch(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="pl-9 pr-8 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg 
                    focus:ring-2 focus:ring-blue-500 focus:border-transparent
                    bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200
                    w-48 sm:w-64 transition-all duration-200"
                />
                {globalSearch && (
                  <button
                    onClick={() => {
                      setGlobalSearch("");
                      setCurrentPage(1);
                    }}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <FaTimes className="w-3 h-3" />
                  </button>
                )}
              </div>
            )}

            {/* Limpiar búsqueda */}
            {hasActiveSearch && (
              <button
                onClick={clearSearch}
                className="flex items-center gap-1 px-3 py-2 text-sm text-red-600 hover:text-red-700 
                  hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
              >
                <FaTimes className="w-3 h-3" />
                Limpiar búsqueda
              </button>
            )}

            {/* Selector de filas por página */}
            {showRowsPerPageSelector && (
              <div className="flex items-center gap-2">
                <label className="text-sm text-gray-600 dark:text-gray-400">Mostrar:</label>
                <select
                  value={rowsPerPage}
                  onChange={(e) => {
                    setRowsPerPage(Number(e.target.value));
                    setCurrentPage(1);
                  }}
                  className="px-2 py-1.5 text-sm border border-gray-300 dark:border-gray-600 rounded-lg
                    bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200
                    focus:ring-2 focus:ring-blue-500 focus:border-transparent cursor-pointer"
                >
                  {rowsPerPageOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Botón exportar */}
            {showExport && (
              <button
                onClick={exportToCSV}
                disabled={filteredData.length === 0}
                className="flex items-center gap-2 px-3 py-2 text-sm font-medium
                  bg-green-600 hover:bg-green-700 disabled:bg-gray-400 
                  text-white rounded-lg transition-colors disabled:cursor-not-allowed"
                title="Exportar a Excel/CSV"
              >
                <FaFileExcel className="w-4 h-4" />
                <span className="hidden sm:inline">Exportar</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Tabla */}
      <div className={`relative overflow-x-auto ${fullScreen ? "max-w-full" : ""}`}>
        <table className="min-w-max w-full" aria-label="Lista de requisiciones">
          <thead className="sticky top-0 bg-gray-50 dark:bg-gray-800">
            <tr className="divide-x divide-gray-100 dark:divide-gray-700">
              {showIndex && (
                <th className="px-4 py-3 text-left text-xs font-bold text-gray-900 dark:text-white uppercase bg-gray-200 dark:bg-gray-700 border-b border-gray-300 dark:border-gray-600">
                  #
                </th>
              )}
              {columns.map((col, idx) => {
                const key =
                  typeof col.accessor === "string" ? col.accessor : col.header;
                const isSorted = sortBy === key;
                const alignClass = col.align === "center" ? "text-center" : col.align === "right" ? "text-right" : "text-left";
                return (
                  <th
                    key={`column-${idx}`}
                    style={{ 
                      display: col.hide ? "none" : undefined,
                      minWidth: col.minWidth,
                      maxWidth: col.maxWidth,
                    }} 
                    className={`px-4 py-3 ${alignClass} text-xs font-bold text-gray-900 dark:text-white uppercase bg-gray-200 dark:bg-gray-700 border-b border-gray-300 dark:border-gray-600 cursor-pointer select-none hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors`}
                    onClick={() => {
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
                    <div className="flex items-center gap-2">
                      {col.header}
                      <span className="text-gray-400">
                        {isSorted ? (
                          sortDirection === "asc" ? (
                            <FaSortUp className="inline text-blue-600" />
                          ) : sortDirection === "desc" ? (
                            <FaSortDown className="inline text-blue-600" />
                          ) : (
                            <FaSort className="inline" />
                          )
                        ) : (
                          <FaSort className="inline opacity-50" />
                        )}
                      </span>
                    </div>
                  </th>
                );
              })}

              <th className="px-4 py-3 text-left text-xs font-bold text-gray-900 dark:text-white uppercase bg-gray-200 dark:bg-gray-700 border-b border-gray-300 dark:border-gray-600">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
            {/* NUEVO: Skeleton loading */}
            {loading ? (
              <TableSkeleton columns={columns.filter(c => !c.hide).length + (showIndex ? 1 : 0)} rows={rowsPerPage} />
            ) : paginatedData.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length + (showIndex ? 2 : 1)}
                  className="text-center py-12 text-gray-500 dark:text-gray-400"
                >
                  <div className="flex flex-col items-center gap-2">
                    <svg className="w-12 h-12 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <span>{emptyMessage}</span>
                    {hasActiveSearch && (
                      <button
                        onClick={clearSearch}
                        className="text-blue-600 hover:text-blue-700 text-sm underline"
                      >
                        Limpiar búsqueda
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ) : (
            paginatedData.map((row, rowIndex) => {
              const uniqueRowKey = rowKey(row) || `row-${rowIndex}`;
              const customRowClass = rowClassName ? rowClassName(row) : "";
              const isEditing = editable && editingRowKey === uniqueRowKey;
              const rowNumber = (currentPage - 1) * rowsPerPage + rowIndex + 1;

              return (
                <tr
                  key={uniqueRowKey}
                  className={`hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors duration-150 even:bg-gray-100 dark:even:bg-gray-850 ${customRowClass}`}
                >
                  {showIndex && (
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-left text-gray-700 dark:text-gray-300">
                      {rowNumber}
                    </td>
                  )}
                  {columns.map((col, idx) => {
                    const cell =
                      typeof col.accessor === "function"
                        ? col.accessor(row)
                        : (row[col.accessor as keyof T] as React.ReactNode);

                    // NUEVO: Si está en modo edición y la columna es editable
                    // Soporta editField para cuando accessor es una función
                    const fieldToEdit = col.editField || (typeof col.accessor === "string" ? col.accessor : null);
                    if (
                      isEditing &&
                      fieldToEdit &&
                      col.editable
                    ) {
                      // Soporte para diferentes tipos de input
                      if (col.editType === "select" && col.editOptions) {
                        return (
                          <td key={`${uniqueRowKey}-col-${idx}`} className="px-4 py-3 text-left">
                            <select
                              className="border rounded px-2 py-1 w-full text-sm"
                              value={
                                editValues[fieldToEdit as keyof T] !== undefined
                                  ? String(editValues[fieldToEdit as keyof T])
                                  : String(row[fieldToEdit as keyof T] ?? "")
                              }
                              onChange={(e) =>
                                setEditValues((prev) => ({
                                  ...prev,
                                  [fieldToEdit]: e.target.value,
                                }))
                              }
                              {...col.editProps}
                            >
                              <option value="">Seleccione...</option>
                              {col.editOptions.map((opt) => (
                                <option key={opt.value} value={opt.value}>
                                  {opt.label}
                                </option>
                              ))}
                            </select>
                          </td>
                        );
                      }
                      if (col.editType === "checkbox") {
                        return (
                          <td key={`${uniqueRowKey}-col-${idx}`} className="px-4 py-3 text-center">
                            <input
                              type="checkbox"
                              checked={
                                editValues[fieldToEdit as keyof T] !== undefined
                                  ? Boolean(editValues[fieldToEdit as keyof T])
                                  : Boolean(row[fieldToEdit as keyof T])
                              }
                              onChange={(e) =>
                                setEditValues((prev) => ({
                                  ...prev,
                                  [fieldToEdit]: e.target.checked,
                                }))
                              }
                              {...col.editProps}
                            />
                          </td>
                        );
                      }
                      if (col.editType === "number") {
                        return (
                          <td key={`${uniqueRowKey}-col-${idx}`} className="px-4 py-3 text-left">
                            <input
                              type="number"
                              className="border rounded px-2 py-1 w-full text-sm"
                              value={
                                editValues[fieldToEdit as keyof T] !== undefined
                                  ? String(editValues[fieldToEdit as keyof T])
                                  : String(row[fieldToEdit as keyof T] ?? "")
                              }
                              onChange={(e) =>
                                setEditValues((prev) => ({
                                  ...prev,
                                  [fieldToEdit]: e.target.value,
                                }))
                              }
                              {...col.editProps}
                            />
                          </td>
                        );
                      }
                      if (col.editType === "date") {
                        return (
                          <td key={`${uniqueRowKey}-col-${idx}`} className="px-4 py-3 text-left">
                            <input
                              type="date"
                              className="border rounded px-2 py-1 w-full text-sm"
                              value={
                                editValues[fieldToEdit as keyof T] !== undefined
                                  ? String(editValues[fieldToEdit as keyof T])
                                  : String(row[fieldToEdit as keyof T] ?? "")
                              }
                              onChange={(e) =>
                                setEditValues((prev) => ({
                                  ...prev,
                                  [fieldToEdit]: e.target.value,
                                }))
                              }
                              {...col.editProps}
                            />
                          </td>
                        );
                      }
                      // Por defecto: input tipo texto
                      return (
                        <td key={`${uniqueRowKey}-col-${idx}`} className="px-4 py-3 text-left">
                          <input
                            className="border rounded px-2 py-1 w-full text-sm"
                            value={
                              editValues[fieldToEdit as keyof T] !== undefined
                                ? String(editValues[fieldToEdit as keyof T])
                                : String(row[fieldToEdit as keyof T] ?? "")
                            }
                            onChange={(e) =>
                              setEditValues((prev) => ({
                                ...prev,
                                [fieldToEdit]: e.target.value,
                              }))
                            }
                            {...col.editProps}
                          />
                        </td>
                      );
                    }

                    const isEstadoCol =
                      (typeof col.accessor === "string" &&
                        col.accessor.toLowerCase().includes("estado")) ||
                      (typeof col.header === "string" &&
                        col.header.toLowerCase().includes("estado"));

                    if (isEstadoCol) {
                      // Normaliza el valor para comparar
                      const cellValue = String(cell).trim().toLowerCase();
                      let bg = "bg-gray-300 text-gray-700";

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
                        bg = "bg-yellow-700 text-white";
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
                      }else if (
                        cellValue === "comprado" ||
                        cellValue === "canceled"
                      ) {
                        bg = "bg-green-300 text-white";
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

                    // Columnas normales con soporte para truncate/wrap
                    const alignClass = col.align === "center" ? "text-center" : col.align === "right" ? "text-right" : "text-left";
                    const wrapClass = col.wrap ? "whitespace-normal" : "whitespace-nowrap";
                    
                    return (
                      <td
                        key={`${uniqueRowKey}-col-${idx}`}
                        style={{ 
                          display: col.hide ? "none" : undefined,
                          minWidth: col.minWidth,
                          maxWidth: col.maxWidth,
                        }} 
                        className={`px-4 py-3 text-sm text-gray-700 dark:text-gray-300 ${alignClass} ${wrapClass}`}
                      >
                        {col.truncate ? (
                          <TruncatedCell content={cell} maxWidth={col.maxWidth || "200px"} />
                        ) : (
                          cell
                        )}
                      </td>
                    );
                  })}

                  <td className="px-4 py-3">
                    <ActionButtonGroup>
                      {editable && !isEditing && (
                        <ActionButton
                          actionType="editar"
                          onClick={() => {
                            setEditingRowKey(uniqueRowKey);
                            setEditValues(row);
                          }}
                        />
                      )}
                      {editable && isEditing && (
                        <>
                          <ActionButton
                            actionType="guardar"
                            onClick={() => handleSaveEdit(row)}
                          />
                          <ActionButton
                            actionType="cancelar"
                            onClick={handleCancelEdit}
                          />
                        </>
                      )}
                      {!editable &&
                        actions.map((act, idx) => {
                          if (act.disabled && act.disabled(row)) return null;
                          if (act.show && !act.show(row)) return null;
                          
                          // Si tiene actionType, usar ActionButton con icono
                          if (act.actionType) {
                            return (
                              <ActionButton
                                key={`${uniqueRowKey}-action-${idx}`}
                                actionType={act.actionType}
                                onClick={() => act.onClick(row)}
                                disabled={act.label !== "Re-Activar" && act.disabled ? act.disabled(row) : false}
                                tooltip={act.tooltip}
                              />
                            );
                          }
                          
                          // Fallback: botón con texto (legacy)
                          return (
                            <Button
                              key={`${uniqueRowKey}-action-${idx}`}
                              className={`size-small ${
                                act.label === "Eliminar" || act.label === "Cancelado" || act.label === "Cancelar"
                                  ? "bg-hpmm-rojo-claro text-white hover:bg-hpmm-rojo-oscuro"
                                  : act.label === "Editar"
                                  ? "bg-hpmm-amarillo-claro text-white hover:bg-hpmm-amarillo-oscuro"
                                  : act.label === "Ver"
                                  ? "bg-hpmm-verde-claro text-white hover:bg-hpmm-verde-oscuro"
                                  : "bg-hpmm-azul-claro text-white hover:bg-hpmm-azul-oscuro"
                              }`}
                              onClick={() => act.onClick(row)}
                              disabled={act.label !== "Re-Activar" && act.disabled ? act.disabled(row) : false}
                            >
                              {act.label}
                            </Button>
                          );
                        })}
                    </ActionButtonGroup>
                  </td>
                </tr>
              );
            })
            )}
          </tbody>
        </table>
      </div>

      {/* Footer con paginación */}
      {totalPages > 1 && !loading && (
        <div className="p-4 border-t border-gray-200 dark:border-gray-700">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </div>
      )}
    </div>
  );
};

export default GenericTable;



