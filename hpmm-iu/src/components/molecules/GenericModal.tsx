// src/components/molecules/GenericModal.tsx

import React, { useEffect, useRef } from "react";
// Si usas focus-trap-react, descomenta la siguiente línea e instálalo:
// import FocusTrap from "focus-trap-react";

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
  fullScreen?: boolean; // <-- NUEVO
}

const GenericModal: React.FC<ModalProps> = ({
  children,
  isOpen,
  onClose,
  title,
  showHeader = true,
  showFooter = true,
  onSave,
  saveButtonText = "Guardar",
  fullScreen = false, // <-- NUEVO
}) => {
  const modalRef = useRef<HTMLDivElement>(null);
  // Cerrar con ESC
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  // Captura foco al abrir
  useEffect(() => {
    if (isOpen && modalRef.current) {
      modalRef.current.focus();
    }
  }, [isOpen]);

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) onClose();
  };


  const handleSave = () => {
    if (onSave) onSave();
  };

  if (!isOpen) return null;

  // Puedes envolver el modal con <FocusTrap> si lo tienes instalado
  return (
    // <FocusTrap>
    <div
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-50"
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      tabIndex={-1}
    >
      <div
        ref={modalRef}
        className="w-full h-full md:h-auto md:w-auto flex items-center justify-center"
        tabIndex={0}
      >
        <div
          className={`bg-white rounded-2xl shadow-xl flex flex-col overflow-hidden
            ${fullScreen 
              ? "w-full max-w-[98vw] h-full max-h-[98vh] m-0"
              : "w-full h-full max-w-4xl mx-2 md:mx-auto"
            }
          `}
        >
          {/* Header */}
          {showHeader && (
            <header className="bg-purple-700 h-12 px-4 flex items-center justify-between text-center rounded-t-2xl shadow-md">
              <h2
                id="modal-title"
                className="text-base font-semibold text-white truncate"
              >
                {title}
              </h2>
              <button
                onClick={onClose}
                className="text-white hover:text-gray-200 text-2xl leading-none transition-colors focus:outline-none"
                aria-label="Cerrar"
              >
                ×
              </button>
            </header>
          )}

          {/* Content */}
          <div className={`flex-1 overflow-y-auto space-y-4 max-h-[80vh] ${
            fullScreen ? "p-2 md:p-4" : "p-4 md:p-8"
          }`}>
            {children}
          </div>

          {/* Footer */}
          {showFooter && (
            <div className="flex justify-end space-x-4 pt-4 border-t border-gray-200 px-6 md:px-8 pb-6">
              
              {onSave && (
                <button
                  onClick={handleSave}
                  className="px-4 py-2 rounded-xl bg-hpmm-accent text-white hover:bg-hpmm-accent-dark transition focus:ring-2 focus:ring-hpmm-accent focus:border-transparent"
                  type="button"
                >
                  {saveButtonText}
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
    // </FocusTrap>
  );
};

export default GenericModal;
