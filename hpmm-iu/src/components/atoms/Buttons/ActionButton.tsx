// src/components/atoms/Buttons/ActionButton.tsx
import React from "react";
import {
  Check,
  X,
  Pencil,
  Trash2,
  Eye,
  Ban,
  RefreshCw,
  Plus,
  FileText,
  Download,
  Upload,
  Save,
  Copy,
  Send,
  RotateCcw,
  type LucideIcon,
} from "lucide-react";

// Mapeo de acciones comunes a iconos y colores
export type ActionType =
  | "aprobar"
  | "rechazar"
  | "cancelar"
  | "editar"
  | "eliminar"
  | "ver"
  | "reactivar"
  | "agregar"
  | "guardar"
  | "descargar"
  | "subir"
  | "copiar"
  | "enviar"
  | "documento"
  | "deshacer";

interface ActionConfig {
  icon: LucideIcon;
  bgColor: string;
  hoverColor: string;
  tooltip: string;
}

// Configuración de cada tipo de acción con colores HEX para estilos inline
const actionConfigs: Record<ActionType, ActionConfig> = {
  aprobar: {
    icon: Check,
    bgColor: "#10b981", // emerald-500
    hoverColor: "#059669", // emerald-600
    tooltip: "Aprobar",
  },
  rechazar: {
    icon: X,
    bgColor: "#f43f5e", // rose-500
    hoverColor: "#e11d48", // rose-600
    tooltip: "Rechazar",
  },
  cancelar: {
    icon: Ban,
    bgColor: "#f59e0b", // amber-500
    hoverColor: "#d97706", // amber-600
    tooltip: "Cancelar",
  },
  editar: {
    icon: Pencil,
    bgColor: "#0ea5e9", // sky-500
    hoverColor: "#0284c7", // sky-600
    tooltip: "Editar",
  },
  eliminar: {
    icon: Trash2,
    bgColor: "#dc2626", // red-600
    hoverColor: "#b91c1c", // red-700
    tooltip: "Eliminar",
  },
  ver: {
    icon: Eye,
    bgColor: "#6366f1", // indigo-500
    hoverColor: "#4f46e5", // indigo-600
    tooltip: "Ver detalles",
  },
  reactivar: {
    icon: RefreshCw,
    bgColor: "#14b8a6", // teal-500
    hoverColor: "#0d9488", // teal-600
    tooltip: "Reactivar",
  },
  agregar: {
    icon: Plus,
    bgColor: "#22c55e", // green-500
    hoverColor: "#16a34a", // green-600
    tooltip: "Agregar",
  },
  guardar: {
    icon: Save,
    bgColor: "#2563eb", // blue-600
    hoverColor: "#1d4ed8", // blue-700
    tooltip: "Guardar",
  },
  descargar: {
    icon: Download,
    bgColor: "#a855f7", // purple-500
    hoverColor: "#9333ea", // purple-600
    tooltip: "Descargar",
  },
  subir: {
    icon: Upload,
    bgColor: "#f97316", // orange-500
    hoverColor: "#ea580c", // orange-600
    tooltip: "Subir",
  },
  copiar: {
    icon: Copy,
    bgColor: "#6b7280", // gray-500
    hoverColor: "#4b5563", // gray-600
    tooltip: "Copiar",
  },
  enviar: {
    icon: Send,
    bgColor: "#06b6d4", // cyan-500
    hoverColor: "#0891b2", // cyan-600
    tooltip: "Enviar",
  },
  documento: {
    icon: FileText,
    bgColor: "#64748b", // slate-500
    hoverColor: "#475569", // slate-600
    tooltip: "Documento",
  },
  deshacer: {
    icon: RotateCcw,
    bgColor: "#71717a", // zinc-500
    hoverColor: "#52525b", // zinc-600
    tooltip: "Deshacer",
  },
};

interface ActionButtonProps {
  /** Tipo de acción predefinido */
  actionType: ActionType;
  /** Función a ejecutar al hacer clic */
  onClick: () => void;
  /** Si el botón está deshabilitado */
  disabled?: boolean;
  /** Tamaño del botón */
  size?: "sm" | "md" | "lg";
  /** Mostrar tooltip */
  showTooltip?: boolean;
  /** Tooltip personalizado */
  tooltip?: string;
  /** Clases adicionales */
  className?: string;
  /** Mostrar texto junto al icono */
  showLabel?: boolean;
  /** Etiqueta personalizada */
  label?: string;
}

const ActionButton: React.FC<ActionButtonProps> = ({
  actionType,
  onClick,
  disabled = false,
  size = "sm",
  showTooltip = true,
  tooltip,
  className = "",
  showLabel = false,
  label,
}) => {
  const config = actionConfigs[actionType];
  const Icon = config.icon;
  const [isHovered, setIsHovered] = React.useState(false);

  // Tamaños
  const sizeStyles = {
    sm: { padding: "6px" },
    md: { padding: "8px" },
    lg: { padding: "10px" },
  };

  const iconSizes = {
    sm: 16,
    md: 18,
    lg: 20,
  };

  const tooltipText = tooltip || config.tooltip;

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      title={showTooltip ? tooltipText : undefined}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        backgroundColor: isHovered && !disabled ? config.hoverColor : config.bgColor,
        ...sizeStyles[size],
      }}
      className={`
        group relative inline-flex items-center justify-center
        text-white rounded-lg
        transition-all duration-200 ease-in-out
        transform hover:scale-105 active:scale-95
        focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-opacity-50
        shadow-sm hover:shadow-md
        disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none
        ${className}
      `}
    >
      <Icon size={iconSizes[size]} strokeWidth={2} color="white" />
      {showLabel && (
        <span className="ml-1.5 text-sm font-medium text-white">
          {label || tooltipText}
        </span>
      )}
    </button>
  );
};

export default ActionButton;

// Componente para agrupar múltiples botones de acción
interface ActionButtonGroupProps {
  children: React.ReactNode;
  className?: string;
}

export const ActionButtonGroup: React.FC<ActionButtonGroupProps> = ({
  children,
  className = "",
}) => {
  return (
    <div className={`flex items-center gap-1.5 ${className}`}>
      {children}
    </div>
  );
};
