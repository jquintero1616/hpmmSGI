import React, { useState } from "react";
import { useRequisicion } from "../../hooks/use.Requisicion";
import { useAuth } from "../../hooks/use.Auth";
import { SeguimientoTramite } from "../molecules/SeguimientoTramite";

const SeguimientoTramiteOrganism: React.FC = () => {
  const { requisiDetail } = useRequisicion();
  const { idEmployes, roleName } = useAuth();
  const [selectedId, setSelectedId] = useState<string>("");

  const isAdmin = roleName === "Administrador" || roleName === "Super Admin";  

  // Filtrar solo las requisiciones del usuario autenticado
  const userRequisitions = isAdmin ? requisiDetail : requisiDetail.filter(
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
        <option value=""> Selecciona un ID de requisición </option>
        {userRequisitions.map((req) => (
          <option key={req.id_requisi} value={req.id_requisi}>
            R-{req.id_requisi.split("-")[0].toUpperCase()} | {req.product_name || "Sin producto"} {req.descripcion ? `- ${req.descripcion}` : ""}
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
        <h3 className="text-sm font-semibold text-gray-700 mb-2">¿Cómo funciona el seguimiento?</h3>
        <p className="text-xs text-gray-600 leading-relaxed">
          Cada requisición pasa por <strong>5 etapas</strong>: primero se crea la <strong>Solicitud</strong>, 
          luego pasa a <strong>Aprobación</strong> donde se revisa y autoriza. Una vez aprobada, se genera 
          la <strong>Compra</strong> del producto. Cuando el producto llega, se registra la <strong>Entrada</strong> 
          al inventario, y finalmente la <strong>Salida</strong> cuando se entrega al solicitante.
        </p>

        <div className="mt-3 pt-3 border-t text-xs text-gray-500 flex flex-wrap gap-3">
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-green-500"></span> Completado
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500"></span> Rechazado
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-orange-500"></span> Cancelado
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-gray-300"></span> Pendiente
          </span>
        </div>
      </div>
    </div>
  );
};

export default SeguimientoTramiteOrganism;