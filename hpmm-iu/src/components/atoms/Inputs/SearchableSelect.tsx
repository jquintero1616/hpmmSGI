// src/components/atoms/Inputs/SearchableSelect.tsx

import React, { useState, useRef, useEffect, ChangeEvent, FocusEvent } from 'react';

export interface SearchableSelectOption {
  label: string;
  value: string | number | boolean;
  searchTerms?: string;
}

export interface SearchableSelectProps {
  name: string;
  value?: string;
  onChange: (e: ChangeEvent<HTMLSelectElement>) => void;
  onBlur?: (e: FocusEvent<HTMLInputElement>) => void;
  options: SearchableSelectOption[];
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  "aria-invalid"?: boolean;
  "aria-describedby"?: string;
}

const SearchableSelect: React.FC<SearchableSelectProps> = ({
  name,
  value,
  onChange,
  onBlur,
  options,
  placeholder = 'Seleccione...',
  className = '',
  disabled = false,
  "aria-invalid": ariaInvalid,
  "aria-describedby": ariaDescribedby,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const selectedOption = options.find(opt => opt.value?.toString() === value);

  const filteredOptions = options.filter(opt => {
    const search = searchTerm.toLowerCase();
    return opt.label.toLowerCase().includes(search) || 
           opt.value?.toString().toLowerCase().includes(search) ||
           opt.searchTerms?.toLowerCase().includes(search);
  });

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setSearchTerm('');
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (option: SearchableSelectOption) => {
    const syntheticEvent = {
      target: { name, value: option.value?.toString() ?? '' },
    } as ChangeEvent<HTMLSelectElement>;
    onChange(syntheticEvent);
    setIsOpen(false);
    setSearchTerm('');
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange({ target: { name, value: '' } } as ChangeEvent<HTMLSelectElement>);
    setSearchTerm('');
  };

  return (
    <div className="relative" ref={containerRef}>
      <div
        className={`
          flex items-center w-full h-9 border rounded-md bg-white
          ${disabled ? "bg-gray-100 cursor-not-allowed" : "cursor-pointer"}
          ${ariaInvalid ? "border-red-500" : "border-gray-300"}
          ${isOpen ? "ring-2 ring-purple-600" : ""}
          ${className}
        `}
        onClick={() => !disabled && setIsOpen(true)}
      >
        <input
          ref={inputRef}
          type="text"
          value={isOpen ? searchTerm : (selectedOption?.label || '')}
          onChange={(e) => { setSearchTerm(e.target.value); if (!isOpen) setIsOpen(true); }}
          onFocus={() => !disabled && setIsOpen(true)}
          onBlur={(e) => setTimeout(() => onBlur?.(e), 150)}
          placeholder={placeholder}
          disabled={disabled}
          className="flex-1 h-full px-3 outline-none bg-transparent text-sm"
          aria-invalid={ariaInvalid}
          aria-describedby={ariaDescribedby}
          autoComplete="off"
        />
        
        {value && !disabled && (
          <button type="button" onClick={handleClear} className="px-1 text-gray-400 hover:text-gray-600" tabIndex={-1}>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
        
        <span className="px-2 text-gray-400">
          <svg className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </span>
      </div>

      {isOpen && !disabled && (
        <ul className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-48 overflow-auto">
          {filteredOptions.length === 0 ? (
            <li className="px-3 py-2 text-gray-500 text-sm">Sin resultados</li>
          ) : (
            filteredOptions.map((option) => (
              <li
                key={option.value?.toString()}
                onClick={() => handleSelect(option)}
                className={`
                  px-3 py-2 text-sm cursor-pointer hover:bg-gray-100
                  ${option.value?.toString() === value ? 'bg-purple-50 text-purple-700 font-medium' : ''}
                `}
              >
                {option.label}
                {option.searchTerms && <span className="ml-2 text-xs text-gray-400">({option.searchTerms})</span>}
              </li>
            ))
          )}
        </ul>
      )}
    </div>
  );
};

export default SearchableSelect;
