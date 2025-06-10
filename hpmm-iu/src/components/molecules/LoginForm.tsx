import React, { FormEvent } from 'react';
import Input from '../atoms/Inputs/Input';
import Button from '../atoms/Buttons/Button';
import ErrorMessage from './ErrorMessage';


export interface LoginFormProps {
  email: string;
  password: string;
  error?: string;
  onEmailChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onPasswordChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (e: FormEvent) => void;
}

const LoginForm: React.FC<LoginFormProps> = ({
  email,
  password,
  error,
  onEmailChange,
  onPasswordChange,
  onSubmit,
}) => (
  
  <form onSubmit={onSubmit} className="space-y-5">
    <Input
      name="email"
      type="email"
      value={email}
      onChange={onEmailChange}
      placeholder="Correo electrónico"
    />

    <Input
      name="password"
      type="password"
      value={password}
      onChange={onPasswordChange}
      placeholder="Contraseña"
    />

    {error && <ErrorMessage message={error} />}

    <Button
      type="submit"
      className="w-full bg-blue-600 text-white hover:bg-purple-700"
    >
      Iniciar sesión
    </Button>
  </form>
);

export default LoginForm;