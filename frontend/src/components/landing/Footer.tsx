import { Link } from "react-router-dom";
import { MessagesSquare } from "lucide-react";
import Container from "@/components/ui/Container";

// Pie de página: logo, descripción corta, enlaces y créditos.
export default function Footer() {
  const anio = new Date().getFullYear();

  return (
    <footer className="bg-white border-t border-gray-200">
      <Container className="py-12">
        <div className="grid gap-8 md:grid-cols-3">
          {/* Marca */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-lg bg-primary-500 flex items-center justify-center">
                <MessagesSquare className="w-4 h-4 text-white" />
              </div>
              <span className="text-lg font-bold text-dark-100">Multi-Administrador</span>
            </div>
            <p className="text-sm text-gray-500 max-w-xs">
              Sistema web para la administración integral de conjuntos residenciales
              y propiedades horizontales.
            </p>
          </div>

          {/* Enlaces */}
          <div>
            <h4 className="text-sm font-semibold text-gray-800 mb-3">Empresa</h4>
            <ul className="space-y-2 text-sm text-gray-500">
              <li><Link to="/" className="hover:text-primary-600">Inicio</Link></li>
              <li><Link to="/login" className="hover:text-primary-600">Iniciar Sesión</Link></li>
              <li><Link to="/register" className="hover:text-primary-600">Registrarse</Link></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-sm font-semibold text-gray-800 mb-3">Información</h4>
            <ul className="space-y-2 text-sm text-gray-500">
              <li><span className="cursor-default">Políticas de privacidad</span></li>
              <li><span className="cursor-default">Términos y condiciones</span></li>
              <li><span className="cursor-default">Soporte y ayuda</span></li>
            </ul>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-gray-100 text-center text-sm text-gray-400">
          © {anio} Multi-Administrador · Desarrollado con React, FastAPI y PostgreSQL.
          Proyecto académico.
        </div>
      </Container>
    </footer>
  );
}
