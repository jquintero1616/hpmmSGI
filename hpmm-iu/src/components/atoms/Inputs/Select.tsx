// src/components/atoms/Select.tsx

import React, { ChangeEvent } from 'react';

export interface SelectOption {
  label: string;
  value: string;
}

export interface SelectProps {
  name: string;
  value: string;
  onChange: (e: ChangeEvent<HTMLSelectElement>) => void;
  options: SelectOption[];
  placeholder?: string;
  className?: string;
}

const Select: React.FC<SelectProps> = ({
  name,
  value,
  onChange,
  options,
  placeholder = 'Seleccione...',
  className = '',
}) => (
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
      `}
    >
      <option value="" disabled>
        {placeholder}
      </option>
      {options.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  </div>
);

export default Select;