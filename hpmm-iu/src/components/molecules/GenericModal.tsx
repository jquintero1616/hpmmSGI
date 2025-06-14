// src/components/molecules/GenericModal.tsx

import React from "react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title?: string;
  showHeader?: boolean;
  showFooter?: boolean;
  onSave?: () => void;
  onCancel?: () => void;
  saveButtonText?: string;
  cancelButtonText?: string;
}

const GenericModal: React.FC<ModalProps> = ({ 
  children, 
  isOpen, 
  onClose,
  title = "Modal",
  showHeader = true,
  showFooter = true,
  onSave,
  onCancel,
  saveButtonText = "Guardar",
  
}) => {
  if (!isOpen) return null;

  // Manejador para detectar clicks fuera del modal
  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    // Si el click es exactamente en el fondo (no en el modal)
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    } else {
      onClose();
    }
  };

  const handleSave = () => {
    if (onSave) {
      onSave();
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-20 backdrop-blur-sm flex justify-center items-center"
      style={{ zIndex: 1000 }}
      onClick={handleBackdropClick}
    >
      <div className="w-full max-w-lg mx-auto">
        <div className="bg-white rounded-lg shadow-xl max-h-[90vh] overflow-hidden">
          {/* Header */}
          {showHeader && (
            <header className="bg-purple-600 text-white p-4 rounded-t-lg flex justify-between items-center">
              <h2 className="text-lg font-semibold">{title}</h2>
              <button
                onClick={onClose}
                className="text-2xl leading-none hover:text-gray-300 transition-colors"
                aria-label="Cerrar"
              >
                ×
              </button>
            </header>
          )}

          {/* Content */}
          <div className="overflow-y-auto max-h-[calc(90vh-140px)]">
            {children}
          </div>

          {/* Footer */}
          {showFooter && (
            <div className="flex justify-end space-x-4 p-4 border-t">
             
              {onSave && (
                <button
                  onClick={handleSave}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:opacity-90 transition"
                >
                  {saveButtonText}
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default GenericModal;
