import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 py-4 w-full relative">
      <div className="flex justify-center items-center px-4">
        <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4 text-center text-sm">
          <span>
            © {new Date().getFullYear()} HPMM · Sistema de Inventario · v1.0.0
          </span>
          <span className="hidden md:inline text-gray-400 dark:text-gray-500">•</span>
          <a
            href="mailto:soporte@hpmm.com"
            className="text-purple-600 dark:text-purple-400 hover:text-purple-800 dark:hover:text-purple-300 hover:underline transition-all duration-150"
          >
            soporte@hpmm.com
          </a>
        </div>
      </div>
    </footer>
  );
};
