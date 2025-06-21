import React, { useEffect, useState, useRef } from "react";
import { useKardex } from "../../hooks/use.Kardex";
import { useProducts } from "../../hooks/use.Product";
import GenericReportTable, { ReportColumn } from "../molecules/GenericReportTable";
import Button from "../atoms/Buttons/Button";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import GenericPDF from "../molecules/GenericPDF";
import { HiOutlineDocumentArrowDown } from "react-icons/hi2";

const ImpresionReporte: React.FC = () => {
  const { kardexDetail, GetKardexContext } = useKardex();
  const { products, GetProductsContext } = useProducts();
  const [loading, setLoading] = useState(true);
  const [listapv, setListapv] = useState<any[]>([]);
  const reportRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setLoading(true);
    Promise.all([GetKardexContext(), GetProductsContext()]).finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    const entradas = kardexDetail.filter((k) => k.tipo_movimiento === "Entrada");
    setListapv(
      entradas.map((k) => ({
        ...k,
        nombre_producto:
          products.find((p) => p.id_product === (k.id_producto || k.id_producto))?.nombre ||
          "Sin nombre",
      }))
    );
  }, [kardexDetail, products]);

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
              Descargar PDF
            </Button>
          </div>

          {/* PDF oculto solo para exportar */}
          <div
            ref={reportRef}
            style={{
              position: "absolute",
              left: "-9999px",
              top: 0,
              width: "1056px",  // landscape carta
              height: "816px",
              background: "#fff",
            }}
          >
            <GenericPDF
              columns={columns}
              data={listapv}
              rowKey={(row) => row.id_kardex}
              title="Reporte Kardex"
              date={new Date().toLocaleDateString("es-HN", { year: "numeric", month: "long", day: "numeric" })}
            >
              {/* Total general solo para el PDF */}
              <div className="flex justify-end mb-16">
                <div className="bg-gray-100 rounded px-8 py-3 font-bold text-xl text-gray-700 shadow">
                  Total : <span className="text-yellow-700">{`L${totalGeneral.toLocaleString("es-HN", { minimumFractionDigits: 2 })}`}</span>
                </div>
              </div>
              {/* Firmas */}
              <div className="grid grid-cols-3 gap-24 mt-20">
                <div className="flex flex-col items-center">
                  <div className="border-b-2 border-gray-400 w-56 mb-2" />
                  <input
                    type="text"
                    className="w-56 text-center outline-none bg-transparent font-semibold text-gray-800"
                    placeholder="Dr. Aguilar Mendoza"
                    readOnly
                  />
                </div>
                <div className="flex flex-col items-center">
                  <div className="border-b-2 border-gray-400 w-56 mb-2" />
                  <input
                    type="text"
                    className="w-56 text-center outline-none bg-transparent font-semibold text-gray-800"
                    placeholder="Nombre Subdirección"
                    readOnly
                  />
                </div>
                <div className="flex flex-col items-center">
                  <div className="border-b-2 border-gray-400 w-56 mb-2" />
                  <input
                    type="text"
                    className="w-56 text-center outline-none bg-transparent font-semibold text-gray-800"
                    placeholder="Nombre Logística"
                    readOnly
                  />
                </div>
              </div>
            </GenericPDF>
          </div>
        </>
      )}
    </div>
  );
};

export default ImpresionReporte;