import React, { useState } from "react";
import { useRequisicion } from "../../hooks/use.Requisicion";
import { useAuth } from "../../hooks/use.Auth";
import { SeguimientoTramite } from "../molecules/SeguimientoTramite";

const SeguimientoTramiteOrganism: React.FC = () => {
  const { requisitions } = useRequisicion();
  const { idEmployes, roleName } = useAuth();
  const [selectedId, setSelectedId] = useState<string>("");

  const isAdmin = roleName === "Administrador" || roleName === "Super Admin";  

  // Filtrar solo las requisiciones del usuario autenticado
  const userRequisitions = isAdmin ? requisitions : requisitions.filter(
    (req) => req.id_employes === idEmployes
  );

  return (
    <div className="max-w-6xl mx-auto mt-8 p-8 bg-white rounded-lg shadow-lg">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-3">
          Seguimiento de Requisiciones
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Monitorea el progreso de tus solicitudes de inventario desde la
          requisición inicial hasta su registro en kardex
        </p>
      </div>

      <label className="block mb-2 font-semibold text-gray-700">
        Selecciona una requisición para ver su estado detallado:{" "}
      </label>
      <select
        className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
        value={selectedId}
        onChange={(e) => setSelectedId(e.target.value)}
      >
        <option value="">-- Selecciona un ID de requisición --</option>
        {userRequisitions.map((req) => (
          <option key={req.id_requisi} value={req.id_requisi}>
            {`R-${req.id_requisi.split("-")[0].toLocaleUpperCase()}`} :{" "}
            {`"${req.descripcion || req.product_name}"`}
          </option>
        ))}
      </select>

      {selectedId && (
        <div className="flex justify-center mt-8">
          <SeguimientoTramite id_requisicion={selectedId} size="xl" />
        </div>
      )}

      {/* Instrucciones del flujo - versión simple */}
      <div className="mt-8 bg-gray-50 rounded-lg p-4 border">
        <h3 className="text-lg font-medium text-gray-800 mb-3">
          Proceso de Requisiciones
        </h3>
        <div className="text-sm text-gray-600 space-y-1">
          <p>
            <strong>1. Requisición:</strong> Solicitud inicial del producto
          </p>
          <p>
            <strong>2. Solicitud Compra:</strong> Aprobación para comprar
          </p>
          <p>
            <strong>3. Compra:</strong> Adquisición del producto
          </p>
          <p>
            <strong>4. Kardex:</strong> Registro en inventario
          </p>
        </div>

        <div className="mt-3 pt-3 border-t text-xs text-gray-500">
          🟢 Completado • 🔴 Rechazado • ⚪ Pendiente
        </div>
      </div>
    </div>
  );
};

export default SeguimientoTramiteOrganism;