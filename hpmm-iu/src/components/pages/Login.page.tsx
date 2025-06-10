import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/use.Auth";
import axios from "axios";
import LoginForm from "../molecules/LoginForm";
import LoginFormProps from "../organisms/Login";

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { authenticate } = useAuth();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(""); // Limpia el error anterior

    // Validación previa
    if (!email || !password) {
      setLoginError("Debes ingresar correo y contraseña.");
      return;
    }

    setLoading(true);
    try {
      await authenticate(email, password);
      navigate("/home");
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        setLoginError("* Credenciales incorrectas.");
      } else {
        setLoginError("* Error al iniciar sesión.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-purple-50 to-white-100">
      <LoginFormProps>
        <div className="w-full max-w-xs mx-auto">
          {/* Mensaje de error estático, sin animación */}
          {loginError && (
            <div className="mb-4 px-4 py-3 rounded-lg bg-red-100 border border-red-300 text-red-700 text-sm">
              {loginError}
            </div>
          )}

          {loading ? (
            <div className="flex justify-center items-center h-40">
              <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-purple-500"></div>
            </div>
          ) : (
            <LoginForm
              email={email}
              password={password}
              error="" // Ya mostramos el error arriba
              onEmailChange={(e) => setEmail(e.target.value)}
              onPasswordChange={(e) => setPassword(e.target.value)}
              onSubmit={handleLogin}
            />
          )}
        </div>
      </LoginFormProps>
    </div>
  );
};

export default LoginPage;
