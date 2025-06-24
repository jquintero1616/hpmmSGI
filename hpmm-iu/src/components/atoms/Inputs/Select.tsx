// src/components/atoms/Select.tsx

import React, { ChangeEvent } from 'react';

export interface SelectOption {
  label: string;
  value: string | number | boolean;
}

export interface SelectProps {
  name: string;
  value?: string; // <-- Ahora opcional
  onChange: (e: ChangeEvent<HTMLSelectElement>) => void;
  options: SelectOption[];
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  defaultValue?: string; // <-- Agregado aquí
}

const Select: React.FC<SelectProps> = ({

  name,
  value,
  onChange,
  options,
  placeholder = 'Seleccione...',
  className = '',
  disabled = false,
  defaultValue, // <-- Agregado aquí

}) => {
  return (
  <div className="mb-5">
    <select
      id={name}
      name={name}
      value={value}
      onChange={onChange}
      className={`
        w-full h-9 px-4 border rounded-md 
        focus:outline-none focus:ring-2 focus:ring-purple-600 
        ${className}
        ${disabled ? "bg-gray-100 text-gray-500 cursor-not-allowed" : ""}
      `}
      disabled={disabled}
      defaultValue={defaultValue} // <-- Agregado aquí
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