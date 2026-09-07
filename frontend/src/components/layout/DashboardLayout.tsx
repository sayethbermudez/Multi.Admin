import { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import ChatWidget from "./ChatWidget";

export default function DashboardLayout() {
  const [menuAbierto, setMenuAbierto] = useState(false);

  return (
    <div className="flex min-h-screen bg-surface">
      {/* Sidebar escritorio */}
      <div className="hidden lg:block">
        <Sidebar />
      </div>

      {/* Sidebar móvil (overlay) */}
      {menuAbierto && (
        <div className="lg:hidden fixed inset-0 z-40">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setMenuAbierto(false)}
          />
          <div className="absolute left-0 top-0 bottom-0 z-10">
            <Sidebar />
          </div>
        </div>
      )}

      {/* Contenido */}
      <div className="flex-1 flex flex-col min-w-0">
        <Topbar onToggleSidebar={() => setMenuAbierto(true)} />
        <main className="flex-1 p-4 sm:p-6">
          <Outlet />
        </main>
      </div>

      {/* Widget de chatbot */}
      <ChatWidget />
    </div>
  );
}
