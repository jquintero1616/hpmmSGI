import React, { useContext, useMemo } from "react";
import { RequisicionContext } from "../../contexts/Requisicion.contex";
import { SolicitudComprasContext } from "../../contexts/SolicitudCompras.context";
import { ShoppingContext } from "../../contexts/Shopping.context";
import { KardexContext } from "../../contexts/Kardex.context";

interface Props {
  id_requisicion: string;
  size?: "md" | "xl";
}

const estadosColores: Record<string, string> = {
  espera: "#bdbdbd",
  aprobado: "#4caf50",
  comprado: "#2196f3",
  rechazado: "#f44336",
  cancelado: "#f44336",
  kardex: "#ff9800",
};

const getEstadoColor = (estado: string) => {
  switch (estado.toLowerCase()) {
    case "aprobado":
    case "aceptado":
      return estadosColores.aprobado;
    case "comprado":
      return estadosColores.comprado;
    case "rechazado":
      return estadosColores.rechazado;
    case "cancelado":
      return estadosColores.cancelado;
    case "kardex":
      return estadosColores.kardex;
    default:
      return estadosColores.espera;
  }
};

export const SeguimientoTramite: React.FC<Props> = ({
  id_requisicion,
  size = "md",
}) => {
  const { requisitions } = useContext(RequisicionContext);
  const { scompras } = useContext(SolicitudComprasContext);
  const { shopping } = useContext(ShoppingContext);
  const { kardex } = useContext(KardexContext);

  const estados = useMemo(() => {
    const req = requisitions.find((r) => r.id_requisi === id_requisicion);
    const scompra = scompras.find((s) => s.id_requisi === id_requisicion);
    const shop = shopping.find((s) => s.id_scompra === scompra?.id_scompra);
    const kardexItem = kardex.find((k) => k.id_shopping === shop?.id_shopping);

    return [
      {
        label: "Requisición",
        estado: req?.estado || "espera",
      },
      {
        label: "Solicitud Compra",
        estado: scompra?.estado || "pendiente",
      },
      {
        label: "Compra",
        estado: (shop?.shopping_order_id ? "comprado" : "espera"),
      },
      {
        label: "Kardex",
        estado: kardexItem ? "kardex" : "espera",
      },
    ];
  }, [requisitions, scompras, shopping, kardex, id_requisicion]);

  // Tamaño de las esferas
  const sphereSize = size === "xl" ? 70 : 32;
  const fontSize = size === "xl" ? 22 : 16;

  return (
    <div style={{ display: "flex", gap: 40, alignItems: "center" }}>
      {estados.map((item, idx) => (
        <div key={item.label} style={{ textAlign: "center" }}>
          <div
            style={{
              width: sphereSize,
              height: sphereSize,
              borderRadius: "50%",
              background: getEstadoColor(item.estado),
              margin: "0 auto",
              border: "4px solid #888",
              boxShadow: "0 4px 16px rgba(0,0,0,0.15)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#fff",
              fontWeight: "bold",
              fontSize,
              transition: "background 0.3s",
            }}
            title={item.estado}
          >
            {idx + 1}
          </div>
          <div style={{ marginTop: 8, fontSize: 15, fontWeight: 500 }}>
            {item.label}
          </div>
        </div>
      ))}
    </div>
  );
};
