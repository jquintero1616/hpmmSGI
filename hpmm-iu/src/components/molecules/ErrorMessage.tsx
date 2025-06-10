import React from 'react';

const ErrorMessage: React.FC<{ message: string }> = ({ message }) => (
  <p className="text-red-500 text-sm text-center">{message}</p>
);

export default ErrorMessage;