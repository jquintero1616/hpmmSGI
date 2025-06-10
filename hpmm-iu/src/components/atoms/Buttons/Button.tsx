// src/components/atoms/buttons/Button.tsx

import React from 'react';

interface ButtonProps {
  children: React.ReactNode;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  isPrimary?: boolean;
  isDanger?: boolean; // ← Nueva prop
  size?: 'small' | 'medium' | 'large';
  variant?: 'filled' | 'text';
  style?: React.CSSProperties;
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
  className?: string;
}

const Button: React.FC<ButtonProps> = ({
  children,
  onClick,
  isPrimary = false,
  isDanger = false, // ← Nueva prop
  size = 'small',
  variant = 'filled',
  style,
  disabled = false,
  type = 'button',
  className = '',
}) => {
  // estilos de padding y font según tamaño
  const padding = {
    small: 'py-1 px-2',
    medium: 'py-2 px-4',
    large: 'py-3 px-6',
  }[size];

  const fontSize = {
    small: 'text-sm',
    medium: 'text-base',
    large: 'text-lg',
  }[size];

  // si es sólo texto, anulamos bg, borde y padding
  if (variant === 'text') {
    return (
      <button
        type={type}
        onClick={onClick}
        disabled={disabled}
        className={`bg-transparent border-none p-0 font-medium focus:outline-none focus:underline text-purple-700 ${className}`}
        style={style}
      >
        {children}
      </button>
    );
  }

  // caso "filled" con mejores colores
  const getButtonColors = () => {
    if (isDanger) return 'bg-red-500 hover:bg-red-700';
    if (isPrimary) return 'bg-blue-500 hover:bg-blue-700';
    return 'bg-hpmm-morado-oscuro hover:bg-hpmm-morado-claro text-gray-800';
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${getButtonColors()} text-white mb-1   font-bold rounded focus:outline-none focus:shadow-outline ${padding} ${fontSize} ${className}`}
      style={style}
    >
      {children}
    </button>
  );
};

export default Button;
