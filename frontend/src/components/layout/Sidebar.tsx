import { NavLink, useNavigate } from "react-router-dom";
import { api } from "@/lib/api";
import {
  LayoutDashboard,
  Users,
  UserRound,
  Building2,
  Wallet,
  Wrench,
  FileText,
  CalendarDays,
  LogOut,
  MessagesSquare,
  Settings,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { puedeVerModulo, tienePermiso } from "@/lib/permisos";

// Ítems del menú (estilo exacto del dashboard). Cada uno declara el permiso
// (módulo) necesario para VERLO; se filtran según el rol del usuario (RBAC).
interface ItemMenu {
  label: string;
  path: string;
  icon: typeof LayoutDashboard;
  end?: boolean;
  modulo?: string;
}
const items: ItemMenu[] = [
  { label: "Dashboard", path: "/dashboard", icon: LayoutDashboard, end: true, modulo: "dashboard" as const },
  { label: "Usuarios", path: "/dashboard/usuarios", icon: Users, modulo: "usuarios" as const },
  { label: "Residentes", path: "/dashboard/residentes", icon: UserRound, modulo: "residentes" as const },
  { label: "Propiedades", path: "/dashboard/propiedades", icon: Building2, modulo: "propiedades" as const },
  { label: "Finanzas", path: "/dashboard/finanzas", icon: Wallet, modulo: "finanzas" as const },
  { label: "Mantenimiento", path: "/dashboard/mantenimiento", icon: Wrench, modulo: "mantenimiento" as const },
  { label: "Documentos", path: "/dashboard/documentos", icon: FileText, modulo: "documentos" as const },
  { label: "Eventos", path: "/dashboard/eventos", icon: CalendarDays, modulo: "eventos" as const },
];

export default function Sidebar() {
  const { usuario, logout } = useAuth();
  const navigate = useNavigate();

  // Solo se muestran los módulos para los que el rol tiene el permiso <modulo>.ver.
  const itemsVisibles: ItemMenu[] = items.filter((i) => i.modulo && puedeVerModulo(usuario, i.modulo));

  // El historial de chat solo es visible si el rol tiene el permiso chat.usar.
  if (tienePermiso(usuario, "chat.usar")) {
    itemsVisibles.push({ label: "Chat asistente", path: "/dashboard/chat", icon: MessagesSquare });
  }
  // Configuración solo es visible si el rol puede verla (config.ver).
  if (tienePermiso(usuario, "config.ver")) {
    itemsVisibles.push({ label: "Configuración", path: "/dashboard/configuracion", icon: Settings });
  }

  // Cierra sesión en el backend (revoca el token en Redis) y limpia el cliente.
  const cerrar = async () => {
    try {
      await api.post("/logout");
    } catch {
      // Siguemos igual aunque el backend no esté disponible.
    }
    logout();
    navigate("/login");
  };

  return (
    <aside className="w-64 bg-dark-100 text-white flex flex-col h-screen sticky top-0 hidden lg:flex">
      {/* Logo */}
      <div className="px-6 py-6 flex items-center gap-2 border-b border-white/10">
        <div className="w-9 h-9 rounded-lg bg-primary-500 flex items-center justify-center">
          <MessagesSquare className="w-5 h-5 text-white" />
        </div>
        <div>
          <h1 className="text-lg font-bold leading-tight">Multi-Admin</h1>
          <p className="text-[10px] text-gray-400">Gestión de copropiedades</p>
        </div>
      </div>

      {/* Navegación */}
      <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto">
        <p className="text-[11px] uppercase tracking-wider text-gray-500 px-4 mb-2">Menú</p>
        {itemsVisibles.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.end}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all duration-200 ${
                isActive
                  ? "bg-primary-500/15 text-primary-500"
                  : "text-gray-400 hover:bg-white/10 hover:text-white"
              }`
            }
          >
            <item.icon className="w-5 h-5" />
            <span className="text-sm font-medium">{item.label}</span>
          </NavLink>
        ))}
      </nav>

      {/* Usuario + logout */}
      <div className="p-4 border-t border-white/10">
        <div className="flex items-center gap-3 px-2 mb-3">
          <div className="w-9 h-9 rounded-full bg-primary-500 flex items-center justify-center text-sm font-bold">
            {usuario?.nombre?.charAt(0)?.toUpperCase() || "U"}
          </div>
          <div className="min-w-0">
            <p className="text-sm font-medium text-white truncate">{usuario?.nombre}</p>
            <p className="text-xs text-gray-400 truncate">{usuario?.correo}</p>
          </div>
        </div>
        <button
          onClick={cerrar}
          className="flex items-center gap-3 px-4 py-2.5 w-full rounded-lg text-gray-400 hover:bg-white/10 hover:text-white transition-all duration-200"
        >
          <LogOut className="w-5 h-5" />
          <span className="text-sm font-medium">Cerrar sesión</span>
        </button>
      </div>
    </aside>
  );
}
