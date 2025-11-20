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
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { authenticate } = useAuth();

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value;
    // Si el usuario ya escribió el dominio, no lo agregues
    if (value.endsWith("@hpmm.com")) {
      setEmail(value);
    } else {
      setEmail(value.replace(/@hpmm\.com$/, ""));
    }
  };

  const handleEmailBlur = () => {
    // Al perder el foco, agrega el dominio si no está presente
    if (email && !email.endsWith("@hpmm.com")) {
      setEmail(email + "@hpmm.com");
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    let emailToUse = email;
    if (!emailToUse.endsWith("@hpmm.com")) {
      emailToUse = emailToUse + "@hpmm.com";
      setEmail(emailToUse); // Opcional: actualiza el input
    }

    if (!emailToUse || !password) {
      setError("Por favor, ingresa tu correo electronico y contraseña.");
      return;
    }

    setLoading(true);
    try {
      await authenticate(emailToUse, password);
      toast.success("¡Bienvenido!", { position: "top-right" });
      navigate("/home", { state: { showWelcome: true } });
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        setError("El correo electrónico o la contraseña que has introducido no son correctos, verifica tus credenciales e inténtalo de nuevo.");
      } else if (axios.isAxiosError(error) && error.response?.status === 400) {
        setError("Por favor, completa todos los campos requeridos.");
      } else if (axios.isAxiosError(error) && !error.response) {
        setError("No se pudo conectar con el servidor. Por favor, verifica tu conexión a internet e inténtalo de nuevo.");
      } else {
        setError("Ocurrió un error inesperado al iniciar sesión. Por favor, inténtalo de nuevo más tarde.");
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
            <img src={Logo} alt="Logo" className="mx-auto mb-6 w-40 h-30 object-contain" />
          
          </div>

          <LoginForm
            email={email}
            password={password}
            error={error}
            isLoading={loading}
            onEmailChange={handleEmailChange}
            onPasswordChange={(e) => setPassword(e.target.value)}
            onSubmit={handleLogin}
            onForgotPassword={handleForgotPassword}
            onEmailBlur={handleEmailBlur} // <-- Asegúrate de pasar esta prop
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
