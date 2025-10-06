import React from "react";

export interface DataSheetItem {
  label: string;
  value: React.ReactNode;
}

interface DataSheetProps {
  items: DataSheetItem[];
  columns?: number;          // número de parejas (label+valor) por fila (1–4)
  dense?: boolean;
  title?: string;
  minLabelWidth?: number;    // ancho mínimo de cada etiqueta
}

const DataSheet: React.FC<DataSheetProps> = ({
  items,
  columns = 2,
  dense = false,
  title,
  minLabelWidth = 120,
}) => {
  const pairs = Math.min(Math.max(columns, 1), 4); // clamp 1–4

  // Layout vertical clásico (uno debajo del otro)
  if (pairs === 1) {
    return (
      <div className="w-full">
        {title && (
          <h3 className="text-lg font-semibold mb-3 tracking-wide">
            {title}
          </h3>
        )}
        <dl className="divide-y divide-gray-200 dark:divide-gray-700 border border-gray-200 dark:border-gray-700 rounded bg-white dark:bg-gray-900">
          {items.map((it, i) => (
            <div
              key={i}
              className={`grid grid-cols-1 md:grid-cols-3 gap-3 px-4 ${
                dense ? "py-1.5" : "py-3"
              }`}
            >
              <dt className="text-xs font-medium tracking-wider uppercase text-gray-500 dark:text-gray-400 self-center">
                {it.label}
              </dt>
              <dd className="md:col-span-2 text-sm text-gray-900 dark:text-gray-100 leading-snug">
                {it.value === "" || it.value === null || it.value === undefined ? (
                  <span className="italic text-gray-400">—</span>
                ) : (
                  it.value
                )}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    );
  }

  // Layout ancho en grid (pares horizontales)
  return (
    <div className="w-full">
      {title && (
        <h3 className="text-lg font-semibold mb-3 tracking-wide">
          {title}
        </h3>
      )}
      <dl
        className={`border border-gray-200 dark:border-gray-700 rounded bg-white dark:bg-gray-900 p-4 grid ${
          dense ? "gap-y-2 gap-x-6" : "gap-y-4 gap-x-8"
        }`}
        style={{
          gridTemplateColumns: `repeat(${pairs}, minmax(${minLabelWidth}px, 170px) 1fr)`,
        }}
      >
        {items.map((it, i) => (
          <React.Fragment key={i}>
            <dt className="text-[11px] font-semibold tracking-wider uppercase text-gray-500 dark:text-gray-400 self-start pt-0.5">
              {it.label}
            </dt>
            <dd className="text-sm text-gray-900 dark:text-gray-100 leading-snug">
              {it.value === "" || it.value === null || it.value === undefined ? (
                <span className="italic text-gray-400">—</span>
              ) : (
                it.value
              )}
            </dd>
          </React.Fragment>
        ))}
      </dl>
    </div>
  );
};

export default DataSheet;