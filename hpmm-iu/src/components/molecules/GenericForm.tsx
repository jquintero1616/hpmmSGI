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
  value: string | number | boolean;
}

export interface FieldConfig {
  name: string;
  label: string;
  type: string;
  options?: { label: string; value: any }[];
  required?: boolean;
  hide?: boolean; // <-- NUEVO
  showIf?: (values: any) => boolean;
  placeholder?: string;
  min?: number; // Para números
  max?: number; // Para números
  pattern?: string; // Para validaciones custom
  rows?: number; // Para textarea
  disabled?: boolean | ((values: any) => boolean); // Para deshabilitar el campo
  defaultValue?: string | boolean; // <-- Modificado para aceptar boolean también
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
  extraFields?: Record<string, React.ReactNode>;
  dataList?: any[];
  setDataList?: React.Dispatch<React.SetStateAction<any[]>>;
  onAddItem?: (item: T) => void;
  onChange?: (values: T, prevValues?: T) => void; // <-- Cambia aquí
  fullScreen?: boolean; // <-- NUEVO
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
}: GenericFormProps<T>) => {
  // Solo inicializa una vez
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
      return updated;
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

    const fieldValue =
      values[field.name] !== undefined && values[field.name] !== ""
        ? values[field.name]
        : field.defaultValue !== undefined
        ? field.defaultValue
        : "";

    if (field.type === "checkbox") {
      return (
        <div className="flex items-center mt-1">
          <input
            type="checkbox"
            name={field.name}
            checked={Boolean(values[field.name])}
            onChange={handleChange}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded disabled:opacity-50"
            disabled={
              typeof field.disabled === "function"
                ? field.disabled(values)
                : field.disabled ?? false
            }
            aria-invalid={hasError}
          />
          <span className="ml-2 text-sm text-gray-600">
            {field.placeholder || `${field.label.toLowerCase()}`}
          </span>
        </div>
      );
    }

    if (field.type === "select") {
      return (
        <Select
          name={field.name}
          value={fieldValue?.toString() ?? ""}
          onChange={handleChange}
          options={opts}
          placeholder={getPlaceholder(field)}
          className={commonClasses}
          disabled={
            typeof field.disabled === "function"
              ? field.disabled(values)
              : field.disabled ?? false
          }
          defaultValue={field.defaultValue?.toString()}
        />
      );
    }

    if (field.type === "textarea") {
      return (
        <textarea
          name={field.name}
          value={String(fieldValue)}
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
        value={String(fieldValue)}
        onChange={handleChange}
        placeholder={getPlaceholder(field)}
        className={commonClasses}
        aria-invalid={hasError}
        {...(field.type === "number" &&
          field.min !== undefined && { min: field.min })}
        {...(field.type === "number" &&
          field.max !== undefined && { max: field.max })}
        disabled={
          typeof field.disabled === "function"
            ? field.disabled(values)
            : field.disabled ?? false
        }
      />
    );
  };



  return (
    <div
      className={`${
        fullScreen
          ? "w-full max-w-[95vw] p-4"
          : "max-w-xl mx-auto p-6"
      } bg-white rounded-lg`}
    >
      {/* Formulario */}
      {title && (
        <h2 className="text-xl font-semibold text-gray-800 mb-4">{title}</h2>
      )}
      <form onSubmit={handleSubmit} className="space-y-4">
        {fields
          .filter(
            (field) =>
              !field.hide && // Oculta si hide es true
              (!field.showIf || field.showIf(values)) // <--- aquí el cambio
          )
          .map((field) => (
            <div
              key={field.name}
              className={`flex flex-col ${
                field.type === "textarea" && fullScreen
                  ? "lg:col-span-3 md:col-span-2"
                  : field.type === "textarea"
                  ? "md:col-span-2"
                  : ""
              } ${field.type === "checkbox" ? "justify-start" : ""}`}
            >
              <label
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
              {errors[field.name] && (
                <p className="text-xs text-red-500 mt-1">
                  {errors[field.name]}
                </p>
              )}
            </div>
          ))}
        <div className="flex justify-end space-x-3 mt-6">
          {cancelLabel && (
            <Button
              type="button"
              onClick={onCancel}
              className="px-5 py-2 bg-hpmm-rojo-claro text-gray-700 hover:bg-hpmm-rojo-oscuro transition-colors"
            >
              {cancelLabel}
            </Button>
          )}
          {submitLabel && (
            <Button
              type="submit"
              className="px-6 py-2 bg-hpmm-azul-claro text-white hover:bg-hpmm-azul-oscuro transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={submitDisabled}
            >
              {submitLabel}
            </Button>
          )}
        </div>
      </form>
    </div>
  );
};

export default GenericForm;
