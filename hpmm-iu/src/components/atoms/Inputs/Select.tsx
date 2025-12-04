// src/components/atoms/Select.tsx

import React, { ChangeEvent, FocusEvent } from 'react';

export interface SelectOption {
  label: string;
  value: string | number | boolean;
}

export interface SelectProps {
  name: string;
  value?: string;
  onChange: (e: ChangeEvent<HTMLSelectElement>) => void;
  onBlur?: (e: FocusEvent<HTMLSelectElement>) => void; // NUEVO
  options: SelectOption[];
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  defaultValue?: string;
  "aria-invalid"?: boolean; // NUEVO
  "aria-describedby"?: string; // NUEVO
}

const Select: React.FC<SelectProps> = ({
  name,
  value,
  onChange,
  onBlur, // NUEVO
  options,
  placeholder = 'Seleccione...',
  className = '',
  disabled = false,
  defaultValue,
  "aria-invalid": ariaInvalid, // NUEVO
  "aria-describedby": ariaDescribedby, // NUEVO
}) => {
  return (
  <div className="mb-5">
    <select
      id={name}
      name={name}
      value={value}
      onChange={onChange}
      onBlur={onBlur}
      className={`
        w-full h-9 px-4 border rounded-md 
        focus:outline-none focus:ring-2 focus:ring-purple-600 
        ${className}
        ${disabled ? "bg-gray-100 text-gray-500 cursor-not-allowed" : ""}
      `}
      disabled={disabled}
      defaultValue={defaultValue}
      aria-invalid={ariaInvalid}
      aria-describedby={ariaDescribedby}
    >
      <option value="" disabled>
        {placeholder}
      </option>
      {options.map((opt) => (
        <option key={opt.value.toString()} value={opt.value.toString()}>
          {opt.label}
        </option>
      ))}
    </select>
  </div>
)};


export default Select;