import { useState, useEffect } from "react";
import { userService } from "../services/userService";

const PHONE_REGEX = /^9\d{8}$/;

export function useInformationForm() {
  const [telefono, setTelefono] = useState("");
  const [presentacion, setPresentacion] = useState("");
  const [cvArchivo, setCvArchivo] = useState(null);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [generalError, setGeneralError] = useState("");

  // Guardamos los valores originales que vinieron del backend
  // para comparar y solo enviar lo que realmente cambió
  const [initialValues, setInitialValues] = useState({
    telefono: "",
    presentacion: "",
    cvArchivo: null,
  });

  useEffect(() => {
    const cargarPerfil = async () => {
      try {
        const response = await userService.getProfile();
        if (response.success && response.data) {
          const { telefono, texto_presentacion, cv_url } = response.data;
          const telefonoCargado = telefono || "";
          const presentacionCargada = texto_presentacion || "";
          const cvCargado = cv_url ? { name: cv_url.split("/").pop() } : null;

          setTelefono(telefonoCargado);
          setPresentacion(presentacionCargada);
          setCvArchivo(cvCargado);

          // Guardamos los valores iniciales para comparar después
          setInitialValues({
            telefono: telefonoCargado,
            presentacion: presentacionCargada,
            cvArchivo: cvCargado,
          });

          // Sincronizar localStorage para que ConfirmacionCV tenga los datos más recientes
          const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
          let needsUpdate = false;
          if (telefonoCargado && storedUser.telefono !== telefonoCargado) {
            storedUser.telefono = telefonoCargado;
            needsUpdate = true;
          }
          if (cv_url && storedUser.cv_url !== cv_url) {
            storedUser.cv_url = cv_url;
            needsUpdate = true;
          }
          if (needsUpdate) {
            localStorage.setItem("user", JSON.stringify(storedUser));
          }
        }
      } catch {
        // Si falla, los campos quedan vacíos
      }
    };

    cargarPerfil();
  }, []);

  const isDirty =
    telefono !== initialValues.telefono ||
    presentacion !== initialValues.presentacion ||
    cvArchivo instanceof File; // solo es "sucio" si subieron un archivo nuevo

  const validateForm = () => {
    const newErrors = {};

    if (!telefono.trim()) {
      newErrors.telefono = "El número de teléfono es obligatorio.";
    } else if (!PHONE_REGEX.test(telefono.trim())) {
      newErrors.telefono = "Debe empezar con 9 y contener 9 dígitos en total.";
    }

    if (presentacion.trim() !== "" && presentacion.trim().length < 20) {
      newErrors.presentacion =
        "La presentación debe tener al menos 20 caracteres.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const clearError = (field) => {
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: null }));
  };

  const handleGuardar = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    setGeneralError("");
    setSuccessMessage("");

    try {
      const user = JSON.parse(localStorage.getItem("user") || "{}");

      // Solo construimos el objeto con los campos que realmente cambiaron
      const cambios = {};

      if (telefono.trim() !== initialValues.telefono) {
        cambios.telefono = telefono.trim();
      }
      if (presentacion.trim() !== initialValues.presentacion) {
        cambios.texto_presentacion = presentacion.trim();
      }
      if (cvArchivo instanceof File) {
        cambios.cv = cvArchivo;
      }

      // Si no cambió nada, no llamamos al backend
      if (Object.keys(cambios).length === 0) {
        setSuccessMessage("No hay cambios que guardar.");
        return;
      }

      const result = await userService.updateProfile({
        nombre_completo: user.nombre_completo,
        ...cambios,
      });

      // Si se subió un CV o se actualizó el teléfono, actualizamos en localStorage
      // para que ConfirmacionCV.jsx lo detecte al postular
      const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
      let needsStorageUpdate = false;

      if (result?.data?.cv_url) {
        storedUser.cv_url = result.data.cv_url;
        needsStorageUpdate = true;
      }
      
      if (cambios.telefono) {
        storedUser.telefono = cambios.telefono;
        needsStorageUpdate = true;
      }

      if (needsStorageUpdate) {
        localStorage.setItem("user", JSON.stringify(storedUser));
      }

      // Actualizamos los valores iniciales con los nuevos guardados
      setInitialValues({
        telefono: telefono.trim(),
        presentacion: presentacion.trim(),
        cvArchivo:
          cvArchivo instanceof File ? { name: cvArchivo.name } : cvArchivo,
      });

      setSuccessMessage("¡Perfil actualizado correctamente!");
    } catch (error) {
      setGeneralError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDescartar = () => {
    // Restauramos los valores iniciales que vinieron del backend
    setTelefono(initialValues.telefono);
    setPresentacion(initialValues.presentacion);
    setCvArchivo(initialValues.cvArchivo);
    setErrors({});
    setSuccessMessage("");
    setGeneralError("");
  };

  return {
    telefono,
    setTelefono,
    presentacion,
    setPresentacion,
    cvArchivo,
    setCvArchivo,
    errors,
    clearError,
    isDirty,
    isLoading,
    successMessage,
    generalError,
    handleGuardar,
    handleDescartar,
  };
}
