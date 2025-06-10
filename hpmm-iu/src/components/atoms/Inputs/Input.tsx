import React, { ChangeEvent } from 'react';

export interface InputProps {
  name: string;
  type?: string;
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  className?: string;
}

const Input: React.FC<InputProps> = ({ name, type = 'text', value, onChange, placeholder = '', className = '' }) => (
  <div className="mb-5">
    <input
      id={name}
      name={name}
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className={`w-full h-9 px-4 py-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-00 ${className}`}
    />
  </div>
);

export default Input;