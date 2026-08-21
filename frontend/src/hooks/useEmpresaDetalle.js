import { useState, useEffect } from "react";
import { listadoEmpresasService } from "../services/listadoEmpresasService";

const FORM_INICIAL = {
  relacion: "",
  tiempo_relacion: "",
  estrellas: 0,
  texto_positivo: "",
  texto_negativo: "",
  recomendaria: "",
};

export function useEmpresaDetalle(empresa_id) {
  const [empresa, setEmpresa] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [yaEvaluo, setYaEvaluo] = useState(false);
  const [modalAbierto, setModalAbierto] = useState(false);
  const [form, setForm] = useState(FORM_INICIAL);
  const [errors, setErrors] = useState({});
  const [enviando, setEnviando] = useState(false);
  const [exito, setExito] = useState(false);

  useEffect(() => {
    if (!empresa_id) return;
    const cargar = async () => {
      setIsLoading(true);
      try {
        const [data, evalData] = await Promise.all([
          listadoEmpresasService.detalle(empresa_id),
          localStorage.getItem("token")
            ? listadoEmpresasService.yaEvaluo(empresa_id)
            : Promise.resolve({ ya_evaluo: false }),
        ]);
        setEmpresa(data);
        setYaEvaluo(evalData.ya_evaluo);
      } catch {
        setEmpresa(null);
      } finally {
        setIsLoading(false);
      }
    };
    cargar();
  }, [empresa_id]);

  const handleChange = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: null }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!form.relacion) newErrors.relacion = "Selecciona tu relación con la empresa.";
    if (!form.tiempo_relacion) newErrors.tiempo_relacion = "Selecciona el tiempo de tu relación.";
    if (!form.estrellas) newErrors.estrellas = "Selecciona una calificación.";
    if (!form.recomendaria) newErrors.recomendaria = "Indica si recomendarías esta empresa.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleEnviar = async () => {
    if (!validateForm()) return;
    setEnviando(true);
    try {
      await listadoEmpresasService.crear({ ...form, empresa_id });
      setExito(true);
      setYaEvaluo(true);
      // Recargar evaluaciones
      const data = await listadoEmpresasService.detalle(empresa_id);
      setEmpresa(data);
    } catch (err) {
      setErrors({ general: err.message });
    } finally {
      setEnviando(false);
    }
  };

  const abrirModal = () => {
    setForm(FORM_INICIAL);
    setErrors({});
    setExito(false);
    setModalAbierto(true);
  };

  const cerrarModal = () => setModalAbierto(false);

  return {
    empresa, isLoading, yaEvaluo,
    modalAbierto, abrirModal, cerrarModal,
    form, handleChange, errors,
    enviando, exito, handleEnviar,
  };
}