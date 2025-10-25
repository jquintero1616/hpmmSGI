import React, { useEffect, useState } from "react";
import { EyeIcon } from "@heroicons/react/24/outline";
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
  const [isDetailOpen, setDetailOpen] = useState(false);
  const [itemToView, setItemToView] = useState<Bitacorainterface | null>(null);

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

  // Ordenar datos por fecha más reciente
  const sortedBitacoras = bitacoras.sort((a, b) =>
    new Date(b.fecha_evento).getTime() - new Date(a.fecha_evento).getTime()
  );

  if (loading) {
    return <div className="text-center py-8">Cargando auditoría de sistema...</div>;
  }

  return (
    <div>
      <ToastContainer />
      <h1 className="text-2xl font-bold mb-4 text-left text-hpmm-azul-oscuro">
        Auditoria de sistema
      </h1>

      <GenericTable
        columns={bitacoraColumns}
        data={sortedBitacoras}
        rowKey={(row) => row.id.toString()}
        actions={[
          {
            header: "Ver Detalles",
            label: <EyeIcon className="h-4 w-4" />,
            onClick: (row) => openDetail(row.id),
          },
        ]}
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