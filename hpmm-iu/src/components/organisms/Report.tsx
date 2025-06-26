import React, { useEffect, useState, useRef } from "react";
import { useKardex } from "../../hooks/use.Kardex";
import { useProducts } from "../../hooks/use.Product";
import GenericReportTable, { ReportColumn } from "../molecules/GenericReportTable";
import Button from "../atoms/Buttons/Button";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import PdfReportLayout from "../molecules/PdfReportLayout";
import { HiOutlineDocumentArrowDown } from "react-icons/hi2";
import Employe from "./Employes";
import Unit from "./Unit";

const ImpresionReporte: React.FC = () => {
  const { kardexDetail,kardex, GetKardexContext } = useKardex();
  const { products, GetProductsContext } = useProducts();
  const [loading, setLoading] = useState(true);
  const [listapv, setListapv] = useState<any[]>([]);
  const [tipoReporte, setTipoReporte] = useState("entradas"); // entradas, vencimiento, baja_existencia
  const reportRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setLoading(true);
    Promise.all([GetKardexContext(), GetProductsContext()])
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    console.log("Todos los datos de kardex:", kardex);
  }, [kardex]);

  useEffect(() => {
    // Filtrar solo entradas y que estén aprobadas en kardex
    const entradas = kardex.filter(
      (k) =>
        (k.tipo_movimiento === "Entrada" || k.tipoMovimiento === "Entrada") &&
        (k.estado === true || k.estado === 1)
        // Quita el filtro por tipo o ajusta según tus necesidades
    );

    // Combinar con kardexDetail por id_kardex
    const listaCombinada = entradas.map((k) => {
      // Busca el producto relacionado
      const producto = products.find((p) => p.id_product === k.id_product);
      // Busca el detalle relacionado
      const detalle = kardexDetail.find((d) => d.id_kardex === k.id_kardex);

      return {
        ...k,
        ...detalle,
        nombre_producto: k.nombre_producto || producto?.nombre || "Sin nombre",
        cantidad: Number(k.cantidad ?? detalle?.cantidad ?? 0),
        precio_unitario: Number(k.precio_unitario ?? detalle?.precio_unitario ?? 0),
        fecha_movimiento: k.fecha_movimiento ?? detalle?.fecha_movimiento ?? "",
        numero_lote: k.numero_lote ?? detalle?.numero_lote ?? "",
        rfid: k.rfid ?? detalle?.rfid ?? "",
      };
    });

    console.log("Lista combinada para reporte:", listaCombinada);
    setListapv(listaCombinada);
  }, [kardex, kardexDetail, products]);

  const columnsEntradas: ReportColumn<any>[] = [
    { header: "Producto", accessor: (row) => row.nombre_producto },
    { header: "Cantidad", accessor: (row) => row.cantidad },
    { header: "Precio Unitario", accessor: (row) => row.precio_unitario },
    { header: "Fecha Movimiento", accessor: (row) => row.fecha_movimiento },
    
    { header: "Fecha de vencimiento", accessor: (row) => row.fecha_vencimiento || "N/A" },
  ];

  const columnsVencimiento: ReportColumn<any>[] = [
    { header: "Producto", accessor: (row) => row.nombre_producto },
    { header: "Cantidad", accessor: (row) => row.cantidad },
    { header: "Fecha Vencimiento", accessor: (row) => row.fecha_vencimiento },
  ];

  const columnsBajaExistencia: ReportColumn<any>[] = [
    { header: "Producto", accessor: (row) => row.nombre },
    { header: "Existencia", accessor: (row) => row.stock_actual },
    { header: "Stock Mínimo", accessor: (row) => row.stock_minimo },
  ];

  // Filtrado de datos según tipo de reporte
  let dataFiltrada = listapv;
  let columns = columnsEntradas;

  if (tipoReporte === "vencimiento") {
    dataFiltrada = listapv.filter(row => row.fecha_vencimiento && new Date(row.fecha_vencimiento) <= new Date(Date.now() + 30 * 24 * 60 * 60 * 1000));
    columns = columnsVencimiento;
  } else if (tipoReporte === "baja_existencia") {
    dataFiltrada = products.filter(
      (p) =>
        p.stock_actual !== undefined &&
        p.stock_minimo !== undefined &&
        Number(p.stock_actual) <= Number(p.stock_minimo)
    );
    columns = columnsBajaExistencia;
  }

  const totalGeneral = listapv.reduce(
    (acc, row) =>
      acc +
      (row.precio_unitario != null && row.cantidad != null
        ? Number(row.precio_unitario) * Number(row.cantidad)
        : 0),
    0
  );

  const handleDownloadPDF = async () => {
    if (!reportRef.current) return;
    const cartaWidth = 279; // mm (ancho en landscape)
    const cartaHeight = 216; // mm (alto en landscape)

    await html2canvas(reportRef.current, {
      backgroundColor: "#fff",
      scale: 2,
      useCORS: true,
    }).then((canvas) => {
      const imgData = canvas.toDataURL("image/jpeg", 1.0);
      const imgWidthMm = canvas.width * 0.264583;
      const imgHeightMm = canvas.height * 0.264583;

      let renderWidth = cartaWidth;
      let renderHeight = (imgHeightMm * cartaWidth) / imgWidthMm;
      if (renderHeight > cartaHeight) {
        renderHeight = cartaHeight;
        renderWidth = (imgWidthMm * cartaHeight) / imgHeightMm;
      }

      const marginX = (cartaWidth - renderWidth) / 2;
      const marginY = (cartaHeight - renderHeight) / 2;

      const pdf = new jsPDF("landscape", "mm", "letter");
      pdf.addImage(imgData, "JPEG", marginX, marginY, renderWidth, renderHeight);
      const currentTime = new Date();
      pdf.save(`Reporte_Kardex_${currentTime.toISOString().slice(0, 10)}.pdf`);
    });
  };

  return (
    <div className="p-4">
      <h1 className="text-3xl font-bold mb-2 text-center text-hpmm-claro">Reporte Kardex</h1>
      <h2 className="text-xl font-semibold mb-6 text-center text-gray-700">Productos</h2>
      {/* Select para elegir tipo de reporte */}
      <div className="flex justify-center mb-4">
        <select
          className="border rounded px-3 py-2"
          value={tipoReporte}
          onChange={e => setTipoReporte(e.target.value)}
        >
          <option value="entradas">Entradas</option>
          <option value="vencimiento">Por Vencer</option>
          <option value="baja_existencia">Baja Existencia</option>
        </select>
      </div>
      {loading ? (
        <div className="flex justify-center items-center h-32">
          <span className="animate-spin text-3xl">🔄</span>
        </div>
      ) : (
        <>
          <GenericReportTable columns={columns} data={dataFiltrada} rowKey={(row) => row.id_kardex} />

          {/* Botón de descarga PDF debajo de la tabla */}
          <div className="flex justify-end mt-6 print:hidden">
            <Button
              className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded flex items-center gap-2"
              onClick={handleDownloadPDF}
            >
              <HiOutlineDocumentArrowDown className="text-xl" />
              Generar PDF
            </Button>
          </div>

          {/* PDF oculto solo para exportar */}
          <div
            ref={reportRef}
            style={{
              position: "absolute",
              left: "-9999px",
              top: 0,
              width: "1056px",
              height: "816px",
              background: "#fff",
            }}
          >
            <PdfReportLayout
              columns={columns}
              data={listapv}
              rowKey={(row) => row.id_kardex}
              title="Reporte Kardex"
              date={new Date().toLocaleDateString("es-HN", { year: "numeric", month: "long", day: "numeric" })}
            >
              <div className="flex justify-end mb-2 mt-0">
    <div className="bg-gray-100 rounded px-4 py-1 font-semibold text-[10px] text-gray-700 shadow">
      Total: <span className="text-green-700">{`L${totalGeneral.toLocaleString("es-HN", { minimumFractionDigits: 2 })}`}</span>
    </div>
  </div>
            </PdfReportLayout>
          </div>
        </>
      )}
    </div>
  );
};

export default ImpresionReporte;