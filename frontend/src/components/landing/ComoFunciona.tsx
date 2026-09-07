import { motion } from "framer-motion";
import { UserPlus, Settings2, Workflow, LineChart } from "lucide-react";
import Container from "@/components/ui/Container";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { staggerContainer, childrenItem } from "@/utils/animations";

// Cómo funciona el sistema en 4 pasos.
const pasos = [
  {
    numero: "01",
    titulo: "Crea tu cuenta",
    desc: "Regístrate como administrador en menos de un minuto. Define el rol de cada usuario del conjunto.",
    icon: UserPlus,
  },
  {
    numero: "02",
    titulo: "Configura tu conjunto",
    desc: "Registra bloques, torres, apartamentos, residentes, conceptos de cobro y cronogramas de pago.",
    icon: Settings2,
  },
  {
    numero: "03",
    titulo: "Gestiona el día a día",
    desc: "Registra pagos, mantenimientos, documentos y eventos. El sistema centraliza toda la información.",
    icon: Workflow,
  },
  {
    numero: "04",
    titulo: "Reporta y decide",
    desc: "Consulta dashboard, finanzas y gráficas en tiempo real para tomar decisiones informadas.",
    icon: LineChart,
  },
];

export default function ComoFunciona() {
  const { ref, controls } = useScrollAnimation();

  return (
    <section id="como-funciona" className="py-20 bg-white">
      <Container>
        <motion.div
          ref={ref}
          initial="initial"
          animate={controls}
          variants={staggerContainer}
        >
          <motion.div variants={childrenItem} className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-primary-600 text-sm font-semibold uppercase tracking-wider">
              Cómo funciona
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-dark-100 mt-2">
              Empieza a administrar en 4 pasos
            </h2>
            <p className="mt-4 text-gray-500 text-lg">
              Un proceso simple que te permite tener tu copropiedad funcionando en minutos.
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {pasos.map((p, i) => (
              <motion.div
                key={p.numero}
                variants={childrenItem}
                className="relative bg-surface rounded-xl border border-gray-200 p-6 hover:shadow-card-hover transition-all duration-200"
              >
                <span className="text-5xl font-bold text-blue-50 absolute top-4 right-5 select-none">
                  {p.numero}
                </span>
                <div className="w-12 h-12 bg-primary-500/10 rounded-lg flex items-center justify-center text-primary-600 mb-4">
                  <p.icon className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-semibold text-gray-800">{p.titulo}</h3>
                <p className="text-gray-500 text-sm mt-2 leading-relaxed">{p.desc}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </Container>
    </section>
  );
}
