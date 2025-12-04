/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState, useRef, useMemo } from "react";
import { useKardex } from "../../hooks/use.Kardex";
import { useProducts } from "../../hooks/use.Product";
import { useRequisicion } from "../../hooks/use.Requisicion";
import GenericReportTable, { ReportColumn } from "../molecules/GenericReportTable";
import Button from "../atoms/Buttons/Button";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import PdfReportLayout from "../molecules/PdfReportLayout";

// Categorías principales de reportes
type CategoriaReporte = "kardex" | "productos" | "requisiciones";

// Subfiltros dentro de Kardex
interface SubfiltrosKardex {
  // Por tipo de movimiento
  entradas: boolean;
  salidas: boolean;
  // Por origen/tipo de solicitud
  requisiciones: boolean;
  donaciones: boolean;
  pactos: boolean;
  // Por estado
  aprobados: boolean;
  rechazados: boolean;
  pendientes: boolean;
  cancelados: boolean;
}

interface SubfiltrosProductos {
  solo_activos: boolean;
  con_exceso: boolean;
  con_faltante: boolean;
}

interface ColumnaConfig {
  id: string;
  nombre: string;
  visible: boolean;
  accessor: (row: any) => React.ReactNode;
}

const ImpresionReporte: React.FC = () => {
  const { kardexDetail, GetKardexContext } = useKardex();
  const { products, GetProductsContext } = useProducts();
  const { requisiDetail, GetRequisicionesContext } = useRequisicion();
  
  const [loading, setLoading] = useState(true);
  const [categoriaActiva, setCategoriaActiva] = useState<CategoriaReporte>("kardex");
  const [columnasConfig, setColumnasConfig] = useState<ColumnaConfig[]>([]);
  
  // Subfiltros por categoría
  const [subfiltrosKardex, setSubfiltrosKardex] = useState<SubfiltrosKardex>({ 
    entradas: true, 
    salidas: true, 
    requisiciones: true,
    donaciones: true,
    pactos: true,
    aprobados: true,
    rechazados: true,
    pendientes: true,
    cancelados: true
  });
  const [subfiltrosProductos, setSubfiltrosProductos] = useState<SubfiltrosProductos>({ 
    solo_activos: true, 
    con_exceso: false, 
    con_faltante: false 
  });
  
  const [mostrarPersonalizacion, setMostrarPersonalizacion] = useState(false);
  const reportRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setLoading(true);
    Promise.all([GetKardexContext(), GetProductsContext(), GetRequisicionesContext()])
      .finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Calcular stock real de productos desde kardex
  const calcularStockProductos = useMemo(() => {
    const stockPorProducto: Record<string, number> = {};
    
    // Sumar entradas y restar salidas por producto
    kardexDetail.forEach((k) => {
      if (k.tipo_movimiento === "Entrada" || k.tipo_movimiento === "Salida") {
        const idProducto = k.id_product || "";
        const cantidad = Number(k.cantidad || 0);
        
        if (!stockPorProducto[idProducto]) {
          stockPorProducto[idProducto] = 0;
        }
        
        if (k.tipo_movimiento === "Entrada") {
          stockPorProducto[idProducto] += cantidad;
        } else {
          stockPorProducto[idProducto] -= cantidad;
        }
      }
    });
    
    return stockPorProducto;
  }, [kardexDetail]);

  // Columnas por categoría
  const columnasPorCategoria = useMemo(() => ({
    kardex: [
      { id: "k_mov", nombre: "Movimiento", visible: true, accessor: (r: any) => r.tipo_movimiento || "-" },
      { id: "k_origen", nombre: "Origen", visible: true, accessor: (r: any) => r.tipo_solicitud === "Donacion" ? "Donación" : r.tipo_solicitud || "-" },
      { id: "k_producto", nombre: "Producto", visible: true, accessor: (r: any) => r.nombre_producto || r.nombre || "-" },
      { id: "k_descripcion", nombre: "Descripción", visible: false, accessor: (r: any) => r.descripcion_producto || r.descripcion || "-" },
      { id: "k_cantidad", nombre: "Cantidad", visible: true, accessor: (r: any) => r.cantidad ?? r.cantidad_comprada ?? 0 },
      { id: "k_cantidad_sol", nombre: "Cant. Solicitada", visible: false, accessor: (r: any) => r.cantidad_solicitada ?? "-" },
      { id: "k_cantidad_rec", nombre: "Cant. Recepcionada", visible: false, accessor: (r: any) => r.cantidad_recepcionada ?? "-" },
      { id: "k_precio", nombre: "Precio Unit.", visible: true, accessor: (r: any) => `L${Number(r.precio_unitario || 0).toFixed(2)}` },
      { id: "k_isv", nombre: "ISV", visible: false, accessor: (r: any) => r.isv ? `L${Number(r.isv).toFixed(2)}` : "-" },
      { id: "k_total", nombre: "Total", visible: false, accessor: (r: any) => `L${Number(r.total || (Number(r.cantidad || 0) * Number(r.precio_unitario || 0))).toFixed(2)}` },
      { id: "k_fecha", nombre: "Fecha", visible: true, accessor: (r: any) => r.fecha_movimiento ? new Date(r.fecha_movimiento).toLocaleDateString("es-HN") : "-" },
      { id: "k_anio", nombre: "Año", visible: false, accessor: (r: any) => r.anio_creacion || "-" },
      { id: "k_factura", nombre: "No. Factura", visible: false, accessor: (r: any) => r.numero_factura || r.nombre_de_factura || "-" },
      { id: "k_requisicion", nombre: "No. Requisición", visible: false, accessor: (r: any) => r.requisicion_numero || "-" },
      { id: "k_donante", nombre: "Donante", visible: false, accessor: (r: any) => r.nombre_donante || "-" },
      { id: "k_proveedor", nombre: "Proveedor", visible: false, accessor: (r: any) => r.vendedor_nombre || r.nombre_proveedor || r.nombre_contacto_vendedor || "-" },
      { id: "k_lote", nombre: "Lote", visible: false, accessor: (r: any) => r.numero_lote || "-" },
      { id: "k_vencimiento", nombre: "Vencimiento", visible: false, accessor: (r: any) => r.fecha_vencimiento ? new Date(r.fecha_vencimiento).toLocaleDateString("es-HN") : "-" },
      { id: "k_estado", nombre: "Estado", visible: false, accessor: (r: any) => r.tipo || "-" },
      { id: "k_observacion", nombre: "Observación", visible: false, accessor: (r: any) => r.observacion || r.motivo || "-" },
    ],
    productos: [
      { id: "p_nombre", nombre: "Nombre", visible: true, accessor: (r: any) => r.nombre || "-" },
      { id: "p_descripcion", nombre: "Descripción", visible: false, accessor: (r: any) => r.descripcion || "-" },
      { id: "p_stock", nombre: "Stock Actual", visible: true, accessor: (r: any) => calcularStockProductos[r.id_product] ?? 0 },
      { id: "p_stock_max", nombre: "Stock Máx.", visible: true, accessor: (r: any) => r.stock_maximo ?? 0 },
      { id: "p_exceso", nombre: "Exceso", visible: false, accessor: (r: any) => {
        const actual = calcularStockProductos[r.id_product] ?? 0;
        const maximo = Number(r.stock_maximo || 0);
        return actual > maximo ? actual - maximo : 0;
      }},
      { id: "p_faltante", nombre: "Faltante", visible: false, accessor: (r: any) => {
        const actual = calcularStockProductos[r.id_product] ?? 0;
        const maximo = Number(r.stock_maximo || 0);
        return actual < maximo ? maximo - actual : 0;
      }},
      { id: "p_estado", nombre: "Estado", visible: true, accessor: (r: any) => r.estado ? "Activo" : "Inactivo" },
    ],
    requisiciones: [
      { id: "r_solicitante", nombre: "Solicitante", visible: true, accessor: (r: any) => r.employee_name || "-" },
      { id: "r_producto", nombre: "Producto", visible: true, accessor: (r: any) => r.product_name || "-" },
      { id: "r_cantidad", nombre: "Cantidad", visible: true, accessor: (r: any) => r.cantidad ?? 0 },
      { id: "r_fecha", nombre: "Fecha", visible: true, accessor: (r: any) => r.fecha ? new Date(r.fecha).toLocaleDateString("es-HN") : "-" },
      { id: "r_estado", nombre: "Estado", visible: true, accessor: (r: any) => r.estado || "-" },
      { id: "r_unidad", nombre: "Unidad", visible: false, accessor: (r: any) => r.unit_name || "-" },
      { id: "r_descripcion", nombre: "Descripción", visible: false, accessor: (r: any) => r.descripcion || "-" },
    ],
  }), [calcularStockProductos]);

  // Actualizar columnas cuando cambia la categoría
  useEffect(() => {
    setColumnasConfig([...columnasPorCategoria[categoriaActiva]]);
  }, [categoriaActiva, columnasPorCategoria]);

  // Obtener datos según categoría y subfiltros
  const getData = (): any[] => {
    switch (categoriaActiva) {
      case "kardex": {
        // Filtrar solo registros que tengan tipo_movimiento válido (Entrada o Salida)
        let data = [...kardexDetail].filter(
          (k) => k.tipo_movimiento === "Entrada" || k.tipo_movimiento === "Salida"
        );
        
        // Filtrar por tipo de movimiento
        const movimientosPermitidos: string[] = [];
        if (subfiltrosKardex.entradas) movimientosPermitidos.push("Entrada");
        if (subfiltrosKardex.salidas) movimientosPermitidos.push("Salida");
        
        if (movimientosPermitidos.length > 0 && movimientosPermitidos.length < 2) {
          data = data.filter((k) => movimientosPermitidos.includes(k.tipo_movimiento));
        }
        
        // Filtrar por origen (tipo_solicitud)
        const origenesPermitidos: string[] = [];
        if (subfiltrosKardex.requisiciones) origenesPermitidos.push("Requisicion");
        if (subfiltrosKardex.donaciones) origenesPermitidos.push("Donacion");
        if (subfiltrosKardex.pactos) origenesPermitidos.push("Pacto");
        
        if (origenesPermitidos.length > 0 && origenesPermitidos.length < 3) {
          data = data.filter((k) => origenesPermitidos.includes(k.tipo_solicitud));
        }
        
        // Si no hay ningún filtro de movimiento activo, mostrar vacío
        if (!subfiltrosKardex.entradas && !subfiltrosKardex.salidas) {
          data = [];
        }
        
        // Si no hay ningún filtro de origen activo, mostrar vacío
        if (!subfiltrosKardex.requisiciones && !subfiltrosKardex.donaciones && !subfiltrosKardex.pactos) {
          data = [];
        }
        
        // Filtrar por estado
        const estadosPermitidos: string[] = [];
        if (subfiltrosKardex.aprobados) estadosPermitidos.push("Aprobado");
        if (subfiltrosKardex.rechazados) estadosPermitidos.push("Rechazado");
        if (subfiltrosKardex.pendientes) estadosPermitidos.push("Pendiente");
        if (subfiltrosKardex.cancelados) estadosPermitidos.push("Cancelado");
        
        if (estadosPermitidos.length > 0 && estadosPermitidos.length < 4) {
          data = data.filter((k) => estadosPermitidos.includes(k.tipo));
        }
        
        // Si no hay ningún filtro de estado activo, mostrar vacío
        if (!subfiltrosKardex.aprobados && !subfiltrosKardex.rechazados && !subfiltrosKardex.pendientes && !subfiltrosKardex.cancelados) {
          data = [];
        }
        
        return data;
      }
      case "productos": {
        let data = [...products];
        if (subfiltrosProductos.solo_activos) {
          data = data.filter((p) => p.estado === true);
        }
        if (subfiltrosProductos.con_exceso) {
          data = data.filter((p) => {
            const stockReal = calcularStockProductos[p.id_product] ?? 0;
            return stockReal > Number(p.stock_maximo || 0);
          });
        }
        if (subfiltrosProductos.con_faltante) {
          data = data.filter((p) => {
            const stockReal = calcularStockProductos[p.id_product] ?? 0;
            return stockReal < Number(p.stock_maximo || 0);
          });
        }
        return data;
      }
      case "requisiciones":
        return requisiDetail;
      default:
        return [];
    }
  };

  const columnasVisibles: ReportColumn<any>[] = columnasConfig
    .filter((c) => c.visible)
    .map((c) => ({ header: c.nombre, accessor: c.accessor }));

  const toggleColumna = (id: string) => {
    setColumnasConfig((prev) => prev.map((c) => (c.id === id ? { ...c, visible: !c.visible } : c)));
  };

  const nombresCategorias: Record<CategoriaReporte, string> = {
    kardex: "Kardex",
    productos: "Productos",
    requisiciones: "Requisiciones",
  };

  const data = getData();
  
  // Calcular totales para Kardex
  const mostrarTotalKardex = categoriaActiva === "kardex";
  const totalEntradas = mostrarTotalKardex
    ? data.filter((r) => r.tipo_movimiento === "Entrada")
        .reduce((acc, r) => acc + Number(r.cantidad || 0) * Number(r.precio_unitario || 0), 0)
    : 0;

  // Generar subtítulo
  const getSubtitulo = () => {
    if (categoriaActiva === "kardex") {
      const movimientos = [];
      if (subfiltrosKardex.entradas) movimientos.push("Entradas");
      if (subfiltrosKardex.salidas) movimientos.push("Salidas");
      
      const origenes = [];
      if (subfiltrosKardex.requisiciones) origenes.push("Requisiciones");
      if (subfiltrosKardex.donaciones) origenes.push("Donaciones");
      if (subfiltrosKardex.pactos) origenes.push("Pactos");
      
      const estados = [];
      if (subfiltrosKardex.aprobados) estados.push("Aprobados");
      if (subfiltrosKardex.rechazados) estados.push("Rechazados");
      if (subfiltrosKardex.pendientes) estados.push("Pendientes");
      if (subfiltrosKardex.cancelados) estados.push("Cancelados");
      
      const movStr = movimientos.length ? movimientos.join(" y ") : "Sin movimientos";
      const origStr = origenes.length ? origenes.join(", ") : "Sin origen";
      const estStr = estados.length ? estados.join(", ") : "Sin estado";
      return `${movStr} | ${origStr} | Estado: ${estStr}`;
    }
    if (categoriaActiva === "productos") {
      const partes = [];
      if (subfiltrosProductos.solo_activos) partes.push("Solo activos");
      if (subfiltrosProductos.con_exceso) partes.push("Con exceso");
      if (subfiltrosProductos.con_faltante) partes.push("Con faltante");
      return partes.length ? partes.join(" | ") : "Todos";
    }
    return "Todos los registros";
  };

  const handleDownloadPDF = async () => {
    if (!reportRef.current) return;
    const canvas = await html2canvas(reportRef.current, { backgroundColor: "#fff", scale: 2 });
    const pdf = new jsPDF("landscape", "mm", "letter");
    const pdfW = 279, pdfH = 216;
    const imgW = canvas.width * 0.264583, imgH = canvas.height * 0.264583;
    let w = pdfW, h = (imgH * pdfW) / imgW;
    if (h > pdfH) { h = pdfH; w = (imgW * pdfH) / imgH; }
    pdf.addImage(canvas.toDataURL("image/jpeg"), "JPEG", (pdfW - w) / 2, (pdfH - h) / 2, w, h);
    pdf.save(`Reporte_${nombresCategorias[categoriaActiva]}_${new Date().toISOString().slice(0, 10)}.pdf`);
  };

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-1 text-center text-hpmm-morado-oscuro">
        Reporte: {nombresCategorias[categoriaActiva]}
      </h1>
      <p className="text-sm text-gray-500 text-center mb-4">{getSubtitulo()}</p>

      {/* Panel de configuración */}
      <div className="bg-gray-50 rounded-lg mb-4">
        
        {/* Cabecera con tipo de reporte y botón personalizar */}
        <div className="p-4 flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-4">
            <span className="text-sm font-medium text-gray-700">Tipo:</span>
            <div className="flex flex-wrap gap-2">
              {(Object.keys(nombresCategorias) as CategoriaReporte[]).map((cat) => (
                <button
                  key={cat}
                  onClick={() => setCategoriaActiva(cat)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium border-2 transition-all ${
                    categoriaActiva === cat
                      ? "bg-purple-600 text-white border-purple-600 shadow-md"
                      : "bg-white text-gray-600 border-gray-300 hover:border-purple-400"
                  }`}
                >
                  {nombresCategorias[cat]}
                </button>
              ))}
            </div>
          </div>
          
          <button
            onClick={() => setMostrarPersonalizacion(!mostrarPersonalizacion)}
            className="flex items-center gap-2 px-3 py-2 text-sm text-gray-600 hover:text-purple-600 hover:bg-white rounded-lg transition-colors border border-gray-300"
          >
            <span>{mostrarPersonalizacion ? "Ocultar" : "Personalizar"}</span>
            <svg 
              className={`w-4 h-4 transition-transform ${mostrarPersonalizacion ? "rotate-180" : ""}`} 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        </div>

        {/* Panel desplegable de personalización */}
        {mostrarPersonalizacion && (
          <div className="border-t px-4 pb-4 pt-3 space-y-4">
            
            {/* Subfiltros de Kardex */}
            {categoriaActiva === "kardex" && (
              <div className="space-y-3">
                {/* Por tipo de movimiento */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">Tipo de movimiento:</span>
                    <div className="flex gap-1">
                      <button
                        onClick={() => setSubfiltrosKardex((f) => ({ ...f, entradas: true, salidas: true }))}
                        className="px-2 py-0.5 text-xs bg-gray-100 hover:bg-green-100 hover:text-green-600 text-gray-500 rounded transition-colors"
                        title="Seleccionar todos"
                      >
                        ✓ Todos
                      </button>
                      <button
                        onClick={() => setSubfiltrosKardex((f) => ({ ...f, entradas: false, salidas: false }))}
                        className="px-2 py-0.5 text-xs bg-gray-100 hover:bg-red-100 hover:text-red-600 text-gray-500 rounded transition-colors"
                        title="Deseleccionar todos"
                      >
                        ✕ Ninguno
                      </button>
                    </div>
                  </div>
                  <div className="flex gap-4 flex-wrap">
                    <label className="flex items-center gap-2 text-sm">
                      <input
                        type="checkbox"
                        checked={subfiltrosKardex.entradas}
                        onChange={(e) => setSubfiltrosKardex((f) => ({ ...f, entradas: e.target.checked }))}
                        className="rounded border-gray-300"
                      />
                      Entradas
                    </label>
                    <label className="flex items-center gap-2 text-sm">
                      <input
                        type="checkbox"
                        checked={subfiltrosKardex.salidas}
                        onChange={(e) => setSubfiltrosKardex((f) => ({ ...f, salidas: e.target.checked }))}
                        className="rounded border-gray-300"
                      />
                      Salidas
                    </label>
                  </div>
                </div>
                
                {/* Por origen */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">Origen:</span>
                    <div className="flex gap-1">
                      <button
                        onClick={() => setSubfiltrosKardex((f) => ({ ...f, requisiciones: true, donaciones: true, pactos: true }))}
                        className="px-2 py-0.5 text-xs bg-gray-100 hover:bg-green-100 hover:text-green-600 text-gray-500 rounded transition-colors"
                        title="Seleccionar todos"
                      >
                        ✓ Todos
                      </button>
                      <button
                        onClick={() => setSubfiltrosKardex((f) => ({ ...f, requisiciones: false, donaciones: false, pactos: false }))}
                        className="px-2 py-0.5 text-xs bg-gray-100 hover:bg-red-100 hover:text-red-600 text-gray-500 rounded transition-colors"
                        title="Deseleccionar todos"
                      >
                        ✕ Ninguno
                      </button>
                    </div>
                  </div>
                  <div className="flex gap-4 flex-wrap">
                    <label className="flex items-center gap-2 text-sm">
                      <input
                        type="checkbox"
                        checked={subfiltrosKardex.requisiciones}
                        onChange={(e) => setSubfiltrosKardex((f) => ({ ...f, requisiciones: e.target.checked }))}
                        className="rounded border-gray-300"
                      />
                      Requisiciones
                    </label>
                    <label className="flex items-center gap-2 text-sm">
                      <input
                        type="checkbox"
                        checked={subfiltrosKardex.donaciones}
                        onChange={(e) => setSubfiltrosKardex((f) => ({ ...f, donaciones: e.target.checked }))}
                        className="rounded border-gray-300"
                      />
                      Donaciones
                    </label>
                    <label className="flex items-center gap-2 text-sm">
                      <input
                        type="checkbox"
                        checked={subfiltrosKardex.pactos}
                        onChange={(e) => setSubfiltrosKardex((f) => ({ ...f, pactos: e.target.checked }))}
                        className="rounded border-gray-300"
                      />
                      Pactos
                    </label>
                  </div>
                </div>
                
                {/* Por estado */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">Estado:</span>
                    <div className="flex gap-1">
                      <button
                        onClick={() => setSubfiltrosKardex((f) => ({ ...f, aprobados: true, rechazados: true, pendientes: true, cancelados: true }))}
                        className="px-2 py-0.5 text-xs bg-gray-100 hover:bg-green-100 hover:text-green-600 text-gray-500 rounded transition-colors"
                        title="Seleccionar todos"
                      >
                        ✓ Todos
                      </button>
                      <button
                        onClick={() => setSubfiltrosKardex((f) => ({ ...f, aprobados: false, rechazados: false, pendientes: false, cancelados: false }))}
                        className="px-2 py-0.5 text-xs bg-gray-100 hover:bg-red-100 hover:text-red-600 text-gray-500 rounded transition-colors"
                        title="Deseleccionar todos"
                      >
                        ✕ Ninguno
                      </button>
                    </div>
                  </div>
                  <div className="flex gap-4 flex-wrap">
                    <label className="flex items-center gap-2 text-sm">
                      <input
                        type="checkbox"
                        checked={subfiltrosKardex.aprobados}
                        onChange={(e) => setSubfiltrosKardex((f) => ({ ...f, aprobados: e.target.checked }))}
                        className="rounded border-gray-300"
                      />
                      Aprobados
                    </label>
                    <label className="flex items-center gap-2 text-sm">
                      <input
                        type="checkbox"
                        checked={subfiltrosKardex.rechazados}
                        onChange={(e) => setSubfiltrosKardex((f) => ({ ...f, rechazados: e.target.checked }))}
                        className="rounded border-gray-300"
                      />
                      Rechazados
                    </label>
                    <label className="flex items-center gap-2 text-sm">
                      <input
                        type="checkbox"
                        checked={subfiltrosKardex.pendientes}
                        onChange={(e) => setSubfiltrosKardex((f) => ({ ...f, pendientes: e.target.checked }))}
                        className="rounded border-gray-300"
                      />
                      Pendientes
                    </label>
                    <label className="flex items-center gap-2 text-sm">
                      <input
                        type="checkbox"
                        checked={subfiltrosKardex.cancelados}
                        onChange={(e) => setSubfiltrosKardex((f) => ({ ...f, cancelados: e.target.checked }))}
                        className="rounded border-gray-300"
                      />
                      Cancelados
                    </label>
                  </div>
                </div>
              </div>
            )}

            {/* Subfiltros de Productos */}
            {categoriaActiva === "productos" && (
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">Filtros:</span>
                  <div className="flex gap-1">
                    <button
                      onClick={() => setSubfiltrosProductos({ solo_activos: true, con_exceso: true, con_faltante: true })}
                      className="px-2 py-0.5 text-xs bg-gray-100 hover:bg-green-100 hover:text-green-600 text-gray-500 rounded transition-colors"
                      title="Seleccionar todos"
                    >
                      ✓ Todos
                    </button>
                    <button
                      onClick={() => setSubfiltrosProductos({ solo_activos: false, con_exceso: false, con_faltante: false })}
                      className="px-2 py-0.5 text-xs bg-gray-100 hover:bg-red-100 hover:text-red-600 text-gray-500 rounded transition-colors"
                      title="Deseleccionar todos"
                    >
                      ✕ Ninguno
                    </button>
                  </div>
                </div>
                <div className="flex flex-wrap gap-4 items-center">
                  <label className="flex items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      checked={subfiltrosProductos.solo_activos}
                      onChange={(e) => setSubfiltrosProductos((f) => ({ ...f, solo_activos: e.target.checked }))}
                      className="rounded border-gray-300"
                    />
                    Solo activos
                  </label>
                  <label className="flex items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      checked={subfiltrosProductos.con_exceso}
                      onChange={(e) => setSubfiltrosProductos((f) => ({ ...f, con_exceso: e.target.checked }))}
                      className="rounded border-gray-300"
                    />
                    Con exceso de stock
                  </label>
                  <label className="flex items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      checked={subfiltrosProductos.con_faltante}
                      onChange={(e) => setSubfiltrosProductos((f) => ({ ...f, con_faltante: e.target.checked }))}
                      className="rounded border-gray-300"
                    />
                    Con faltante de stock
                  </label>
                </div>
              </div>
            )}

            {/* Columnas */}
            <div className={categoriaActiva !== "requisiciones" ? "border-t pt-3" : ""}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">Columnas visibles:</span>
                <div className="flex gap-1">
                  <button
                    onClick={() => setColumnasConfig((prev) => prev.map((c) => ({ ...c, visible: true })))}
                    className="px-2 py-0.5 text-xs bg-gray-100 hover:bg-green-100 hover:text-green-600 text-gray-500 rounded transition-colors"
                    title="Mostrar todas"
                  >
                    ✓ Todas
                  </button>
                  <button
                    onClick={() => setColumnasConfig((prev) => prev.map((c) => ({ ...c, visible: false })))}
                    className="px-2 py-0.5 text-xs bg-gray-100 hover:bg-red-100 hover:text-red-600 text-gray-500 rounded transition-colors"
                    title="Ocultar todas"
                  >
                    ✕ Ninguna
                  </button>
                </div>
              </div>
              <div className="flex flex-wrap gap-1">
                {columnasConfig.map((col) => (
                  <button
                    key={col.id}
                    onClick={() => toggleColumna(col.id)}
                    className={`px-2 py-1 rounded text-xs border transition-colors ${
                      col.visible
                        ? "bg-purple-600 text-white border-purple-600"
                        : "bg-white text-gray-600 border-gray-300 hover:bg-gray-100"
                    }`}
                  >
                    {col.nombre}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Resumen */}
      <div className="text-sm text-gray-600 mb-3 flex gap-4 flex-wrap">
        <span>{data.length} registros</span>
        {categoriaActiva === "kardex" && (
          <>
            <span>|</span>
            <span>Entradas: {data.filter((r) => r.tipo_movimiento === "Entrada").length}</span>
            <span>Salidas: {data.filter((r) => r.tipo_movimiento === "Salida").length}</span>
            <span>|</span>
            <span>Requisiciones: {data.filter((r) => r.tipo_solicitud === "Requisicion").length}</span>
            <span>Donaciones: {data.filter((r) => r.tipo_solicitud === "Donacion").length}</span>
            <span>Pactos: {data.filter((r) => r.tipo_solicitud === "Pacto").length}</span>
            {totalEntradas > 0 && (
              <span>| Total Entradas: L{totalEntradas.toLocaleString("es-HN", { minimumFractionDigits: 2 })}</span>
            )}
          </>
        )}
      </div>

      {/* Tabla */}
      {loading ? (
        <div className="text-center py-8 text-gray-500">Cargando...</div>
      ) : columnasVisibles.length === 0 ? (
        <div className="text-center text-gray-500 py-4">Selecciona al menos una columna.</div>
      ) : data.length === 0 ? (
        <div className="text-center text-gray-500 py-4">No hay datos con los filtros seleccionados.</div>
      ) : (
        <>
          <GenericReportTable
            columns={columnasVisibles}
            data={data}
            rowKey={(row) => row.id_kardex || row.id_product || row.id_requisi || Math.random().toString()}
          />

          <div className="flex justify-end mt-4">
            <Button className="bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded text-sm" onClick={handleDownloadPDF}>
              Descargar PDF
            </Button>
          </div>

          {/* PDF oculto */}
          <div ref={reportRef} style={{ position: "absolute", left: "-9999px", width: "1056px", height: "auto", minHeight: "816px", background: "#fff" }}>
            <PdfReportLayout
              columns={columnasVisibles}
              data={data}
              rowKey={(row) => row.id_kardex || row.id_product || row.id_requisi || Math.random().toString()}
              title={`Reporte de ${nombresCategorias[categoriaActiva]}`}
              subtitle={getSubtitulo()}
              date={new Date().toLocaleDateString("es-HN", { year: "numeric", month: "long", day: "numeric" })}
              orientation="landscape"
              showSummary={mostrarTotalKardex && totalEntradas > 0}
              summaryData={mostrarTotalKardex ? [
                { label: "Total Entradas", value: `L${totalEntradas.toLocaleString("es-HN", { minimumFractionDigits: 2 })}` },
                { label: "Registros", value: data.length },
                { label: "Columnas", value: columnasVisibles.length }
              ] : []}
            />
          </div>
        </>
      )}
    </div>
  );
};

export default ImpresionReporte;