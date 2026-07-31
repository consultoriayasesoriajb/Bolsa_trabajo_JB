import { Link } from "react-router-dom";
import {
  EnvelopeIcon, ShieldCheckIcon, KeyIcon,
  EyeIcon, EyeSlashIcon,
  CheckCircleIcon, XCircleIcon,
  ArrowLeftIcon,
} from "@heroicons/react/24/outline";
import { useForgotPassword } from "../hooks/useForgotPassword";

const PASOS = ["correo", "codigo", "nueva_password"];

function StepIndicator({ paso }) {
  return (
    <div className="flex items-center justify-center gap-2 mb-8">
      {PASOS.map((p, i) => {
        const idx     = PASOS.indexOf(paso);
        const done    = i < idx;
        const active  = i === idx;
        return (
          <div key={p} className="flex items-center gap-2">
            <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-black transition-colors ${
              done   ? "bg-green-500 text-white" :
              active ? "bg-[#123498] text-white" :
                       "bg-slate-200 text-slate-400"
            }`}>
              {done ? "✓" : i + 1}
            </div>
            {i < PASOS.length - 1 && (
              <div className={`w-8 h-0.5 ${i < PASOS.indexOf(paso) ? "bg-green-500" : "bg-slate-200"}`} />
            )}
          </div>
        );
      })}
    </div>
  );
}

export default function OlvideContrasena() {
  const {
    paso, setPaso,
    correo, setCorreo,
    codigo, setCodigo,
    nuevaPassword, setNuevaPassword,
    confirmarPassword, setConfirmarPassword,
    showPassword, setShowPassword,
    passwordChecks,
    errors, generalError,
    isLoading, exito,
    clearError,
    handleSubmitCorreo,
    handleSubmitCodigo,
    handleSubmitPassword,
  } = useForgotPassword();

  return (
    <div className="min-h-screen bg-[#f4f6fb] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">

        {/* Logo / volver */}
        <div className="text-center mb-6">
          <Link
            to="/login"
            className="inline-flex items-center gap-2 text-[#6b7a9f] hover:text-[#123498] text-sm font-semibold transition-colors"
          >
            <ArrowLeftIcon className="w-4 h-4" />
            Volver al inicio de sesión
          </Link>
        </div>

        <div className="bg-white rounded-2xl border border-[#e8edf5] shadow-sm p-8">

          {/* Éxito */}
          {exito ? (
            <div className="flex flex-col items-center gap-4 text-center">
              <CheckCircleIcon className="w-16 h-16 text-green-500" />
              <h2 className="text-xl font-bold text-[#1c2a52] font-heading">
                ¡Contraseña actualizada!
              </h2>
              <p className="text-sm text-[#6b7a9f]">
                Tu contraseña fue cambiada correctamente. En unos segundos te redirigiremos al inicio de sesión.
              </p>
              <Link
                to="/login"
                className="mt-2 bg-[#123498] hover:bg-[#0f2a80] text-white text-sm font-bold px-6 py-3 rounded-xl transition-colors"
              >
                Ir al login ahora
              </Link>
            </div>
          ) : (
            <>
              {/* Header */}
              <div className="text-center mb-6">
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#f2f5fc]">
                  {paso === "correo"         && <EnvelopeIcon    className="h-7 w-7 text-[#123498]" />}
                  {paso === "codigo"         && <ShieldCheckIcon className="h-7 w-7 text-[#123498]" />}
                  {paso === "nueva_password" && <KeyIcon         className="h-7 w-7 text-[#f46f0b]" />}
                </div>
                <h1 className="text-xl font-bold text-[#1c2a52] font-heading">
                  {paso === "correo"         && "¿Olvidaste tu contraseña?"}
                  {paso === "codigo"         && "Ingresa el código"}
                  {paso === "nueva_password" && "Nueva contraseña"}
                </h1>
                <p className="mt-1 text-sm text-[#6b7a9f]">
                  {paso === "correo"         && "Ingresa tu correo y te enviaremos un código de verificación."}
                  {paso === "codigo"         && `Te enviamos un código de 6 dígitos a ${correo}. Válido por 15 minutos.`}
                  {paso === "nueva_password" && "Elige una contraseña segura para tu cuenta."}
                </p>
              </div>

              <StepIndicator paso={paso} />

              {/* Error general */}
              {generalError && (
                <div className="mb-4 rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-600">
                  {generalError}
                </div>
              )}

              {/* ── PASO 1: Correo ── */}
              {paso === "correo" && (
                <form onSubmit={handleSubmitCorreo} className="flex flex-col gap-5">
                  <div>
                    <label className="mb-1.5 block text-sm font-semibold text-[#1c2a52]">
                      Correo electrónico
                    </label>
                    <div className="relative">
                      <EnvelopeIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-[#9aa3bd]" />
                      <input
                        type="email"
                        placeholder="tucorreo@ejemplo.com"
                        value={correo}
                        onChange={e => { setCorreo(e.target.value); clearError("correo"); }}
                        className={`w-full pl-10 pr-4 py-3 rounded-xl border text-sm outline-none transition focus:ring-2 ${
                          errors.correo
                            ? "border-red-400 focus:ring-red-400/20"
                            : "border-[#cdd6ea] focus:border-[#123498] focus:ring-[#123498]/20"
                        }`}
                      />
                    </div>
                    {errors.correo && <p className="mt-1.5 text-xs text-red-500">{errors.correo}</p>}
                  </div>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full rounded-xl bg-[#123498] py-3 text-sm font-bold text-white transition hover:bg-[#0f2a80] disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {isLoading ? "Enviando..." : "Enviar código"}
                  </button>
                </form>
              )}

              {/* ── PASO 2: Código ── */}
              {paso === "codigo" && (
                <form onSubmit={handleSubmitCodigo} className="flex flex-col gap-5">
                  <div>
                    <label className="mb-1.5 block text-sm font-semibold text-[#1c2a52]">
                      Código de verificación
                    </label>
                    <input
                      type="text"
                      inputMode="numeric"
                      maxLength={6}
                      placeholder="000000"
                      value={codigo}
                      onChange={e => { setCodigo(e.target.value.replace(/\D/g, "")); clearError("codigo"); }}
                      className={`w-full rounded-xl border px-4 py-3 text-center text-2xl font-bold tracking-[0.4em] text-[#1c2a52] outline-none transition focus:ring-2 ${
                        errors.codigo
                          ? "border-red-400 focus:ring-red-400/20"
                          : "border-[#cdd6ea] focus:border-[#123498] focus:ring-[#123498]/20"
                      }`}
                    />
                    {errors.codigo && <p className="mt-1.5 text-xs text-red-500">{errors.codigo}</p>}
                  </div>
                  <button
                    type="submit"
                    className="w-full rounded-xl bg-[#123498] py-3 text-sm font-bold text-white transition hover:bg-[#0f2a80]"
                  >
                    Continuar
                  </button>
                  <button
                    type="button"
                    onClick={() => setPaso("correo")}
                    className="text-center text-sm text-[#6b7a9f] hover:text-[#123498] transition"
                  >
                    ← Cambiar correo
                  </button>
                </form>
              )}

              {/* ── PASO 3: Nueva contraseña ── */}
              {paso === "nueva_password" && (
                <form onSubmit={handleSubmitPassword} className="flex flex-col gap-5">

                  {/* Nueva contraseña */}
                  <div>
                    <label className="mb-1.5 block text-sm font-semibold text-[#1c2a52]">
                      Nueva contraseña
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        placeholder="Mínimo 8 caracteres"
                        value={nuevaPassword}
                        onChange={e => { setNuevaPassword(e.target.value); clearError("nuevaPassword"); }}
                        className={`w-full rounded-xl border px-4 py-3 pr-11 text-sm outline-none transition focus:ring-2 [&::-ms-reveal]:hidden ${
                          errors.nuevaPassword
                            ? "border-red-400 focus:ring-red-400/20"
                            : "border-[#cdd6ea] focus:border-[#123498] focus:ring-[#123498]/20"
                        }`}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(v => !v)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9aa3bd] hover:text-[#1c2a52]"
                      >
                        {showPassword ? <EyeSlashIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
                      </button>
                    </div>
                    {errors.nuevaPassword && <p className="mt-1.5 text-xs text-red-500">{errors.nuevaPassword}</p>}

                    {/* Indicadores */}
                    {nuevaPassword && (
                      <ul className="mt-2 flex flex-col gap-1">
                        {[
                          { ok: passwordChecks.hasMinLength, label: "Mínimo 8 caracteres" },
                          { ok: passwordChecks.hasUppercase, label: "Al menos una mayúscula" },
                          { ok: passwordChecks.hasSymbol,    label: "Al menos un símbolo (!@#...)" },
                        ].map(({ ok, label }) => (
                          <li key={label} className={`flex items-center gap-1.5 text-xs ${ok ? "text-green-600" : "text-[#9aa3bd]"}`}>
                            {ok ? <CheckCircleIcon className="h-3.5 w-3.5" /> : <XCircleIcon className="h-3.5 w-3.5" />}
                            {label}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>

                  {/* Confirmar */}
                  <div>
                    <label className="mb-1.5 block text-sm font-semibold text-[#1c2a52]">
                      Confirmar contraseña
                    </label>
                    <input
                      type={showPassword ? "text" : "password"}
                      placeholder="Repite tu nueva contraseña"
                      value={confirmarPassword}
                      onChange={e => { setConfirmarPassword(e.target.value); clearError("confirmarPassword"); }}
                      className={`w-full rounded-xl border px-4 py-3 text-sm outline-none transition focus:ring-2 [&::-ms-reveal]:hidden ${
                        errors.confirmarPassword
                          ? "border-red-400 focus:ring-red-400/20"
                          : "border-[#cdd6ea] focus:border-[#123498] focus:ring-[#123498]/20"
                      }`}
                    />
                    {errors.confirmarPassword && <p className="mt-1.5 text-xs text-red-500">{errors.confirmarPassword}</p>}
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full rounded-xl bg-[#f46f0b] py-3 text-sm font-bold text-white transition hover:bg-[#d65f09] disabled:opacity-60 disabled:cursor-not-allowed"
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
            </>
          )}
        </div>
      </div>
    </div>
  );
}