import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import LandingPage from "@/pages/LandingPage";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import Recuperar from "@/pages/Recuperar";
import RestablecerPassword from "@/pages/RestablecerPassword";
import DashboardLayout from "@/components/layout/DashboardLayout";
import Inicio from "@/pages/Dashboard/Inicio";
import Usuarios from "@/pages/Dashboard/Usuarios";
import Residentes from "@/pages/Dashboard/Residentes";
import Propiedades from "@/pages/Dashboard/Propiedades";
import Finanzas from "@/pages/Dashboard/Finanzas";
import Mantenimiento from "@/pages/Dashboard/Mantenimiento";
import Documentos from "@/pages/Dashboard/Documentos";
import Eventos from "@/pages/Dashboard/Eventos";
import ChatSesiones from "@/pages/Dashboard/ChatSesiones";
import Configuracion from "@/pages/Dashboard/Configuracion";
import { useAuth } from "@/context/AuthContext";
import { puedeVerModulo, tienePermiso } from "@/lib/permisos";

// Ruta protegida: exige sesión iniciada.
function Protegida({ children }: { children: React.ReactNode }) {
  const { token } = useAuth();
  if (!token) return <Navigate to="/login" replace />;
  return <>{children}</>;
}

/** Ruta de chat: exige el permiso chat.usar. */
function ConPermisoChat({ children }: { children: React.ReactNode }) {
  const { usuario } = useAuth();
  if (!tienePermiso(usuario, "chat.usar")) return <Navigate to="/dashboard" replace />;
  return <>{children}</>;
}

/** Ruta de configuración: exige el permiso config.ver. */
function ConPermisoConfig({ children }: { children: React.ReactNode }) {
  const { usuario } = useAuth();
  if (!tienePermiso(usuario, "config.ver")) return <Navigate to="/dashboard" replace />;
  return <>{children}</>;
}

/** Ruta protegida + permiso de módulo: si el rol del usuario no puede ver el
 *  módulo, redirige al dashboard. Esto alinea el rol con los permisos (RBAC).
 */
function ConPermiso({
  modulo,
  children,
}: {
  modulo:
    | "dashboard"
    | "usuarios"
    | "residentes"
    | "propiedades"
    | "finanzas"
    | "mantenimiento"
    | "documentos"
    | "eventos";
  children: React.ReactNode;
}) {
  const { usuario } = useAuth();
  if (!puedeVerModulo(usuario, modulo)) {
    return <Navigate to="/dashboard" replace />;
  }
  return <>{children}</>;
}

export default function App() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        {/* Rutas públicas */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/recuperar" element={<Recuperar />} />
        <Route path="/restablecer/:token" element={<RestablecerPassword />} />

        {/* Rutas protegidas del dashboard */}
        <Route
          path="/dashboard"
          element={
            <Protegida>
              <DashboardLayout />
            </Protegida>
          }
        >
          <Route index element={<ConPermiso modulo="dashboard"><Inicio /></ConPermiso>} />
          <Route path="usuarios" element={<ConPermiso modulo="usuarios"><Usuarios /></ConPermiso>} />
          <Route path="residentes" element={<ConPermiso modulo="residentes"><Residentes /></ConPermiso>} />
          <Route path="propiedades" element={<ConPermiso modulo="propiedades"><Propiedades /></ConPermiso>} />
          <Route path="finanzas" element={<ConPermiso modulo="finanzas"><Finanzas /></ConPermiso>} />
          <Route path="mantenimiento" element={<ConPermiso modulo="mantenimiento"><Mantenimiento /></ConPermiso>} />
          <Route path="documentos" element={<ConPermiso modulo="documentos"><Documentos /></ConPermiso>} />
          <Route path="eventos" element={<ConPermiso modulo="eventos"><Eventos /></ConPermiso>} />
          <Route path="chat" element={<ConPermisoChat><ChatSesiones /></ConPermisoChat>} />
          <Route path="configuracion" element={<ConPermisoConfig><Configuracion /></ConPermisoConfig>} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AnimatePresence>
  );
}
