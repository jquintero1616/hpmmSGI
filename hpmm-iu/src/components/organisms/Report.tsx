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
  const reportRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setLoading(true);
    Promise.all([GetKardexContext(), GetProductsContext()])
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
  
  }, [kardex, products, Employe, Unit]);

  useEffect(() => {
    // Filtrar solo entradas y que estén aprobadas en kardex
    const entradas = kardex.filter(
      (k) => k.tipo_movimiento === "Entrada" && k.estado === true && k.tipo === "Aprobado"
    );

    // Combinar con kardexDetail por id_kardex
    const listaCombinada = entradas.map((k) => {
      const detalle = kardexDetail.find((d) => d.id_kardex === k.id_kardex);
      return {
        ...k,
        ...detalle,
        nombre_producto:
          products.find((p) => p.id_product === k.id_product)?.nombre || "Sin nombre",
        nombre_unidad: detalle?.nombre_unidad || "N/A",
        nombre_empleado_sf: detalle?.nombre_empleado_sf || "N/A",
      };
    });

    setListapv(listaCombinada);
  }, [kardex, kardexDetail, products, Employe, Unit]);

  const columns: ReportColumn<any>[] = [
    { header: "Unidad", accessor: "nombre_unidad" },
    { header: "Solicitante de Fusión", accessor: "nombre_empleado_sf" },
    { header: "Lote", accessor: "numero_lote" },
    { header: "Producto", accessor: "nombre_producto" },
    { header: "Cantidad", accessor: "cantidad", align: "right" },
    {
      header: "Precio Unitario",
      accessor: (row) =>
        row.precio_unitario != null
          ? `L${Number(row.precio_unitario).toLocaleString("es-HN", { minimumFractionDigits: 2 })}`
          : "-",
      align: "right",
    },
    {
      header: "Precio Total",
      accessor: (row) =>
        row.precio_unitario != null && row.cantidad != null
          ? `L${(Number(row.precio_unitario) * Number(row.cantidad)).toLocaleString("es-HN", { minimumFractionDigits: 2 })}`
          : "-",
      align: "right",
    },
    {
      header: "Fecha Movimiento",
      accessor: (row) =>
        row.fecha_movimiento
          ? new Date(row.fecha_movimiento).toLocaleDateString()
          : "",
    },
    {
      header: "Fecha Vencimiento",
      accessor: (row) =>
        row.fecha_vencimiento
          ? new Date(row.fecha_vencimiento).toLocaleDateString()
          : "",
    },
  ];

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
      <h2 className="text-xl font-semibold mb-6 text-center text-gray-700">Entradas + Vencimiento</h2>
      {loading ? (
        <div className="flex justify-center items-center h-32">
          <span className="animate-spin text-3xl">🔄</span>
        </div>
      ) : (
        <>
          {/* Vista para el usuario */}
          <GenericReportTable columns={columns} data={listapv} rowKey={(row) => row.id_kardex} />

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