import React, { useState } from "react";
import { useRequisicion } from "../../hooks/use.Requisicion";
import { useAuth } from "../../hooks/use.Auth";
import { SeguimientoTramite } from "../molecules/SeguimientoTramite";

const SeguimientoTramiteOrganism: React.FC = () => {
  const { requisitions } = useRequisicion();
  const { idEmployes } = useAuth();
  const [selectedId, setSelectedId] = useState<string>("");

  // Filtrar solo las requisiciones del usuario autenticado
  const userRequisitions = requisitions.filter(
    (req) => req.id_employes === idEmployes
  );

  return (
    <div className="max-w-xl mx-auto mt-8 p-6 bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-4 text-center">Seguimiento de Trámite</h2>
      <label className="block mb-2 font-semibold text-gray-700">
        Selecciona una requisición:
      </label>
      <select
        className="w-full mb-6 p-2 border rounded"
        value={selectedId}
        onChange={(e) => setSelectedId(e.target.value)}
      >
        <option value="">-- Selecciona un ID de requisición --</option>
        {userRequisitions.map((req) => (
          <option key={req.id_requisi} value={req.id_requisi}>
            {req.id_requisi} - {req.descripcion || req.product_name}
          </option>
        ))}
      </select>

      {selectedId && (
        <div className="flex justify-center mt-8">
          <SeguimientoTramite id_requisicion={selectedId} size="xl" />
        </div>
      )}
    </div>
  );
};

export default SeguimientoTramiteOrganism;