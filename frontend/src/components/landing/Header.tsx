import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { MessagesSquare, Menu, X } from "lucide-react";
import Button from "@/components/ui/Button";

// Enlaces de navegación de la landing.
const nav = [
  { label: "Inicio", href: "#inicio" },
  { label: "Características", href: "#caracteristicas" },
  { label: "Cómo funciona", href: "#como-funciona" },
  { label: "Roles", href: "#roles" },
  { label: "FAQ", href: "#faq" },
];

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [abierto, setAbierto] = useState(false);

  // Detectar scroll para aplicar el efecto de blur.
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <motion.header
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6 }}
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
        scrolled ? "bg-white/80 backdrop-blur-md shadow-sm border-b border-gray-200" : "bg-transparent"
      }`}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-lg bg-primary-500 flex items-center justify-center">
              <MessagesSquare className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="text-lg font-bold text-dark-100 leading-tight block">
                Multi-Administrador
              </span>
              <span className="hidden sm:block text-[10px] text-gray-500">
                Gestión de copropiedades
              </span>
            </div>
          </Link>

          {/* Navegación central */}
          <nav className="hidden md:flex items-center gap-1">
            {nav.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-primary-600 rounded-lg hover:bg-gray-100 transition"
              >
                {item.label}
              </a>
            ))}
          </nav>

          {/* Acciones */}
          <div className="hidden md:flex items-center gap-2">
            <Link to="/login">
              <Button variante="ghost" tamano="sm">
                Iniciar Sesión
              </Button>
            </Link>
            <Link to="/register">
              <Button variante="primary" tamano="sm">
                Registrarse
              </Button>
            </Link>
          </div>

          {/* Botón menú móvil */}
          <button
            className="md:hidden p-2 rounded-lg text-gray-700 hover:bg-gray-100"
            onClick={() => setAbierto((v) => !v)}
            aria-label="Menú"
          >
            {abierto ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Menú móvil */}
      {abierto && (
        <div className="md:hidden bg-white border-t border-gray-200 shadow-lg">
          <div className="px-4 py-4 space-y-1">
            {nav.map((item) => (
              <a
                key={item.href}
                href={item.href}
                onClick={() => setAbierto(false)}
                className="block px-4 py-2.5 text-sm font-medium text-gray-700 rounded-lg hover:bg-gray-100"
              >
                {item.label}
              </a>
            ))}
            <div className="pt-3 grid grid-cols-2 gap-2">
              <Link to="/login">
                <Button variante="outline" tamano="sm" className="w-full">
                  Iniciar Sesión
                </Button>
              </Link>
              <Link to="/register">
                <Button variante="primary" tamano="sm" className="w-full">
                  Registrarse
                </Button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </motion.header>
  );
}
