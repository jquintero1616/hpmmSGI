// Pagination.tsx
import React from 'react';


interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({ currentPage, totalPages, onPageChange }) => {
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div className="flex justify-center items-center gap-2 mt-6">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className={`w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center rounded-full transition 
          ${currentPage === 1 ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-white text-purple-700 hover:bg-purple-100 border border-purple-200'}`}
        aria-label="Anterior"
      >
        &#8592;
      </button>
      {pages.map((page) => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          className={`w-8 h-8 flex items-center justify-center rounded-full font-semibold transition
            ${page === currentPage
              ? 'bg-purple-700 text-white shadow'
              : 'bg-white text-purple-700 hover:bg-purple-100 border border-purple-200'}`}
          aria-current={page === currentPage ? 'page' : undefined}
        >
          {page}
        </button>
      ))}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className={`w-8 h-8 flex items-center justify-center rounded-full transition 
          ${currentPage === totalPages ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-white text-purple-700 hover:bg-purple-100 border border-purple-200'}`}
        aria-label="Siguiente"
      >
        &#8594;
      </button>
    </div>
  );
};

export default Pagination;