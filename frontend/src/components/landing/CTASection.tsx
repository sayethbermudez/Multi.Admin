import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import Button from "@/components/ui/Button";
import Container from "@/components/ui/Container";

// Llamada a la acción final: incentivo a registrarse.
export default function CTASection() {
  return (
    <section className="py-20 bg-surface">
      <Container>
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary-600 to-primary-500 px-8 py-14 text-center shadow-xl">
          <div className="absolute -top-10 -right-10 w-48 h-48 rounded-full bg-white/10 blur-2xl" />
          <div className="absolute -bottom-10 -left-10 w-48 h-48 rounded-full bg-white/10 blur-2xl" />
          <div className="relative">
            <h2 className="text-3xl sm:text-4xl font-bold text-white">
              ¿Listo para optimizar tu gestión?
            </h2>
            <p className="mt-4 text-blue-100 text-lg max-w-2xl mx-auto">
              Crea tu cuenta gratis y comienza a administrar tu conjunto residencial
              de forma profesional, segura y eficiente.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Link to="/register">
                <Button
                  variante="outline"
                  tamano="lg"
                  className="bg-white text-primary-600 border-white hover:bg-blue-50"
                >
                  Regístrate Gratis <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
