import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/use.Auth";
import axios from "axios";
import LoginForm from "../molecules/LoginForm";
import LoginFormProps from "../organisms/Login";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { authenticate } = useAuth();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Por favor, ingresa tu correo y contraseña.");
      return;
    }

    setLoading(true);
    try {
      await authenticate(email, password);
      toast.success("¡Bienvenido!", { position: "top-right" });
      navigate("/home", { state: { showWelcome: true } });
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        setError("Tus credenciales son incorrectas.");
      } else {
        setError("Ocurrió un error al iniciar sesión.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = () => {
    navigate("/forgot-password");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 via-white to-purple-50">
      <LoginFormProps>
        <div className="w-full max-w-md mx-auto p-6">
          {/* Logo/Imagen circular arriba */}
          

          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-gray-800 mb-2">
              Bienvenido
            </h1>
            <p className="text-gray-600 text-sm">Inicia sesión</p>
          </div>

          <LoginForm
            email={email}
            password={password}
            error={error}
            isLoading={loading}
            onEmailChange={(e) => setEmail(e.target.value)}
            onPasswordChange={(e) => setPassword(e.target.value)}
            onSubmit={handleLogin}
            onForgotPassword={handleForgotPassword}
          />
        </div>
      </LoginFormProps>

      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </div>
  );
};

export default LoginPage;
