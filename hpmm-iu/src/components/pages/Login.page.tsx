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
  const navigate = useNavigate();
  const { authenticate } = useAuth();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validación previa
    if (!email || !password) {
      toast.warn("Por favor, ingresa tu correo y contraseña.", { position: "top-right" });
      return;
    }

    setLoading(true);
    try {
      await authenticate(email, password);
      navigate("/home", { state: { showWelcome: true } });
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        toast.error("Tus credenciales son incorrectas.", { position: "top-right" });
      } else {
        toast.error("Ocurrió un error al iniciar sesión.", { position: "top-right" });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-purple-50 to-white-100">
      <LoginFormProps>
        <div className="w-full max-w-xs mx-auto">
          
          {loading ? (
            <div className="flex justify-center items-center h-40">
              <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-purple-500"></div>
            </div>
          ) : (
            <LoginForm
              email={email}
              password={password}
              error=""
              onEmailChange={(e) => setEmail(e.target.value)}
              onPasswordChange={(e) => setPassword(e.target.value)}
              onSubmit={handleLogin}
            />
          )}
        </div>
      </LoginFormProps>
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};

export default LoginPage;
