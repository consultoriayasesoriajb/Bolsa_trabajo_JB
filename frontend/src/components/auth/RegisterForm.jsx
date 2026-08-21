import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { authService } from "../../services/authService";
import {
  UserIcon,
  EnvelopeIcon,
  LockClosedIcon,
  EyeIcon,
  EyeSlashIcon,
  CheckCircleIcon,
} from "@heroicons/react/24/outline";

export default function RegisterForm() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [generalError, setGeneralError] = useState("");
  const [errors, setErrors] = useState({});
  const [aceptaTerminos, setAceptaTerminos] = useState(false);
  const [formData, setFormData] = useState({
    nombre: "",
    correo: "",
    password: "",
    cv: null,
  });

  const hasMinLength = formData.password.length >= 8;
  const hasUppercase = /[A-Z]/.test(formData.password);
  const hasSymbol = /[!@#$%^&*.,_\-]/.test(formData.password);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData({ ...formData, [name]: files ? files[0] : value });
    if (errors[name]) setErrors({ ...errors, [name]: null });
  };

  const validateForm = () => {
    let newErrors = {};
    let isValid = true;

    if (!formData.nombre.trim()) {
      newErrors.nombre = "El nombre es obligatorio.";
      isValid = false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.correo) {
      newErrors.correo = "El correo es obligatorio.";
      isValid = false;
    } else if (!emailRegex.test(formData.correo)) {
      newErrors.correo = "Ingresa un correo válido.";
      isValid = false;
    }

    const pwdRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*.,_\-]).{8,}$/;
    if (!formData.password) {
      newErrors.password = "La contraseña es obligatoria.";
      isValid = false;
    } else if (!pwdRegex.test(formData.password)) {
      newErrors.password = "La contraseña no cumple con los requisitos.";
      isValid = false;
    }

    if (!aceptaTerminos) {
      newErrors.terminos = "Debes aceptar los términos y condiciones.";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isLoading) return;
    setGeneralError("");
    setSuccessMessage("");
    if (validateForm()) {
      setIsLoading(true);
      try {
        const response = await authService.register({
          nombre_completo: formData.nombre,
          correo: formData.correo,
          password: formData.password,
        });
        if (response.success) {
          navigate("/revisa-tu-correo");
          setFormData({ nombre: "", correo: "", password: "", cv: null });
          setAceptaTerminos(false);
        }
      } catch (error) {
        setGeneralError(error.message);
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5" noValidate>
      {generalError && (
        <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg border border-red-200">
          {generalError}
        </div>
      )}

      {/* NOMBRE */}
      <div className="flex flex-col gap-1.5">
        <label className="text-[10px] font-bold text-gray-600 uppercase tracking-wider">
          Nombre completo
        </label>
        <div className="relative flex items-center">
          <UserIcon className="absolute left-4 w-5 h-5 text-azul" />
          <input
            type="text"
            name="nombre"
            value={formData.nombre}
            placeholder="Ingresa tu nombre completo"
            className={`w-full pl-12 pr-4 py-3 border rounded-xl text-sm focus:outline-none focus:ring-1 ${errors.nombre ? "border-red-500 focus:ring-red-500" : "border-gray-200 focus:border-azul"}`}
            onChange={handleChange}
          />
        </div>
        {errors.nombre && (
          <p className="text-red-500 text-xs mt-1">{errors.nombre}</p>
        )}
      </div>

      {/* CORREO */}
      <div className="flex flex-col gap-1.5">
        <label className="text-[10px] font-bold text-gray-600 uppercase tracking-wider">
          Correo electrónico
        </label>
        <div className="relative flex items-center">
          <EnvelopeIcon className="absolute left-4 w-5 h-5 text-azul" />
          <input
            type="email"
            name="correo"
            value={formData.correo}
            placeholder="Ejemplo@gmail.com"
            className={`w-full pl-12 pr-4 py-3 border rounded-xl text-sm focus:outline-none focus:ring-1 ${errors.correo ? "border-red-500 focus:ring-red-500" : "border-gray-200 focus:border-azul"}`}
            onChange={handleChange}
          />
        </div>
        {errors.correo && (
          <p className="text-red-500 text-xs mt-1">{errors.correo}</p>
        )}
      </div>

      {/* CONTRASEÑA */}
      <div className="flex flex-col gap-1.5">
        <label className="text-[10px] font-bold text-gray-600 uppercase tracking-wider">
          Contraseña
        </label>
        <div className="relative flex items-center">
          <LockClosedIcon className="absolute left-4 w-5 h-5 text-azul" />
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            value={formData.password}
            placeholder="Crea tu contraseña"
            className={`w-full pl-12 pr-10 py-3 border rounded-xl text-sm focus:outline-none focus:ring-1
              [&::-ms-reveal]:hidden [&::-webkit-credentials-auto-fill-button]:hidden ${
                errors.password
                  ? "border-red-500 focus:ring-red-500"
                  : "border-gray-200 focus:border-azul"
              }`}
            onChange={handleChange}
          />
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

      {/* VALIDACIÓN CONTRASEÑA */}
      <div className="bg-slate-50 border border-slate-100 rounded-xl p-4 flex flex-col gap-2">
        {[
          { ok: hasMinLength, label: "Mínimo 8 caracteres" },
          { ok: hasUppercase, label: "Al menos una letra mayúscula" },
          { ok: hasSymbol, label: "Al menos un símbolo" },
        ].map(({ ok, label }) => (
          <div key={label} className="flex items-center gap-2">
            <CheckCircleIcon
              className={`w-4 h-4 transition-colors duration-300 ${ok ? "text-green-600" : "text-gray-300"}`}
            />
            <span
              className={`text-xs font-medium transition-colors duration-300 ${ok ? "text-gray-600" : "text-gray-500"}`}
            >
              {label}
            </span>
          </div>
        ))}
      </div>

      {/* TÉRMINOS Y CONDICIONES */}
      <div className="flex flex-col gap-1">
        <label className="flex items-start gap-3 cursor-pointer select-none group">
          <div className="relative mt-0.5 shrink-0">
            <input
              id="aceptaTerminos"
              type="checkbox"
              checked={aceptaTerminos}
              onChange={(e) => {
                setAceptaTerminos(e.target.checked);
                if (errors.terminos) setErrors({ ...errors, terminos: null });
              }}
              className="sr-only peer"
            />
            <div
              className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all duration-200
              peer-focus:ring-2 peer-focus:ring-azul/30
              ${aceptaTerminos ? "bg-azul border-azul" : errors.terminos ? "border-red-500 bg-red-50" : "border-gray-300 bg-white group-hover:border-azul"}`}
            >
              {aceptaTerminos && (
                <svg
                  className="w-3 h-3 text-white"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={3}
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              )}
            </div>
          </div>
          <span className="text-sm text-gray-600 leading-snug">
            He leído y acepto los{" "}
            <Link
              to="/terminos-condiciones"
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-azul hover:underline"
            >
              Términos y Condiciones
            </Link>
          </span>
        </label>
        {errors.terminos && (
          <p className="text-red-500 text-xs mt-1 ml-8">{errors.terminos}</p>
        )}
      </div>

      {/* BOTÓN */}
      <button
        type="submit"
        aria-label="Crear mi cuenta"
        disabled={isLoading}
        className={`w-full text-white font-semibold py-3 rounded-lg mt-4 transition-colors flex justify-center items-center gap-2 ${
          isLoading
            ? "bg-orange-400 cursor-not-allowed"
            : "bg-naranja hover:bg-orange-600"
        }`}
      >
        {isLoading ? (
          <>
            <svg
              className="animate-spin h-5 w-5 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            Creando cuenta...
          </>
        ) : (
          "Crear mi cuenta"
        )}
      </button>
    </form>
  );
}
