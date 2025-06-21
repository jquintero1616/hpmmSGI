import React, { FormEvent, useEffect, useState } from "react";
import Input from "../atoms/Inputs/Input";
import Button from "../atoms/Buttons/Button";
import ErrorMessage from "./ErrorMessage";

export interface LoginFormProps {
  email: string;
  password: string;
  error?: string;
  isLoading?: boolean;
  onEmailChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onPasswordChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (e: FormEvent) => void;
  onForgotPassword?: () => void;
  onEmailBlur?: () => void; // <-- Agregado
}

const LoginForm: React.FC<LoginFormProps> = ({
  email,
  password,
  error,
  isLoading = false,
  onEmailChange,
  onPasswordChange,
  onSubmit,
  onForgotPassword,
  onEmailBlur, // <-- Agregado
}) => {
  const [remember, setRemember] = useState(false);
  const [initialLoad, setInitialLoad] = useState(true);
  const [showPassword, setShowPassword] = useState(false); // Nuevo estado

  useEffect(() => {
    if (initialLoad) {
      const savedEmail = localStorage.getItem("rememberedEmail");
      const savedPassword = localStorage.getItem("rememberedPassword");
      if (savedEmail) {
        onEmailChange({ target: { value: savedEmail } } as React.ChangeEvent<HTMLInputElement>);
        setRemember(true);
      }
      if (savedPassword) {
        onPasswordChange({ target: { value: savedPassword } } as React.ChangeEvent<HTMLInputElement>);
      }
      setInitialLoad(false);
    }
  }, [onEmailChange, onPasswordChange, initialLoad]);

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRemember(false);
    onEmailChange(e);
  };

  const handleSubmit = (e: FormEvent) => {
    if (remember) {
      localStorage.setItem("rememberedEmail", email);
      localStorage.setItem("rememberedPassword", password);
    } else {
      localStorage.removeItem("rememberedEmail");
      localStorage.removeItem("rememberedPassword");
    }
    onSubmit(e);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <Input
          name="email"
          type="email"
          value={email}
          onChange={handleEmailChange}
          onBlur={onEmailBlur} // <-- Agregado
          placeholder="Correo electrónico"
          disabled={isLoading}
        />

        <div className="relative">
          <Input
            name="password"
            type={showPassword ? "text" : "password"} // Cambia el tipo según el estado
            value={password}
            onChange={onPasswordChange}
            placeholder="Contraseña"
            disabled={isLoading}
          />
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-hpmm-morado-claro focus:outline-none"
            tabIndex={-1}
          >
            {showPassword ? (
              // Ícono de ojo cerrado
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-5 0-9-4.03-9-9 0-1.657.403-3.216 1.125-4.575m2.122-2.122A8.963 8.963 0 0112 3c5 0 9 4.03 9 9 0 1.657-.403 3.216-1.125 4.575m-2.122 2.122A8.963 8.963 0 0112 21c-2.21 0-4.253-.72-5.875-1.825M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3l18 18" />
              </svg>
            ) : (
              // Ícono de ojo abierto
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-.274.857-.687 1.664-1.212 2.393M15.54 17.44A8.963 8.963 0 0112 19c-2.21 0-4.253-.72-5.875-1.825" />
              </svg>
            )}
          </button>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <label className="flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={remember}
            onChange={() => setRemember(!remember)}
            disabled={isLoading}
            className="w-4 h-4 text-hpmm-morado-claro bg-gray-100 border-gray-300 rounded focus:ring-hpmm-morado-claro focus:ring-2"
          />
          <span className="ml-2 text-sm text-gray-600">Recuérdame</span>
        </label>

        {onForgotPassword && (
          <button
            type="button"
            onClick={onForgotPassword}
            disabled={isLoading}
            className="text-xs text-gray-400 hover:text-hpmm-morado-claro transition-colors duration-200 underline-offset-4 hover:underline disabled:opacity-50"
          >
            ¿Olvidaste tu contraseña?
          </button>
        )}
      </div>

      {error && <ErrorMessage message={error} />}

      <Button
        type="submit"
        disabled={isLoading}
        className="w-full py-3 bg-hpmm-morado-claro text-white hover:bg-hpmm-morado-oscuro disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 rounded-lg"
      >
        {isLoading ? (
          <span className="flex items-center justify-center">
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Cargando...
          </span>
        ) : (
          "Ingresar"
        )}
      </Button>
    </form>
  );
};

export default LoginForm;
