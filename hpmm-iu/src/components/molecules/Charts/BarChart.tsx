import React from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend, Cell } from "recharts";

interface BarChartProps {
  data: any[];
  xKey: string;
  barKey: string;
  title?: string;
  layout?: "horizontal" | "vertical";
  colors?: string[];
}

const DEFAULT_COLORS = [
  "#2563eb", // Azul moderno
  "#22c55e", // Verde moderno
  "#64748b", // Gris moderno
  "#f59e42", // Naranja suave
  "#a21caf", // Morado
  "#0ea5e9", // Celeste
];

const CustomBarChart: React.FC<BarChartProps> = ({
  data,
  xKey,
  barKey,
  title,
  layout = "vertical",
  colors = DEFAULT_COLORS,
}) => (
  <div style={{ width: "100%", height: 250 }}>
    {title && <h3 className="text-lg font-bold mb-3">{title}</h3>}
    <ResponsiveContainer>
      <BarChart data={data} layout={layout === "horizontal" ? "vertical" : "horizontal"}>
        <CartesianGrid strokeDasharray="3 3" />
        {layout === "horizontal" ? (
          <>
            <XAxis type="number" />
            <YAxis
              dataKey={xKey}
              type="category"
              width={80} // Aumenta el ancho para etiquetas largas
              tick={({ x, y, payload }) => (
                <text
                  x={x}
                  y={y + 10}
                  width={120}
                  fontSize={12}
                  textAnchor="end"
                  style={{ whiteSpace: "pre-line" }}
                >
                  {String(payload.value).length > 18
                    ? String(payload.value).slice(0, 18) + "..."
                    : payload.value}
                </text>
              )}
            />
          </>
        ) : (
          <>
            <XAxis dataKey={xKey} type="category" />
            <YAxis type="number" />
          </>
        )}
        <Tooltip />
        <Legend />
        <Bar dataKey={barKey}>
          {data.map((_, idx) => (
            <Cell key={`cell-${idx}`} fill={colors[idx % colors.length]} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  </div>
);

export default CustomBarChart;