// src/components/Layout.tsx
import { Outlet } from "react-router-dom";
import Header from "./Header";
import { Footer } from "./Footer";
import { Sidebar } from "./SideBar";

export default function Layout() {
  return (
    <div className="flex flex-col h-screen">
      {/* Header fijo en la parte superior */}
      <Header />
      
      {/* Contenedor principal que ocupa el resto del espacio */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar fijo que ocupa toda la altura disponible */}
        <aside className="flex-shrink-0">
          <Sidebar />
        </aside>
        
        {/* Main content que se adapta al ancho del sidebar */}
        <main className="flex-1 overflow-auto bg-gray-50">
          <Outlet />
        </main>
      </div>
      
      {/* Footer fijo en la parte inferior */}
      <Footer />
    </div>
  );
}
