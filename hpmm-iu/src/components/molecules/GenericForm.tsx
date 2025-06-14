// src/components/organisms/GenericForm.tsx
import React, {
  useState,
  useRef,
  useEffect,
  ChangeEvent,
  FormEvent,
} from "react";
import Input from "../atoms/Inputs/Input";
import Button from "../atoms/Buttons/Button";
import Select from "../atoms/Inputs/Select";

interface SelectOption {
  label: string;
  value: string | number;
}

export interface FieldConfig {
  name: string;
  label: string;
  type:
    | "text"
    | "date"
    | "number"
    | "password"
    | "select"
    | "email"
    | "tel"
    | "textarea";
  options?: string[] | { value: string | number | boolean; label: string }[];
  placeholder?: string;
  required?: boolean;
  min?: number; // Para números
  max?: number; // Para números
  pattern?: string; // Para validaciones custom
  rows?: number; // Para textarea
  disabled?: boolean; // Para deshabilitar el campo
}

interface GenericFormProps<T> {
  initialValues: T;
  fields: FieldConfig[];
  onSubmit: (values: T) => void;
  onCancel: () => void;
  submitLabel?: React.ReactNode;
  cancelLabel?: string;
  title?: string;
  submitDisabled?: boolean;
  validate?: (values: T) => Record<string, string>;
  extraFields?: Record<string, React.ReactNode>; // ← Añade esto
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
  submitLabel = "Guardar",
  cancelLabel = "Cancelar",
  
  submitDisabled = false,
  validate, // ← Recibe validate
  extraFields,
}: GenericFormProps<T>) => {
  const [values, setValues] = useState<T>(initialValues);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const errorTimeouts = useRef<Record<string, number>>({});


  
  useEffect(() => {
    // Limpiar timeouts al desmontar
    return () => {
      Object.values(errorTimeouts.current).forEach((timeoutId) =>
        clearTimeout(timeoutId)
      );
    };
  }, []);

  // Modifica handleChange para validar en tiempo real
  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    let processedValue: any = value;

    if (type === "number") {
      processedValue = value === "" ? "" : Number(value);
    } else if (type === "email") {
      processedValue = value.toLowerCase().trim();
    } else if (type === "tel") {
      processedValue = value.replace(/[^0-9+\-()\s]/g, "");
    }

    setValues((prev) => {
      const newValues = { ...prev, [name]: processedValue };

      // Validación en tiempo real usando validate del padre
      if (validate) {
        const validationErrors = validate(newValues);
        setErrors(validationErrors);
      } else {
        // Limpiar error si existe
        if (errors[name]) {
          setErrors((prev) => ({ ...prev, [name]: "" }));
          if (errorTimeouts.current[name]) {
            clearTimeout(errorTimeouts.current[name]);
            delete errorTimeouts.current[name];
          }
        }
      }

      return newValues;
    });
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

    // 1. Validar campos requeridos y formato SIEMPRE
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
              if (field.min !== undefined && numValue < field.min) {
                newErrors[field.name] = `Mínimo valor: ${field.min}`;
              }
              if (field.max !== undefined && numValue > field.max) {
                newErrors[field.name] = `Máximo valor: ${field.max}`;
              }
            }
            break;
          case "password":
            if (fieldValue.length < 6) {
              newErrors[field.name] =
                "La contraseña debe tener al menos 6 caracteres";
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
    if (validateAll()) {
      onSubmit(values);
    }
  };

  const getPlaceholder = (field: FieldConfig): string => {
    if (field.placeholder) return field.placeholder;

    switch (field.type) {
      case "email":
        return "ejemplo@hpmm.com";
      case "tel":
        return "Número de teléfono"; // Placeholder más genérico
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
    const commonClasses = `px-3 py-2 border rounded text-sm focus:outline-none transition-colors ${
      hasError
        ? "border-red-500 focus:ring-1 focus:ring-red-400"
        : "border-gray-300 focus:ring-1 focus:ring-blue-400"
    }`;

    if (field.type === "select" && opts.length > 0) {
      return (
        <Select
          name={field.name}
          value={values[field.name] || ""}
          onChange={handleChange}
          options={opts as SelectOption[]}
          placeholder={
            field.placeholder || `Seleccionar ${field.label.toLowerCase()}`
          }
          className={`${commonClasses} ${
            !values[field.name] ? "text-gray-400" : "text-gray-900"
          }`}
          disabled={field.disabled}
        />
      );
    }

    if (field.type === "textarea") {
      return (
        <textarea
          name={field.name}
          value={String(values[field.name] ?? "")}
          onChange={handleChange}
          placeholder={getPlaceholder(field)}
          rows={field.rows || 3}
          className={`${commonClasses} resize-vertical`}
          aria-invalid={hasError}
        />
      );
    }

    return (
      <Input
        name={field.name}
        type={field.type === "tel" ? "telefono" : field.type}
        value={String(values[field.name] ?? "")}
        onChange={handleChange}
        placeholder={getPlaceholder(field)}
        className={commonClasses}
        aria-invalid={hasError}
        {...(field.type === "number" &&
          field.min !== undefined && { min: field.min })}
        {...(field.type === "number" &&
          field.max !== undefined && { max: field.max })}
        disabled={field.disabled}
      />
    );
  };

  return (
    <div className="max-w-xl mx-auto bg-white rounded-lg p-6">
      

      {/* Formulario */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {fields.map((field) => (
            <div
              key={field.name}
              className={`flex flex-col ${
                field.type === "textarea" ? "md:col-span-2" : ""
              }`}
            >
              <label className="text-sm font-semibold text-gray-700 mb-1">
                {field.label}
                {field.required && <span className="text-red-500 ml-1">*</span>}
              </label>

              {/* Si hay extraFields para este campo, lo renderiza, si no, el campo normal */}
              {extraFields && extraFields[field.name]
                ? extraFields[field.name]
                : renderField(field)}

              {errors[field.name] && (
                <p className="text-xs text-red-500 mt-1">
                  {errors[field.name]}
                </p>
              )}

              {/* Ayuda contextual */}
              {field.type === "email" && !errors[field.name] && (
                <p className="text-xs text-gray-500 mt-1">
                 
                </p>
              )}
              {field.type === "number" &&
                (field.min || field.max) &&
                !errors[field.name] && (
                  <p className="text-xs text-gray-500 mt-1">
                    {field.min && field.max
                      ? `Rango: ${field.min} - ${field.max}`
                      : field.min
                      ? `Mínimo: ${field.min}`
                      : `Máximo: ${field.max}`}
                  </p>
                )}
            </div>
          ))}
        </div>

        <div className="flex justify-end space-x-3">
          <Button
            type="button"
            onClick={onCancel}
            className="px-5 py-2 bg-hpmm-rojo-claro text-gray-700 hover:bg-hpmm-rojo-oscuro transition-colors"
          >
            {cancelLabel}
          </Button>
          <Button
            type="submit"
            className="px-6 py-2 bg-hpmm-azul-claro text-white hover:bg-hpmm-azul-oscuro transition-colors"
            disabled={submitDisabled} // ← Nuevo
          >
            {submitLabel}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default GenericForm;
