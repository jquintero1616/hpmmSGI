import React, { useEffect, useMemo, useState } from "react";
import { EyeIcon } from "@heroicons/react/24/outline";
import { useBitacora } from "../../hooks/Use.Bitacora";
import { Bitacorainterface } from "../../interfaces/Bitacora.interface";
import Modal from "../molecules/GenericModal";
import GenericTable, { Column } from "../molecules/GenericTable";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Traducir acciones al español para el usuario
const traducirAccion = (accion: string): string => {
  const map: Record<string, string> = {
    create: "Creación",
    insert: "Creación",
    update: "Edición",
    delete: "Eliminación",
    login: "Inicio de sesión",
  };
  return map[accion.toLowerCase()] || accion;
};

// Traducir nombres de tablas al español
const traducirTabla = (tabla: string): string => {
  const map: Record<string, string> = {
    users: "Usuarios",
    roles: "Roles",
    product: "Productos",
    category: "Categorías",
    subcategory: "Subcategorías",
    direction: "Direcciones",
    subdireccion: "Subdirecciones",
    employes: "Empleados",
    suppliers: "Proveedores",
    donantes: "Donantes",
    vendedor: "Vendedores",
    units: "Unidades",
    pacts: "Pactos",
    units_x_pacts: "Unidades por Pactos",
    requisitions: "Requisiciones",
    requi_x_product: "Requisición x Producto",
    kardex: "Kardex",
    shopping: "Compras",
    solicitud_compras: "Solicitudes de Compra",
    notifications: "Notificaciones",
    reports: "Reportes",
    bitacora: "Bitácora",
  };
  return map[tabla.toLowerCase()] || tabla;
};

type FiltroAccion = "todos" | "create" | "update" | "delete" | "login";

const Bitacora: React.FC = () => {
  const {
    bitacoras,
    GetBitacorasContext,
    GetBitacoraByIdContext,
  } = useBitacora();

  // Estados locales para manejar la UI
  const [loading, setLoading] = useState(true);
  const [isDetailOpen, setDetailOpen] = useState(false);
  const [itemToView, setItemToView] = useState<Bitacorainterface | null>(null);
  const [filtroAccion, setFiltroAccion] = useState<FiltroAccion>("todos");
  const [fechaDesde, setFechaDesde] = useState("");
  const [fechaHasta, setFechaHasta] = useState("");
  const [filtroUsuario, setFiltroUsuario] = useState("");

  // 1) Columnas de la tabla
  const bitacoraColumns: Column<Bitacorainterface>[] = [
    { 
      header: "Usuario", 
      accessor: (row) => row.nombre_usuario || "Sistema"
    },
    { 
      header: "Acción", 
      accessor: (row) => traducirAccion(row.accion)
    },
    { 
      header: "Tabla", 
      accessor: (row) => traducirTabla(row.tabla_afectada)
    },
    { 
      header: "Módulo", 
      accessor: (row) => row.modulo_afecto || "N/A"
    },
    {
      header: "Fecha",
      accessor: (row) =>
        new Date(row.fecha_evento).toLocaleDateString('es-ES', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit'
        })
    },
    {
      header: "IP Origen",
      accessor: (row) => row.ip_origin || "N/A"
    }
  ];

  // 2) Cargar bitácoras al montar
  useEffect(() => {
    setLoading(true);
    GetBitacorasContext().finally(() => setLoading(false));
  }, [GetBitacorasContext]);

  const closeAll = () => {
    setDetailOpen(false);
    setItemToView(null);
  };

  const openDetail = async (id: number) => {
    const bitacora = bitacoras.find((b) => b.id === id);
    if (bitacora) {
      try {
        const detailedBitacora = await GetBitacoraByIdContext(id.toString());
        setItemToView(detailedBitacora || bitacora);
      } catch  {
        setItemToView(bitacora);
      }
      setDetailOpen(true);
    }
  };

  // Función para formatear JSON de manera legible
  const formatJsonString = (jsonString: string | null) => {
    if (!jsonString) return "N/A";
    try {
      const parsed = JSON.parse(jsonString);
      return JSON.stringify(parsed, null, 2);
    } catch {
      return jsonString;
    }
  };

  // Lista única de usuarios para el select
  const usuarios = useMemo(() => {
    const set = new Set(bitacoras.map((b) => b.nombre_usuario || "Sistema"));
    return Array.from(set).sort();
  }, [bitacoras]);

  // Ordenar y filtrar
  const datosFiltrados = useMemo(() => {
    let datos = [...bitacoras].sort((a, b) =>
      new Date(b.fecha_evento).getTime() - new Date(a.fecha_evento).getTime()
    );

    // Filtro por acción
    if (filtroAccion !== "todos") {
      datos = datos.filter((b) => {
        const lower = b.accion.toLowerCase();
        if (filtroAccion === "create") return lower === "create" || lower === "insert";
        return lower === filtroAccion;
      });
    }

    // Filtro por usuario
    if (filtroUsuario) {
      datos = datos.filter((b) => (b.nombre_usuario || "Sistema") === filtroUsuario);
    }

    // Filtro por fecha desde
    if (fechaDesde) {
      const desde = new Date(fechaDesde);
      datos = datos.filter((b) => new Date(b.fecha_evento) >= desde);
    }

    // Filtro por fecha hasta
    if (fechaHasta) {
      const hasta = new Date(fechaHasta + "T23:59:59");
      datos = datos.filter((b) => new Date(b.fecha_evento) <= hasta);
    }

    return datos;
  }, [bitacoras, filtroAccion, filtroUsuario, fechaDesde, fechaHasta]);

  // Contadores por tipo de acción
  const resumen = useMemo(() => {
    const r = { creaciones: 0, ediciones: 0, eliminaciones: 0, sesiones: 0 };
    datosFiltrados.forEach((b) => {
      const l = b.accion.toLowerCase();
      if (l === "create" || l === "insert") r.creaciones++;
      else if (l === "update") r.ediciones++;
      else if (l === "delete") r.eliminaciones++;
      else if (l === "login") r.sesiones++;
    });
    return r;
  }, [datosFiltrados]);

  if (loading) {
    return <div className="text-center py-8">Cargando auditoría de sistema...</div>;
  }

  return (
    <div>
      <ToastContainer />
      {/* Header */}
      <div className="mb-4">
        <h1 className="text-2xl font-bold text-gray-800">
          Bitácora del Sistema
        </h1>
        <p className="text-gray-500 text-sm mt-1">
          Registro de actividades y cambios en el sistema
        </p>
      </div>

      {/* Mini resumen */}
      <div className="flex flex-wrap gap-3 mb-4 text-xs text-gray-500">
        <span>{resumen.creaciones} creaciones</span>
        <span>·</span>
        <span>{resumen.ediciones} ediciones</span>
        <span>·</span>
        <span>{resumen.eliminaciones} eliminaciones</span>
        <span>·</span>
        <span>{resumen.sesiones} inicios de sesión</span>
      </div>

      {/* Filtros: acción + usuario + fechas */}
      <div className="flex flex-wrap items-center gap-3 mb-4">
        {/* Filtros por acción */}
        <div className="flex flex-wrap gap-2">
        {([
          { key: "todos", label: "Todos" },
          { key: "create", label: "Creación" },
          { key: "update", label: "Edición" },
          { key: "delete", label: "Eliminación" },
          { key: "login", label: "Inicio de sesión" },
        ] as { key: FiltroAccion; label: string }[]).map((f) => (
          <button
            key={f.key}
            onClick={() => setFiltroAccion(f.key)}
            className={`px-3 py-1 text-sm rounded-full border transition-colors ${
              filtroAccion === f.key
                ? "bg-hpmm-azul-claro text-white border-hpmm-azul-claro"
                : "bg-white text-gray-600 border-gray-300 hover:bg-gray-50"
            }`}
          >
            {f.label}
          </button>
        ))}
        </div>

        <div className="h-6 w-px bg-gray-300 hidden sm:block" />

        {/* Filtro por usuario */}
        <select
          value={filtroUsuario}
          onChange={(e) => setFiltroUsuario(e.target.value)}
          className="text-sm border border-gray-300 rounded px-2 py-1 bg-white text-gray-600"
        >
          <option value="">Todos los usuarios</option>
          {usuarios.map((u) => (
            <option key={u} value={u}>{u}</option>
          ))}
        </select>

        {/* Filtro por fechas */}
        <div className="flex items-center gap-2">
          <label className="text-xs text-gray-500">Desde:</label>
          <input
            type="date"
            value={fechaDesde}
            onChange={(e) => setFechaDesde(e.target.value)}
            className="text-sm border border-gray-300 rounded px-2 py-1"
          />
          <label className="text-xs text-gray-500">Hasta:</label>
          <input
            type="date"
            value={fechaHasta}
            onChange={(e) => setFechaHasta(e.target.value)}
            className="text-sm border border-gray-300 rounded px-2 py-1"
          />
        </div>

        {/* Limpiar filtros */}
        {(filtroAccion !== "todos" || filtroUsuario || fechaDesde || fechaHasta) && (
          <button
            onClick={() => {
              setFiltroAccion("todos");
              setFiltroUsuario("");
              setFechaDesde("");
              setFechaHasta("");
            }}
            className="text-xs text-gray-500 hover:text-gray-700 underline"
          >
            Limpiar filtros
          </button>
        )}
      </div>

      {datosFiltrados.length === 0 ? (
        <div className="text-center py-12 text-gray-400">
          <p className="text-lg">No se encontraron registros</p>
          <p className="text-sm mt-1">Intenta con otro filtro</p>
        </div>
      ) : (
      <GenericTable
        columns={bitacoraColumns}
        data={datosFiltrados}
        rowKey={(row) => row.id.toString()}
        actions={[
          {
            header: "Ver Detalles",
            label: <EyeIcon className="h-4 w-4" />,
            onClick: (row) => openDetail(row.id),
          },
        ]}
        rowClassName={() => "hover:bg-gray-50"}
      />
      )}

      {/* Modal Detalle */}
      <Modal isOpen={isDetailOpen} onClose={closeAll}>
        {itemToView && (
          <div className="max-w-4xl p-6 bg-white rounded shadow-lg">
            <h3 className="text-xl font-semibold mb-4 text-hpmm-azul-oscuro">
              Detalles del Registro de Auditoría
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700">ID:</label>
                  <p className="text-gray-900">{itemToView.id}</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">Usuario:</label>
                  <p className="text-gray-900">{itemToView.nombre_usuario || "Sistema"}</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">Acción:</label>
                  <span className={`inline-block px-2 py-1 rounded text-sm font-medium ${
                    itemToView.accion.toLowerCase() === 'create' ? 'bg-green-100 text-green-800' :
                    itemToView.accion.toLowerCase() === 'update' ? 'bg-blue-100 text-blue-800' :
                    itemToView.accion.toLowerCase() === 'delete' ? 'bg-red-100 text-red-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {traducirAccion(itemToView.accion)}
                  </span>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">Tabla Afectada:</label>
                  <p className="text-gray-900">{itemToView.tabla_afectada}</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">ID del Registro:</label>
                  <p className="text-gray-900">{itemToView.registro_id}</p>
                </div>
              </div>
              
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Módulo:</label>
                  <p className="text-gray-900">{itemToView.modulo_afecto || "N/A"}</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">IP Origen:</label>
                  <p className="text-gray-900">{itemToView.ip_origin || "N/A"}</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">Fecha del Evento:</label>
                  <p className="text-gray-900">
                    {new Date(itemToView.fecha_evento).toLocaleString('es-ES')}
                  </p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">Creado:</label>
                  <p className="text-gray-900">
                    {new Date(itemToView.created_at).toLocaleString('es-ES')}
                  </p>
                </div>
              </div>
            </div>
            
            {itemToView.descripcion_evento && (
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Descripción del Evento:
                </label>
                <p className="text-gray-900 bg-gray-50 p-3 rounded">
                  {itemToView.descripcion_evento}
                </p>
              </div>
            )}
            
            {itemToView.valores_anterior && (
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Valores Anteriores:
                </label>
                <pre className="text-sm bg-red-50 p-3 rounded overflow-auto max-h-40 text-gray-800">
                  {formatJsonString(itemToView.valores_anterior)}
                </pre>
              </div>
            )}
            
            {itemToView.valores_nuevos && (
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Valores Nuevos:
                </label>
                <pre className="text-sm bg-green-50 p-3 rounded overflow-auto max-h-40 text-gray-800">
                  {formatJsonString(itemToView.valores_nuevos)}
                </pre>
              </div>
            )}
            
            <div className="text-right">
              <button
                onClick={closeAll}
                className="bg-hpmm-azul-claro hover:bg-hpmm-azul-oscuro text-white font-bold py-2 px-4 rounded"
              >
                Cerrar
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default Bitacora;