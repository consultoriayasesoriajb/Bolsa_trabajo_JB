import { useLoginForm } from "../../hooks/useLoginForm";
import { Link } from "react-router-dom";
import {
  EnvelopeIcon,
  LockClosedIcon,
  EyeIcon,
  EyeSlashIcon,
} from "@heroicons/react/24/outline";

export default function LoginForm() {
  const {
    formData,
    errors,
    generalError,
    showPassword,
    setShowPassword,
    rememberMe,
    setRememberMe,
    handleChange,
    handleSubmit,
  } = useLoginForm();

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5" noValidate>
      {/* Mensaje de Error (Fondo Rojo) - Solo para el Login */}
      {generalError && (
        <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg border border-red-200">
          {generalError}
        </div>
      )}

      {/* CAMPO DE CORREO */}
      <div className="flex flex-col gap-1.5">
        <label className="text-[10px] font-bold text-gray-600 uppercase tracking-wider">
          Correo eléctronico
        </label>
        <div className="relative flex items-center">
          <EnvelopeIcon className="absolute left-4 w-5 h-5 text-azul" />
          <input
            type="email"
            name="correo"
            aria-label="Ingresa tu correo"
            value={formData.correo}
            placeholder="Ingresa tu usuario o correo"
            className={`w-full pl-12 pr-4 py-3 border rounded-xl text-sm focus:outline-none focus:ring-1 ${errors.correo ? "border-red-500 focus:ring-red-500" : "border-gray-200 focus:border-azul"}`}
            onChange={handleChange}
          />
        </div>
        {errors.correo && (
          <p className="text-red-500 text-xs mt-1">{errors.correo}</p>
        )}
      </div>

      {/* CAMPO DE CONTRASEÑA */}
      <div className="flex flex-col gap-1.5">
        <label className="text-[10px] font-bold text-gray-600 uppercase tracking-wider">
          Contraseña
        </label>
        <div className="relative flex items-center">
          {/* Ícono de Candado */}
          <LockClosedIcon className="absolute left-4 w-5 h-5 text-azul" />
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            aria-label="Ingresa tu contraseña"
            placeholder="Mínimo 8 caracteres"
            className={`w-full pl-12 pr-10 py-3 border rounded-xl text-sm focus:outline-none focus:ring-1 [&::-ms-reveal]:hidden [&::-webkit-credentials-auto-fill-button]:hidden ${errors.password ? "border-red-500 focus:ring-red-500" : "border-gray-200 focus:border-azul"}`}
            onChange={handleChange}
          />

          {/* Ícono de Ojo */}
          <button
            type="button"
            aria-label={
              showPassword ? "Ocultar contraseña" : "Mostrar contraseña"
            }
            onClick={() => setShowPassword(!showPassword)}
            className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-500 hover:text-gray-600"
          >
            {showPassword ? (
              <EyeSlashIcon className="w-5 h-5" />
            ) : (
              <EyeIcon className="w-5 h-5" />
            )}
          </button>
        </div>
        {errors.password && (
          <p className="text-red-500 text-xs mt-1">{errors.password}</p>
        )}
      </div>

      {/* ENLACE: Olvidé mi contraseña */}
      <div className="flex justify-end">
        <Link
          to="/olvide-contrasena"
          className="text-xs text-[#123498] hover:underline font-semibold"
        >
          ¿Olvidaste tu contraseña?
        </Link>
      </div>

      {/* RECUÉRDAME */}
      <div className="flex items-center justify-between">
        <label className="flex items-center gap-2 cursor-pointer select-none">
          <div
            onClick={() => setRememberMe((v) => !v)}
            className={`h-4 w-4 rounded border-2 flex items-center justify-center transition-colors ${
              rememberMe
                ? "bg-azul border-azul"
                : "bg-white border-gray-300 hover:border-azul"
            }`}
          >
            {rememberMe && (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="white"
                strokeWidth={3}
                className="h-2.5 w-2.5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4.5 12.75l6 6 9-13.5"
                />
              </svg>
            )}
          </div>
          <span className="text-xs text-gray-500">Recuérdame</span>
        </label>
      </div>

      <button
        type="submit"
        aria-label="Ingresar al sistema"
        className="w-full bg-naranja hover:bg-orange-600 text-white font-bold py-3 rounded-lg mt-4 transition-colors"
      >
        Ingresar al sistema
      </button>
    </form>
  );
}
