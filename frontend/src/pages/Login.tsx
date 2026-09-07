import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthShell from "@/components/ui/AuthShell";
import Button from "@/components/ui/Button";
import { useAuth } from "@/context/AuthContext";

export default function Login() {
  const { login, cargando } = useAuth();
  const navigate = useNavigate();
  const [correo, setCorreo] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const enviar = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      await login(correo, password);
      navigate("/dashboard");
    } catch (err) {
      const m = (err as Error).message;
      setError(m.includes("incorrect") ? "Correo o contraseña incorrectos." : m);
    }
  };

  return (
    <AuthShell
      titulo="Iniciar Sesión"
      subtitulo="Accede a tu panel de administración"
      footer={
        <>
          ¿No tienes cuenta?{" "}
          <Link to="/register" className="text-primary-600 font-medium hover:underline">
            Regístrate
          </Link>
        </>
      }
    >
      <form onSubmit={enviar} className="space-y-4">
        <div>
          <label className="label">Correo electrónico</label>
          <input
            type="email"
            value={correo}
            onChange={(e) => setCorreo(e.target.value)}
            className="input"
            placeholder="tu@correo.com"
            required
          />
        </div>
        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="label mb-0">Contraseña</label>
            <Link to="/recuperar" className="text-xs text-gray-400 hover:text-primary-600">
              ¿Olvidaste tu contraseña?
            </Link>
          </div>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="input"
            placeholder="••••••••"
            required
          />
        </div>

        {error && (
          <div className="text-sm text-danger bg-red-50 border border-red-200 rounded-lg px-3 py-2">
            {error}
          </div>
        )}

        <Button variante="primary" tamano="lg" className="w-full" disabled={cargando}>
          {cargando ? "Entrando..." : "Ingresar"}
        </Button>

        <p className="text-xs text-gray-400 text-center">
          Demo: admin@multiadmin.com / Admin2026!
        </p>
      </form>
    </AuthShell>
  );
}
