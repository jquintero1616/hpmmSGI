import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/use.Auth";
import axios from "axios";
import LoginForm from "../molecules/LoginForm";
import LoginFormProps from "../organisms/Login";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Logo from "../../assets/hpmm2.png";

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { authenticate } = useAuth();

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      toast.warn("Por favor, ingresa tu correo electrónico y contraseña.", { position: "top-right" });
      return;
    }

    setLoading(true);
    try {
      await authenticate(email, password);
      toast.success("¡Bienvenido!", { position: "top-right" });
      navigate("/home", { state: { showWelcome: true } });
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        toast.error("Credenciales incorrectas. Verifica tu correo y contraseña.", { position: "top-right" });
      } else if (axios.isAxiosError(error) && error.response?.status === 400) {
        toast.warn("Por favor, completa todos los campos requeridos.", { position: "top-right" });
      } else if (axios.isAxiosError(error) && !error.response) {
        toast.error("No se pudo conectar con el servidor. Verifica tu conexión a internet.", { position: "top-right" });
      } else {
        toast.error("Ocurrió un error inesperado. Inténtalo de nuevo más tarde.", { position: "top-right" });
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
          <div className="text-center mb-8">
            <img src={Logo} alt="Logo" className="mx-auto mb-4 w-40 h-30 object-contain" />
            <p className="text-sm text-gray-400">Accede a tu cuenta</p>
          </div>

          <LoginForm
            email={email}
            password={password}
            isLoading={loading}
            onEmailChange={handleEmailChange}
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
