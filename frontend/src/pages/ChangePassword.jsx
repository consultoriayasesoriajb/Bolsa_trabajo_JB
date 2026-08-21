import { useRef } from "react";
import { Link } from "react-router-dom";
import {
  ShieldCheckIcon,
  KeyIcon,
  EyeIcon,
  EyeSlashIcon,
  CheckCircleIcon,
  XCircleIcon,
  ArrowLongLeftIcon
} from "@heroicons/react/24/outline";
import { useChangePassword } from "../hooks/useChangePassword";

export default function ChangePassword() {
  const {
    paso, setPaso,
    codigo, setCodigo,
    nuevaPassword, setNuevaPassword,
    confirmarPassword, setConfirmarPassword,
    showPassword, setShowPassword,
    passwordChecks,
    errors,
    generalError,
    isLoading,
    clearError,
    handleSubmitCodigo,
    handleSubmitPassword,
  } = useChangePassword();

  const inputRefs = useRef([]);

  const handleCodeChange = (index, value) => {
    // Solo permitimos números
    if (!/^\d*$/.test(value)) return;

    // Convertimos el string actual en un arreglo de 6 posiciones
    const newCodeArray = (codigo || "").padEnd(6, "").split("");
    
    // Tomamos el último carácter ingresado (por si escriben rápido)
    newCodeArray[index] = value.slice(-1);
    
    const newCode = newCodeArray.join("").substring(0, 6);
    setCodigo(newCode);
    clearError("codigo");

    // Saltar al siguiente input si se ingresó un número y no es el último
    if (value && index < 5) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (index, e) => {
    // Retroceder al input anterior si se presiona Backspace y el actual está vacío
    if (e.key === "Backspace" && !codigo[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    // Extraer solo los números del texto pegado
    const pastedData = e.clipboardData.getData("text/plain").replace(/\D/g, "").slice(0, 6);
    if (pastedData) {
      setCodigo(pastedData);
      clearError("codigo");
      // Enfocar el siguiente input vacío, o el último si se pegaron los 6
      const nextIndex = Math.min(pastedData.length, 5);
      inputRefs.current[nextIndex].focus();
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#F9F9F9] px-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-sm border border-[#e8edf5] border-t-naranja border-t-2">

        {/* Ícono + título */}
        <div className="mb-6 flex flex-col items-center gap-3 text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#f2f5fc]">
            {paso === "codigo"
              ? <ShieldCheckIcon className="h-7 w-7 text-[#123498]" />
              : <KeyIcon className="h-7 w-7 text-azul" />
            }
          </div>
          <div>
            <h1 className="text-xl font-bold text-[#1c2a52]">
              {paso === "codigo" ? "Ingresa el código" : "Nueva contraseña"}
            </h1>
            <p className="mt-1 text-sm text-[#6b7a9f] whitespace-pre-line">
              {paso === "codigo"
                ? "Te enviamos un código de 6 dígitos a tu correo.\n Válido por 15 minutos."
                : "Elige una contraseña segura para tu cuenta."
              }
            </p>
          </div>
        </div>

        {/* Error general */}
        {generalError && (
          <div className="mb-4 rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-600">
            {generalError}
          </div>
        )}

        {/* ── PASO 1: Código ── */}
        {paso === "codigo" && (
          <form onSubmit={handleSubmitCodigo} className="flex flex-col gap-5">
            <div>
              <label className="mb-1.5 block text-sm font-semibold text-[#1c2a52]">
                Código de verificación
              </label>

              {/* Contenedor de las 6 cajitas */}
              <div className="flex gap-2 justify-between mt-4">
                {[0, 1, 2, 3, 4, 5].map((index) => (
                  <input
                    key={index}
                    ref={(el) => (inputRefs.current[index] = el)}
                    type="text"
                    inputMode="numeric"
                    maxLength={2} // Permitimos 2 internamente para que funcione el reemplazo si escriben encima
                    value={codigo[index] || ""}
                    onChange={(e) => handleCodeChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    onPaste={handlePaste}
                    className="h-12 w-10 sm:w-12 sm:h-14 rounded-xl border border-[#cdd6ea] bg-[#f8fafc] text-center text-xl sm:text-2xl font-bold text-[#1c2a52] outline-none transition focus:border-[#123498] focus:ring-2 focus:ring-[#123498]/20"
                  />
                ))}
              </div>

              {errors.codigo && (
                <p className="mt-1.5 text-xs text-red-500">{errors.codigo}</p>
              )}
            </div>

            <button
              type="submit"
              className="w-full rounded-xl bg-azul py-3 text-sm font-bold text-white transition hover:bg-[#0f2a80]"
            >
              Continuar
            </button>

            <Link
              to="/mi-perfil"
              className="flex flex-row gap-2 items-center justify-center text-center text-sm text-[#6b7a9f] hover:text-[#123498] transition"
            >
              <ArrowLongLeftIcon className="h-5 w-5" />
              Cancelar y volver al perfil
            </Link>
          </form>
        )}

        {/* ── PASO 2: Nueva contraseña ── */}
        {paso === "nueva_password" && (
          <form onSubmit={handleSubmitPassword} className="flex flex-col gap-5">

            {/* Nueva contraseña */}
            <div>
              <label className="mb-1.5 block text-sm font-semibold text-azul">
                Nueva contraseña
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Mínimo 8 caracteres"
                  value={nuevaPassword}
                  onChange={(e) => {
                    setNuevaPassword(e.target.value);
                    clearError("nuevaPassword");
                  }}
                  className="w-full rounded-xl border border-[#cdd6ea] bg-[#f8fafc] px-4 py-3 pr-11 text-sm text-[#1c2a52] outline-none transition focus:border-[#123498] focus:ring-2 focus:ring-[#123498]/20"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9aa3bd] hover:text-[#1c2a52]"
                >
                  {showPassword
                    ? <EyeSlashIcon className="h-5 w-5" />
                    : <EyeIcon className="h-5 w-5" />
                  }
                </button>
              </div>
              {errors.nuevaPassword && (
                <p className="mt-1.5 text-xs text-red-500">{errors.nuevaPassword}</p>
              )}

              {/* Indicadores de requisitos */}
              {nuevaPassword && (
                <ul className="mt-2 flex flex-col gap-1">
                  {[
                    { ok: passwordChecks.hasMinLength, label: "Mínimo 8 caracteres" },
                    { ok: passwordChecks.hasUppercase, label: "Al menos una mayúscula" },
                    { ok: passwordChecks.hasSymbol,    label: "Al menos un símbolo (!@#...)" },
                  ].map(({ ok, label }) => (
                    <li key={label} className={`flex items-center gap-1.5 text-xs ${ok ? "text-green-600" : "text-[#9aa3bd]"}`}>
                      {ok
                        ? <CheckCircleIcon className="h-3.5 w-3.5" />
                        : <XCircleIcon className="h-3.5 w-3.5" />
                      }
                      {label}
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Confirmar contraseña */}
            <div>
              <label className="mb-1.5 block text-sm font-semibold text-azul">
                Confirmar contraseña
              </label>
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Repite tu nueva contraseña"
                value={confirmarPassword}
                onChange={(e) => {
                  setConfirmarPassword(e.target.value);
                  clearError("confirmarPassword");
                }}
                className="w-full rounded-xl border border-[#cdd6ea] bg-[#f8fafc] px-4 py-3 text-sm text-[#1c2a52] outline-none transition focus:border-[#123498] focus:ring-2 focus:ring-[#123498]/20"
              />
              {errors.confirmarPassword && (
                <p className="mt-1.5 text-xs text-red-500">{errors.confirmarPassword}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full rounded-xl bg-azul py-3 text-sm font-bold text-white transition hover:bg-[#0f2a80] disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isLoading ? "Guardando..." : "Cambiar contraseña"}
            </button>

            <button
              type="button"
              onClick={() => setPaso("codigo")}
              className="text-center text-sm text-[#6b7a9f] hover:text-[#123498] transition"
            >
              ← Volver al código
            </button>
          </form>
        )}
      </div>
    </div>
  );
}