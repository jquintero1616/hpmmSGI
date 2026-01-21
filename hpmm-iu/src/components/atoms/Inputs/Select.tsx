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
    <div className="mb-5 relative">
      <select
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        className={`
          w-full h-9 px-4 border border-gray-300 rounded-md bg-white
          text-sm appearance-none cursor-pointer
          focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent
          transition-all duration-200
          ${disabled ? "bg-gray-100 text-gray-500 cursor-not-allowed" : "hover:border-purple-400"}
          ${className}
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
      <span className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </span>
    </div>
  );
};


export default Select;