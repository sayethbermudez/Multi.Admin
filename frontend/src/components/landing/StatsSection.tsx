import { motion } from "framer-motion";
import Container from "@/components/ui/Container";
import { useCountUp } from "@/hooks/useCountUp";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

// Estadísticas con animación de conteo.
const stats = [
  { label: "Usuarios", valor: 120, sufijo: "+" },
  { label: "Propiedades", valor: 520, sufijo: "+" },
  { label: "Pagos procesados", valor: 3600, sufijo: "+" },
  { label: "Documentos", valor: 240, sufijo: "+" },
];

function StatCard({ label, valor, sufijo }: { label: string; valor: number; sufijo: string }) {
  const { ref, valor: v } = useCountUp(valor);
  return (
    <span ref={ref} className="block text-center">
      <p className="text-4xl font-bold text-dark-100">
        {v.toLocaleString("es-CO")}
        <span className="text-primary-500">{sufijo}</span>
      </p>
      <p className="text-sm text-gray-500 mt-1">{label}</p>
    </span>
  );
}

export default function StatsSection() {
  const { ref, controls } = useScrollAnimation();

  return (
    <section id="estadisticas" className="py-16 bg-dark-100">
      <Container>
        <motion.div
          ref={ref}
          initial="initial"
          animate={controls}
          className="grid grid-cols-2 lg:grid-cols-4 gap-8"
        >
          {stats.map((s) => (
            <StatCard key={s.label} {...s} />
          ))}
        </motion.div>
      </Container>
    </section>
  );
}
