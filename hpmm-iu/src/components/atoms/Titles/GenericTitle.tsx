import React from 'react';

export interface GenericTitleProps {
    children: React.ReactNode;
    variant?: 'form' | 'section' | 'card' | 'modal';
    className?: string;
}

const GenericTitle: React.FC<GenericTitleProps> = ({ 
    children, 
    variant = 'form', 
    className = '' 
}) => {
    const baseStyles = {
        form: 'text-lg font-medium text-gray-800',     // Para formularios
        section: 'text-base font-semibold text-gray-700', // Para secciones
        card: 'text-sm font-medium text-gray-600',     // Para tarjetas
        modal: 'text-xl font-semibold text-gray-800',  // Para modales
    };

    return (
        <h3 className={`${baseStyles[variant]} mb-3 ${className}`}>
            {children}
        </h3>
    );
};

export default GenericTitle;