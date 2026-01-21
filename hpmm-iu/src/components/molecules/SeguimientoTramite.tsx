import React, { useContext, useMemo } from "react";
import { RequisicionContext } from "../../contexts/Requisicion.contex";
import { SolicitudComprasContext } from "../../contexts/SolicitudCompras.context";
import { ShoppingContext } from "../../contexts/Shopping.context";
import { KardexContext } from "../../contexts/Kardex.context";
import { FileText, ShoppingCart, CreditCard, PackageCheck, PackageMinus, Check, X } from "lucide-react";

interface Props {
  id_requisicion: string;
  size?: "md" | "xl";
}

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

    const kardexEntrada = kardex.find(
      (k) => k.id_shopping === shop?.id_shopping && k.tipo_movimiento === "Entrada"
    );
    const kardexSalida = kardex.find(
      (k) => k.id_shopping === shop?.id_shopping && k.tipo_movimiento === "Salida"
    );

    return [
      {
        label: "Solicitud",
        icon: FileText,
        estado: req?.estado || "pendiente",
      },
      {
        label: "Aprobación",
        icon: ShoppingCart,
        estado: scompra?.estado || "pendiente",
      },
      {
        label: "Compra",
        icon: CreditCard,
        estado: shop?.shopping_order_id ? "comprado" : "pendiente",
      },
      {
        label: "Entrada",
        icon: PackageCheck,
        estado: kardexEntrada ? "completado" : "pendiente",
      },
      {
        label: "Salida",
        icon: PackageMinus,
        estado: kardexSalida ? "completado" : "pendiente",
      },
    ];
  }, [requisitions, scompras, shopping, kardex, id_requisicion]);

  const getStatus = (estado: string) => {
    const lower = estado.toLowerCase();
    if (["aprobado", "aceptado", "comprado", "kardex", "completado"].includes(lower)) {
      return "completed";
    }
    if (["rechazado", "cancelado"].includes(lower)) {
      return "rejected";
    }
    return "pending";
  };

  const iconSize = size === "xl" ? "w-5 h-5" : "w-4 h-4";
  const circleSize = size === "xl" ? "w-12 h-12" : "w-10 h-10";

  return (
    <div className="flex items-center justify-center py-4">
      {estados.map((item, idx) => {
        const status = getStatus(item.estado);
        const Icon = item.icon;
        
        const bgColor = status === "completed" 
          ? "bg-green-500" 
          : status === "rejected" 
            ? "bg-red-500" 
            : "bg-gray-200";
        
        const textColor = status === "completed" 
          ? "text-white" 
          : status === "rejected" 
            ? "text-white" 
            : "text-gray-400";

        const lineColor = status === "completed" 
          ? "bg-green-500" 
          : status === "rejected" 
            ? "bg-red-500" 
            : "bg-gray-200";

        const labelColor = status === "completed" 
          ? "text-green-700" 
          : status === "rejected" 
            ? "text-red-700" 
            : "text-gray-500";

        return (
          <React.Fragment key={item.label}>
            <div className="flex flex-col items-center">
              {/* Círculo con icono */}
              <div
                className={`${circleSize} ${bgColor} rounded-full flex items-center justify-center transition-all duration-300`}
                title={`${item.label}: ${item.estado}`}
              >
                {status === "completed" ? (
                  <Check className={`${iconSize} ${textColor}`} />
                ) : status === "rejected" ? (
                  <X className={`${iconSize} ${textColor}`} />
                ) : (
                  <Icon className={`${iconSize} ${textColor}`} />
                )}
              </div>
              
              {/* Label */}
              <span className={`mt-2 text-xs font-medium ${labelColor} text-center`}>
                {item.label}
              </span>
            </div>
            
            {/* Línea conectora */}
            {idx < estados.length - 1 && (
              <div className={`flex-1 h-0.5 ${lineColor} mx-2 min-w-[40px] sm:min-w-[60px]`} />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
};
