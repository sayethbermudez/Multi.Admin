import { motion } from "framer-motion";
import {
  Users,
  LayoutDashboard,
  FileText,
  Wallet,
  Wrench,
  BarChart3,
  Bell,
  Building2,
} from "lucide-react";
import Container from "@/components/ui/Container";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { staggerContainer, childrenItem } from "@/utils/animations";

// Funcionalidades principales del sistema.
const features = [
  {
    titulo: "Gestión de Usuarios",
    desc: "Controla roles y permisos: administrador, residente, tesorería y seguridad.",
    icon: Users,
  },
  {
    titulo: "Dashboard Inteligente",
    desc: "Indicadores en tiempo real de la copropiedad en un panel claro y moderno.",
    icon: LayoutDashboard,
  },
  {
    titulo: "Finanzas Automatizadas",
    desc: "Cuotas, pagos, recaudación y control de mora. Reportes financieros listos.",
    icon: Wallet,
  },
  {
    titulo: "Reportes y Gráficas",
    desc: "Visualiza ingresos, gastos y estados con gráficas generadas automáticamente.",
    icon: BarChart3,
  },
  {
    titulo: "Mantenimientos",
    desc: "Registra solicitudes, asigna tareas y da seguimiento a su resolución.",
    icon: Wrench,
  },
  {
    titulo: "Gestión Documental",
    desc: "Centraliza reglamentos, actas, manuales y documentos de la copropiedad.",
    icon: FileText,
  },
  {
    titulo: "Notificaciones",
    desc: "Mantente informado de pagos, eventos y novedades del conjunto.",
    icon: Bell,
  },
  {
    titulo: "Propiedades y Residentes",
    desc: "Administra bloques, torres, apartamentos y el perfil de cada residente.",
    icon: Building2,
  },
];

export default function FeaturesSection() {
  const { ref, controls } = useScrollAnimation();

  return (
    <section id="caracteristicas" className="py-20 bg-white">
      <Container>
        <motion.div
          ref={ref}
          initial="initial"
          animate={controls}
          variants={staggerContainer}
        >
          <motion.div variants={childrenItem} className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-primary-600 text-sm font-semibold uppercase tracking-wider">
              Características
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-dark-100 mt-2">
              Todo lo que tu conjunto necesita
            </h2>
            <p className="mt-4 text-gray-500 text-lg">
              Centraliza la administración de tu copropiedad con herramientas pensadas
              para el trabajo diario del administrador.
            </p>
          </motion.div>

          <motion.div variants={childrenItem} className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {features.map((f, i) => (
              <motion.div
                key={f.titulo}
                variants={childrenItem}
                whileHover={{ y: -8, transition: { duration: 0.2 } }}
                className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-card-hover transition-all duration-200"
              >
                <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center text-primary-600 mb-4">
                  <f.icon className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-semibold text-gray-800">{f.titulo}</h3>
                <p className="text-gray-500 text-sm mt-2 leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </Container>
    </section>
  );
}
