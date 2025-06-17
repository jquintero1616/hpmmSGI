import React from "react";


const Login: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="bg-white-100 flex items-center justify-center min-h-screen w-full">
      <div className="bg-white rounded-xl shadow-lg p-8 max-w-xs w-full">
        
        {children}
        <p className="mt-6 text-center text-gray-500 text-sm">
        { /* AQUI PODEMOS PONER UN TEXTO ABAJO DE INICIAR SESION */ }
        </p>
      </div>
    </div>
  </div>
);

export default Login;