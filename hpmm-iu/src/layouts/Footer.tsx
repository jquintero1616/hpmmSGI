import React, { useState, useEffect } from 'react';
import { Wifi, WifiOff, Mail } from 'lucide-react';

export const Footer: React.FC = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return (
    <footer className="bg-gray-100 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 py-3 w-full">
      <div className="flex justify-between items-center px-4 text-xs sm:text-sm">
        {/* Indicador de conexión */}
        <div 
          className={`flex items-center gap-1.5 px-2 py-1 rounded-full ${
            isOnline 
              ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400' 
              : 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400'
          }`}
          title={isOnline ? 'Conectado' : 'Sin conexión'}
        >
          {isOnline ? <Wifi className="w-3.5 h-3.5" /> : <WifiOff className="w-3.5 h-3.5" />}
          <span className="hidden sm:inline">{isOnline ? 'Conectado' : 'Sin conexión'}</span>
        </div>

        {/* Copyright */}
        <span className="text-gray-500 dark:text-gray-400">
          © {new Date().getFullYear()} HPMM · SGI v1.0.0
        </span>

        {/* Soporte */}
        <a
          href="mailto:soporte@hpmm.com"
          className="flex items-center gap-1.5 text-purple-600 dark:text-purple-400 hover:text-purple-800 dark:hover:text-purple-300 transition-colors"
        >
          <Mail className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Soporte</span>
        </a>
      </div>
    </footer>
  );
};
