import { useState, useMemo } from "react";
import Footer from "../components/layout/Footer";
import HeroSection from "../components/home/HeroSection";
import EmpresasSection from "../components/home/EmpresasSection";
import ComoFunciona from "../components/home/ComoFunciona";
import EmpleosSection from "../components/home/EmpleosSection";
import QuienesSomosSection from "../components/home/QuienesSomosSection";
import BannerContacto from "../components/home/BannerContacto";
import PreguntasFrecuentes from "../components/home/PreguntasFrecuentes";

const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-white font-sans antialiased text-slate-800 relative">
      {/* Botón flotante scroll to top */}
      <button
        onClick={scrollToTop}
        className="fixed bottom-6 right-6 z-40 w-12 h-12 bg-[#FDB907] hover:bg-yellow-500 text-slate-900 rounded-full shadow-xl flex items-center justify-center hover:scale-105 active:scale-95 transition-all duration-200"
        title="Subir al inicio"
      >
        <svg
          className="w-5 h-5 stroke-[3px]"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M5 15l7-7 7 7"
          />
        </svg>
      </button>

      <HeroSection />
      <EmpresasSection />
      <ComoFunciona />
      <EmpleosSection />
      <QuienesSomosSection />
      <PreguntasFrecuentes />
      <BannerContacto />
    </div>
  );
}
