import React, { useState } from "react";
import Button from "../atoms/Buttons/Button";
import { Column, Action } from "./GenericTable";

interface GroupedInlineTableProps<T> {
  data: T[];
  columns: Column<T>[];
  actions?: Action<T>[];
  rowKey: (row: T) => string;
  pactCol: string;   // accessor para Pacto
  unitCol: string;   // accessor para Unidad
}

function GroupedInlineTable<T extends Record<string, any>>({
  data,
  columns,
  actions = [],
  rowKey,
  pactCol,
  unitCol,
}: GroupedInlineTableProps<T>) {
  // Agrupar primero por Unidad, luego por Pacto
  const groupedByUnit = data.reduce((acc, item) => {
    const unitKey = item[unitCol];
    if (!acc[unitKey]) acc[unitKey] = {};
    const pactKey = item[pactCol];
    if (!acc[unitKey][pactKey]) acc[unitKey][pactKey] = [];
    acc[unitKey][pactKey].push(item);
    return acc;
  }, {} as Record<string, Record<string, T[]>>);

  const [expandedUnits, setExpandedUnits] = useState<Record<string, boolean>>({});
  const [expandedPacts, setExpandedPacts] = useState<Record<string, boolean>>({});

  const handleToggleUnit = (unitKey: string) => {
    setExpandedUnits((prev) => ({
      ...prev,
      [unitKey]: !prev[unitKey],
    }));
  };

  const handleTogglePact = (unitKey: string, pactKey: string) => {
    const key = `${unitKey}||${pactKey}`;
    setExpandedPacts((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const unitKeys = Object.keys(groupedByUnit);

  return (
    <div className="overflow-x-auto bg-white dark:bg-gray-900 rounded-lg shadow-sm p-4">
      <table className="w-full min-w-[600px] table-auto border-collapse text-sm">
        <thead className="sticky top-0 bg-gray-50 dark:bg-gray-800">
          <tr className="divide-x divide-gray-100 dark:divide-gray-700">
            {columns.map((col, idx) => (
              <th
                key={idx}
                className="px-4 py-3 text-left text-xs font-bold text-gray-900 dark:text-white uppercase bg-gray-200 dark:bg-gray-700 border-b border-gray-300 dark:border-gray-600"
              >
                {col.header}
              </th>
            ))}
            {actions.length > 0 && (
              <th className="px-4 py-3 text-left text-xs font-bold text-gray-900 dark:text-white uppercase bg-gray-200 dark:bg-gray-700 border-b border-gray-300 dark:border-gray-600">
                Acciones
              </th>
            )}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
          {unitKeys.length === 0 && (
            <tr>
              <td
                colSpan={columns.length + (actions.length > 0 ? 1 : 0)}
                className="text-center py-6 text-gray-500 dark:text-gray-400"
              >
                Sin datos para mostrar.
              </td>
            </tr>
          )}
          {unitKeys.map((unitKey) => {
            const pacts = groupedByUnit[unitKey];
            const pactKeys = Object.keys(pacts);
            const unitCount = pactKeys.reduce((acc, pk) => acc + pacts[pk].length, 0);
            const isUnitOpen = !!expandedUnits[unitKey];
            return (
              <React.Fragment key={unitKey}>
                {/* Fila de Unidad */}
                <tr
                  className="cursor-pointer select-none bg-gray-100 dark:bg-gray-800 font-semibold"
                  onClick={() => handleToggleUnit(unitKey)}
                  tabIndex={0}
                  aria-expanded={isUnitOpen}
                  style={{ userSelect: "none" }}
                >
                  {columns.map((col, idx) => {
                    let value = "";
                    if (
                      (typeof col.accessor === "string" && col.accessor === unitCol) ||
                      (typeof col.header === "string" && col.header.toLowerCase().includes("unidad"))
                    ) {
                      value = unitKey;
                    }
                    return (
                      <td
                        key={idx}
                        className="px-4 py-3 whitespace-nowrap text-left text-gray-900 dark:text-white"
                      >
                        {value}
                        {idx === 0 && (
                          <span className="ml-2 text-xs text-gray-500">
                            <span
                              className={`inline-block transition-transform duration-200 ${
                                isUnitOpen ? "rotate-90" : ""
                              }`}
                            >
                              ▶
                            </span>{" "}
                            ({unitCount} {unitCount === 1 ? "" : ""})
                          </span>
                        )}
                      </td>
                    );
                  })}
                  {actions.length > 0 && <td />}
                </tr>
                {/* Filas de Pactos (Frecuencias) */}
                {isUnitOpen &&
                  pactKeys.map((pactKey) => {
                    const pactRows = pacts[pactKey];
                    const isPactOpen = !!expandedPacts[`${unitKey}||${pactKey}`];
                    return (
                      <React.Fragment key={pactKey}>
                        <tr
                          className="cursor-pointer select-none bg-gray-50 dark:bg-gray-900"
                          onClick={() => handleTogglePact(unitKey, pactKey)}
                          tabIndex={0}
                          aria-expanded={isPactOpen}
                          style={{ userSelect: "none" }}
                        >
                          {columns.map((col, idx) => {
                            let value = "";
                            if (
                              (typeof col.accessor === "string" && col.accessor === pactCol) ||
                              (typeof col.header === "string" && col.header.toLowerCase().includes("pacto"))
                            ) {
                              value = pactKey;
                            }
                            return (
                              <td
                                key={idx}
                                className="px-4 py-3 whitespace-nowrap text-left text-gray-900 dark:text-white"
                              >
                                {value}
                                {idx === 0 && (
                                  <span className="ml-2 text-xs text-gray-500">
                                    <span
                                      className={`inline-block transition-transform duration-200 ${
                                        isPactOpen ? "rotate-90" : ""
                                      }`}
                                    >
                                      ▶
                                    </span>{" "}
                                    ({pactRows.length} {pactRows.length === 1 ? "" : ""})
                                  </span>
                                )}
                              </td>
                            );
                          })}
                          {actions.length > 0 && <td />}
                        </tr>
                        {/* Filas de datos */}
                        {isPactOpen &&
                          pactRows.map((row, rowIndex) => (
                            <tr
                              key={rowKey(row) || `row-${rowIndex}`}
                              className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors duration-150 even:bg-gray-100 dark:even:bg-gray-850"
                            >
                              {columns.map((col, idx) => {
                                const cell =
                                  typeof col.accessor === "function"
                                    ? col.accessor(row)
                                    : (row[col.accessor] as React.ReactNode);

                                // Formato especial para columna "estado"
                                const isEstadoCol =
                                  (typeof col.accessor === "string" &&
                                    col.accessor.toLowerCase().includes("estado")) ||
                                  (typeof col.header === "string" &&
                                    col.header.toLowerCase().includes("estado"));

                                if (isEstadoCol) {
                                  const cellValue = String(cell).trim().toLowerCase();
                                  let bg = "bg-gray-100 text-gray-700";
                                  if (
                                    cellValue === "activo" ||
                                    cellValue === "active" ||
                                    cellValue === "true" ||
                                    cell === true
                                  ) {
                                    bg = "bg-green-100 text-green-700";
                                  } else if (
                                    cellValue === "inactivo" ||
                                    cellValue === "inactive" ||
                                    cellValue === "false" ||
                                    cell === false
                                  ) {
                                    bg = "bg-red-100 text-red-700";
                                  } else if (
                                    cellValue === "pendiente" ||
                                    cellValue === "pending"
                                  ) {
                                    bg = "bg-yellow-100 text-yellow-700";
                                  } else if (
                                    cellValue === "aprobado" ||
                                    cellValue === "approved"
                                  ) {
                                    bg = "bg-green-100 text-blue-500";
                                  } else if (
                                    cellValue === "cancelado" ||
                                    cellValue === "canceled"
                                  ) {
                                    bg = "bg-red-100 text-green-700";
                                  }
                                  return (
                                    <td
                                      key={idx}
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

                                // Columnas normales
                                const isNumeric =
                                  typeof cell === "number" ||
                                  (typeof cell === "string" && !isNaN(Number(cell)));
                                return (
                                  <td
                                    key={idx}
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
                              {actions.length > 0 && (
                                <td className="px-4 py-3">
                                  <div className="flex space-x-2" role="group" aria-label="Acciones sobre la fila">
                                    {actions.map((act, idx) => (
                                      <Button
                                        key={idx}
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
                              )}
                            </tr>
                          ))}
                      </React.Fragment>
                    );
                  })}
              </React.Fragment>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default GroupedInlineTable;