// src/components/organisms/GenericForm.tsx
import { useState, ChangeEvent, FormEvent } from "react";
import Input from "../atoms/Inputs/Input";
import Button from "../atoms/Buttons/Button";
import Title from "../atoms/Titles/Title";

interface SelectOption {
  label: string;
  value: string;
}

export interface FieldConfig {
  name: string;
  label: string;
  type: "text" | "date" | "number" | "password" | "select" | "email";
  options?: string[] | { value: string; label: string }[];
  placeholder?: string;
  required?: boolean;
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
  title,
}: GenericFormProps<T>) => {
  const [values, setValues] = useState<T>(initialValues);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const isEditing = Boolean((initialValues as any).id_kardex);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    setValues((prev) => ({
      ...prev,
      [name]: type === "number" ? Number(value) : value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    fields.forEach((field) => {
      if (
        field.required &&
        (!values[field.name] || values[field.name].toString().trim() === "")
      ) {
        newErrors[field.name] = `${field.label} es requerido`;
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

  return (
    <div className="max-w-xl mx-auto bg-white rounded-lg shadow p-6">
      {/* Header */}
      <div className="mb-4">
        <Title level={2}>
          {title || (isEditing ? "Editar Registro" : "Nuevo Registro")}
        </Title>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {fields.map((field) => {
            const opts = normalizeOptions(field.options);
            return (
              <div key={field.name} className="flex flex-col">
                <label className="text-sm font-semibold text-gray-700 mb-1">
                  {field.label}
                  {field.required && (
                    <span className="text-red-500 ml-1">*</span>
                  )}
                </label>

                {field.type === "select" && opts.length > 0 ? (
                  <select
                    name={field.name}
                    value={values[field.name] || ""}
                    onChange={handleChange}
                    className={`px-3 py-2 border rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-400 transition-colors ${
                      errors[field.name] ? "border-red-300" : "border-gray-300"
                    }`}
                  >
                    <option value="">-- Selecciona --</option>
                    {opts.map((o) => (
                      <option key={o.value} value={o.value}>
                        {o.label}
                      </option>
                    ))}
                  </select>
                ) : (
                  <Input
                    name={field.name}
                    type={field.type === "number" ? "number" : field.type}
                    value={String(values[field.name] ?? "")}
                    onChange={handleChange}
                    placeholder={field.placeholder || ""}
                    className={`px-3 py-2 border rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-400 transition-colors ${
                      errors[field.name] ? "border-red-300" : "border-gray-300"
                    }`}
                  />
                )}

                {errors[field.name] && (
                  <p className="text-xs text-red-500 mt-1">
                    {errors[field.name]}
                  </p>
                )}
              </div>
            );
          })}
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
