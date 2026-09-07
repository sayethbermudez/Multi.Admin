import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Building2, ShieldCheck, Wallet, Sparkles } from "lucide-react";
import Button from "@/components/ui/Button";

// Hero: titular bienvenida, subtítulo y CTAs a registro/login.
export default function HeroSection() {
  return (
    <section id="inicio" className="relative overflow-hidden pt-28 pb-20 bg-surface">
      {/* Fondo decorativo con gradiente */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-surface to-white" />
      <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-primary-500/10 blur-3xl" />
      <div className="absolute bottom-0 -left-24 w-96 h-96 rounded-full bg-warning/10 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 grid lg:grid-cols-2 gap-12 items-center">
        {/* Texto */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-blue-100 text-primary-600 text-xs font-semibold mb-5 shadow-sm">
            <Sparkles className="w-3.5 h-3.5" /> Plataforma todo-en-uno para copropiedades
          </span>
          <h1 className="text-4xl sm:text-5xl font-bold text-dark-100 leading-tight">
            Bienvenido a{" "}
            <span className="text-primary-500">Multi-Administrador</span>
          </h1>
          <p className="mt-5 text-lg text-gray-500 max-w-xl leading-relaxed">
            El sistema web para la administración integral de conjuntos residenciales,
            edificios y propiedades horizontales. Gestiona residentes, propiedades,
            finanzas, mantenimientos, documentos y reportes desde un solo lugar.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link to="/register">
              <Button variante="primary" tamano="lg">
                Comenzar Ahora <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
            <Link to="/login">
              <Button variante="outline" tamano="lg">
                Iniciar Sesión
              </Button>
            </Link>
          </div>
          <p className="mt-4 text-sm text-gray-400">
            ¿Ya tienes cuenta?{" "}
            <Link to="/login" className="text-primary-600 font-medium hover:underline">
              Accede aquí
            </Link>
          </p>
        </motion.div>

        {/* Ilustración / mock del dashboard */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="relative"
        >
          <div className="bg-white rounded-2xl border border-gray-200 shadow-xl p-5">
            {/* Barra superior */}
            <div className="flex items-center gap-1.5 mb-5">
              <span className="w-3 h-3 rounded-full bg-red-400" />
              <span className="w-3 h-3 rounded-full bg-amber-400" />
              <span className="w-3 h-3 rounded-full bg-emerald-400" />
              <div className="ml-4 h-7 flex-1 bg-gray-100 rounded-lg" />
            </div>
            {/* Stats */}
            <div className="grid grid-cols-3 gap-3 mb-5">
              {[
                { label: "Residentes", valor: "1.2K", color: "text-primary-500" },
                { label: "Propiedades", valor: "520", color: "text-success" },
                { label: "Pagos/mes", valor: "$3.9M", color: "text-warning" },
              ].map((s) => (
                <div key={s.label} className="bg-gray-50 border border-gray-100 rounded-xl p-4">
                  <p className={`text-2xl font-bold ${s.color}`}>{s.valor}</p>
                  <p className="text-xs text-gray-500 mt-1">{s.label}</p>
                </div>
              ))}
            </div>
            {/* Gráfica simple */}
            <div className="bg-gray-50 border border-gray-100 rounded-xl p-4">
              <p className="text-sm font-semibold text-gray-700 mb-3">Ingresos por mes</p>
              <div className="flex items-end gap-2 h-28">
                {[40, 65, 50, 80, 60, 90, 75].map((h, i) => (
                  <motion.div
                    key={i}
                    initial={{ height: 0 }}
                    animate={{ height: `${h}%` }}
                    transition={{ delay: 0.4 + i * 0.1, duration: 0.5 }}
                    className="flex-1 rounded-t-md bg-primary-500"
                  />
                ))}
              </div>
            </div>
          </div>
          {/* Insignias flotantes */}
          <div className="absolute -bottom-5 -left-5 bg-white rounded-xl border border-gray-200 shadow-lg px-4 py-3 flex items-center gap-2">
            <div className="w-9 h-9 rounded-lg bg-emerald-100 text-emerald-600 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-semibold text-gray-700">Seguro y confiable</p>
              <p className="text-[11px] text-gray-400">Datos protegidos</p>
            </div>
          </div>
          <div className="absolute -top-4 -right-3 bg-white rounded-xl border border-gray-200 shadow-lg px-4 py-3 flex items-center gap-2">
            <div className="w-9 h-9 rounded-lg bg-blue-100 text-primary-600 flex items-center justify-center">
              <Wallet className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-semibold text-gray-700">Finanzas claras</p>
              <p className="text-[11px] text-gray-400">Reportes automáticos</p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
