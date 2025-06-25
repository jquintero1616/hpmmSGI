import React, { ChangeEvent } from 'react';

export interface InputProps {
  name: string;
  type?: string;
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
  placeholder?: string;
  className?: string;
  error?: string;
  "aria-invalid"?: boolean;
  disabled?: boolean;
  defaultValue?: string; 
}

const Input: React.FC<InputProps> = ({
  name,
  type = 'text',
  value,
  onChange,
  onBlur,
  placeholder = '',
  className = '',
  error,
  "aria-invalid": ariaInvalid = false,
  disabled = false,
  defaultValue, 
  ...rest
}) => {
  return (
    <div className="mb-5">
      <div className="relative">
        <input
          id={name}
          name={name}
          type={type}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          placeholder={placeholder}
          className={`w-full h-9 px-4 py-3 border rounded-md focus:outline-none focus:ring-2 ${className} ${
            error ? "border-red-500 pr-10" : ""
          }`}
          aria-invalid={ariaInvalid}
          aria-describedby={error ? `${name}-error` : undefined}
          inputMode={type === "tel" ? "tel" : undefined}
          pattern={type === "tel" ? "^[0-9+\\-()\\s]{7,}$" : undefined}
          disabled={disabled}
          defaultValue={defaultValue?.toString()} 
          {...rest}
        />
        {error && (
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-red-500">
            <svg width="20" height="20" fill="none" viewBox="0 0 24 24">
              <circle
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="2"
              />
              <path
                d="M12 8v4m0 4h.01"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </span>
        )}
      </div>
      {error && (
        <p
          id={`${name}-error`}
          className="mt-1 text-xs text-red-600 flex items-center gap-1"
        >
          {error}
        </p>
      )}
    </div>
  );

};

export default Input;