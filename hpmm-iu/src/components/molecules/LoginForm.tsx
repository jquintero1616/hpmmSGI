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
}) => {
  const [remember, setRemember] = useState(false);
  const [initialLoad, setInitialLoad] = useState(true);

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
          placeholder="Correo electrónico"
          disabled={isLoading}
        />

        <Input
          name="password"
          type="password"
          value={password}
          onChange={onPasswordChange}
          placeholder="Contraseña"
          disabled={isLoading}
        />
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
        {isLoading ? "Iniciando sesión..." : "Iniciar sesión"}
      </Button>
    </form>
  );
};

export default LoginForm;
