import { useState } from "react";
import { GoogleOAuthProvider } from '@react-oauth/google';
import GoogleLoginButton from "../components/auth/GoogleLoginButton";
import LoginForm from "../components/auth/LoginForm";
import RegisterForm from "../components/auth/RegisterForm";
import InfoPanel from "../components/auth/InfoPanel";

export default function Login() {
  const [isRegister, setIsRegister] = useState(false);

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#f4f6fb] flex items-center justify-center p-0 md:p-8">

      {/* ===== FONDO BOKEH (círculos difuminados) ===== */}
      <div className="pointer-events-none absolute -left-24 -top-32 h-105 w-105 rounded-full bg-[#f97316] opacity-45 blur-[120px]" />
      <div className="pointer-events-none absolute -right-32 -bottom-40 h-115 w-115rounded-full bg-[#2563eb] opacity-40 blur-[130px]" />
      <div className="pointer-events-none absolute right-40 -top-24 h-75 w-75 rounded-full bg-[#fbbf24] opacity-35 blur-[110px]" />

      {/* ===== CARD (con z-10 para quedar sobre el fondo) ===== */}
      <div
        key={isRegister ? "registro" : "login"}
        className="animate-fade-slide relative z-10 flex flex-col md:flex-row w-full max-w-5xl bg-white rounded-none md:rounded-[2.5rem] shadow-none md:shadow-2xl overflow-hidden min-h-screen md:min-h-0"
      >
        {/* Lado Izquierdo (Arriba en móviles): Panel Informativo */}
        <InfoPanel isRegister={isRegister} />

        {/* Lado Derecho (Abajo en móviles): Formulario */}
        <div className="w-full md:w-1/2 flex flex-col items-center justify-center p-8 lg:p-16 flex-1">
          <div className="w-full max-w-md">

            {/* ===== NUEVO: ENVOLVEMOS EL BOTÓN ===== */}
            <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
              <GoogleLoginButton />
            </GoogleOAuthProvider>

            <div className="my-6 flex items-center before:mt-0.5 before:flex-1 before:border-t before:border-gray-300 after:mt-0.5 after:flex-1 after:border-t after:border-gray-300">
              <p className="mx-4 mb-0 text-center text-sm font-semibold text-gray-500">
                O con tu correo
              </p>
            </div>

            {/* PESTAÑAS */}
            <div className="flex bg-slate-50 rounded-full p-1.5 mb-8 w-max mx-auto border border-gray-100">
              <button
                type="button"
                aria-label="Cambiar a login"
                className={`px-8 py-2.5 text-xs font-bold rounded-full transition-all ${!isRegister ? "bg-white text-azul shadow-sm" : "text-gray-500 hover:text-gray-700"}`}
                onClick={() => setIsRegister(false)}
              >
                INGRESAR
              </button>
              <button
                type="button"
                aria-label="Cambiar a registro"
                className={`px-8 py-2.5 text-xs font-bold rounded-full transition-all ${isRegister ? "bg-white text-azul shadow-sm" : "text-gray-500 hover:text-gray-700"}`}
                onClick={() => setIsRegister(true)}
              >
                REGISTRO
              </button>
            </div>

            {isRegister ? <RegisterForm /> : <LoginForm />}
          </div>
        </div>
      </div>
    </div>
  );
}