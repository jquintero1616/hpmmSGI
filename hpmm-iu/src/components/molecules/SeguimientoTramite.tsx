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
  espera: "#e0e0e0",
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
  const sphereSize = size === "xl" ? 80 : 50;
  const fontSize = size === "xl" ? 20 : 14;
  const lineHeight = size === "xl" ? 8 : 6;

  return (
    <div style={{ 
      display: "flex", 
      alignItems: "center", 
      justifyContent: "center",
      padding: "30px 0",
      position: "relative"
    }}>
      {estados.map((item, idx) => {
        const isActive = item.estado !== "espera" && item.estado !== "pendiente";
        const isCompleted = ["aprobado", "aceptado", "comprado", "kardex"].includes(item.estado.toLowerCase());
        const isRejected = ["rechazado", "cancelado"].includes(item.estado.toLowerCase());
        
        // Sistema simple: Verde si completado, Rojo si rechazado, Gris si pendiente
        const circleColor = isCompleted ? "#22c55e" : isRejected ? "#ef4444" : "#9ca3af";
        
        return (
          <React.Fragment key={item.label}>
            <div style={{ 
              display: "flex", 
              flexDirection: "column", 
              alignItems: "center",
              position: "relative",
              zIndex: 2,
              margin: "0 10px"
            }}>
              {/* Esfera principal */}
              <div
                style={{
                  width: sphereSize,
                  height: sphereSize,
                  borderRadius: "50%",
                  backgroundColor: circleColor,
                  border: `4px solid ${circleColor}`,
                  boxShadow: `0 6px 20px ${circleColor}40`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#fff",
                  fontWeight: "bold",
                  fontSize,
                  transition: "all 0.3s ease",
                  position: "relative"
                }}
                title={`${item.label}: ${item.estado}`}
              >
                {/* Icono según el estado */}
                {isCompleted && (
                  <span style={{ fontSize: fontSize }}>✓</span>
                )}
                {isRejected && (
                  <span style={{ fontSize: fontSize }}>✗</span>
                )}
                {!isActive && (
                  <span style={{ fontSize: fontSize * 0.8 }}>{idx + 1}</span>
                )}
              </div>
              
              {/* Label */}
              <div style={{ 
                marginTop: 15, 
                fontSize: size === "xl" ? 16 : 13, 
                fontWeight: 600,
                color: "#374151",
                textAlign: "center",
                maxWidth: "120px",
                lineHeight: "1.2"
              }}>
                {item.label}
              </div>
              
              {/* Estado actual con badge */}
              <div style={{
                marginTop: 8,
                padding: "4px 12px",
                borderRadius: "20px",
                fontSize: size === "xl" ? 12 : 10,
                fontWeight: 500,
                textTransform: "capitalize",
                backgroundColor: `${circleColor}20`,
                color: circleColor,
                border: `1px solid ${circleColor}40`
              }}>
                {item.estado}
              </div>
            </div>
            
            {/* Línea conectora */}
            {idx < estados.length - 1 && (
              <div style={{ display: "flex", alignItems: "center", flex: 1, minWidth: size === "xl" ? 80 : 60 }}>
                <div
                  style={{
                    width: "100%",
                    height: lineHeight,
                    backgroundColor: estados[idx + 1].estado !== "espera" && estados[idx + 1].estado !== "pendiente"
                      ? "#22c55e" 
                      : "#d1d5db",
                    borderRadius: lineHeight / 2,
                    transition: "all 0.3s ease",
                    position: "relative"
                  }}
                >
                  {/* Puntos decorativos en la línea */}
                  <div style={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    width: "6px",
                    height: "6px",
                    borderRadius: "50%",
                    backgroundColor: "#fff",
                    opacity: estados[idx + 1].estado !== "espera" && estados[idx + 1].estado !== "pendiente" ? 1 : 0.3
                  }} />
                </div>
              </div>
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
};
