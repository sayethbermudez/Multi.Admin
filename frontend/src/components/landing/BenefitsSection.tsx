import { motion } from "framer-motion";
import { GitMerge, Clock, TrendingUp, ShieldCheck, Users, BarChart3 } from "lucide-react";
import Container from "@/components/ui/Container";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

// Beneficios claves para el usuario administrativo.
const beneficios = [
  {
    titulo: "Centraliza tu información",
    desc: "Residentes, propiedades, pagos y documentos en un solo sistema. Adiós a las hojas de cálculo dispersas.",
    icon: GitMerge,
    color: "text-primary-600 bg-blue-50",
  },
  {
    titulo: "Ahorra tiempo y recursos",
    desc: "Automatiza la recaudación, genera recibos y reduce tareas manuales con procesos digitales.",
    icon: Clock,
    color: "text-emerald-600 bg-emerald-50",
  },
  {
    titulo: "Toma decisiones con datos",
    desc: "Reportes y gráficas en tiempo real te muestran la salud financiera de la copropiedad.",
    icon: TrendingUp,
    color: "text-warning bg-amber-50",
  },
];

export default function BenefitsSection() {
  const { ref, controls } = useScrollAnimation();

  return (
    <section id="beneficios" className="py-20 bg-surface">
      <Container>
        <motion.div ref={ref} initial="initial" animate={controls}>
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-primary-600 text-sm font-semibold uppercase tracking-wider">
              Beneficios
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-dark-100 mt-2">
              Hecho para el administrador moderno
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {beneficios.map((b, i) => (
              <motion.div
                key={b.titulo}
                initial={{ opacity: 0, y: 30 }}
                animate={controls}
                transition={{ delay: i * 0.1 }}
                className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 border-l-4 border-l-primary-500 hover:shadow-card-hover transition-all duration-200"
              >
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center mb-4 ${b.color}`}>
                  <b.icon className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-semibold text-gray-800">{b.titulo}</h3>
                <p className="text-gray-500 text-sm mt-2 leading-relaxed">{b.desc}</p>
              </motion.div>
            ))}
          </div>

          {/* Indicadores de confianza */}
          <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { icon: Users, valor: "120+", label: "Usuarios activos" },
              { icon: BarChart3, valor: "98%", label: "Recaudación" },
              { icon: ShieldCheck, valor: "24/7", label: "Disponibilidad" },
              { icon: TrendingUp, valor: "6 meses", label: "Historial" },
            ].map((s, i) => (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={controls}
                transition={{ delay: 0.2 + i * 0.1 }}
                className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 text-center"
              >
                <s.icon className="w-6 h-6 text-primary-500 mx-auto mb-2" />
                <p className="text-2xl font-bold text-dark-100">{s.valor}</p>
                <p className="text-xs text-gray-500 mt-1">{s.label}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </Container>
    </section>
  );
}
