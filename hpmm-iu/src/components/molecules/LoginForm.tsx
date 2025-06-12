import React, { FormEvent, useEffect, useState } from "react";
import Input from "../atoms/Inputs/Input";
import Button from "../atoms/Buttons/Button";
import ErrorMessage from "./ErrorMessage";

export interface LoginFormProps {
  email: string;
  password: string;
  error?: string;
  onEmailChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onPasswordChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (e: FormEvent) => void;
  onForgotPassword?: () => void;
}

const LoginForm: React.FC<LoginFormProps> = ({
  email,
  password,
  error,
  onEmailChange,
  onPasswordChange,
  onSubmit,
  onForgotPassword,
}) => {
  const [remember, setRemember] = useState(false);
  const [initialLoad, setInitialLoad] = useState(true);

  // Cargar email y contraseña guardados si existen SOLO al montar
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

  // Si el usuario cambia el email manualmente, desactiva "Recuérdame"
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
    <form onSubmit={handleSubmit} className="space-y-5">
      <Input
        name="email"
        type="email"
        value={email}
        onChange={handleEmailChange}
        placeholder="Correo electrónico"
      />

      <Input
        name="password"
        type="password"
        value={password}
        onChange={onPasswordChange}
        placeholder="Contraseña"
      />

      {/* Recuérdame arriba */}
      <div className="flex items-start">
        <label className="flex items-center text-xs">
          <input
            type="checkbox"
            checked={remember}
            onChange={() => setRemember(!remember)}
            className="mr-2 text-xs text-hpmm-morado-claro focus:ring-2 focus:ring-hpmm-morado-oscuro rounded"
          />
          Recuérdame
        </label>
      </div>

      {/* Botón de recuperar contraseña abajo */}
      <div className="flex justify-end">
        <Button
          type="button"
          variant="text"
          className="text-xs text-hpmm-morado-claro hover:underline"
          onClick={onForgotPassword}
        >
          ¿Olvidaste tu contraseña?
        </Button>
      </div>

      {error && <ErrorMessage message={error} />}

      <Button
        type="submit"
        className="w-full bg-hpmm-morado-claro text-white hover:bg-hpmm-morado-oscuro font-bold rounded focus:outline-none focus:shadow-outline"
      >
        Iniciar sesión
      </Button>
    </form>
  );
};

export default LoginForm;
