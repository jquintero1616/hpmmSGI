import React, { ReactNode } from 'react';

export const Icon: React.FC<{ children: ReactNode }> = ({ children }) => (
  <span className="h-5 w-5 text-gray-600 flex-shrink-0">
    {children}
  </span>
);
