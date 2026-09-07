import { motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";

// Tarjeta de estadística idéntica al dashboard ("Customer / Orders / Currency").
export default function StatCard({
  titulo,
  valor,
  icono: Icono,
  color = "primary",
  indicador,
  subida = true,
}: {
  titulo: string;
  valor: string;
  icono: LucideIcon;
  color?: "primary" | "success" | "warning" | "danger" | "purple";
  indicador?: string;
  subida?: boolean;
}) {
  const colores: Record<string, { bg: string; text: string }> = {
    primary: { bg: "bg-blue-50", text: "text-primary-600" },
    success: { bg: "bg-emerald-50", text: "text-success" },
    warning: { bg: "bg-amber-50", text: "text-warning" },
    danger: { bg: "bg-red-50", text: "text-danger" },
    purple: { bg: "bg-purple-50", text: "text-purple-600" },
  };
  const c = colores[color];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="card p-5"
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-500 font-medium">{titulo}</p>
          <p className="text-2xl font-bold text-gray-800 mt-1">{valor}</p>
        </div>
        <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${c.bg} ${c.text}`}>
          <Icono className="w-6 h-6" />
        </div>
      </div>
      {indicador && (
        <p className={`mt-3 text-xs flex items-center gap-1 ${subida ? "text-success" : "text-danger"}`}>
          <span>●</span> {indicador}
        </p>
      )}
    </motion.div>
  );
}
