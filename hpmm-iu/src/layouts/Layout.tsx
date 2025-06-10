// src/components/Layout.tsx
import { Outlet } from "react-router-dom";
import Header from "./Header";
import { Footer } from "./Footer";
import { Sidebar } from "./SideBar";

export default function Layout() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <div className="flex flex-1">
        {/* Sidebar fijo que ocupa toda la altura disponible */}
        <aside className="fixed top-[76px] left-0 bottom-0 z-20">
          <Sidebar />
        </aside>
        {/* Main content que se adapta al ancho del sidebar */}
        <main
          className="flex-1 overflow-auto bg-gray-50 transition-all duration-300"
          style={{ marginLeft: "var(--sidebar-width, 256px)" }}
        >
          <div className="p-4 pb-[48px]">
            <Outlet />
          </div>
        </main>
      </div>
      <Footer />
    </div>
  );
}
