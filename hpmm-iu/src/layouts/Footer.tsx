  import React, { useState, useEffect } from 'react';
  import { Wifi, WifiOff} from 'lucide-react';

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
     

          {/* Copyright */}
          <span className="text-gray-500 dark:text-gray-400">
            © {new Date().getFullYear()} HPMM · SGI v1.0.0
          </span>

          {/* Soporte */}
          <a
            href="mailto:soporte@hpmm.com"
            className="flex items-center gap-1.5 text-purple-600 dark:text-purple-400 hover:text-purple-800 dark:hover:text-purple-300 transition-colors"
          >
      
          </a>
        </div>
      </footer>
    );
  };
