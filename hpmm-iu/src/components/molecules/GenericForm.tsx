// src/components/organisms/GenericForm.tsx
import { useState, ChangeEvent, FormEvent } from "react";
import Input from "../atoms/Inputs/Input";
import Button from "../atoms/Buttons/Button";
// Cambiar import

interface SelectOption {
  label: string;
  value: string | number | boolean;
}

export interface FieldConfig {
  name: string;
  label: string;
  type: "text" | "date" | "number" | "password" | "select" | "email" | "tel" | "textarea";
  options?: string[] | { value: string | number | boolean; label: string }[];
  placeholder?: string;
  required?: boolean;
  min?: number; // Para números
  max?: number; // Para números
  pattern?: string; // Para validaciones custom
  rows?: number; // Para textarea
}

interface GenericFormProps<T> {
  initialValues: T;
  fields: FieldConfig[];
  onSubmit: (values: T) => void;
  onCancel: () => void;
  submitLabel?: string;
  cancelLabel?: string;
  title?: string;
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

}: GenericFormProps<T>) => {
  const [values, setValues] = useState<T>(initialValues);
  const [errors, setErrors] = useState<Record<string, string>>({});
  

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    
    let processedValue: any = value;
    
    // Procesar según el tipo de campo
    if (type === "number") {
      processedValue = value === "" ? "" : Number(value);
    } else if (type === "email") {
      processedValue = value.toLowerCase().trim();
    }
    // Removemos el procesamiento automático del teléfono
    
    setValues((prev) => ({
      ...prev,
      [name]: processedValue,
    }));
    
    // Limpiar error si existe
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
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

  const validate = () => {
    const newErrors: Record<string, string> = {};
    
    fields.forEach((field) => {
      const value = values[field.name];
      const fieldValue = value?.toString().trim();
      
      // Validar campos requeridos
      if (field.required && (!value || fieldValue === "")) {
        newErrors[field.name] = `${field.label} es requerido`;
        return;
      }
      
      // Validaciones específicas por tipo
      if (fieldValue) {
        switch (field.type) {
          case "email":
            if (!validateEmail(fieldValue)) {
              newErrors[field.name] = "Ingrese un email válido";
            }
            break;
            
          // Removemos la validación de teléfono por ahora
          // case "tel":
          //   if (!validatePhone(fieldValue)) {
          //     newErrors[field.name] = "Ingrese un teléfono válido";
          //   }
          //   break;
            
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
              newErrors[field.name] = "La contraseña debe tener al menos 6 caracteres";
            }
            break;
        }
        
        // Validación con pattern personalizado
        if (field.pattern && !new RegExp(field.pattern).test(fieldValue)) {
          newErrors[field.name] = `Formato inválido para ${field.label}`;
        }
      }
    });
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (validate()) {
      onSubmit(values);
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
    const opts = normalizeOptions(field.options);
    const commonClasses = `px-3 py-2 border rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-400 transition-colors ${
      errors[field.name] ? "border-red-300" : "border-gray-300"
    }`;

    if (field.type === "select" && opts.length > 0) {
      return (
        <select
          name={field.name}
          value={values[field.name] || ""}
          onChange={handleChange}
          className={`${commonClasses} ${!values[field.name] ? "text-gray-400" : "text-gray-900"}`}
        >
          <option value="" disabled hidden>
            {field.placeholder || `Seleccionar ${field.label.toLowerCase()}`}
          </option>
          {opts.map((o) => (
            <option key={String(o.value)} value={String(o.value)} className="text-gray-900">
              {o.label}
            </option>
          ))}
        </select>
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
        />
      );
    }

    return (
      <Input
        name={field.name}
        type={field.type === "tel" ? "tel" : field.type}
        value={String(values[field.name] ?? "")}
        onChange={handleChange}
        placeholder={getPlaceholder(field)}
        className={commonClasses}
        {...(field.type === "number" && field.min !== undefined && { min: field.min })}
        {...(field.type === "number" && field.max !== undefined && { max: field.max })}
      />
    );
  };

  return (
    <div className="max-w-xl mx-auto bg-white rounded-lg shadow p-6">
      {/* Header con título más apropiado */}
      <div className="mb-4">
        
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {fields.map((field) => (
            <div 
              key={field.name} 
              className={`flex flex-col ${field.type === 'textarea' ? 'md:col-span-2' : ''}`}
            >
              <label className="text-sm font-semibold text-gray-700 mb-1">
                {field.label}
                {field.required && (
                  <span className="text-red-500 ml-1">*</span>
                )}
              </label>

              {renderField(field)}

              {errors[field.name] && (
                <p className="text-xs text-red-500 mt-1">
                  {errors[field.name]}
                </p>
              )}
              
              {/* Ayuda contextual */}
              {field.type === "email" && !errors[field.name] && (
                <p className="text-xs text-gray-500 mt-1">
                  Ej: usuario@hospital.com
                </p>
              )}
              {field.type === "number" && (field.min || field.max) && !errors[field.name] && (
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
            className="px-5 py-2 bg-gray-100 text-gray-700 hover:bg-gray-200"
          >
            {cancelLabel}
          </Button>
          <Button
            type="submit"
            className="px-6 py-2 bg-blue-600 text-white hover:bg-blue-700"
          >
            {submitLabel}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default GenericForm;
