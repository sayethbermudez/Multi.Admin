import { useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import AuthShell from "@/components/ui/AuthShell";
import Button from "@/components/ui/Button";
import { api } from "@/lib/api";

// Solicitud de recuperación de contraseña (envía el enlace por correo).
export default function Recuperar() {
  const [correo, setCorreo] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [linkRel, setLinkRel] = useState<string | null>(null);
  const [modoDemo, setModoDemo] = useState(false);
  const [error, setError] = useState("");
  const [cargando, setCargando] = useState(false);

  const enviar = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setCargando(true);
    try {
      const res = await api.post<{ mensaje: string; modo?: string; link?: string }>(
        "/recuperar-password",
        { correo },
      );
      setMensaje(res.mensaje);
      setLinkRel(res.link ?? null);
      setModoDemo(res.modo === "demo");
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

          {modoDemo && linkRel && (
            <div className="mt-4 p-4 rounded-xl bg-blue-50 border border-blue-200 text-left">
              <p className="text-xs font-semibold text-blue-700 mb-1">🔧 Modo demo (sin SMTP configurado)</p>
              <p className="text-xs text-blue-600 mb-2">
                Para probar el flujo, abre este enlace de restablecimiento:
              </p>
              <button
                type="button"
                onClick={() => linkRel && window.open(linkRel, "_blank")}
                className="w-full text-sm break-all text-left text-primary-600 font-medium underline hover:text-primary-500"
              >
                {linkRel}
              </button>
            </div>
          )}
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
