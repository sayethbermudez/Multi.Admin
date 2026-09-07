import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthShell from "@/components/ui/AuthShell";
import Button from "@/components/ui/Button";
import { api } from "@/lib/api";
import type { Usuario } from "@/types";

export default function Register() {
  const navigate = useNavigate();
  const [nombre, setNombre] = useState("");
  const [telefono, setTelefono] = useState("");
  const [correo, setCorreo] = useState("");
  const [contrasena, setContrasena] = useState("");
  const [confirmar, setConfirmar] = useState("");
  const [error, setError] = useState("");
  const [exito, setExito] = useState(false);
  const [cargando, setCargando] = useState(false);

  const enviar = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    if (contrasena.length < 8) {
      setError("La contraseña debe tener al menos 8 caracteres.");
      return;
    }
    if (contrasena !== confirmar) {
      setError("Las contraseñas no coinciden.");
      return;
    }
    setCargando(true);
    try {
      await api.post<Usuario>("/register", {
        nombre,
        telefono,
        correo,
        contrasena,
        rol_id: 3, // residente por defecto
      });
      setExito(true);
      setTimeout(() => navigate("/login"), 1500);
    } catch (err) {
      const d = (err as { detail?: string }).detail;
      const m = (err as Error).message;
      setError(d || m);
    } finally {
      setCargando(false);
    }
  };

  return (
    <AuthShell
      titulo="Crear cuenta"
      subtitulo="Comienza a administrar tu copropiedad"
      footer={
        <>
          ¿Ya tienes cuenta?{" "}
          <Link to="/login" className="text-primary-600 font-medium hover:underline">
            Inicia sesión
          </Link>
        </>
      }
    >
      {exito ? (
        <div className="text-center py-8">
          <div className="text-5xl mb-3">✅</div>
          <p className="text-lg font-semibold text-gray-800">¡Cuenta creada!</p>
          <p className="text-sm text-gray-500 mt-1">Redirigiendo al inicio de sesión...</p>
        </div>
      ) : (
        <form onSubmit={enviar} className="space-y-4">
          <div>
            <label className="label">Nombre completo</label>
            <input value={nombre} onChange={(e) => setNombre(e.target.value)} className="input" required />
          </div>
          <div>
            <label className="label">Teléfono</label>
            <input value={telefono} onChange={(e) => setTelefono(e.target.value)} className="input" placeholder="3001234567" />
          </div>
          <div>
            <label className="label">Correo electrónico</label>
            <input type="email" value={correo} onChange={(e) => setCorreo(e.target.value)} className="input" required />
          </div>
          <div>
            <label className="label">Contraseña</label>
            <input type="password" value={contrasena} onChange={(e) => setContrasena(e.target.value)} className="input" placeholder="Mínimo 8 caracteres" required />
          </div>
          <div>
            <label className="label">Confirmar contraseña</label>
            <input type="password" value={confirmar} onChange={(e) => setConfirmar(e.target.value)} className="input" required />
          </div>

          {error && (
            <div className="text-sm text-danger bg-red-50 border border-red-200 rounded-lg px-3 py-2">{error}</div>
          )}

          <Button variante="primary" tamano="lg" className="w-full" disabled={cargando}>
            {cargando ? "Creando..." : "Registrarse"}
          </Button>
        </form>
      )}
    </AuthShell>
  );
}
