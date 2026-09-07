import { motion } from "framer-motion";
import Header from "@/components/landing/Header";
import HeroSection from "@/components/landing/HeroSection";
import FeaturesSection from "@/components/landing/FeaturesSection";
import ComoFunciona from "@/components/landing/ComoFunciona";
import BenefitsSection from "@/components/landing/BenefitsSection";
import RolesSection from "@/components/landing/RolesSection";
import StatsSection from "@/components/landing/StatsSection";
import FAQ from "@/components/landing/FAQ";
import CTASection from "@/components/landing/CTASection";
import Footer from "@/components/landing/Footer";

// Carta de presentación antes del login/registro.
export default function LandingPage() {
  return (
    <div className="min-h-screen bg-surface">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        <Header />
        <HeroSection />
        <FeaturesSection />
        <ComoFunciona />
        <BenefitsSection />
        <RolesSection />
        <StatsSection />
        <FAQ />
        <CTASection />
        <Footer />
      </motion.div>
    </div>
  );
}
