import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { authService } from "../services/authService";

const PASSWORD_REGEX = /^(?=.*[A-Z])(?=.*[!@#$%^&*.,_\-]).{8,}$/;

export function useForgotPassword() {
  const navigate = useNavigate();

  // Tres pasos: "correo" | "codigo" | "nueva_password"
  const [paso, setPaso]                     = useState("correo");
  const [correo, setCorreo]                 = useState("");
  const [codigo, setCodigo]                 = useState("");
  const [nuevaPassword, setNuevaPassword]   = useState("");
  const [confirmarPassword, setConfirmarPassword] = useState("");
  const [showPassword, setShowPassword]     = useState(false);
  const [errors, setErrors]                 = useState({});
  const [generalError, setGeneralError]     = useState("");
  const [isLoading, setIsLoading]           = useState(false);
  const [exito, setExito]                   = useState(false);

  const passwordChecks = {
    hasMinLength: nuevaPassword.length >= 8,
    hasUppercase: /[A-Z]/.test(nuevaPassword),
    hasSymbol:    /[!@#$%^&*.,_\-]/.test(nuevaPassword),
  };

  const clearError = (field) => {
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: null }));
  };

  // ── PASO 1: enviar correo ────────────────────────────────
  const handleSubmitCorreo = async (e) => {
    e.preventDefault();
    const newErrors = {};
    if (!correo.trim()) newErrors.correo = "El correo es obligatorio.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo)) newErrors.correo = "Ingresa un correo válido.";
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    setIsLoading(true);
    setGeneralError("");
    try {
      await authService.forgotPassword(correo.trim());
      // Siempre avanzamos al paso 2 (por seguridad el backend no revela si el correo existe)
      setPaso("codigo");
    } catch (err) {
      setGeneralError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  // ── PASO 2: validar código ───────────────────────────────
  const handleSubmitCodigo = (e) => {
    e.preventDefault();
    const newErrors = {};
    if (!codigo.trim()) newErrors.codigo = "El código es obligatorio.";
    else if (!/^\d{6}$/.test(codigo.trim())) newErrors.codigo = "El código debe tener 6 dígitos.";
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;
    setPaso("nueva_password");
  };

  // ── PASO 3: nueva contraseña ─────────────────────────────
  const handleSubmitPassword = async (e) => {
    e.preventDefault();
    const newErrors = {};
    if (!nuevaPassword) newErrors.nuevaPassword = "La contraseña es obligatoria.";
    else if (!PASSWORD_REGEX.test(nuevaPassword)) newErrors.nuevaPassword = "La contraseña no cumple los requisitos.";
    if (!confirmarPassword) newErrors.confirmarPassword = "Debes confirmar la contraseña.";
    else if (nuevaPassword !== confirmarPassword) newErrors.confirmarPassword = "Las contraseñas no coinciden.";
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    setIsLoading(true);
    setGeneralError("");
    try {
      await authService.verifyForgotPassword({
        correo:         correo.trim(),
        codigo:         codigo.trim(),
        nueva_password: nuevaPassword,
      });
      setExito(true);
      // Redirigir al login tras 3 segundos
      setTimeout(() => navigate("/login"), 3000);
    } catch (err) {
      setGeneralError(err.message);
      // Si el código es inválido, volver al paso 2
      if (err.message.toLowerCase().includes("código")) {
        setPaso("codigo");
        setCodigo("");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return {
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
  };
}