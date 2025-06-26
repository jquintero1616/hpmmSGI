// Pagination.tsx
import React from 'react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({ currentPage, totalPages, onPageChange }) => {
  if (totalPages <= 1) return null;

  const canGoBack = currentPage > 1;
  const canGoForward = currentPage < totalPages;

  const pages: (number | string)[] = [];

  // Siempre muestra la primera página
  pages.push(1);

  // Elipsis si hay más de 3 páginas antes de la actual
  if (currentPage > 3) pages.push('...');

  // Página anterior (si no es la primera)
  if (currentPage > 2) pages.push(currentPage - 1);

  // Página actual (si no es la primera ni la última)
  if (currentPage !== 1 && currentPage !== totalPages) pages.push(currentPage);

  // Página siguiente (si no es la última)
  if (currentPage < totalPages - 1) pages.push(currentPage + 1);

  // Elipsis si hay más de 2 páginas después de la actual
  if (currentPage < totalPages - 2) pages.push('...');

  // Siempre muestra la última página
  if (totalPages > 1) pages.push(totalPages);

  // Elimina duplicados y ordena
  const uniquePages = Array.from(new Set(pages)).sort((a, b) =>
    typeof a === 'number' && typeof b === 'number' ? a - b : 0
  );

  return (
    <div className="flex justify-center items-center gap-1 mt-6">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="w-8 h-8 rounded bg-white border text-purple-700 hover:bg-purple-100 disabled:bg-gray-200 disabled:text-gray-400"
        aria-label="Anterior"
      >
        &#8592;
      </button>
      {uniquePages.map((page, idx) =>
        typeof page === 'number' ? (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            className={`w-8 h-8 rounded font-semibold ${
              page === currentPage
                ? 'bg-purple-700 text-white'
                : 'bg-white text-purple-700 hover:bg-purple-100 border'
            }`}
            aria-current={page === currentPage ? 'page' : undefined}
          >
            {page}
          </button>
        ) : (
          <span key={`ellipsis-${idx}`} className="w-8 h-8 flex items-center justify-center text-purple-700 select-none">
            ...
          </span>
        )
      )}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="w-8 h-8 rounded bg-white border text-purple-700 hover:bg-purple-100 disabled:bg-gray-200 disabled:text-gray-400"
        aria-label="Siguiente"
      >
        &#8594;
      </button>
    </div>
  );
};

export default Pagination;