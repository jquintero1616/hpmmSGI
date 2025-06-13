import React, { useEffect, useState } from "react";
import { useBitacora } from "../../hooks/Use.Bitacora";
import { Bitacorainterface } from "../../interfaces/Bitacora.interface";
import Modal from "../molecules/GenericModal";
import GenericTable, { Column } from "../molecules/GenericTable";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Bitacora: React.FC = () => {
  const {
    bitacoras,
    GetBitacorasContext,
    GetBitacoraByIdContext,
  } = useBitacora();

  // Estados locales para manejar la UI
  const [loading, setLoading] = useState(true);
  const [filteredData, setFilteredData] = useState<Bitacorainterface[]>([]);
  const [isDetailOpen, setDetailOpen] = useState(false);
  const [itemToView, setItemToView] = useState<Bitacorainterface | null>(null);
  const [filterAccion, setFilterAccion] = useState<string>("Todas");
  const [filterModulo, setFilterModulo] = useState<string>("Todos");
  const [searchTerm, setSearchTerm] = useState<string>("");

  // 1) Columnas de la tabla
  const bitacoraColumns: Column<Bitacorainterface>[] = [
    { 
      header: "Usuario", 
      accessor: (row) => row.nombre_usuario || "Sistema"
    },
    { 
      header: "Acción", 
      accessor: "accion"
    },
    { 
      header: "Tabla", 
      accessor: "tabla_afectada"
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
  }, []);

  // 3) Filtrar datos
  useEffect(() => {
    handleFilteredData();
  }, [bitacoras, filterAccion, filterModulo, searchTerm]);

  const closeAll = () => {
    setDetailOpen(false);
    setItemToView(null);
  };

  const openDetail = async (id: number) => {
    const bitacora = bitacoras.find((b) => b.id === id);
    if (bitacora) {
      // Obtener detalles completos si es necesario
      try {
        const detailedBitacora = await GetBitacoraByIdContext(id.toString());
        setItemToView(detailedBitacora || bitacora);
      } catch (error) {
        setItemToView(bitacora);
      }
      setDetailOpen(true);
    }
  };

  const handleFilteredData = () => {
    let filtered = bitacoras;

    // Filtrar por acción
    if (filterAccion !== "Todas") {
      filtered = filtered.filter((b) => b.accion === filterAccion);
    }

    // Filtrar por módulo
    if (filterModulo !== "Todos") {
      filtered = filtered.filter((b) => b.modulo_afecto === filterModulo);
    }

    // Filtrar por término de búsqueda
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter((b) =>
        b.nombre_usuario?.toLowerCase().includes(term) ||
        b.accion.toLowerCase().includes(term) ||
        b.tabla_afectada.toLowerCase().includes(term) ||
        b.modulo_afecto?.toLowerCase().includes(term) ||
        b.descripcion_evento?.toLowerCase().includes(term)
      );
    }

    // Ordenar por fecha más reciente
    const sorted = filtered.sort((a, b) =>
      new Date(b.fecha_evento).getTime() - new Date(a.fecha_evento).getTime()
    );

    setFilteredData(sorted);
  };

  // Obtener valores únicos para los filtros
  const uniqueAcciones = Array.from(new Set(bitacoras.map(b => b.accion)));
  const uniqueModulos = Array.from(new Set(bitacoras.map(b => b.modulo_afecto).filter(Boolean)));

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

  if (loading) {
    return <div className="text-center py-8">Cargando bitácora...</div>;
  }

  return (
    <div>
      <ToastContainer />
      <h1 className="text-2xl font-bold mb-4 text-left text-hpmm-azul-oscuro">
        Bitácora
      </h1>

      {/* Filtros y búsqueda */}
      <div className="mb-4 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Buscar:
          </label>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Usuario, acción, tabla, módulo..."
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-hpmm-azul-claro"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Filtrar por Acción:
          </label>
          <select
            value={filterAccion}
            onChange={(e) => setFilterAccion(e.target.value)}
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-hpmm-azul-claro"
          >
            <option value="Todas">Todas las acciones</option>
            {uniqueAcciones.map((accion) => (
              <option key={accion} value={accion}>
                {accion}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Filtrar por Módulo:
          </label>
          <select
            value={filterModulo}
            onChange={(e) => setFilterModulo(e.target.value)}
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-hpmm-azul-claro"
          >
            <option value="Todos">Todos los módulos</option>
            {uniqueModulos.map((modulo) => (
              <option key={modulo} value={modulo}>
                {modulo}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Información de resultados */}
      <div className="mb-4 text-sm text-gray-600">
        Mostrando {filteredData.length} de {bitacoras.length} registros
      </div>

      <GenericTable
        columns={bitacoraColumns}
        data={filteredData}
        rowKey={(row) => row.id.toString()}
        actions={[
          {
            header: "Ver Detalles",
            label: "Ver",
            onClick: (row) => openDetail(row.id),
          },
        ]}
        // Colorear filas según el tipo de acción
        rowClassName={(row) => {
          switch (row.accion.toLowerCase()) {
            case "create":
            case "insert":
              return "bg-green-50 hover:bg-green-100";
            case "update":
              return "bg-blue-50 hover:bg-blue-100";
            case "delete":
              return "bg-red-50 hover:bg-red-100";
            case "login":
              return "bg-yellow-50 hover:bg-yellow-100";
            default:
              return "hover:bg-gray-50";
          }
        }}
      />

      {/* Modal Detalle */}
      <Modal isOpen={isDetailOpen} onClose={closeAll}>
        {itemToView && (
          <div className="max-w-4xl">
            <h3 className="text-xl font-semibold mb-4 text-hpmm-azul-oscuro">
              Detalles del Registro de Bitácora
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
                    {itemToView.accion}
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