import { useState } from "react";
import { Menu, Search, X } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import Notificaciones from "@/components/layout/Notificaciones";

export default function Topbar({ onToggleSidebar }: { onToggleSidebar: () => void }) {
  const { usuario } = useAuth();
  const [buscar, setBuscar] = useState("");

  return (
    <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-gray-200 px-4 sm:px-6 py-3 flex items-center justify-between gap-4">
      {/* Botón menú en móvil */}
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleSidebar}
          className="lg:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100"
          aria-label="Abrir menú"
        >
          <Menu className="w-5 h-5" />
        </button>
        <h2 className="text-lg font-semibold text-gray-800 hidden sm:block">Panel de Control</h2>
      </div>

      {/* Búsqueda */}
      <div className="flex-1 max-w-md relative">
        <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
        <input
          value={buscar}
          onChange={(e) => setBuscar(e.target.value)}
          placeholder="Buscar..."
          className="input pl-9"
        />
        {buscar && (
          <button
            onClick={() => setBuscar("")}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Notificaciones y perfil */}
      <div className="flex items-center gap-3">
        <Notificaciones />
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-full bg-primary-500 text-white flex items-center justify-center text-sm font-bold">
            {usuario?.nombre?.charAt(0)?.toUpperCase() || "U"}
          </div>
          <div className="hidden md:block text-right">
            <p className="text-sm font-medium text-gray-800">{usuario?.nombre}</p>
            <p className="text-xs text-gray-400">{usuario?.nombre_rol}</p>
          </div>
        </div>
      </div>
    </header>
  );
}
