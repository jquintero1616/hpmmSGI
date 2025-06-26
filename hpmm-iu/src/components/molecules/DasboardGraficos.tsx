import CustomBarChart from "../molecules/Charts/BarChart";
import CustomPieChart from "./Charts/PieChart";
import { useKardex } from "../../hooks/use.Kardex";
import { useProducts } from "../../hooks/use.Product";
import { useEffect, useState } from "react";

const DashboardGraficos = () => {
  const { kardex, kardexDetail, GetKardexContext } = useKardex();
  const { products, GetProductsContext } = useProducts();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    Promise.all([GetKardexContext(), GetProductsContext()])
      .finally(() => setLoading(false));
  }, []);

  // 1. Consumo por Unidad (Entradas aprobadas agrupadas por unidad)
  const entradasAprobadas = kardex.filter(
    (k) => (k.tipo_movimiento === "Entrada" || k.tipoMovimiento === "Entrada") && (k.estado === true || k.estado === 1)
  );
  const consumoPorUnidad = entradasAprobadas.map((k) => {
    const detalle = kardexDetail.find((d) => d.id_kardex === k.id_kardex);
    return {
      unidad: detalle?.nombre_unidad || "N/A",
      cantidad: Number(k.cantidad) || 0,
    };
  }).reduce((acc: any, curr: any) => {
    acc[curr.unidad] = (acc[curr.unidad] || 0) + curr.cantidad;
    return acc;
  }, {});
  const chartConsumoUnidad = Object.keys(consumoPorUnidad).map((unidad) => ({
    unidad,
    cantidad: consumoPorUnidad[unidad],
  }));

  // 2. Productos con Baja Existencia
  const productosBajaExistencia = products.filter(
    (p) =>
      p.stock_actual !== undefined &&
      p.stock_minimo !== undefined &&
      Number(p.stock_actual) <= Number(p.stock_minimo)
  );
  const chartBajaExistencia = productosBajaExistencia.map((p) => ({
    producto: p.nombre,
    existencia: Number(p.stock_actual),
    stock_minimo: Number(p.stock_minimo),
  }));

  // 3. Productos más movidos (mayor cantidad de movimientos de entrada y salida)
  const movimientosPorProducto: Record<string, number> = {};
  kardex.forEach((k) => {
    const nombre = products.find((p) => p.id_product === k.id_product)?.nombre || "Sin nombre";
    movimientosPorProducto[nombre] = (movimientosPorProducto[nombre] || 0) + Number(k.cantidad || 0);
  });
  // Ordenar y tomar los 10 más movidos
  const chartProductosMovidos = Object.entries(movimientosPorProducto)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([producto, cantidad]) => ({ producto, cantidad }));

  // 4. (Opcional) Pie chart de distribución de consumo por unidad
  const pieConsumoUnidad = chartConsumoUnidad.map((item) => ({
    name: item.unidad,
    value: item.cantidad,
  }));

  return (
    <div className="pt-8 pb-8 px-8">
      <h1 className="text-2xl font-bold mb-8">Dashboard de Gráficos</h1>
      {loading ? (
        <div className="flex justify-center items-center h-32">
          <span className="animate-spin text-3xl">🔄</span>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10">
          <CustomBarChart
            data={chartConsumoUnidad}
            xKey="unidad"
            barKey="cantidad"
            title="Consumo por Unidad"
          />
          <CustomBarChart
            data={chartBajaExistencia}
            xKey="producto"
            barKey="existencia"
            title="Productos con Baja Existencia"
          />
          <CustomBarChart
            data={chartProductosMovidos}
            xKey="producto"
            barKey="cantidad"
            title="Productos Más Movidos"
          />
          <CustomPieChart
            data={pieConsumoUnidad}
            dataKey="value"
            nameKey="name"
            title="Distribución de Consumo por Unidad"
          />
        </div>
      )}
    </div>
  );
};

export default DashboardGraficos;

// Dentro de CustomBarChart.tsx, busca el componente <XAxis /> y agrega:
// <XAxis dataKey={xKey} angle={-30} textAnchor="end" />