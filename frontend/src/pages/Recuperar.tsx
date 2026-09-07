import { useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import AuthShell from "@/components/ui/AuthShell";
import Button from "@/components/ui/Button";
import { api } from "@/lib/api";

// Solicitud de recuperación de contraseña (envía el enlace por correo).
export default function Recuperar() {
  const [correo, setCorreo] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [error, setError] = useState("");
  const [cargando, setCargando] = useState(false);

  const enviar = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setCargando(true);
    try {
      const res = await api.post<{ mensaje: string }>(
        "/recuperar-password",
        { correo },
      );
      setMensaje(res.mensaje);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setCargando(false);
    }
  };

  return (
    <AuthShell
      titulo="Recuperar contraseña"
      subtitulo="Te enviaremos un enlace para restablecerla"
      footer={<Link to="/login" className="text-primary-600 font-medium hover:underline">Volver a iniciar sesión</Link>}
    >
      {mensaje ? (
        <div className="text-center py-6">
          <div className="text-5xl mb-3">📬</div>
          <p className="text-sm text-gray-600">{mensaje}</p>
          <p className="text-xs text-gray-400 mt-2">Revisa tu bandeja de entrada (y el spam).</p>

        </div>
      ) : (
        <form onSubmit={enviar} className="space-y-4">
          <div>
            <label className="label">Correo electrónico</label>
            <input type="email" value={correo} onChange={(e) => setCorreo(e.target.value)} className="input" placeholder="tu@correo.com" required />
          </div>
          {error && <div className="text-sm text-danger bg-red-50 border border-red-200 rounded-lg px-3 py-2">{error}</div>}
          <Button variante="primary" tamano="lg" className="w-full" disabled={cargando}>
            {cargando ? "Enviando..." : "Enviar enlace"}
          </Button>
        </form>
      )}
    </AuthShell>
  );
}
