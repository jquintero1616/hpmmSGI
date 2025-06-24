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

  // 1. Entradas por Unidad (basado en kardex + kardexDetail)
  const entradasAprobadas = kardex.filter(
    (k) => k.tipo_movimiento === "Entrada" && k.estado === true && k.tipo === "Aprobado"
  );
  const dataEntradasUnidad = entradasAprobadas.map((k) => {
    const detalle = kardexDetail.find((d) => d.id_kardex === k.id_kardex);
    return {
      unidad: detalle?.nombre_unidad || "N/A",
      cantidad: Number(k.cantidad) || 0,
    };
  }).reduce((acc: any, curr: any) => {
    acc[curr.unidad] = (acc[curr.unidad] || 0) + curr.cantidad;
    return acc;
  }, {});
  const chartEntradasUnidad = Object.keys(dataEntradasUnidad).map((unidad) => ({
    unidad,
    cantidad: dataEntradasUnidad[unidad],
  }));

  // 2. Entradas por Producto (basado en kardex)
  const dataEntradasProducto = entradasAprobadas.map((k) => ({
    producto: products.find((p) => p.id_product === k.id_product)?.nombre || "Sin nombre",
    cantidad: Number(k.cantidad) || 0,
  })).reduce((acc: any, curr: any) => {
    acc[curr.producto] = (acc[curr.producto] || 0) + curr.cantidad;
    return acc;
  }, {});
  const chartEntradasProducto = Object.keys(dataEntradasProducto).map((producto) => ({
    producto,
    cantidad: dataEntradasProducto[producto],
  }));

  // 3. Entradas por Solicitante (basado en kardex + kardexDetail)
  const dataEntradasSolicitante = entradasAprobadas.map((k) => {
    const detalle = kardexDetail.find((d) => d.id_kardex === k.id_kardex);
    return {
      solicitante: detalle?.nombre_empleado_sf || "N/A",
      cantidad: Number(k.cantidad) || 0,
    };
  }).reduce((acc: any, curr: any) => {
    acc[curr.solicitante] = (acc[curr.solicitante] || 0) + curr.cantidad;
    return acc;
  }, {});
  const chartEntradasSolicitante = Object.keys(dataEntradasSolicitante).map((solicitante) => ({
    solicitante,
    cantidad: dataEntradasSolicitante[solicitante],
  }));

  // 4. Productos con vencimiento próximo (próximos 30 días, basado en kardex + kardexDetail)
  const hoy = new Date();
  hoy.setHours(0, 0, 0, 0); // Normaliza la hora
  const en30dias = new Date(hoy);
  en30dias.setDate(hoy.getDate() + 30);

  const productosPorVencer: Record<string, number> = {};

  entradasAprobadas.forEach((k) => {
    const detalle = kardexDetail.find((d) => d.id_kardex === k.id_kardex);
    if (!detalle || !detalle.fecha_vencimiento) return;
    const fechaVencimiento = new Date(detalle.fecha_vencimiento);
    fechaVencimiento.setHours(0, 0, 0, 0);

    if (fechaVencimiento >= hoy && fechaVencimiento <= en30dias) {
      const nombreProducto = products.find((p) => p.id_product === k.id_product)?.nombre || "Sin nombre";
      productosPorVencer[nombreProducto] = (productosPorVencer[nombreProducto] || 0) + Number(k.cantidad);
    }
  });

  const chartVencimiento = Object.keys(productosPorVencer).map((producto) => ({
    producto,
    cantidad: productosPorVencer[producto],
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
          <div className="bg-white rounded-xl shadow-md p-8 flex flex-col justify-between">
            <CustomBarChart
              data={chartEntradasUnidad}
              xKey="unidad"
              barKey="cantidad"
              title="Entradas por Unidad"
            />
          </div>
          <div className="bg-white rounded-xl shadow-md p-8 flex flex-col justify-between">
            <CustomBarChart
              data={chartEntradasProducto}
              xKey="producto"
              barKey="cantidad"
              title="Entradas por Producto"
            />
          </div>
          <div className="bg-white rounded-xl shadow-md p-8 flex flex-col justify-between">
            <CustomBarChart
              data={chartEntradasSolicitante}
              xKey="solicitante"
              barKey="cantidad"
              title="Entradas por Solicitante"
            />
          </div>
          <div className="bg-white rounded-xl shadow-md p-8 flex flex-col justify-between">
            <CustomBarChart
              data={chartVencimiento}
              xKey="producto"
              barKey="cantidad"
              title="Productos por vencer en 30 días"
              layout="horizontal"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardGraficos;

// Dentro de CustomBarChart.tsx, busca el componente <XAxis /> y agrega:
// <XAxis dataKey={xKey} angle={-30} textAnchor="end" />