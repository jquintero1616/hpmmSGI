// src/App.tsx
import { Suspense } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { routes } from "./routes/RouterConfig";
import { AuthProvider } from "./contexts/Auth.context";
import PrivateRouteValidation from "./routes/PrivateRoute";

function AppRoutes() {
  const location = useLocation();

  const renderRoute = (route: any) => {
    // Si la ruta tiene hijos (children)
    if (route.children) {
      return (
        <Route key={route.path} path={route.path} element={route.element}>
          {route.children.map((child: any) => {
            // Si la ruta hija tiene roles válidos, envuelve con PrivateRouteValidation
            if (child.valid && child.valid.roles) {
              return (
                <Route
                  key={child.path}
                  path={child.path}
                  element={
                    <PrivateRouteValidation validRoles={child.valid.roles}>
                      {child.element}
                    </PrivateRouteValidation>
                  }
                />
              );
            }
            // Si no, solo renderiza normalmente
            return (
              <Route key={child.path} path={child.path} element={child.element} />
            );
          })}
        </Route>
      );
    }
    // Para rutas sin hijos, igual verifica roles
    if (route.valid && route.valid.roles) {
      return (
        <Route
          key={route.path}
          path={route.path}
          element={
            <PrivateRouteValidation validRoles={route.valid.roles}>
              {route.element}
            </PrivateRouteValidation>
          }
        />
      );
    }
    return (
      <Route
        key={route.path}
        path={route.path}
        element={route.element}
      />
    );
  };

  return (
    <AnimatePresence mode="wait">
      <Suspense fallback={
        <div className="flex items-center justify-center h-screen bg-white">
          <div className="flex space-x-2">
            <div className="w-2.5 h-2.5 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.3s]" />
            <div className="w-2.5 h-2.5 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.15s]" />
            <div className="w-2.5 h-2.5 bg-gray-400 rounded-full animate-bounce" />
          </div>
        </div>
      }>
        <Routes location={location} key={location.pathname}>
          {routes.map(renderRoute)}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </AnimatePresence>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <AppRoutes />
      </Router>
    </AuthProvider>
  );
}
