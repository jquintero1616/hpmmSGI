// src/components/molecules/GenericModal.tsx

import React from "react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

const GenericModal: React.FC<ModalProps> = ({ children, isOpen, onClose }) => {
  if (!isOpen) return null;

  // Manejador para detectar clicks fuera del modal
  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    // Si el click es exactamente en el fondo (no en el modal)
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center"
      style={{ zIndex: 1000 }}
      onClick={handleBackdropClick}
    >
      <div
        className="
          bg-white p-4 rounded 
          w-11/12 max-w-2xl    /* ocupa casi todo el ancho, pero no excede 2xl */
          max-h-[90vh]         /* no pasa del 90% de la altura de la ventana */
          overflow-y-auto      /* si hay mucho contenido, hace scroll interno */
          relative
        "
      >
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-2xl leading-none hover:text-gray-600"
          aria-label="Cerrar"
        >
          ×
        </button>
        {children}
      </div>
    </div>
  );
};

export default GenericModal;
