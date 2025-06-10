// src/templates/GenericTemplate.tsx
import React from "react";

interface GenericTemplateProps {
  title?: string;
  children: React.ReactNode; // opcional: te permite pasar clases extra si alguna plantilla la necesita
  className?: string;
  status?: string; // opcional: para manejar el estado si es necesario
}

const GenericTemplate: React.FC<GenericTemplateProps> = ({
  title,
  children,
  className = "",
}) => (
  <div className={`p-6 bg-white rounded-lg shadow-md ${className}`}>
    {title && (
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-purple-700">{title}</h2>
      </div>
    )}
    {children}
  </div>
);

export default GenericTemplate;
