// src/components/organisms/GenericForm.tsx
import React, {
  useState,
  useRef,
  useEffect,
  ChangeEvent,
  FormEvent,
  FocusEvent,
  useCallback,
} from "react";
import Input from "../atoms/Inputs/Input";
import Button from "../atoms/Buttons/Button";
import Select from "../atoms/Inputs/Select";
import SearchableSelect from "../atoms/Inputs/SearchableSelect";

// Iconos de estado
const CheckIcon = () => (
  <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
  </svg>
);

const ErrorIcon = () => (
  <svg className="w-4 h-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
  </svg>
);

const ResetIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
  </svg>
);

interface SelectOption {
  label: string;
  value: string | number | boolean;
}

export interface FieldConfig {
  name: string;
  label: string;
  type: string;
  options?: { label: string; value: any; searchTerms?: string }[];
  required?: boolean;
  hide?: boolean;
  showIf?: (values: any) => boolean;
  placeholder?: string;
  min?: number;
  max?: number;
  pattern?: string;
  rows?: number;
  disabled?: boolean | ((values: any) => boolean);
  defaultValue?: string | boolean;
  colSpan?: 1 | 2 | 3 | 4;
  section?: string;
  helpText?: string;
}

// NUEVO: Configuración de sección
export interface SectionConfig {
  id: string;
  title: string;
  description?: string;
  collapsible?: boolean;
  defaultCollapsed?: boolean;
}

interface GenericFormProps<T> {
  initialValues: T;
  fields: FieldConfig[];
  onSubmit: (values: T) => void;
  onCancel: () => void;
  submitLabel?: React.ReactNode;
  cancelLabel?: string;
  title?: string;
  subTitle?: string;
  submitDisabled?: boolean;
  validate?: (values: T) => Record<string, string>;
  extraFields?: Record<string, React.ReactNode>;
  dataList?: any[];
  setDataList?: React.Dispatch<React.SetStateAction<any[]>>;
  onAddItem?: (item: T) => void;
  onChange?: (values: T, prevValues?: T) => void;
  fullScreen?: boolean;
  readOnly?: boolean;
  columns?: 1 | 2 | 3 | 4;
  sections?: SectionConfig[]; // NUEVO: Definir secciones
  validateOnBlur?: boolean; // NUEVO: Validar al perder foco
  showReset?: boolean; // NUEVO: Mostrar botón reset
  showFieldStatus?: boolean; // NUEVO: Mostrar iconos de estado
}

function normalizeOptions(o?: string[] | SelectOption[]): SelectOption[] {
  if (!o) return [];
  return typeof o[0] === "string"
    ? (o as string[]).map((s) => ({ label: s, value: s }))
    : (o as SelectOption[]);
}

const GenericForm = <T extends Record<string, any>>({
  initialValues,
  fields,
  onSubmit,
  onCancel,
  submitLabel,
  cancelLabel,
  submitDisabled = false,
  validate,
  extraFields,
  onChange,
  title = "Formulario Genérico",
  fullScreen = false,
  readOnly = false,
  subTitle = "",
  columns = 1,
  sections,
  validateOnBlur = true,
  showReset = false,
  showFieldStatus = false, // Desactivado por defecto
}: GenericFormProps<T>) => {
  const [values, setValues] = useState<T>(initialValues);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({}); // NUEVO: Campos tocados
  const [validFields, setValidFields] = useState<Record<string, boolean>>({}); // NUEVO: Campos válidos
  const [collapsedSections, setCollapsedSections] = useState<Record<string, boolean>>(() => {
    // Inicializar secciones colapsadas
    const initial: Record<string, boolean> = {};
    sections?.forEach(s => {
      if (s.defaultCollapsed) initial[s.id] = true;
    });
    return initial;
  });
  const errorTimeouts = useRef<Record<string, number>>({});

  useEffect(() => {
    // Limpiar timeouts al desmontar
    return () => {
      Object.values(errorTimeouts.current).forEach((timeoutId) =>
        clearTimeout(timeoutId)
      );
    };
  }, []);

  // NUEVO: Función para resetear el formulario
  const handleReset = useCallback(() => {
    setValues(initialValues);
    setErrors({});
    setTouched({});
    setValidFields({});
  }, [initialValues]);

  // NUEVO: Validar un campo individual
  const validateField = useCallback((field: FieldConfig, value: any): string => {
    const fieldValue = value?.toString().trim();

    if (field.required && (!value || fieldValue === "")) {
      return `${field.label} es requerido`;
    }

    if (fieldValue) {
      switch (field.type) {
        case "email":
          if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fieldValue)) {
            return "Ingrese un email válido";
          }
          break;
        case "number":
          const numValue = Number(value);
          if (isNaN(numValue)) {
            return "Debe ser un número válido";
          }
          if (numValue <= 0) {
            return "Debe ser mayor a 0";
          }
          if (field.min !== undefined && numValue < field.min) {
            return `Mínimo valor: ${field.min}`;
          }
          if (field.max !== undefined && numValue > field.max) {
            return `Máximo valor: ${field.max}`;
          }
          break;
        case "tel":
          if (!/^\d{8}$/.test(fieldValue)) {
            return "El número debe tener exactamente 8 dígitos";
          }
          break;
        case "password":
          if (fieldValue.length < 4) {
            return "La contraseña debe tener al menos 4 caracteres";
          }
          break;
      }
      if (field.pattern && !new RegExp(field.pattern).test(fieldValue)) {
        return `Formato inválido para ${field.label}`;
      }
    }

    return "";
  }, []);

  // NUEVO: Manejar blur para validación en tiempo real
  const handleBlur = (e: FocusEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name } = e.target;
    
    if (!validateOnBlur) return;
    
    setTouched(prev => ({ ...prev, [name]: true }));
    
    const field = fields.find(f => f.name === name);
    if (!field) return;

    const error = validateField(field, values[name]);
    
    if (error) {
      setErrors(prev => ({ ...prev, [name]: error }));
      setValidFields(prev => ({ ...prev, [name]: false }));
    } else {
      setErrors(prev => ({ ...prev, [name]: "" }));
      setValidFields(prev => ({ ...prev, [name]: true }));
    }
  };

  // handleChange
  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, type } = e.target;
    let value: any;

    if (
      e.target instanceof HTMLInputElement &&
      type === "checkbox"
    ) {
      value = e.target.checked;
    } else {
      value = e.target.value;
    }

    setValues((prev) => {
      const updated = { ...prev, [name]: value };
      if (onChange) onChange(updated, prev);
      
      // Limpiar error si el campo fue tocado y ahora tiene valor
      if (touched[name] && value) {
        const field = fields.find(f => f.name === name);
        if (field) {
          const error = validateField(field, value);
          if (!error) {
            setErrors(prev => ({ ...prev, [name]: "" }));
            setValidFields(prev => ({ ...prev, [name]: true }));
          }
        }
      }
      
      return updated;
    });
  };

  // Toggle sección colapsada
  const toggleSection = (sectionId: string) => {
    setCollapsedSections(prev => ({
      ...prev,
      [sectionId]: !prev[sectionId]
    }));
  };

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePhone = (phone: string): boolean => {
    // Validar formato de teléfono (mínimo 7 dígitos)
    const phoneRegex = /[\d\s+()-]{7,}/;
    return phoneRegex.test(phone);
  };

  // Modifica validate para usar la función del padre si existe
  const validateAll = () => {
    let newErrors: Record<string, string> = {};

    fields.forEach((field) => {
      const value = values[field.name];
      const fieldValue = value?.toString().trim();

      if (field.required && (!value || fieldValue === "")) {
        newErrors[field.name] = `${field.label} es requerido`;
        return;
      }

      if (fieldValue) {
        switch (field.type) {
          case "email":
            if (!validateEmail(fieldValue)) {
              newErrors[field.name] = "Ingrese un email válido";
            }
            break;
          case "number":
            const numValue = Number(value);
            if (isNaN(numValue)) {
              newErrors[field.name] = "Debe ser un número válido";
            } else {
              // Validar que sea mayor a 0
              if (numValue <= 0) {
                newErrors[field.name] = "Debe ser mayor a 0";
              }
              if (field.min !== undefined && numValue < field.min) {
                newErrors[field.name] = `Mínimo valor: ${field.min}`;
              }
              if (field.max !== undefined && numValue > field.max) {
                newErrors[field.name] = `Máximo valor: ${field.max}`;
              }
            }
            break;
          case "tel":
            // Validación para teléfonos de Honduras: exactamente 8 dígitos
            if (!/^\d{8}$/.test(fieldValue)) {
              newErrors[field.name] = "El número debe tener exactamente 8 dígitos";
            }
            break;
          case "password":
            if (fieldValue.length < 4) {
              newErrors[field.name] =
                "La contraseña debe tener al menos 4 caracteres";
            }
            break;
        }
        if (field.pattern && !new RegExp(field.pattern).test(fieldValue)) {
          newErrors[field.name] = `Formato inválido para ${field.label}`;
        }
      }
    });

    // 2. Si hay función validate personalizada, combinar errores
    if (validate) {
      const customErrors = validate(values);
      newErrors = { ...newErrors, ...customErrors };
    }

    setErrors(newErrors);

    // Limpiar errores después de 3 segundos
    Object.keys(newErrors).forEach((key) => {
      if (errorTimeouts.current[key]) clearTimeout(errorTimeouts.current[key]);
      errorTimeouts.current[key] = window.setTimeout(() => {
        setErrors((prev) => ({ ...prev, [key]: "" }));
        delete errorTimeouts.current[key];
      }, 3000);
    });

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    // Aplica trim a todos los valores string antes de enviar
    const trimmedValues = Object.fromEntries(
      Object.entries(values).map(([key, val]) => [
        key,
        typeof val === "string" ? val.trim() : val,
      ])
    ) as T;

    if (validateAll()) {
      onSubmit(trimmedValues);
    }
  };

  const getPlaceholder = (field: FieldConfig): string => {
    if (field.placeholder) return field.placeholder;

    switch (field.type) {
      case "email":
        return "ejemplo@correo.com";
      case "tel":
        return "Número de teléfono"; 
      case "number":
        return "Ingrese un número";
      case "password":
        return "Mínimo 6 caracteres";
      case "date":
        return "dd/mm/yyyy";
      default:
        return `Ingrese ${field.label.toLowerCase()}`;
    }
  };

  const renderField = (field: FieldConfig) => {
    const opts = normalizeOptions(field.options as string[] | SelectOption[]);
    const hasError = !!errors[field.name];
    const isValid = validFields[field.name] && touched[field.name] && !hasError;
    const isTouched = touched[field.name];
    
    const commonClasses = `px-3 py-2 border rounded text-sm focus:outline-none transition-all duration-200 ${
      hasError
        ? "border-red-500 focus:ring-2 focus:ring-red-200 bg-red-50"
        : "border-gray-300 focus:ring-2 focus:ring-blue-200 focus:border-blue-400"
    }`;

    const fieldValue =
      values[field.name] !== undefined && values[field.name] !== ""
        ? values[field.name]
        : field.defaultValue !== undefined
        ? field.defaultValue
        : "";

    // NUEVO: Componente de estado del campo
    const FieldStatus = () => {
      if (!showFieldStatus || !isTouched) return null;
      return (
        <span className="absolute right-3 top-1/2 -translate-y-1/2 transition-all duration-200">
          {hasError ? <ErrorIcon /> : isValid ? <CheckIcon /> : null}
        </span>
      );
    };

    if (field.type === "checkbox") {
      return (
        <div className="flex items-center mt-1">
          <input
            type="checkbox"
            id={`field-${field.name}`}
            name={field.name}
            checked={Boolean(values[field.name])}
            onChange={handleChange}
            onBlur={handleBlur}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded disabled:opacity-50 transition-all duration-200"
            disabled={
              readOnly ||
              (typeof field.disabled === "function"
                ? field.disabled(values)
                : field.disabled ?? false)
            }
            aria-invalid={hasError}
            aria-describedby={hasError ? `error-${field.name}` : undefined}
          />
          <span className="ml-2 text-sm text-gray-600">
            {field.placeholder || `${field.label.toLowerCase()}`}
          </span>
        </div>
      );
    }

    if (field.type === "select") {
      return (
        <div className="relative">
          <Select
            name={field.name}
            value={fieldValue?.toString() ?? ""}
            onChange={handleChange} 
            onBlur={handleBlur}
            options={opts}
            placeholder={getPlaceholder(field)}
            className={commonClasses}
            disabled={
              readOnly ||
              (typeof field.disabled === "function"
                ? field.disabled(values)
                : field.disabled ?? false)
            }
            defaultValue={field.defaultValue?.toString()}
            aria-invalid={hasError}
            aria-describedby={hasError ? `error-${field.name}` : field.helpText ? `help-${field.name}` : undefined}
          />
        </div>
      );
    }

    // Nuevo tipo: select con búsqueda
    if (field.type === "searchable-select") {
      const searchableOpts = (field.options || []).map(opt => ({
        label: opt.label,
        value: opt.value,
        searchTerms: opt.searchTerms,
      }));
      
      return (
        <div className="relative">
          <SearchableSelect
            name={field.name}
            value={fieldValue?.toString() ?? ""}
            onChange={handleChange}
            onBlur={handleBlur}
            options={searchableOpts}
            placeholder={getPlaceholder(field)}
            disabled={
              readOnly ||
              (typeof field.disabled === "function"
                ? field.disabled(values)
                : field.disabled ?? false)
            }
            aria-invalid={hasError}
            aria-describedby={hasError ? `error-${field.name}` : field.helpText ? `help-${field.name}` : undefined}
          />
        </div>
      );
    }

    if (field.type === "textarea") {
      return (
        <div className="relative">
          <textarea
            id={`field-${field.name}`}
            name={field.name}
            value={String(fieldValue)}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder={getPlaceholder(field)}
            rows={field.rows || 3}
            className={`${commonClasses} resize-vertical w-full`}
            aria-invalid={hasError}
            aria-describedby={hasError ? `error-${field.name}` : field.helpText ? `help-${field.name}` : undefined}
            disabled={readOnly}
          />
        </div>
      );
    }

    return (
      <div className="relative">
        <Input
          id={`field-${field.name}`}
          name={field.name}
          type={field.type === "tel" ? "telefono" : field.type}
          value={String(fieldValue)}
          onChange={handleChange}
          onBlur={handleBlur}
          placeholder={getPlaceholder(field)}
          className={`${commonClasses} pr-10`}
          aria-invalid={hasError}
          aria-describedby={hasError ? `error-${field.name}` : field.helpText ? `help-${field.name}` : undefined}
          {...(field.type === "number" &&
            field.min !== undefined && { min: field.min })}
          {...(field.type === "number" &&
            field.max !== undefined && { max: field.max })}
          disabled={
            readOnly ||
            (typeof field.disabled === "function"
              ? field.disabled(values)
              : field.disabled ?? false)
          }
        />
        <FieldStatus />
      </div>
    );
  };

  // Helper para obtener la clase de columnas del grid
  const getGridColumnsClass = () => {
    switch (columns) {
      case 4:
        return "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4";
      case 3:
        return "grid-cols-1 sm:grid-cols-2 md:grid-cols-3";
      case 2:
        return "grid-cols-1 sm:grid-cols-2";
      default:
        return "grid-cols-1";
    }
  };

  // Helper para obtener la clase de colSpan de cada campo
  const getColSpanClass = (field: FieldConfig) => {
    const span = field.colSpan || 1;
    // Para textarea, por defecto ocupa todo el ancho si no se especifica colSpan
    const effectiveSpan = field.type === "textarea" && !field.colSpan ? columns : span;
    
    switch (effectiveSpan) {
      case 4:
        return "col-span-1 sm:col-span-2 md:col-span-3 lg:col-span-4";
      case 3:
        return "col-span-1 sm:col-span-2 md:col-span-3";
      case 2:
        return "col-span-1 sm:col-span-2";
      default:
        return "col-span-1";
    }
  };

  // NUEVO: Renderizar un campo con su wrapper
  const renderFieldWrapper = (field: FieldConfig) => {
    const hasError = !!errors[field.name];
    
    return (
      <div
        key={field.name}
        className={`flex flex-col ${getColSpanClass(field)} ${
          field.type === "checkbox" ? "justify-start" : ""
        } animate-fadeIn`}
      >
        <label
          htmlFor={`field-${field.name}`}
          className={`text-sm font-semibold text-gray-700 mb-1 ${
            field.type === "checkbox" ? "mb-0" : ""
          }`}
        >
          {field.label}
          {field.required && <span className="text-red-500 ml-1">*</span>}
        </label>
        {extraFields && extraFields[field.name]
          ? extraFields[field.name]
          : renderField(field)}
        {/* Texto de ayuda */}
        {field.helpText && !hasError && (
          <p id={`help-${field.name}`} className="text-xs text-gray-500 mt-1">
            {field.helpText}
          </p>
        )}
        {/* Error con animación */}
        {hasError && (
          <p 
            id={`error-${field.name}`}
            className="text-xs text-red-500 mt-1 animate-shake flex items-center gap-1"
            role="alert"
          >
            <ErrorIcon />
            {errors[field.name]}
          </p>
        )}
      </div>
    );
  };

  // NUEVO: Renderizar sección
  const renderSection = (section: SectionConfig, sectionFields: FieldConfig[]) => {
    const isCollapsed = collapsedSections[section.id];
    
    return (
      <div key={section.id} className="col-span-full mb-4">
        {/* Header de sección */}
        <div 
          className={`flex items-center justify-between py-2 border-b border-gray-200 mb-4 ${
            section.collapsible ? "cursor-pointer hover:bg-gray-50 rounded px-2 -mx-2" : ""
          }`}
          onClick={() => section.collapsible && toggleSection(section.id)}
        >
          <div>
            <h3 className="text-md font-semibold text-gray-800">{section.title}</h3>
            {section.description && (
              <p className="text-xs text-gray-500">{section.description}</p>
            )}
          </div>
          {section.collapsible && (
            <svg 
              className={`w-5 h-5 text-gray-500 transition-transform duration-200 ${
                isCollapsed ? "" : "rotate-180"
              }`}
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          )}
        </div>
        {/* Campos de la sección */}
        <div 
          className={`grid ${getGridColumnsClass()} gap-4 transition-all duration-300 overflow-hidden ${
            isCollapsed ? "max-h-0 opacity-0" : "max-h-[2000px] opacity-100"
          }`}
        >
          {sectionFields.map(field => renderFieldWrapper(field))}
        </div>
      </div>
    );
  };

  // Agrupar campos por sección
  const getFieldsBySection = () => {
    if (!sections || sections.length === 0) return null;
    
    const grouped: Record<string, FieldConfig[]> = {};
    const noSection: FieldConfig[] = [];
    
    fields
      .filter(f => !f.hide && (!f.showIf || f.showIf(values)))
      .forEach(field => {
        if (field.section) {
          if (!grouped[field.section]) grouped[field.section] = [];
          grouped[field.section].push(field);
        } else {
          noSection.push(field);
        }
      });
    
    return { grouped, noSection };
  };

  return (
    <div
      className={`${
        fullScreen
          ? "w-full max-w-[95vw] p-4"
          : "max-w-xl mx-auto p-6"
      } bg-white rounded-lg`}
    >
      {/* Estilos de animación */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-5px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }
        .animate-fadeIn { animation: fadeIn 0.2s ease-out; }
        .animate-shake { animation: shake 0.3s ease-in-out; }
      `}</style>

      {/* Header del formulario */}
      {title && (
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-xl font-semibold text-gray-800">{title}</h2>
          {showReset && !readOnly && (
            <button
              type="button"
              onClick={handleReset}
              className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 transition-colors"
              title="Resetear formulario"
            >
              <ResetIcon />
              Limpiar
            </button>
          )}
        </div>
      )}
      {subTitle && (
        <p className="text-xs font-medium text-gray-500 mb-6">{subTitle}</p>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Renderizar con secciones si existen */}
        {sections && sections.length > 0 ? (
          <>
            {(() => {
              const fieldsBySection = getFieldsBySection();
              if (!fieldsBySection) return null;
              
              return (
                <>
                  {/* Campos sin sección primero */}
                  {fieldsBySection.noSection.length > 0 && (
                    <div className={`grid ${getGridColumnsClass()} gap-4`}>
                      {fieldsBySection.noSection.map(field => renderFieldWrapper(field))}
                    </div>
                  )}
                  {/* Secciones */}
                  {sections.map(section => {
                    const sectionFields = fieldsBySection.grouped[section.id] || [];
                    if (sectionFields.length === 0) return null;
                    return renderSection(section, sectionFields);
                  })}
                </>
              );
            })()}
          </>
        ) : (
          /* Renderizar sin secciones (comportamiento original) */
          <div className={`grid ${getGridColumnsClass()} gap-4`}>
            {fields
              .filter(
                (field) =>
                  !field.hide &&
                  (!field.showIf || field.showIf(values))
              )
              .map(field => renderFieldWrapper(field))}
          </div>
        )}

        {/* Botones */}
        {!readOnly && (
          <div className="flex justify-end space-x-3 mt-6 pt-4 border-t border-gray-100">
            {cancelLabel && (
              <Button
                type="button"
                onClick={onCancel}
                className="px-5 py-2 bg-hpmm-rojo-claro text-gray-700 hover:bg-hpmm-rojo-oscuro transition-all duration-200"
              >
                {cancelLabel}
              </Button>
            )}
            {submitLabel && (
              <Button
                type="submit"
                className="px-6 py-2 bg-hpmm-azul-claro text-white hover:bg-hpmm-azul-oscuro transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02] active:scale-[0.98]"
                disabled={submitDisabled}
              >
                {submitLabel}
              </Button>
            )}
          </div>
        )}
      </form>
    </div>
  );
};

export default GenericForm;
